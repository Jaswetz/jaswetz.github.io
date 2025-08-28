#!/usr/bin/env node

/**
 * MCP WebSocket Bridge Server
 * Bridges WebSocket connections from browsers to stdio-based MCP servers
 */

import { WebSocketServer } from "ws";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class MCPBridgeServer {
  constructor(port = 3001) {
    this.port = port;
    this.wss = null;
    this.mcpProcess = null;
    this.connections = new Map();
  }

  start() {
    console.log(`Starting MCP Bridge Server on port ${this.port}`);

    this.wss = new WebSocketServer({ port: this.port });

    this.wss.on("connection", (ws, request) => {
      console.log("New WebSocket connection established");
      this.handleConnection(ws, request);
    });

    this.wss.on("error", (error) => {
      console.error("WebSocket Server error:", error);
    });

    console.log(`MCP Bridge Server listening on ws://localhost:${this.port}`);
  }

  handleConnection(ws, request) {
    const connectionId = Date.now() + Math.random();
    const connection = {
      id: connectionId,
      ws,
      mcpProcess: null,
      pendingRequests: new Map(),
      requestId: 0,
    };

    this.connections.set(connectionId, connection);

    // Start MCP server process for this connection
    this.startMCPProcess(connection);

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleWebSocketMessage(connection, message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        ws.send(
          JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32700, message: "Parse error" },
            id: null,
          })
        );
      }
    });

    ws.on("close", () => {
      console.log(`WebSocket connection ${connectionId} closed`);
      this.cleanupConnection(connection);
    });

    ws.on("error", (error) => {
      console.error(`WebSocket connection ${connectionId} error:`, error);
      this.cleanupConnection(connection);
    });
  }

  startMCPProcess(connection) {
    try {
      // Path to the MCP server
      const mcpServerPath = path.resolve(
        __dirname,
        "../../Documents/Kilo-Code/MCP/performance-monitor/build/index.js"
      );

      console.log(`Starting MCP server process: ${mcpServerPath}`);

      // Spawn the MCP server as a child process
      connection.mcpProcess = spawn("node", [mcpServerPath], {
        stdio: ["pipe", "pipe", "pipe"],
        cwd: path.dirname(mcpServerPath),
      });

      connection.mcpProcess.on("error", (error) => {
        console.error("MCP process error:", error);
        connection.ws.send(
          JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32000, message: "MCP server process error" },
            id: null,
          })
        );
      });

      connection.mcpProcess.on("exit", (code, signal) => {
        console.log(`MCP process exited with code ${code}, signal ${signal}`);
        connection.ws.send(
          JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32000, message: "MCP server process exited" },
            id: null,
          })
        );
      });

      // Handle MCP server stdout (responses)
      connection.mcpProcess.stdout.on("data", (data) => {
        try {
          const messages = data
            .toString()
            .split("\n")
            .filter((line) => line.trim());
          for (const message of messages) {
            const parsedMessage = JSON.parse(message);
            this.handleMCPMessage(connection, parsedMessage);
          }
        } catch (error) {
          console.error("Error parsing MCP message:", error);
        }
      });

      // Handle MCP server stderr (logs)
      connection.mcpProcess.stderr.on("data", (data) => {
        console.log("MCP stderr:", data.toString());
      });
    } catch (error) {
      console.error("Error starting MCP process:", error);
      connection.ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32000, message: "Failed to start MCP server" },
          id: null,
        })
      );
    }
  }

  handleWebSocketMessage(connection, message) {
    // Forward the message to the MCP server via stdin
    if (connection.mcpProcess && connection.mcpProcess.stdin) {
      connection.mcpProcess.stdin.write(JSON.stringify(message) + "\n");
    } else {
      connection.ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32000, message: "MCP server not available" },
          id: message.id || null,
        })
      );
    }
  }

  handleMCPMessage(connection, message) {
    // Forward MCP responses back to the WebSocket client
    if (connection.ws && connection.ws.readyState === 1) {
      // WebSocket.OPEN
      connection.ws.send(JSON.stringify(message));
    }
  }

  cleanupConnection(connection) {
    // Clean up MCP process
    if (connection.mcpProcess) {
      connection.mcpProcess.kill();
    }

    // Remove from connections map
    this.connections.delete(connection.id);
  }

  stop() {
    console.log("Stopping MCP Bridge Server");

    // Close all connections
    for (const connection of this.connections.values()) {
      this.cleanupConnection(connection);
    }

    // Close WebSocket server
    if (this.wss) {
      this.wss.close();
    }
  }
}

// Start the bridge server
const bridgeServer = new MCPBridgeServer(3001);

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down gracefully...");
  bridgeServer.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  bridgeServer.stop();
  process.exit(0);
});

// Start the server
bridgeServer.start();

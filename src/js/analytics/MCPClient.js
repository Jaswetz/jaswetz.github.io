/**
 * Browser-compatible MCP Client
 * Provides WebSocket-based communication with MCP servers
 */

export class MCPClient {
  constructor(serverUrl = "ws://localhost:3001") {
    this.serverUrl = serverUrl;
    this.ws = null;
    this.connected = false;
    this.pendingRequests = new Map();
    this.requestId = 0;
    this.eventListeners = new Map();
  }

  /**
   * Connect to MCP server via WebSocket
   */
  async connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.serverUrl);

        this.ws.onopen = () => {
          // Connected to MCP server
          this.connected = true;
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = () => {
          // Disconnected from MCP server
          this.connected = false;
          this.ws = null;
        };

        this.ws.onerror = (error) => {
          console.error("[MCPClient] WebSocket error:", error);
          reject(error);
        };

        // Connection timeout
        setTimeout(() => {
          if (!this.connected) {
            reject(new Error("MCP server connection timeout"));
          }
        }, 5000);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from MCP server
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
    }
  }

  /**
   * Send MCP request and wait for response
   */
  async sendRequest(method, params = {}) {
    if (!this.connected) {
      throw new Error("MCP client not connected");
    }

    const id = ++this.requestId;
    const request = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    };

    return new Promise((resolve, reject) => {
      // Store the promise handlers
      this.pendingRequests.set(id, { resolve, reject });

      // Send the request
      this.ws.send(JSON.stringify(request));

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`MCP request timeout: ${method}`));
        }
      }, 30000);
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleMessage(data) {
    try {
      const message = JSON.parse(data);

      // Handle response to pending request
      if (message.id && this.pendingRequests.has(message.id)) {
        const { resolve, reject } = this.pendingRequests.get(message.id);
        this.pendingRequests.delete(message.id);

        if (message.error) {
          reject(new Error(message.error.message || "MCP server error"));
        } else {
          resolve(message.result);
        }
      }

      // Handle notifications/events
      else if (message.method) {
        this.handleNotification(message.method, message.params);
      }
    } catch (error) {
      console.error("[MCPClient] Error handling message:", error);
    }
  }

  /**
   * Handle MCP notifications
   */
  handleNotification(method, params) {
    const listeners = this.eventListeners.get(method) || [];
    listeners.forEach((callback) => {
      try {
        callback(params);
      } catch (error) {
        console.error("[MCPClient] Error in event listener:", error);
      }
    });
  }

  /**
   * Add event listener for MCP notifications
   */
  addEventListener(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   */
  removeEventListener(event, callback) {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * List available tools
   */
  async listTools() {
    return this.sendRequest("tools/list");
  }

  /**
   * Call a tool
   */
  async callTool(name, args = {}) {
    return this.sendRequest("tools/call", {
      name,
      arguments: args,
    });
  }

  /**
   * Get server info
   */
  async getServerInfo() {
    return this.sendRequest("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: {
        name: "Browser MCP Client",
        version: "1.0.0",
      },
    });
  }
}

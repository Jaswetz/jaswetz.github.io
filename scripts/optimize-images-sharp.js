#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

console.log("🖼️  Optimizing images with Sharp...\n");

async function optimizeImagesWithSharp() {
  const inputDir = path.join(projectRoot, "src/img");
  const backupDir = path.join(projectRoot, "src/img-backup");
  const webpDir = path.join(inputDir, "webp");

  // Create backup of originals (safety first!)
  if (!fs.existsSync(backupDir)) {
    console.log("📋 Creating backup of original images...");
    await copyDirectory(inputDir, backupDir);
    console.log("✅ Backup created at src/img-backup/");
  }

  // Create WebP directory
  if (!fs.existsSync(webpDir)) {
    fs.mkdirSync(webpDir, { recursive: true });
  }

  console.log("🔍 Finding images to optimize...");
  const imageFiles = await findImageFiles(inputDir);
  console.log(`📸 Found ${imageFiles.length} images to process`);

  let optimizedCount = 0;
  let totalSavedBytes = 0;

  for (const filePath of imageFiles) {
    try {
      const relativePath = path.relative(inputDir, filePath);
      const ext = path.extname(filePath).toLowerCase();

      // Skip if in webp directory or already processed
      if (relativePath.startsWith("webp/") || relativePath.startsWith("../")) {
        continue;
      }

      console.log(`🔧 Processing: ${relativePath}`);

      const originalSize = fs.statSync(filePath).size;
      let newSize = originalSize;

      if (ext === ".jpg" || ext === ".jpeg") {
        // Optimize JPEG
        await sharp(filePath)
          .jpeg({ quality: 85, progressive: true })
          .toFile(filePath + ".tmp");

        fs.renameSync(filePath + ".tmp", filePath);
        newSize = fs.statSync(filePath).size;
      } else if (ext === ".png") {
        // Optimize PNG
        await sharp(filePath)
          .png({ compressionLevel: 9, quality: 90 })
          .toFile(filePath + ".tmp");

        fs.renameSync(filePath + ".tmp", filePath);
        newSize = fs.statSync(filePath).size;
      }

      // Create WebP version
      const webpPath = path.join(
        webpDir,
        path.basename(filePath, ext) + ".webp"
      );
      await sharp(filePath).webp({ quality: 85, effort: 6 }).toFile(webpPath);

      const savedBytes = originalSize - newSize;
      totalSavedBytes += savedBytes;
      optimizedCount++;

      const savings =
        savedBytes > 0 ? ` (saved ${formatBytes(savedBytes)})` : "";
      console.log(`   ✅ ${relativePath}${savings}`);
      console.log(`   📦 Created WebP: webp/${path.basename(webpPath)}`);
    } catch (error) {
      console.error(`   ❌ Error processing ${filePath}:`, error.message);
    }
  }

  console.log("\n🎉 Optimization complete!");
  console.log(`📊 Processed: ${optimizedCount} images`);
  console.log(`💾 Total space saved: ${formatBytes(totalSavedBytes)}`);
  console.log("📋 Original images backed up to: src/img-backup/");
  console.log("🆕 WebP versions created in: src/img/webp/");
}

async function findImageFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively search subdirectories
      files.push(...(await findImageFiles(fullPath)));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

async function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Run the optimization
optimizeImagesWithSharp().catch(console.error);

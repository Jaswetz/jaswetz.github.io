#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminWebp from "imagemin-webp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

console.log("🖼️  Optimizing images in-place...\n");

async function optimizeImagesInPlace() {
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

  try {
    // Optimize JPEG images (replace originals)
    console.log("📸 Optimizing JPEG images...");
    const jpegFiles = await imagemin([path.join(inputDir, "**/*.{jpg,jpeg}")], {
      destination: inputDir,
      plugins: [
        imageminMozjpeg({
          quality: 85,
          progressive: true,
        }),
      ],
    });
    console.log(`✅ Optimized ${jpegFiles.length} JPEG images`);

    // Optimize PNG images (replace originals)
    console.log("🎨 Optimizing PNG images...");
    const pngFiles = await imagemin([path.join(inputDir, "**/*.png")], {
      destination: inputDir,
      plugins: [
        imageminPngquant({
          quality: [0.8, 0.9],
          strip: true,
        }),
      ],
    });
    console.log(`✅ Optimized ${pngFiles.length} PNG images`);

    // Create WebP versions in separate folder
    console.log("⚡ Creating WebP versions...");
    const webpFiles = await imagemin(
      [path.join(inputDir, "**/*.{jpg,jpeg,png}")],
      {
        destination: webpDir,
        plugins: [
          imageminWebp({
            quality: 85,
            alphaQuality: 85,
          }),
        ],
      }
    );
    console.log(`✅ Created ${webpFiles.length} WebP images`);

    console.log("\n✨ In-place image optimization complete!");
    console.log("💡 Original images backed up to src/img-backup/");
    console.log("💡 WebP versions available in src/img/webp/");
    console.log("💡 Your HTML can now use the existing image paths!");
  } catch (error) {
    console.error("❌ Error optimizing images:", error);
    process.exit(1);
  }
}

async function copyDirectory(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

optimizeImagesInPlace();

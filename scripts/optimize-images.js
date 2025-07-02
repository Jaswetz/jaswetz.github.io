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

console.log("🖼️  Optimizing images...\n");

async function optimizeImages() {
  const inputDir = path.join(projectRoot, "src/img");
  const outputDir = path.join(projectRoot, "src/img/optimized");

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Optimize JPEG images
    console.log("📸 Optimizing JPEG images...");
    const jpegFiles = await imagemin([path.join(inputDir, "**/*.{jpg,jpeg}")], {
      destination: outputDir,
      plugins: [
        imageminMozjpeg({
          quality: 85, // Good balance between quality and file size
          progressive: true,
        }),
      ],
    });
    console.log(`✅ Optimized ${jpegFiles.length} JPEG images`);

    // Optimize PNG images
    console.log("🎨 Optimizing PNG images...");
    const pngFiles = await imagemin([path.join(inputDir, "**/*.png")], {
      destination: outputDir,
      plugins: [
        imageminPngquant({
          quality: [0.8, 0.9], // Good quality range
          strip: true, // Remove metadata
        }),
      ],
    });
    console.log(`✅ Optimized ${pngFiles.length} PNG images`);

    // Create WebP versions
    console.log("⚡ Creating WebP versions...");
    const webpFiles = await imagemin(
      [path.join(inputDir, "**/*.{jpg,jpeg,png}")],
      {
        destination: path.join(outputDir, "webp"),
        plugins: [
          imageminWebp({
            quality: 85,
            alphaQuality: 85,
          }),
        ],
      }
    );
    console.log(`✅ Created ${webpFiles.length} WebP images`);

    // Generate responsive sizes for large images
    console.log("📱 Creating responsive image sizes...");
    await generateResponsiveImages();

    console.log("\n✨ Image optimization complete!");
    console.log("💡 Images are optimized but originals are preserved.");
    console.log(
      "💡 Update your HTML to use the optimized versions and WebP with fallbacks."
    );
  } catch (error) {
    console.error("❌ Error optimizing images:", error);
    process.exit(1);
  }
}

async function generateResponsiveImages() {
  // For now, we'll document the sizes that should be created
  // In a full implementation, you'd use sharp or similar for resizing
  const responsiveSizes = {
    "hero-backgrounds": [640, 1024, 1440, 1920],
    "project-thumbnails": [300, 600, 900],
    "project-images": [400, 800, 1200],
    "profile-images": [150, 300, 600],
  };

  console.log("📋 Responsive image sizes to create:");
  Object.entries(responsiveSizes).forEach(([category, sizes]) => {
    console.log(`  ${category}: ${sizes.join("w, ")}w`);
  });
  console.log(
    "💡 Consider using a service like Cloudinary or creating these sizes manually."
  );
}

optimizeImages();

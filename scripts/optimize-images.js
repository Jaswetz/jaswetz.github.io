import sharp from 'sharp';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

const inputDir = 'src/img';
const outputDir = 'src/img/optimized';

// Configuration for different image types and sizes
const imageConfig = {
  // Profile/hero images - large but reasonable
  profile: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 85,
    sizes: [400, 600, 800, 1200], // responsive sizes
  },
  // Project thumbnails
  thumbnail: {
    maxWidth: 400,
    maxHeight: 300,
    quality: 80,
    sizes: [200, 300, 400, 1200],
  },
  // Project detail images
  project: {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 82,
    sizes: [600, 900, 1200],
  },
  // Default for other images
  default: {
    maxWidth: 1000,
    maxHeight: 1000,
    quality: 80,
    sizes: [500, 750, 1000],
  },
};

// Detect image type based on filename patterns
function getImageType(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('profile') || lower.includes('jason')) return 'profile';
  if (lower.includes('thumb') || lower.includes('card')) return 'thumbnail';
  if (lower.includes('proj-') || lower.includes('project')) return 'project';
  return 'default';
}

// Get file size in MB
async function getFileSizeMB(filePath) {
  const stats = await fs.stat(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

async function optimizeImage(inputFile, outputDir, filename, config) {
  const baseName = path.parse(filename).name;
  const results = [];

  // Create WebP versions at different sizes
  for (const size of config.sizes) {
    const outputFile = path.join(outputDir, `${baseName}-${size}w.webp`);

    await sharp(inputFile)
      .resize(size, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: config.quality })
      .toFile(outputFile);

    const sizeMB = await getFileSizeMB(outputFile);
    results.push({ file: outputFile, size: sizeMB });
  }

  // Create a main optimized WebP (largest size)
  const mainWebP = path.join(outputDir, `${baseName}.webp`);
  await sharp(inputFile)
    .resize(config.maxWidth, config.maxHeight, {
      withoutEnlargement: true,
      fit: 'inside',
    })
    .webp({ quality: config.quality })
    .toFile(mainWebP);

  const mainSizeMB = await getFileSizeMB(mainWebP);
  results.push({ file: mainWebP, size: mainSizeMB, isMain: true });

  return results;
}

async function handleGifFiles(inputFile, outputDir, filename) {
  const baseName = path.parse(filename).name;
  const results = [];

  // For GIFs, create a static WebP poster and try to optimize the GIF
  const posterFile = path.join(outputDir, `${baseName}-poster.webp`);

  // Create a static poster image from first frame
  await sharp(inputFile, { animated: false })
    .resize(800, 600, {
      withoutEnlargement: true,
      fit: 'inside',
    })
    .webp({ quality: 85 })
    .toFile(posterFile);

  const posterSizeMB = await getFileSizeMB(posterFile);
  results.push({ file: posterFile, size: posterSizeMB, type: 'poster' });

  // For very large GIFs, also create a smaller version
  const originalSizeMB = await getFileSizeMB(inputFile);
  if (originalSizeMB > 2) {
    console.warn(`⚠️  Large GIF detected: ${filename} (${originalSizeMB}MB)`);
    console.warn(
      `   Consider converting to video format or reducing frames/size`
    );
    console.warn(`   Poster image created: ${posterFile}`);
  }

  return results;
}

async function optimizeImages() {
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    console.log('🖼️  Starting image optimization...\n');

    // Find all image files
    const imageFiles = await glob('**/*.{jpg,jpeg,png,gif,webp}', {
      cwd: inputDir,
    });

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    let processedCount = 0;

    for (const imageFile of imageFiles) {
      const inputFile = path.join(inputDir, imageFile);
      const originalSizeMB = await getFileSizeMB(inputFile);
      totalOriginalSize += parseFloat(originalSizeMB);

      console.log(`📁 Processing: ${imageFile} (${originalSizeMB}MB)`);

      // Create subdirectory structure in output
      const outputSubDir = path.join(outputDir, path.dirname(imageFile));
      await fs.mkdir(outputSubDir, { recursive: true });

      const fileExtension = path.extname(imageFile).toLowerCase();
      let results = [];

      if (fileExtension === '.gif') {
        // Skip GIF files to preserve animations
        console.log(
          `   ⏭️  Skipping GIF: ${path.basename(imageFile)} (preserving animation)`
        );
        continue;
      } else {
        // Handle regular image files
        const imageType = getImageType(imageFile);
        const config = imageConfig[imageType];
        results = await optimizeImage(
          inputFile,
          outputSubDir,
          path.basename(imageFile),
          config
        );
      }

      // Calculate savings
      for (const result of results) {
        totalOptimizedSize += parseFloat(result.size);
        const savings = (
          ((originalSizeMB - result.size) / originalSizeMB) *
          100
        ).toFixed(1);
        const icon = result.isMain
          ? '✨'
          : result.type === 'poster'
            ? '🎬'
            : '📱';
        console.log(
          `   ${icon} ${path.basename(result.file)}: ${result.size}MB (${savings}% smaller)`
        );
      }

      processedCount++;
      console.log(''); // Add spacing between files
    }

    // Summary
    const totalSavings = (
      ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) *
      100
    ).toFixed(1);
    console.log('🎉 Optimization Complete!');
    console.log(`📊 Processed ${processedCount} images`);
    console.log(`📉 Original total: ${totalOriginalSize.toFixed(2)}MB`);
    console.log(`📈 Optimized total: ${totalOptimizedSize.toFixed(2)}MB`);
    console.log(
      `💾 Total savings: ${totalSavings}% (${(totalOriginalSize - totalOptimizedSize).toFixed(2)}MB)`
    );

    console.log('\n📋 Next Steps:');
    console.log(
      '1. Update HTML to use optimized images from src/img/optimized/'
    );
    console.log(
      '2. Use responsive <picture> elements with srcset for different sizes'
    );
    console.log(
      '3. Consider converting large GIFs to video format for better performance'
    );
  } catch (error) {
    console.error('❌ Error optimizing images:', error);
    process.exit(1);
  }
}

// Run optimization
optimizeImages();

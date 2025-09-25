import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

const srcDir = 'src';
const optimizedImagesDir = 'src/img/optimized';

// Mapping of original image paths to optimized versions
const imageOptimizations = {
  // Profile images - use optimized WebP
  'jason-profile-pic-square.png': 'optimized/jason-profile-pic-square.webp',
  'jason-profile-pic-square.jpg': 'optimized/jason-profile-pic-square.webp',
  'jason-profile-pic.png': 'optimized/jason-profile-pic.webp',

  // Large GIFs - use poster images for better performance
  'projects/autodesk-messaging/message-overload copy.gif':
    'optimized/projects/autodesk-messaging/message-overload copy-poster.webp',
  'projects/autodesk-messaging/message-overload.gif':
    'optimized/projects/autodesk-messaging/message-overload-poster.webp',
  'projects/dcd/dcd-animation.gif':
    'optimized/projects/dcd/dcd-animation-poster.webp',
  'projects/dcd/checkbox.gif': 'optimized/projects/dcd/checkbox-poster.webp',
  'projects/dc-android/dc-animation-1.gif':
    'optimized/projects/dc-android/dc-animation-1-poster.webp',
  'projects/dc-android/dc-animation-2.gif':
    'optimized/projects/dc-android/dc-animation-2-poster.webp',

  // Project images - use optimized WebP versions
  'mockuuups-ipad-pro-mockup-isometric-right.png':
    'optimized/mockuuups-ipad-pro-mockup-isometric-right.webp',
  'proj-thumb-ios-android.png': 'optimized/proj-thumb-ios-android.webp',
  'proj-thumb-dcd.jpg': 'optimized/proj-thumb-dcd.webp',
  'proj-thumb-dcd.png': 'optimized/proj-thumb-dcd.webp',
  'ios-android.png': 'optimized/ios-android.webp',
};

// Generate responsive picture elements for key images
function createResponsivePicture(
  imagePath,
  alt,
  className = '',
  loading = 'lazy',
  sizes = [400, 600, 800]
) {
  const baseName = path.parse(imagePath).name;
  const optimizedPath = imageOptimizations[imagePath] || imagePath;
  const optimizedDir = path.dirname(optimizedPath);

  // Generate srcset for different sizes
  const srcset = sizes
    .map(size => `./img/${optimizedDir}/${baseName}-${size}w.webp ${size}w`)
    .join(', ');
  const fallbackSrc = `./img/${optimizedPath}`;

  return `<picture>
  <source srcset="${srcset}" type="image/webp" sizes="(max-width: 600px) 400px, (max-width: 900px) 600px, 800px">
  <img
    src="${fallbackSrc}"
    alt="${alt}"
    class="${className}"
    loading="${loading}"${sizes.includes(800) ? '\n    width="800"\n    height="800"' : ''}
  >
</picture>`;
}

async function updateImageReferences() {
  try {
    console.log('🖼️  Updating image references to use optimized versions...\n');

    // Find all HTML files in src
    const htmlFiles = await glob('**/*.html', { cwd: srcDir });

    let totalUpdates = 0;
    let filesModified = 0;

    for (const htmlFile of htmlFiles) {
      const filePath = path.join(srcDir, htmlFile);
      console.log(`📄 Processing: ${htmlFile}`);

      let content = await fs.readFile(filePath, 'utf-8');
      let fileModified = false;
      let fileUpdates = 0;

      // Update meta tags and schema.org references
      if (htmlFile === 'index.html') {
        // Update Open Graph image
        const ogImageRegex =
          /property="og:image"\s+content="[^"]*jason-profile-pic-square\.png"/g;
        if (ogImageRegex.test(content)) {
          content = content.replace(
            ogImageRegex,
            'property="og:image" content="https://jaswetz.github.io/img/optimized/jason-profile-pic-square.webp"'
          );
          fileUpdates++;
        }

        // Update Twitter card image
        const twitterImageRegex =
          /name="twitter:image"\s+content="[^"]*jason-profile-pic-square\.png"/g;
        if (twitterImageRegex.test(content)) {
          content = content.replace(
            twitterImageRegex,
            'name="twitter:image" content="https://jaswetz.github.io/img/optimized/jason-profile-pic-square.webp"'
          );
          fileUpdates++;
        }

        // Update schema.org image
        const schemaImageRegex =
          /"image":\s*"[^"]*jason-profile-pic-square\.png"/g;
        if (schemaImageRegex.test(content)) {
          content = content.replace(
            schemaImageRegex,
            '"image": "https://jaswetz.github.io/img/optimized/jason-profile-pic-square.webp"'
          );
          fileUpdates++;
        }

        // Update preload link to use optimized image
        const preloadRegex =
          /<link rel="preload" as="image" href="\.\/img\/webp\/jason-profile-pic-square\.webp" \/>/g;
        if (preloadRegex.test(content)) {
          content = content.replace(
            preloadRegex,
            '<link rel="preload" as="image" href="./img/optimized/jason-profile-pic-square.webp" />'
          );
          fileUpdates++;
        }
      }

      // Update existing picture elements to use optimized paths
      const existingPictureRegex =
        /<picture>\s*<source srcset="\.\/img\/webp\/([^"]+)" type="image\/webp">\s*<img[^>]*src="\.\/img\/([^"]+)"([^>]*)>\s*<\/picture>/g;
      content = content.replace(
        existingPictureRegex,
        (match, webpSrc, originalSrc, imgAttributes) => {
          const optimizedPath =
            imageOptimizations[originalSrc] ||
            `optimized/${path.parse(originalSrc).name}.webp`;
          fileUpdates++;
          return `<picture>
  <source srcset="./img/${optimizedPath}" type="image/webp">
  <img src="./img/${optimizedPath}"${imgAttributes}>
</picture>`;
        }
      );

      // Replace large GIF images with poster images and add note about animation
      for (const [originalPath, optimizedPath] of Object.entries(
        imageOptimizations
      )) {
        if (originalPath.endsWith('.gif')) {
          const originalRegex = new RegExp(
            `src="([^"]*${originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})"`,
            'g'
          );
          if (originalRegex.test(content)) {
            content = content.replace(
              originalRegex,
              `src="./img/${optimizedPath}"`
            );
            fileUpdates++;

            // Add a note that this was originally an animation
            const figcaptionRegex = /<figcaption([^>]*)>([^<]+)<\/figcaption>/g;
            content = content.replace(
              figcaptionRegex,
              (match, attrs, caption) => {
                if (!caption.includes('(Static image)')) {
                  return `<figcaption${attrs}>${caption} (Static image - original animation optimized for performance)</figcaption>`;
                }
                return match;
              }
            );
          }
        }
      }

      if (fileUpdates > 0) {
        await fs.writeFile(filePath, content);
        fileModified = true;
        totalUpdates += fileUpdates;
        filesModified++;
        console.log(`   ✅ Updated ${fileUpdates} image reference(s)`);
      } else {
        console.log(`   ℹ️  No updates needed`);
      }
    }

    console.log('\n🎉 Image reference update complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Files processed: ${htmlFiles.length}`);
    console.log(`   - Files modified: ${filesModified}`);
    console.log(`   - Total updates: ${totalUpdates}`);

    if (filesModified > 0) {
      console.log('\n📋 Next Steps:');
      console.log('1. Build the project: npm run build');
      console.log('2. Test the optimized images are loading correctly');
      console.log('3. Run performance tests to verify improvements');
    }
  } catch (error) {
    console.error('❌ Error updating image references:', error);
    process.exit(1);
  }
}

// Run the update
updateImageReferences();

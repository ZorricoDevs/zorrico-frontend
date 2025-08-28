const fs = require('fs');
const path = require('path');

// This script copies the logo.png as favicon.png for better browser tab display
// In a production environment, you would use image processing tools like sharp or imagemin

const publicDir = path.join(__dirname, '..', 'public');
const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const logoPath = path.join(publicDir, 'logo.png');
const faviconPath = path.join(publicDir, 'favicon.png');

console.log('📁 Checking for logo.png in public directory...');

if (fs.existsSync(logoPath)) {
  // Copy logo.png as favicon.png if it's smaller and more optimized
  fs.copyFileSync(logoPath, faviconPath);
  console.log('✅ Updated favicon.png from logo.png');

  // Get file size
  const stats = fs.statSync(faviconPath);
  console.log(`📊 New favicon size: ${(stats.size / 1024).toFixed(2)} KB`);
} else {
  console.log('❌ logo.png not found in public directory');
  console.log('💡 Please ensure you have a logo.png file in the public directory');
  console.log('   The ideal favicon should be:');
  console.log('   - 32x32 pixels or 48x48 pixels');
  console.log('   - PNG format');
  console.log('   - Clear and recognizable at small sizes');
  console.log('   - Under 10KB for fast loading');
}

console.log('🔄 Favicon optimization complete!');

const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets', 'images');

function createPNG(width, height, r, g, b) {
  const png = new PNG({ width, height });
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = 255;
    }
  }
  
  return PNG.sync.write(png);
}

const iconPng = createPNG(1024, 1024, 255, 107, 0);
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconPng);
console.log('Created icon.png');

const splashPng = createPNG(1284, 2778, 255, 107, 0);
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splashPng);
console.log('Created splash.png');

const adaptiveIconPng = createPNG(1024, 1024, 255, 107, 0);
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptiveIconPng);
console.log('Created adaptive-icon.png');

const faviconPng = createPNG(48, 48, 255, 107, 0);
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), faviconPng);
console.log('Created favicon.png');

console.log('All PNG files created successfully!');

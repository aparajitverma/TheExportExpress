import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a minimal 1x1 pixel PNG
const createBasicPNG = () => {
  // This is a minimal 1x1 blue pixel PNG
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length (13)
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width: 1
    0x00, 0x00, 0x00, 0x01, // height: 1
    0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, etc.
    0x00, 0x00, 0x00, 0x00, // CRC (will be calculated)
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk length (12)
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x78, 0x9C, 0x63, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // minimal compressed data
    0x00, 0x00, 0x00, 0x00, // CRC (will be calculated)
    0x00, 0x00, 0x00, 0x00, // IEND chunk length (0)
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // IEND CRC
  ]);
  
  return pngData;
};

const iconDir = path.join(__dirname, 'src-tauri/icons');

// Create all required icon files
const pngData = createBasicPNG();
fs.writeFileSync(path.join(iconDir, 'icon.png'), pngData);
fs.writeFileSync(path.join(iconDir, '32x32.png'), pngData);
fs.writeFileSync(path.join(iconDir, '128x128.png'), pngData);
fs.writeFileSync(path.join(iconDir, '128x128@2x.png'), pngData);

console.log('Created basic icon files'); 
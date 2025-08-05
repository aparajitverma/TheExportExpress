import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple valid PNG with blue background
const createSimplePNG = (width, height) => {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk data (13 bytes)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);   // width
  ihdrData.writeUInt32BE(height, 4);  // height
  ihdrData.writeUInt8(8, 8);          // bit depth
  ihdrData.writeUInt8(2, 9);          // color type (RGB)
  ihdrData.writeUInt8(0, 10);         // compression
  ihdrData.writeUInt8(0, 11);         // filter
  ihdrData.writeUInt8(0, 12);         // interlace
  
  // Create IHDR chunk
  const ihdrLength = Buffer.alloc(4);
  ihdrLength.writeUInt32BE(13, 0);
  const ihdrType = Buffer.from('IHDR');
  const ihdrCRC = Buffer.from([0x00, 0x00, 0x00, 0x00]); // Placeholder CRC
  const ihdrChunk = Buffer.concat([ihdrLength, ihdrType, ihdrData, ihdrCRC]);
  
  // Create simple pixel data (blue background)
  const pixelData = Buffer.alloc(width * height * 3);
  for (let i = 0; i < pixelData.length; i += 3) {
    pixelData[i] = 59;     // R
    pixelData[i + 1] = 130; // G
    pixelData[i + 2] = 246; // B
  }
  
  // Add filter bytes
  const filteredData = Buffer.alloc(pixelData.length + height);
  for (let y = 0; y < height; y++) {
    filteredData[y * (width * 3 + 1)] = 0; // filter type (none)
    pixelData.copy(filteredData, y * (width * 3 + 1) + 1, y * width * 3, (y + 1) * width * 3);
  }
  
  // Create IDAT chunk
  const idatLength = Buffer.alloc(4);
  idatLength.writeUInt32BE(filteredData.length, 0);
  const idatType = Buffer.from('IDAT');
  const idatCRC = Buffer.from([0x00, 0x00, 0x00, 0x00]); // Placeholder CRC
  const idatChunk = Buffer.concat([idatLength, idatType, filteredData, idatCRC]);
  
  // Create IEND chunk
  const iendLength = Buffer.alloc(4);
  iendLength.writeUInt32BE(0, 0);
  const iendType = Buffer.from('IEND');
  const iendCRC = Buffer.from([0x00, 0x00, 0x00, 0x00]); // Placeholder CRC
  const iendChunk = Buffer.concat([iendLength, iendType, iendCRC]);
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
};

const iconDir = path.join(__dirname, 'src-tauri/icons');

// Ensure icon directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

console.log('🎨 Creating valid PNG icons...');

// Create icons for different sizes
const sizes = [32, 128, 256];
sizes.forEach(size => {
  const pngData = createSimplePNG(size, size);
  fs.writeFileSync(path.join(iconDir, `${size}x${size}.png`), pngData);
  console.log(`✅ Created ${size}x${size}.png`);
});

// Create icon.png (256x256)
const iconPng = createSimplePNG(256, 256);
fs.writeFileSync(path.join(iconDir, 'icon.png'), iconPng);
console.log('✅ Created icon.png');

// Create 128x128@2x.png (256x256)
const icon2x = createSimplePNG(256, 256);
fs.writeFileSync(path.join(iconDir, '128x128@2x.png'), icon2x);
console.log('✅ Created 128x128@2x.png');

console.log('\n🎉 All PNG icons created successfully!');
console.log('💡 Note: These are placeholder icons with basic blue background.');
console.log('   For production, replace with actual branded icons.'); 
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple CRC32 calculation
const crc32 = (data) => {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = crc ^ data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
};

// Create a valid PNG with proper CRC
const createValidPNG = (width, height) => {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk data
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);   // width
  ihdrData.writeUInt32BE(height, 4);  // height
  ihdrData.writeUInt8(8, 8);          // bit depth
  ihdrData.writeUInt8(2, 9);          // color type (RGB)
  ihdrData.writeUInt8(0, 10);         // compression
  ihdrData.writeUInt8(0, 11);         // filter
  ihdrData.writeUInt8(0, 12);         // interlace
  
  // Create IHDR chunk with proper CRC
  const ihdrType = Buffer.from('IHDR');
  const ihdrCRC = Buffer.alloc(4);
  ihdrCRC.writeUInt32BE(crc32(Buffer.concat([ihdrType, ihdrData])), 0);
  const ihdrLength = Buffer.alloc(4);
  ihdrLength.writeUInt32BE(13, 0);
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
  
  // Create IDAT chunk with proper CRC
  const idatType = Buffer.from('IDAT');
  const idatCRC = Buffer.alloc(4);
  idatCRC.writeUInt32BE(crc32(Buffer.concat([idatType, filteredData])), 0);
  const idatLength = Buffer.alloc(4);
  idatLength.writeUInt32BE(filteredData.length, 0);
  const idatChunk = Buffer.concat([idatLength, idatType, filteredData, idatCRC]);
  
  // Create IEND chunk with proper CRC
  const iendType = Buffer.from('IEND');
  const iendCRC = Buffer.alloc(4);
  iendCRC.writeUInt32BE(crc32(iendType), 0);
  const iendLength = Buffer.alloc(4);
  iendLength.writeUInt32BE(0, 0);
  const iendChunk = Buffer.concat([iendLength, iendType, iendCRC]);
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
};

const iconDir = path.join(__dirname, 'src-tauri/icons');

// Ensure icon directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

console.log('🎨 Creating valid PNG icons with proper CRC...');

// Create icons for different sizes
const sizes = [32, 128, 256];
sizes.forEach(size => {
  const pngData = createValidPNG(size, size);
  fs.writeFileSync(path.join(iconDir, `${size}x${size}.png`), pngData);
  console.log(`✅ Created ${size}x${size}.png`);
});

// Create icon.png (256x256)
const iconPng = createValidPNG(256, 256);
fs.writeFileSync(path.join(iconDir, 'icon.png'), iconPng);
console.log('✅ Created icon.png');

// Create 128x128@2x.png (256x256)
const icon2x = createValidPNG(256, 256);
fs.writeFileSync(path.join(iconDir, '128x128@2x.png'), icon2x);
console.log('✅ Created 128x128@2x.png');

console.log('\n🎉 All PNG icons created successfully with proper CRC!');
console.log('💡 Note: These are placeholder icons with basic blue background.');
console.log('   For production, replace with actual branded icons.'); 
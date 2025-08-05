import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a valid PNG file with proper CRC
const createValidPNG = (width, height) => {
  // PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);   // bit depth
  ihdrData.writeUInt8(2, 9);   // color type (RGB)
  ihdrData.writeUInt8(0, 10);  // compression
  ihdrData.writeUInt8(0, 11);  // filter
  ihdrData.writeUInt8(0, 12);  // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdrData);
  
  // Create pixel data (simple blue background)
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
  
  const idatChunk = createChunk('IDAT', filteredData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
};

const createChunk = (type, data) => {
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = crypto.createHash('crc32');
  crc.update(typeBuffer);
  crc.update(data);
  
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(parseInt(crc.digest('hex'), 16), 0);
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
};

const iconDir = path.join(__dirname, 'src-tauri/icons');

// Create icons for different sizes
const sizes = [32, 128, 256];
sizes.forEach(size => {
  const pngData = createValidPNG(size, size);
  fs.writeFileSync(path.join(iconDir, `${size}x${size}.png`), pngData);
  console.log(`Created ${size}x${size}.png`);
});

// Create icon.png (256x256)
const iconPng = createValidPNG(256, 256);
fs.writeFileSync(path.join(iconDir, 'icon.png'), iconPng);
console.log('Created icon.png');

console.log('All PNG icons created successfully!'); 
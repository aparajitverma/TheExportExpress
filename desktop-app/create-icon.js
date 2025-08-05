const fs = require('fs');
const path = require('path');

// Create a simple 256x256 PNG icon with a blue background and "EE" text
// This is a minimal PNG file structure for testing

const iconDir = path.join(__dirname, 'src-tauri/icons');

// Create a simple PNG file (minimal valid PNG)
const createSimplePNG = (width, height) => {
  // PNG file signature
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk (image header)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);      // width
  ihdrData.writeUInt32BE(height, 4);     // height
  ihdrData.writeUInt8(8, 8);             // bit depth
  ihdrData.writeUInt8(2, 9);             // color type (RGB)
  ihdrData.writeUInt8(0, 10);            // compression
  ihdrData.writeUInt8(0, 11);            // filter
  ihdrData.writeUInt8(0, 12);            // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdrData);
  
  // Create a simple blue background
  const pixelData = Buffer.alloc(width * height * 3);
  for (let i = 0; i < pixelData.length; i += 3) {
    pixelData[i] = 59;     // R (blue background)
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
  
  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
};

const createChunk = (type, data) => {
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = require('crypto').createHash('crc32');
  crc.update(typeBuffer);
  crc.update(data);
  
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc.digest('hex'), 0);
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
};

// Create icons for different sizes
const sizes = [32, 128, 256];
sizes.forEach(size => {
  const pngData = createSimplePNG(size, size);
  fs.writeFileSync(path.join(iconDir, `${size}x${size}.png`), pngData);
  console.log(`Created ${size}x${size}.png`);
});

// Create icon.png (256x256)
const iconPng = createSimplePNG(256, 256);
fs.writeFileSync(path.join(iconDir, 'icon.png'), iconPng);
console.log('Created icon.png');

// Create a simple ICO file
const createSimpleICO = () => {
  // ICO file header
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);    // reserved
  header.writeUInt16LE(1, 2);    // type (1 = ICO)
  header.writeUInt16LE(1, 4);    // count
  
  // Directory entry
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);       // width
  entry.writeUInt8(32, 1);       // height
  entry.writeUInt8(0, 2);        // colors
  entry.writeUInt8(0, 3);        // reserved
  entry.writeUInt16LE(1, 4);     // planes
  entry.writeUInt16LE(32, 6);    // bit count
  entry.writeUInt32LE(40, 8);    // size
  entry.writeUInt32LE(22, 12);   // offset
  
  // BMP header (simplified)
  const bmpHeader = Buffer.alloc(40);
  bmpHeader.writeUInt32LE(40, 0);    // size
  bmpHeader.writeUInt32LE(32, 4);    // width
  bmpHeader.writeUInt32LE(32, 8);    // height
  bmpHeader.writeUInt16LE(1, 12);    // planes
  bmpHeader.writeUInt16LE(32, 14);   // bit count
  
  // Simple blue pixels
  const pixels = Buffer.alloc(32 * 32 * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 246;     // B
    pixels[i + 1] = 130; // G
    pixels[i + 2] = 59;  // R
    pixels[i + 3] = 255; // A
  }
  
  return Buffer.concat([header, entry, bmpHeader, pixels]);
};

const icoData = createSimpleICO();
fs.writeFileSync(path.join(iconDir, 'icon.ico'), icoData);
console.log('Created icon.ico');

console.log('All icons created successfully!'); 
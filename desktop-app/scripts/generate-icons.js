#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Icon generation script for ExportExpressPro Desktop
// This script creates placeholder icons for development
// In production, you would replace these with actual icon files

const iconDir = path.join(__dirname, '../src-tauri/icons');

// Create icon directory if it doesn't exist
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Create placeholder icon files
const iconFiles = [
  '32x32.png',
  '128x128.png', 
  '128x128@2x.png',
  'icon.png',
  'icon.icns',
  'icon.ico'
];

console.log('🎨 Generating icon placeholders for ExportExpressPro Desktop...');

iconFiles.forEach(file => {
  const filePath = path.join(iconDir, file);
  
  if (!fs.existsSync(filePath)) {
    // Create a simple SVG-based placeholder
    const svgContent = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E40AF;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="32" fill="url(#grad1)"/>
  <text x="128" y="140" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">EE</text>
  <text x="128" y="180" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="white">ExportExpressPro</text>
</svg>`;
    
    fs.writeFileSync(filePath, svgContent);
    console.log(`✅ Created ${file}`);
  } else {
    console.log(`ℹ️  ${file} already exists`);
  }
});

console.log('\n📦 Icon generation complete!');
console.log('💡 For production, replace these placeholders with actual icon files:');
console.log('   - 32x32.png: 32x32 pixels');
console.log('   - 128x128.png: 128x128 pixels');
console.log('   - 128x128@2x.png: 256x256 pixels (for retina displays)');
console.log('   - icon.ico: Windows icon with multiple sizes');
console.log('   - icon.icns: macOS icon bundle'); 
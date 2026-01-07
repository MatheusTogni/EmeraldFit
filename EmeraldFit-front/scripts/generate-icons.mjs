import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#10b981" rx="86"/>
  <g transform="translate(256, 256)">
    <path d="M-80,-53 L-80,80 L0,120 L80,80 L80,-53 L0,-13 Z" fill="white" stroke="white" stroke-width="10" stroke-linejoin="round"/>
    <circle cx="0" cy="-13" r="21" fill="#10b981"/>
  </g>
  <text x="256" y="426" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">EMERALD</text>
</svg>`;

// Gerar ícone 192x192
await sharp(Buffer.from(svgContent))
  .resize(192, 192)
  .png()
  .toFile(join(__dirname, '../public/pwa-192x192.png'));

// Gerar ícone 512x512
await sharp(Buffer.from(svgContent))
  .resize(512, 512)
  .png()
  .toFile(join(__dirname, '../public/pwa-512x512.png'));

// Gerar ícone Apple Touch Icon
await sharp(Buffer.from(svgContent))
  .resize(180, 180)
  .png()
  .toFile(join(__dirname, '../public/apple-touch-icon.png'));

console.log('✅ Ícones PWA gerados com sucesso!');

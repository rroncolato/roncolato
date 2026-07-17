// Gera ícones PWA temporários a partir de um SVG com a marca.
// Trocar por arte final do Estúdio Roncolato antes de publicar.
import sharp from "sharp";
import { writeFileSync } from "fs";
import { join } from "path";

const OUT_DIR = join(process.cwd(), "public", "icons");

function svg(size) {
  const fontSize = Math.round(size * 0.32);
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#1B1B1B"/>
  <rect x="${size * 0.08}" y="${size * 0.5 - 1}" width="${size * 0.84}" height="2" fill="#F5AA22"/>
  <text x="50%" y="${size * 0.44}" text-anchor="middle" font-family="Georgia, serif" font-size="${fontSize}" fill="#F1F1F1" letter-spacing="2">DE</text>
</svg>`;
}

const sizes = [
  { size: 192, name: "icon-192x192.png" },
  { size: 512, name: "icon-512x512.png" },
  { size: 180, name: "apple-touch-icon.png" },
];

for (const { size, name } of sizes) {
  const buffer = await sharp(Buffer.from(svg(size))).png().toBuffer();
  writeFileSync(join(OUT_DIR, name), buffer);
  console.log(`gerado: ${name}`);
}

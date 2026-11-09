// Gera os ícones PNG do PWA a partir de um SVG (usa o Chromium do Playwright).
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const svg = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<rect width="512" height="512" rx="${pad ? 0 : 96}" fill="#0d0d0e"/>
<rect x="${pad ? 136 : 112}" y="${pad ? 136 : 112}" width="${pad ? 240 : 288}" height="${pad ? 240 : 288}" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="3"/>
<text x="256" y="${pad ? 300 : 310}" text-anchor="middle" font-family="Cormorant Garamond, Georgia, 'Times New Roman', serif" font-size="${pad ? 170 : 210}" fill="#ffffff">G</text>
</svg>`;
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, size, pad] of [["icon-192", 192, false], ["icon-512", 512, false], ["icon-maskable-512", 512, true], ["apple-touch-icon", 180, true]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg(pad).replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: `public/icons/${name}.png`, omitBackground: true });
}
await browser.close();

// Gera os ícones PNG do PWA a partir de um SVG (usa o Chromium do Playwright).
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const svg = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<rect width="512" height="512" rx="${pad ? 0 : 112}" fill="#136f86"/>
<g transform="translate(256 256) scale(${pad ? 0.72 : 0.9}) translate(-256 -256)">
<path d="M256 96 L416 220 V400 a16 16 0 0 1-16 16 H112 a16 16 0 0 1-16-16 V220 Z" fill="#fff"/>
<path d="M96 330 q40-28 80 0 t80 0 t80 0 t80 0 V400 a16 16 0 0 1-16 16 H112 a16 16 0 0 1-16-16 Z" fill="#1f8aa3"/>
<circle cx="256" cy="250" r="44" fill="#d9ad3c"/>
</g></svg>`;
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, size, pad] of [["icon-192", 192, false], ["icon-512", 512, false], ["icon-maskable-512", 512, true], ["apple-touch-icon", 180, true]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg(pad).replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: `public/icons/${name}.png`, omitBackground: true });
}
await browser.close();

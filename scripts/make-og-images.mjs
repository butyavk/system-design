// Renders the link-preview images (Open Graph) shown when a page is shared in a messenger or
// a social network: public/og/og-en.jpg and public/og/og-ru.jpg, 1200×630.
// The background is the skill-map picture from the README (.github/readme/skill-map-*-dark.png);
// re-take those first if the map changed. Update the numbers below when topics are added.
//
// Run: npm run og-images   (needs a Chromium for Playwright, as check:diagrams does)
import { mkdirSync, writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = new URL('..', import.meta.url).pathname;
const file = (p) => pathToFileURL(join(root, p)).href;

const TEXT = {
  en: {
    sub: 'System design from<br>the basics to the interview',
    facts: '58 topics, 14 solved problems<br>and a skill map',
    legendTop: 1379, // y of the rule above the legend in the README picture, to crop the legend off
  },
  ru: {
    sub: 'Системный дизайн<br>от основ до собеседования',
    facts: '58 тем, 14 разобранных задач<br>и карта навыков',
    legendTop: 1443,
  },
};

const fonts = 'node_modules/@fontsource-variable/onest/files';
const css = `
@font-face { font-family: Onest; font-weight: 100 900; src: url(${file(`${fonts}/onest-latin-wght-normal.woff2`)}) format('woff2');
  unicode-range: U+0000-00FF, U+2013, U+2014, U+2019; }
@font-face { font-family: Onest; font-weight: 100 900; src: url(${file(`${fonts}/onest-cyrillic-wght-normal.woff2`)}) format('woff2');
  unicode-range: U+0400-04FF; }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; background: #11191d; }
body { position: relative; font-family: Onest, sans-serif; color: #e6eded; }
/* The map is the README picture at 0.4666 scale, starting at its second column: the first one would
   sit under the title. The clip falls in the empty strip between the two columns (x = 283 of 2312). */
.map { position: absolute; top: -40px; left: 640px; right: 0; overflow: hidden; }
.map img { position: absolute; left: -132px; width: 1079px; }
.fade { position: absolute; inset: 0;
  background: linear-gradient(90deg, #11191d 0, #11191d 640px, rgb(17 25 29 / 0.5) 641px, rgb(17 25 29 / 0.5) 770px, rgb(17 25 29 / 0.15) 840px, rgb(17 25 29 / 0) 920px),
              linear-gradient(0deg, rgb(17 25 29 / 0.85) 0, rgb(17 25 29 / 0) 80px); }
.text { position: absolute; left: 64px; top: 60px; bottom: 60px; width: 560px; display: flex; flex-direction: column; }
.logo { width: 64px; height: 64px; }
h1 { margin-top: 36px; font-size: 80px; line-height: 1; font-weight: 700; letter-spacing: -0.02em; color: #fff; }
.sub { margin-top: 22px; font-size: 36px; line-height: 1.22; font-weight: 500; color: #3cc4b6; }
.facts { margin-top: auto; font-size: 30px; line-height: 1.3; color: #c2cdcf; }
`;

const page = (lang) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="map" style="height: ${Math.round(TEXT[lang].legendTop * 0.4666)}px"><img src="${file(`.github/readme/skill-map-${lang}-dark.png`)}" alt=""></div>
<div class="fade"></div>
<div class="text">
  <img class="logo" src="${file('src/assets/logo.svg')}" alt="">
  <h1>System Design Primer</h1>
  <div class="sub">${TEXT[lang].sub}</div>
  <div class="facts">${TEXT[lang].facts}</div>
</div></body></html>`;

const out = join(root, 'public/og');
mkdirSync(out, { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'og-'));
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
try {
  const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const lang of Object.keys(TEXT)) {
    const html = join(tmp, `${lang}.html`);
    writeFileSync(html, page(lang));
    await tab.goto(pathToFileURL(html).href, { waitUntil: 'load' });
    await tab.evaluate(() => document.fonts.ready);
    // JPEG keeps the file small: some messengers skip preview images over ~300 KB.
    await tab.screenshot({ path: join(out, `og-${lang}.jpg`), type: 'jpeg', quality: 90 });
    console.log(`public/og/og-${lang}.jpg`);
  }
} finally {
  await browser.close();
  rmSync(tmp, { recursive: true, force: true });
}

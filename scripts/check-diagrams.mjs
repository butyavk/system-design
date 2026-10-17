#!/usr/bin/env node
// Renders every ```mermaid block in the given MDX files (default: all docs) with the
// site's mermaid build and config, in a real browser, and fails when a diagram
//   - does not parse or render, or
//   - is wider than MAX_WIDTH px at natural size: the content column is ~600px wide, so a
//     wider diagram is scaled down and its labels drop below ~12px.
// It also checks that each English page and its Russian twin have the same number of diagrams.
//
// Usage: node scripts/check-diagrams.mjs [files...]
// Needs a Chromium for Playwright: `npx playwright install chromium`, or point
// PW_CHROMIUM at an existing Chrome/Chromium binary.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { chromium } from 'playwright';

const MAX_WIDTH = 800;
const TALL = 1200;
const root = new URL('..', import.meta.url).pathname;
const docs = join(root, 'src/content/docs');
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : f.endsWith('.mdx') ? [join(d, f)] : []));
const files = process.argv.length > 2 ? process.argv.slice(2) : walk(docs);
const config = JSON.parse(readFileSync(join(root, 'src/mermaid.config.json'), 'utf8'));
const blocks = (f) => [...readFileSync(f, 'utf8').matchAll(/```mermaid\n([\s\S]*?)```/g)].map((m) => m[1]);

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.setContent('<!doctype html><html><body><div id="o"></div></body></html>');
await page.addScriptTag({ path: join(root, 'node_modules/mermaid/dist/mermaid.min.js') });
await page.evaluate((cfg) => window.mermaid.initialize({ startOnLoad: false, theme: 'default', ...cfg }), config);

let count = 0;
const problems = [];
const notes = [];
for (const f of files) {
  const rel = relative(root, f);
  for (const [i, code] of blocks(f).entries()) {
    count++;
    const res = await page.evaluate(async (code) => {
      const o = document.getElementById('o');
      o.innerHTML = '';
      try {
        await window.mermaid.parse(code);
        const { svg } = await window.mermaid.render(`d${Math.random().toString(36).slice(2)}`, code);
        o.innerHTML = svg;
        const v = o.querySelector('svg').viewBox.baseVal;
        return { w: Math.round(v.width), h: Math.round(v.height) };
      } catch (e) {
        return { error: String(e?.message ?? e).split('\n')[0] };
      }
    }, code);
    if (res.error) problems.push(`${rel} diagram #${i + 1}: ${res.error}`);
    else if (res.w > MAX_WIDTH) problems.push(`${rel} diagram #${i + 1}: ${res.w}px wide (max ${MAX_WIDTH}px) — stack it top-to-bottom or break long labels`);
    else if (res.h > TALL) notes.push(`${rel} diagram #${i + 1}: ${res.h}px tall`);
  }
  // EN/RU twins must have the same diagrams.
  if (!rel.includes('/docs/ru/')) {
    const twin = f.replace('/src/content/docs/', '/src/content/docs/ru/');
    if (existsSync(twin) && blocks(twin).length !== blocks(f).length)
      problems.push(`${rel}: ${blocks(f).length} diagrams, but the Russian twin has ${blocks(twin).length}`);
  }
}
await browser.close();

for (const n of notes) console.log(`note  ${n}`);
for (const p of problems) console.log(`✗ ${p}`);
console.log(`${count} diagrams checked, ${problems.length} problem(s).`);
process.exit(problems.length ? 1 : 0);

#!/usr/bin/env node
// Regenerates the Anki decks in public/flashcards/ from src/data/flashcards.ts.
// Usage: npm run flashcards   (or: node scripts/export-flashcards.mjs)
//
// The data file is TypeScript without imports or enums, so Node loads it
// directly: type stripping is on by default since Node 22.18. On older Node 22
// releases the script re-runs itself with --experimental-strip-types.
//
// Output: one tab-separated file per language, in the text format Anki 2.1.54+
// imports with file headers (https://docs.ankiweb.net/importing/text-files.html):
//   column 1  Front (HTML)
//   column 2  Back (HTML, ends with a "Read more" link to the page)
//   column 3  Tags (space-separated)
//   column 4  GUID (stable per card, so re-importing updates notes instead of duplicating them)
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SITE = 'https://butyavk.github.io/system-design'; // site + base from astro.config.mjs
const DECK = 'System Design Primer';
const root = new URL('../', import.meta.url);

let data;
try {
  data = await import(new URL('src/data/flashcards.ts', root).href);
} catch (err) {
  if (err?.code !== 'ERR_UNKNOWN_FILE_EXTENSION' || process.execArgv.includes('--experimental-strip-types')) throw err;
  const r = spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', fileURLToPath(import.meta.url)], { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}
const { flashcards, cardHtml, inlineHtml } = data;

const T = {
  en: { more: 'Read more on the site' },
  ru: { more: 'Подробнее на сайте' },
};

/** Quote every field (RFC 4180 style) so quotes inside HTML can never confuse the importer. */
const field = (s) => `"${String(s).replace(/"/g, '""')}"`;

function build(locale) {
  const lines = [
    '#separator:tab',
    '#html:true',
    '#columns:Front\tBack\tTags\tGUID',
    '#tags column:3',
    '#guid column:4',
    '#notetype:Basic',
    `#deck:${DECK}`,
  ];
  for (const c of flashcards) {
    const url = `${SITE}${locale === 'ru' ? '/ru' : ''}${c.link}`;
    const front = inlineHtml(c.front[locale]);
    const back = `${cardHtml(c.back[locale])}<p><a href="${url}">${T[locale].more}</a></p>`;
    const tags = `system-design sdp::${c.section}`;
    const guid = `sdp-${locale}-${c.id}`;
    for (const v of [front, back, tags]) {
      if (/[\t\n\r]/.test(v)) throw new Error(`Card ${c.id} (${locale}): tab or newline in a field`);
    }
    lines.push([front, back, tags, guid].map(field).join('\t'));
  }
  return lines.join('\n') + '\n';
}

const outDir = new URL('public/flashcards/', root);
mkdirSync(outDir, { recursive: true });
for (const locale of ['en', 'ru']) {
  const file = new URL(`system-design-${locale}.tsv`, outDir);
  writeFileSync(file, build(locale));
  console.log(`✓ ${fileURLToPath(file)} — ${flashcards.length} cards`);
}

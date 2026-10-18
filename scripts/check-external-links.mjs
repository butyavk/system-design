// Checks every external link in the site sources: pages (EN and RU), data files and READMEs.
// Not part of CI: other sites are flaky and some block scripts, so run it by hand or on a
// schedule (`npm run check:external`). Exits with 1 when a link looks broken.
//
// Results:
//   broken  — 404/410, other 4xx/5xx, DNS failures, refused connections (after one retry)
//   no answer — the connection was reset or timed out: often a firewall or proxy between you
//             and the site (some sites refuse cloud networks); retry from another network
//             before acting. Does not fail the run.
//   blocked — 401/403/429/999 or an incomplete TLS chain: usually a bot wall or a server
//             that only browsers can verify; open these in a browser before acting
//   known   — links in KNOWN below that fail for scripts but open in a browser; still checked,
//             reported apart and never fail the run
//   moved   — redirects to another host; still working, but worth updating
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Node's fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY is set (Node 22.21+ / 24.5+).
// Behind a proxy, rerun this script with it switched on.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const run = spawnSync(process.execPath, process.argv.slice(1), {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1' },
  });
  process.exit(run.status ?? 1);
}

// Links that fail for scripts but open in a browser. Re-check them by hand now and then and
// drop an entry once the link works for scripts again or is replaced.
const KNOWN = new Map([
  ['https://research.facebook.com/blog/2016/2/three-and-a-half-degrees-of-separation/', 'returns 400 to scripts'],
  ['https://www.lecloud.net/post/7295452622/scalability-for-dummies-part-1-clones', 'incomplete TLS chain'],
  ['https://www.lecloud.net/post/7994751381/scalability-for-dummies-part-2-database', 'incomplete TLS chain'],
  ['https://www.lecloud.net/post/9246290032/scalability-for-dummies-part-3-cache', 'incomplete TLS chain'],
]);

const root = new URL('..', import.meta.url).pathname;
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(mdx|md|ts)$/.test(name)) files.push(p);
  }
};
walk(join(root, 'src/content/docs'));
walk(join(root, 'src/data'));
files.push(join(root, 'README.md'), join(root, 'README.ru.md'));

// Example and placeholder hosts used in prose and code samples.
const SKIP = /(^|\.)(example(\.com|\.org)?|localhost|sho\.rt|butyavk\.github\.io)$|your-username|www\.w3\.org\/2000/;
const uses = new Map();
for (const f of files) {
  for (const m of readFileSync(f, 'utf8').matchAll(/https?:\/\/[^\s)\]>"'`]+/g)) {
    const url = m[0].replace(/[.,;:*]+$/, '');
    let host;
    try {
      host = new URL(url).hostname;
    } catch {
      continue;
    }
    if (SKIP.test(host) || SKIP.test(url)) continue;
    if (!uses.has(url)) uses.set(url, new Set());
    uses.get(url).add(relative(root, f));
  }
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';
async function check(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url.split('#')[0], {
        redirect: 'follow',
        headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8', 'accept-language': 'en-US,en;q=0.8' },
        signal: AbortSignal.timeout(25_000),
      });
      res.body?.cancel();
      if ([429, 502, 503, 504].includes(res.status) && attempt === 0) continue;
      return { status: res.status, final: res.url };
    } catch (e) {
      if (attempt === 1) return { status: 0, error: e.cause?.code ?? e.name };
    }
  }
}

const urls = [...uses.keys()];
const results = new Map();
let next = 0;
await Promise.all(
  Array.from({ length: 12 }, async () => {
    while (next < urls.length) {
      const url = urls[next++];
      results.set(url, await check(url));
    }
  }),
);

const where = (url) => {
  const list = [...uses.get(url)];
  return list[0] + (list.length > 1 ? ` +${list.length - 1}` : '');
};
const host = (u) => new URL(u).hostname.replace(/^www\./, '');
const BOT_WALL = [401, 403, 429, 999];
const TLS_CHAIN = ['UNABLE_TO_GET_ISSUER_CERT_LOCALLY', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'];
const NO_ANSWER = ['ECONNRESET', 'UND_ERR_CONNECT_TIMEOUT', 'UND_ERR_SOCKET', 'TimeoutError', 'ETIMEDOUT'];
const broken = [];
const silent = [];
const blocked = [];
const known = [];
const moved = [];
for (const [url, r] of results) {
  const fails = r.status === 0 || r.status >= 400;
  if (fails && KNOWN.has(url)) known.push([url, r]);
  else if (BOT_WALL.includes(r.status) || TLS_CHAIN.includes(r.error)) blocked.push([url, r]);
  else if (NO_ANSWER.includes(r.error)) silent.push([url, r]);
  else if (fails) broken.push([url, r]);
  else if (r.final && host(r.final) !== host(url)) moved.push([url, r]);
}

console.log(`${urls.length} external links in ${files.length} files`);
console.log(`\nbroken: ${broken.length}`);
for (const [url, r] of broken) console.log(`  ${r.status || r.error}  ${url}  (${where(url)})`);
console.log(`\nno answer from here, retry from another network: ${silent.length}`);
for (const [url, r] of silent) console.log(`  ${r.error}  ${url}  (${where(url)})`);
console.log(`\nblocked for scripts, check in a browser: ${blocked.length}`);
for (const [url, r] of blocked) console.log(`  ${r.status || r.error}  ${url}  (${where(url)})`);
console.log(`\nknown to fail for scripts (see KNOWN): ${known.length}`);
for (const [url, r] of known) console.log(`  ${r.status || r.error}  ${url}  — ${KNOWN.get(url)}`);
console.log(`\nmoved to another host: ${moved.length}`);
for (const [url, r] of moved) console.log(`  ${url}\n    -> ${r.final}`);
process.exitCode = broken.length ? 1 : 0;

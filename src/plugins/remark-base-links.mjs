// Rewrites root-relative links in Markdown/MDX ("/fundamentals/cap-theorem/")
// so that content authors never have to think about the deploy base path or the
// locale prefix. A page under src/content/docs/ru/ links to "/x/" and gets
// "<base>/ru/x/"; an English page gets "<base>/x/".
import { visit } from 'unist-util-visit';

const LOCALES = ['ru'];

export default function remarkBaseLinks({ base = '/' } = {}) {
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return (tree, file) => {
    const path = (file?.path || file?.history?.[0] || '').replaceAll('\\', '/');
    const m = path.match(/\/content\/docs\/([^/]+)\//);
    const locale = m && LOCALES.includes(m[1]) ? m[1] : null;
    const fix = (url) => {
      if (typeof url !== 'string' || !url.startsWith('/') || url.startsWith('//')) return url;
      if (cleanBase && (url === cleanBase || url.startsWith(cleanBase + '/'))) return url;
      let out = url;
      if (locale && !LOCALES.some((l) => out === `/${l}` || out.startsWith(`/${l}/`))) {
        out = `/${locale}${out}`;
      }
      return cleanBase + out;
    };
    visit(tree, (node) => {
      if ((node.type === 'link' || node.type === 'definition') && node.url) node.url = fix(node.url);
      if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
        for (const attr of node.attributes || []) {
          if (attr.type === 'mdxJsxAttribute' && (attr.name === 'href') && typeof attr.value === 'string') {
            attr.value = fix(attr.value);
          }
        }
      }
    });
  };
}

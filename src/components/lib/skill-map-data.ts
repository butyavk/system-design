// Build-time view of the skill map for one locale: structure from src/data/skill-map.ts,
// titles, descriptions and reading time from the pages themselves.
import { getCollection } from 'astro:content';
import { skillNodes, plansFor, planOrder, trackOf, validateSkillMap } from '~/data/skill-map';
import type { Locale } from './format';

export interface MapNode {
  /** Path without base/locale: "data/replication/". */
  p: string;
  /** Label for the map. */
  t: string;
  /** Full page title. */
  title: string;
  d: string;
  tr: string;
  needs: string[];
  /** Direct dependents. */
  deps: string[];
  plans: string[];
  ord: number;
  /** Reading time, minutes. */
  min: number;
}

const cache = new Map<Locale, Promise<MapNode[]>>();

// Time to read a page carefully, as you would to learn from it rather than skim it:
// technical prose at about 150 words a minute (125 in Russian, whose words are longer),
// code at about 15 lines a minute, and a minute for each diagram.
function readingMinutes(body: string, locale: Locale): number {
  const src = body.replace(/^import .*$/gm, '');
  let codeLines = 0;
  let diagrams = 0;
  for (const m of src.matchAll(/```(\w*)[^\n]*\n([\s\S]*?)```/g)) {
    if (m[1] === 'mermaid') diagrams++;
    else codeLines += m[2].split('\n').filter((l) => l.trim()).length;
  }
  const text = src.replace(/```[\s\S]*?```/g, ' ').replace(/<[^>]+>/g, ' ');
  const words = text.split(/[\s\u00a0]+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const minutes = words / (locale === 'ru' ? 125 : 150) + (codeLines * 4) / 60 + diagrams;
  return Math.max(3, Math.round(minutes));
}

async function build(locale: Locale): Promise<MapNode[]> {
  const docs = await getCollection('docs');
  const enPaths = docs.filter((d) => d.id !== 'ru' && d.id !== '404' && !d.id.startsWith('ru/')).map((d) => (d.id === 'index' ? '' : `${d.id}/`));
  validateSkillMap(enPaths);
  const byId = new Map(docs.map((d) => [d.id, d]));
  const deps = new Map<string, string[]>();
  for (const x of skillNodes) for (const d of x.needs) deps.set(d, [...(deps.get(d) ?? []), x.path]);
  return skillNodes.map((x) => {
    const id = (locale === 'ru' ? 'ru/' : '') + x.path.replace(/\/$/, '');
    const entry = byId.get(id);
    if (!entry) throw new Error(`Skill map: page ${id} not found`);
    return {
      p: x.path,
      t: x.label?.[locale] ?? entry.data.title,
      title: entry.data.title,
      d: entry.data.description ?? '',
      tr: trackOf(x.path),
      needs: x.needs,
      deps: deps.get(x.path) ?? [],
      plans: plansFor(x.path),
      ord: planOrder(x.path),
      min: readingMinutes(entry.body ?? '', locale),
    };
  });
}

export function mapNodes(locale: Locale): Promise<MapNode[]> {
  if (!cache.has(locale)) cache.set(locale, build(locale));
  return cache.get(locale)!;
}

export const pageHref = (path: string, locale: Locale) => {
  const raw = import.meta.env.BASE_URL;
  const base = raw.endsWith('/') ? raw : `${raw}/`;
  return `${base}${locale === 'ru' ? 'ru/' : ''}${path}`;
};

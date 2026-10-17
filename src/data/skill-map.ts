// Skill map: every topic page as a node in a prerequisite graph.
// Used by the map page (/start/skill-map/), the "on the map" block at the end of each
// topic page and the study plan. Titles and descriptions come from the pages themselves;
// this file only holds structure.
//
// Rules (checked by validateSkillMap() at build time):
// - every `path` and every entry of `needs` is a node; the graph has no cycles;
// - `needs` lists only DIRECT prerequisites — "read this first, or the page will not make sense";
// - plan closure: a node that is in a study-plan timeline only needs nodes that are in that
//   timeline too, so following the short plan never sends you to a page outside it.

import { studyPhases, type Timeline } from './study-plan';

interface L {
  en: string;
  ru: string;
}

export type StageId = 'orient' | 'fundamentals' | 'blocks' | 'systems' | 'practice' | 'real';

export interface Stage {
  id: StageId;
  title: L;
  /** What you can do once the stage is done. */
  outcome: L;
  tracks: string[];
}

export interface Track {
  id: string;
  title: L;
}

export interface SkillNode {
  /** Page path without base or locale, with trailing slash: "data/replication/". */
  path: string;
  /** Prerequisites (direct only). */
  needs: string[];
  /** Short label for the map when the page title is long. */
  label?: L;
}

export const tracks: Track[] = [
  { id: 'start', title: { en: 'Start here', ru: 'С чего начать' } },
  { id: 'reference', title: { en: 'Numbers & reference', ru: 'Цифры и справочник' } },
  { id: 'fundamentals', title: { en: 'Fundamentals & trade-offs', ru: 'Основы и компромиссы' } },
  { id: 'traffic', title: { en: 'Networking & traffic', ru: 'Сеть и трафик' } },
  { id: 'data', title: { en: 'Databases & storage', ru: 'Базы данных и хранилища' } },
  { id: 'caching', title: { en: 'Caching', ru: 'Кэширование' } },
  { id: 'async', title: { en: 'Asynchronism & messaging', ru: 'Асинхронность и очереди' } },
  { id: 'communication', title: { en: 'Communication & APIs', ru: 'Коммуникация и API' } },
  { id: 'architecture', title: { en: 'Application architecture', ru: 'Архитектура приложений' } },
  { id: 'reliability', title: { en: 'Reliability & security', ru: 'Надёжность и безопасность' } },
  { id: 'practice', title: { en: 'Practice: system design', ru: 'Практика: системный дизайн' } },
  { id: 'ood', title: { en: 'Practice: object-oriented design', ru: 'Практика: ООП-дизайн' } },
  { id: 'real-world', title: { en: 'Real-world systems', ru: 'Реальные системы' } },
];

export const stages: Stage[] = [
  {
    id: 'orient',
    title: { en: 'Get oriented', ru: 'Сориентироваться' },
    outcome: {
      en: 'You know the interview format and can size load and storage in a few minutes.',
      ru: 'Вы знаете формат собеседования и за несколько минут оцениваете нагрузку и объём данных.',
    },
    tracks: ['start', 'reference'],
  },
  {
    id: 'fundamentals',
    title: { en: 'Fundamentals', ru: 'Основы' },
    outcome: {
      en: 'You can name the trade-off behind a design choice: consistency, availability, latency.',
      ru: 'Вы называете компромисс за проектным решением: согласованность, доступность, задержка.',
    },
    tracks: ['fundamentals'],
  },
  {
    id: 'blocks',
    title: { en: 'Building blocks', ru: 'Строительные блоки' },
    outcome: {
      en: 'You can pick a database, cache, queue and protocol, and say what each one costs.',
      ru: 'Вы выбираете базу данных, кэш, очередь и протокол и объясняете, чем платите за каждый.',
    },
    tracks: ['traffic', 'data', 'caching', 'async', 'communication'],
  },
  {
    id: 'systems',
    title: { en: 'Architecture & operations', ru: 'Архитектура и эксплуатация' },
    outcome: {
      en: 'You can split a system into services and keep it running: limits, retries, monitoring, security.',
      ru: 'Вы делите систему на сервисы и держите её в рабочем состоянии: лимиты, повторы, мониторинг, безопасность.',
    },
    tracks: ['architecture', 'reliability'],
  },
  {
    id: 'practice',
    title: { en: 'Practice', ru: 'Практика' },
    outcome: {
      en: 'You can run a 45-minute design interview from requirements to bottlenecks.',
      ru: 'Вы проходите 45-минутное собеседование по дизайну от требований до узких мест.',
    },
    tracks: ['practice', 'ood'],
  },
  {
    id: 'real',
    title: { en: 'Real-world systems', ru: 'Реальные системы' },
    outcome: {
      en: 'You can back your answers with how real companies built their systems.',
      ru: 'Вы подкрепляете ответы тем, как реальные компании построили свои системы.',
    },
    tracks: ['real-world'],
  },
];

const n = (path: string, needs: string[] = [], label?: L): SkillNode => ({ path, needs, label });

/** In display order inside each track (the sidebar order). */
export const skillNodes: SkillNode[] = [
  // Start here
  n('start/introduction/'),
  n('start/study-plan/', ['start/introduction/']),
  n('start/interview-framework/', ['start/introduction/'], { en: 'Interview framework', ru: 'Схема собеседования' }),
  n('start/estimation/', ['start/interview-framework/', 'reference/latency-numbers/'], { en: 'Estimation', ru: 'Прикидочный расчёт' }),
  // Numbers & reference
  n('reference/latency-numbers/', [], { en: 'Latency numbers', ru: 'Цифры задержек' }),
  n('reference/powers-of-two/'),
  n('reference/availability-numbers/'),
  n('reference/flashcards/'),
  // Fundamentals
  n('fundamentals/performance-vs-scalability/', ['start/introduction/']),
  n('fundamentals/latency-vs-throughput/', ['reference/latency-numbers/']),
  n('fundamentals/cap-theorem/', ['fundamentals/performance-vs-scalability/']),
  n('fundamentals/consistency-patterns/', ['fundamentals/cap-theorem/']),
  n('fundamentals/availability-patterns/', ['fundamentals/performance-vs-scalability/']),
  n('fundamentals/consensus-and-coordination/', ['fundamentals/consistency-patterns/', 'fundamentals/availability-patterns/']),
  // Networking & traffic
  n('traffic/dns/', ['fundamentals/latency-vs-throughput/'], { en: 'DNS', ru: 'DNS' }),
  n('traffic/cdn/', ['fundamentals/latency-vs-throughput/'], { en: 'CDN', ru: 'CDN' }),
  n('traffic/load-balancers/', ['fundamentals/performance-vs-scalability/', 'fundamentals/availability-patterns/']),
  n('traffic/reverse-proxy-and-api-gateway/', ['traffic/load-balancers/']),
  // Databases & storage
  n('data/relational-databases/', ['fundamentals/performance-vs-scalability/']),
  n('data/replication/', ['data/relational-databases/', 'fundamentals/availability-patterns/', 'fundamentals/consistency-patterns/']),
  n('data/partitioning-and-sharding/', ['data/replication/']),
  n('data/denormalization-and-tuning/', ['data/relational-databases/']),
  n('data/nosql/', ['data/relational-databases/', 'fundamentals/cap-theorem/']),
  n('data/sql-or-nosql/', ['data/nosql/', 'data/partitioning-and-sharding/']),
  n('data/object-storage/', ['data/replication/']),
  // Caching
  n('caching/caching-layers/', ['fundamentals/latency-vs-throughput/', 'data/relational-databases/']),
  n('caching/cache-strategies/', ['caching/caching-layers/', 'fundamentals/consistency-patterns/']),
  // Asynchronism
  n('async/queues-and-back-pressure/', ['fundamentals/latency-vs-throughput/'], { en: 'Queues and back pressure', ru: 'Очереди и обратное давление' }),
  n('async/event-streaming/', ['async/queues-and-back-pressure/', 'data/partitioning-and-sharding/'], { en: 'Event streaming', ru: 'Потоки событий' }),
  // Communication
  n('communication/http/', ['fundamentals/latency-vs-throughput/']),
  n('communication/tcp-and-udp/', ['communication/http/']),
  n('communication/rpc-and-rest/', ['fundamentals/latency-vs-throughput/']),
  n('communication/api-styles/', ['communication/rpc-and-rest/', 'communication/http/']),
  // Application architecture
  n('architecture/monolith-and-microservices/', ['communication/rpc-and-rest/', 'traffic/load-balancers/'], { en: 'Monolith and microservices', ru: 'Монолит и микросервисы' }),
  n('architecture/service-discovery-and-mesh/', ['architecture/monolith-and-microservices/', 'traffic/reverse-proxy-and-api-gateway/'], { en: 'Discovery and service mesh', ru: 'Обнаружение и service mesh' }),
  n('architecture/llm-applications/', ['communication/api-styles/', 'caching/cache-strategies/', 'reliability/rate-limiting/']),
  // Reliability & security
  n('reliability/rate-limiting/', ['traffic/reverse-proxy-and-api-gateway/']),
  n('reliability/resilience-patterns/', ['fundamentals/availability-patterns/', 'async/queues-and-back-pressure/']),
  n('reliability/observability/', ['reference/availability-numbers/', 'reliability/resilience-patterns/']),
  n('reliability/security/', ['communication/http/', 'traffic/reverse-proxy-and-api-gateway/']),
  // Practice: system design
  n('practice/url-shortener-pastebin/', ['start/estimation/', 'data/sql-or-nosql/', 'caching/caching-layers/'], { en: 'URL shortener / Pastebin', ru: 'Сокращатель ссылок / Pastebin' }),
  n('practice/twitter-timeline/', ['start/estimation/', 'caching/cache-strategies/', 'async/queues-and-back-pressure/', 'data/partitioning-and-sharding/'], { en: 'Twitter timeline', ru: 'Лента Twitter' }),
  n('practice/web-crawler/', ['start/estimation/', 'async/queues-and-back-pressure/', 'data/nosql/', 'traffic/dns/'], { en: 'Web crawler', ru: 'Веб-краулер' }),
  n('practice/personal-finance-mint/', ['async/queues-and-back-pressure/', 'data/denormalization-and-tuning/', 'reliability/security/'], { en: 'Personal finance (Mint)', ru: 'Личные финансы (Mint)' }),
  n('practice/social-graph/', ['data/partitioning-and-sharding/', 'communication/rpc-and-rest/'], { en: 'Social graph', ru: 'Социальный граф' }),
  n('practice/search-query-cache/', ['caching/cache-strategies/', 'ood/lru-cache/', 'data/partitioning-and-sharding/'], { en: 'Search query cache', ru: 'Кэш поисковых запросов' }),
  n('practice/sales-rank/', ['async/event-streaming/', 'data/denormalization-and-tuning/'], { en: 'Sales rank (Amazon)', ru: 'Рейтинг продаж (Amazon)' }),
  n('practice/scaling-to-millions/', ['traffic/load-balancers/', 'traffic/cdn/', 'data/replication/', 'caching/caching-layers/'], { en: 'From 1 to millions of users', ru: 'От 1 до миллионов пользователей' }),
  n('practice/more-questions/', ['practice/url-shortener-pastebin/', 'practice/twitter-timeline/']),
  // Practice: OOD
  n('ood/hash-map/', [], { en: 'Hash map', ru: 'Хеш-таблица' }),
  n('ood/lru-cache/', [], { en: 'LRU cache', ru: 'LRU-кэш' }),
  n('ood/call-center/', [], { en: 'Call center', ru: 'Колл-центр' }),
  n('ood/deck-of-cards/', [], { en: 'Deck of cards', ru: 'Колода карт' }),
  n('ood/parking-lot/', [], { en: 'Parking lot', ru: 'Парковка' }),
  n('ood/online-chat/', ['communication/api-styles/'], { en: 'Online chat', ru: 'Онлайн-чат' }),
  // Real-world systems
  n('real-world/foundational-papers/', ['fundamentals/consensus-and-coordination/', 'data/nosql/', 'data/partitioning-and-sharding/']),
  n('real-world/company-architectures/', ['practice/scaling-to-millions/']),
  n('real-world/engineering-blogs/'),
];

export const trackOf = (path: string) => path.split('/')[0];

/** The map page itself. */
export const MAP_PATH = 'start/skill-map/';

/** Timelines whose study plan includes the page (empty: not a plan step, shown in every plan). */
export function plansFor(path: string): Timeline[] {
  const set = new Set<Timeline>();
  for (const ph of studyPhases) for (const s of ph.steps) if (s.path === path) s.timelines.forEach((t) => set.add(t));
  return [...set];
}

/** Position of the page in the study plan (first step that links to it), for "next up" ordering. */
export function planOrder(path: string): number {
  let i = 0;
  for (const ph of studyPhases)
    for (const s of ph.steps) {
      if (s.path === path) return i;
      i++;
    }
  return 1000 + skillNodes.findIndex((x) => x.path === path);
}

/** Throws with a readable message if the graph breaks one of the rules above. */
export function validateSkillMap(pagePaths: string[]): void {
  const errors: string[] = [];
  const byPath = new Map(skillNodes.map((x) => [x.path, x]));
  if (byPath.size !== skillNodes.length) errors.push('duplicate node paths');
  const trackIds = new Set(tracks.map((t) => t.id));
  const staged = stages.flatMap((s) => s.tracks);
  for (const t of trackIds) if (staged.filter((x) => x === t).length !== 1) errors.push(`track ${t} must be in exactly one stage`);
  for (const x of skillNodes) {
    if (!trackIds.has(trackOf(x.path))) errors.push(`${x.path}: unknown track`);
    if (!pagePaths.includes(x.path)) errors.push(`${x.path}: no such page`);
    for (const d of x.needs) {
      if (!byPath.has(d)) errors.push(`${x.path}: needs unknown ${d}`);
      if (d === x.path) errors.push(`${x.path}: needs itself`);
    }
    const own = plansFor(x.path);
    for (const d of x.needs) {
      const theirs = plansFor(d);
      if (!theirs.length) continue;
      for (const t of own) if (!theirs.includes(t)) errors.push(`${x.path} is in the ${t} plan but needs ${d}, which is not`);
    }
  }
  // Every topic page must be on the map (About pages and the map itself are not topics).
  for (const p of pagePaths)
    if (p && !p.startsWith('about/') && p !== MAP_PATH && !byPath.has(p)) errors.push(`page ${p} is missing from the map`);
  // Every study-plan step must be on the map.
  for (const ph of studyPhases) for (const s of ph.steps) if (!byPath.has(s.path)) errors.push(`study plan step ${s.id}: ${s.path} is not on the map`);
  // Cycle check (DFS).
  const state = new Map<string, number>();
  const visit = (p: string, trail: string[]): void => {
    if (state.get(p) === 2) return;
    if (state.get(p) === 1) {
      errors.push(`cycle: ${[...trail, p].join(' → ')}`);
      return;
    }
    state.set(p, 1);
    for (const d of byPath.get(p)?.needs ?? []) visit(d, [...trail, p]);
    state.set(p, 2);
  };
  for (const x of skillNodes) visit(x.path, []);
  if (errors.length) throw new Error(`Skill map is invalid:\n- ${errors.join('\n- ')}`);
}

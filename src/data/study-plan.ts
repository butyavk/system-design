// Study plan for the StudyPlan component (/start/study-plan/).
// A reworking of the original primer's study-guide table: three timelines,
// each a checklist of steps that link to pages of this site.
// `path` is relative to the site root, without base and locale ("data/replication/").

export type Timeline = 'short' | 'medium' | 'long';

interface L {
  en: string;
  ru: string;
}

export interface StudyStep {
  id: string;
  path: string;
  task: L;
  timelines: Timeline[];
}

export interface StudyPhase {
  id: string;
  title: L;
  /** What to aim for in this phase, per timeline. */
  aim: Record<Timeline, L>;
  steps: StudyStep[];
}

export const timelines: { id: Timeline; name: L; duration: L; summary: L }[] = [
  {
    id: 'short',
    name: { en: 'Short', ru: 'Короткий' },
    duration: { en: '1–2 weeks', ru: '1–2 недели' },
    summary: { en: 'Breadth first. Solve a few questions end to end.', ru: 'Сначала широта. Решить несколько задач от начала до конца.' },
  },
  {
    id: 'medium',
    name: { en: 'Medium', ru: 'Средний' },
    duration: { en: '3–6 weeks', ru: '3–6 недель' },
    summary: { en: 'Breadth plus some depth. Solve many questions.', ru: 'Широта и немного глубины. Решить много задач.' },
  },
  {
    id: 'long',
    name: { en: 'Long', ru: 'Длинный' },
    duration: { en: '2–3 months', ru: '2–3 месяца' },
    summary: { en: 'Breadth plus real depth. Solve most questions.', ru: 'Широта и настоящая глубина. Решить большинство задач.' },
  },
];

const ALL: Timeline[] = ['short', 'medium', 'long'];
const ML: Timeline[] = ['medium', 'long'];
const LONG: Timeline[] = ['long'];

export const studyPhases: StudyPhase[] = [
  {
    id: 'orient',
    title: { en: 'Get oriented', ru: 'Сориентироваться' },
    aim: {
      short: { en: 'Learn the interview format and the numbers you will use in every answer.', ru: 'Понять формат собеседования и выучить цифры, которые пригодятся в каждом ответе.' },
      medium: { en: 'Learn the format, then practise estimates until they take two or three minutes.', ru: 'Понять формат, затем тренировать оценки, пока они не будут занимать две-три минуты.' },
      long: { en: 'Learn the format and make estimation a habit you use while reading every other page.', ru: 'Понять формат и превратить оценки в привычку при чтении всех остальных страниц.' },
    },
    steps: [
      { id: 'intro', path: 'start/introduction/', timelines: ALL, task: { en: 'Read how this guide is organised and what a design interview tests', ru: 'Узнать, как устроен этот курс и что проверяют на собеседовании по дизайну' } },
      { id: 'framework', path: 'start/interview-framework/', timelines: ALL, task: { en: 'Learn the step-by-step framework for answering a design question', ru: 'Освоить пошаговую схему ответа на задачу по дизайну' } },
      { id: 'latency', path: 'reference/latency-numbers/', timelines: ALL, task: { en: 'Memorise the latency numbers (orders of magnitude, not digits)', ru: 'Запомнить задержки (порядки величин, а не точные цифры)' } },
      { id: 'estimation', path: 'start/estimation/', timelines: ALL, task: { en: 'Work through both estimation examples by hand', ru: 'Решить оба примера прикидочного расчёта вручную' } },
      { id: 'powers', path: 'reference/powers-of-two/', timelines: ML, task: { en: 'Learn the key powers of two and KiB vs KB', ru: 'Выучить ключевые степени двойки и разницу между КиБ и КБ' } },
      { id: 'nines', path: 'reference/availability-numbers/', timelines: ML, task: { en: 'Know what three, four and five nines allow per month', ru: 'Знать, сколько простоя в месяц допускают три, четыре и пять девяток' } },
    ],
  },
  {
    id: 'fundamentals',
    title: { en: 'Fundamentals and trade-offs', ru: 'Основы и компромиссы' },
    aim: {
      short: { en: 'Be able to explain each idea in two sentences with an example.', ru: 'Уметь объяснить каждую идею в двух предложениях и с примером.' },
      medium: { en: 'Explain each idea and name the trade-off it forces.', ru: 'Объяснить каждую идею и назвать компромисс, к которому она вынуждает.' },
      long: { en: 'Explain, argue both sides, and connect each idea to a real system.', ru: 'Объяснить, аргументировать обе стороны и связать каждую идею с реальной системой.' },
    },
    steps: [
      { id: 'perf-scal', path: 'fundamentals/performance-vs-scalability/', timelines: ALL, task: { en: 'Performance vs scalability', ru: 'Производительность и масштабируемость' } },
      { id: 'lat-thr', path: 'fundamentals/latency-vs-throughput/', timelines: ALL, task: { en: 'Latency vs throughput', ru: 'Задержка и пропускная способность' } },
      { id: 'cap', path: 'fundamentals/cap-theorem/', timelines: ALL, task: { en: 'CAP theorem and PACELC', ru: 'Теорема CAP и PACELC' } },
      { id: 'consistency', path: 'fundamentals/consistency-patterns/', timelines: ALL, task: { en: 'Consistency patterns', ru: 'Модели согласованности' } },
      { id: 'availability', path: 'fundamentals/availability-patterns/', timelines: ALL, task: { en: 'Availability patterns: failover and replication', ru: 'Паттерны доступности: переключение на резерв и репликация' } },
      { id: 'consensus', path: 'fundamentals/consensus-and-coordination/', timelines: ML, task: { en: 'Consensus, leases and fencing tokens', ru: 'Консенсус, аренды (leases) и токены изоляции (fencing tokens)' } },
    ],
  },
  {
    id: 'blocks',
    title: { en: 'Building blocks', ru: 'Строительные блоки' },
    aim: {
      short: { en: 'Know what each block is for and when to reach for it.', ru: 'Знать, зачем нужен каждый блок и когда его применять.' },
      medium: { en: 'Know when to use each block, its failure modes and its main alternatives.', ru: 'Знать, когда применять каждый блок, как он отказывает и чем его заменить.' },
      long: { en: 'Go one level down: internals, limits, and the further reading on each page.', ru: 'Спуститься на уровень ниже: внутреннее устройство, пределы и материалы из раздела «Что почитать».' },
    },
    steps: [
      { id: 'dns', path: 'traffic/dns/', timelines: ML, task: { en: 'DNS', ru: 'DNS' } },
      { id: 'cdn', path: 'traffic/cdn/', timelines: ALL, task: { en: 'Content delivery networks', ru: 'Сети доставки контента (CDN)' } },
      { id: 'lb', path: 'traffic/load-balancers/', timelines: ALL, task: { en: 'Load balancers', ru: 'Балансировщики нагрузки' } },
      { id: 'proxy', path: 'traffic/reverse-proxy-and-api-gateway/', timelines: ML, task: { en: 'Reverse proxies and API gateways', ru: 'Обратные прокси и API-шлюзы' } },
      { id: 'micro', path: 'architecture/monolith-and-microservices/', timelines: ALL, task: { en: 'Monoliths and microservices', ru: 'Монолиты и микросервисы' } },
      { id: 'mesh', path: 'architecture/service-discovery-and-mesh/', timelines: LONG, task: { en: 'Service discovery and service mesh', ru: 'Обнаружение сервисов и service mesh' } },
      { id: 'llm', path: 'architecture/llm-applications/', timelines: LONG, task: { en: 'LLM-powered systems', ru: 'Системы на базе LLM' } },
      { id: 'rdbms', path: 'data/relational-databases/', timelines: ALL, task: { en: 'Relational databases', ru: 'Реляционные базы данных' } },
      { id: 'replication', path: 'data/replication/', timelines: ALL, task: { en: 'Replication', ru: 'Репликация' } },
      { id: 'sharding', path: 'data/partitioning-and-sharding/', timelines: ALL, task: { en: 'Partitioning and sharding', ru: 'Партиционирование и шардирование' } },
      { id: 'denorm', path: 'data/denormalization-and-tuning/', timelines: ML, task: { en: 'Denormalization and SQL tuning', ru: 'Денормализация и настройка SQL' } },
      { id: 'nosql', path: 'data/nosql/', timelines: ALL, task: { en: 'NoSQL families', ru: 'Семейства NoSQL' } },
      { id: 'sql-nosql', path: 'data/sql-or-nosql/', timelines: ALL, task: { en: 'Choosing SQL or NoSQL', ru: 'Выбор между SQL и NoSQL' } },
      { id: 'objstore', path: 'data/object-storage/', timelines: ML, task: { en: 'Object storage', ru: 'Объектное хранилище' } },
      { id: 'cache-layers', path: 'caching/caching-layers/', timelines: ALL, task: { en: 'Where to cache', ru: 'Где кэшировать' } },
      { id: 'cache-strat', path: 'caching/cache-strategies/', timelines: ALL, task: { en: 'Cache update strategies', ru: 'Стратегии обновления кэша' } },
      { id: 'queues', path: 'async/queues-and-back-pressure/', timelines: ALL, task: { en: 'Queues and back pressure', ru: 'Очереди и обратное давление' } },
      { id: 'streams', path: 'async/event-streaming/', timelines: ML, task: { en: 'Event streaming (Kafka-style logs)', ru: 'Потоки событий (журналы в духе Kafka)' } },
      { id: 'http', path: 'communication/http/', timelines: ML, task: { en: 'HTTP/1.1, HTTP/2 and HTTP/3', ru: 'HTTP/1.1, HTTP/2 и HTTP/3' } },
      { id: 'tcp', path: 'communication/tcp-and-udp/', timelines: LONG, task: { en: 'TCP and UDP', ru: 'TCP и UDP' } },
      { id: 'rpc', path: 'communication/rpc-and-rest/', timelines: ALL, task: { en: 'RPC and REST', ru: 'RPC и REST' } },
      { id: 'api', path: 'communication/api-styles/', timelines: ML, task: { en: 'API styles: GraphQL, SSE, WebSockets, webhooks', ru: 'Стили API: GraphQL, SSE, WebSocket, вебхуки' } },
      { id: 'ratelimit', path: 'reliability/rate-limiting/', timelines: ML, task: { en: 'Rate limiting', ru: 'Ограничение частоты запросов' } },
      { id: 'resilience', path: 'reliability/resilience-patterns/', timelines: ML, task: { en: 'Timeouts, retries, circuit breakers', ru: 'Тайм-ауты, повторы, предохранители' } },
      { id: 'observability', path: 'reliability/observability/', timelines: LONG, task: { en: 'Observability and SLOs', ru: 'Наблюдаемость и SLO' } },
      { id: 'security', path: 'reliability/security/', timelines: ML, task: { en: 'Security basics', ru: 'Основы безопасности' } },
    ],
  },
  {
    id: 'practice',
    title: { en: 'Practise system design questions', ru: 'Решать задачи по системному дизайну' },
    aim: {
      short: { en: 'Solve some: attempt each one yourself for 45 minutes before reading the solution.', ru: 'Решить несколько: каждую сначала 45 минут самостоятельно, потом читать решение.' },
      medium: { en: 'Solve many. Redo one you struggled with a week later.', ru: 'Решить много. Через неделю повторно решить ту, что далась тяжелее всего.' },
      long: { en: 'Solve most, out loud, and compare your design with the solution step by step.', ru: 'Решить большинство, вслух, и сравнить свой дизайн с решением шаг за шагом.' },
    },
    steps: [
      { id: 'p-url', path: 'practice/url-shortener-pastebin/', timelines: ALL, task: { en: 'Design a URL shortener / Pastebin', ru: 'Спроектировать сокращатель ссылок / Pastebin' } },
      { id: 'p-twitter', path: 'practice/twitter-timeline/', timelines: ALL, task: { en: 'Design the Twitter timeline and search', ru: 'Спроектировать ленту и поиск Twitter' } },
      { id: 'p-scale', path: 'practice/scaling-to-millions/', timelines: ALL, task: { en: 'Scale a system from one user to millions', ru: 'Масштабировать систему от одного пользователя до миллионов' } },
      { id: 'p-crawler', path: 'practice/web-crawler/', timelines: ML, task: { en: 'Design a web crawler', ru: 'Спроектировать поискового робота' } },
      { id: 'p-cache', path: 'practice/search-query-cache/', timelines: ML, task: { en: 'Design a cache for search queries', ru: 'Спроектировать кэш поисковых запросов' } },
      { id: 'p-graph', path: 'practice/social-graph/', timelines: ML, task: { en: 'Design social graph data structures', ru: 'Спроектировать структуры данных социального графа' } },
      { id: 'p-rank', path: 'practice/sales-rank/', timelines: LONG, task: { en: 'Design sales rank by category', ru: 'Спроектировать рейтинг продаж по категориям' } },
      { id: 'p-mint', path: 'practice/personal-finance-mint/', timelines: LONG, task: { en: 'Design a personal finance service', ru: 'Спроектировать сервис личных финансов' } },
      { id: 'p-more', path: 'practice/more-questions/', timelines: ML, task: { en: 'Pick extra questions from the list and solve them timed', ru: 'Выбрать дополнительные задачи из списка и решить их на время' } },
    ],
  },
  {
    id: 'ood',
    title: { en: 'Practise object-oriented design', ru: 'Решать задачи на ООП-дизайн' },
    aim: {
      short: { en: 'Solve some: classes, relationships and one or two key methods.', ru: 'Решить несколько: классы, связи и один-два ключевых метода.' },
      medium: { en: 'Solve many, writing real code for the core methods.', ru: 'Решить много, написав настоящий код ключевых методов.' },
      long: { en: 'Solve most and discuss extensibility and concurrency for each.', ru: 'Решить большинство и для каждой обсудить расширяемость и конкурентный доступ.' },
    },
    steps: [
      { id: 'o-lru', path: 'ood/lru-cache/', timelines: ALL, task: { en: 'LRU cache', ru: 'LRU-кэш' } },
      { id: 'o-parking', path: 'ood/parking-lot/', timelines: ALL, task: { en: 'Parking lot', ru: 'Парковка' } },
      { id: 'o-hashmap', path: 'ood/hash-map/', timelines: ML, task: { en: 'Hash map', ru: 'Хеш-таблица' } },
      { id: 'o-callcenter', path: 'ood/call-center/', timelines: ML, task: { en: 'Call center', ru: 'Колл-центр' } },
      { id: 'o-cards', path: 'ood/deck-of-cards/', timelines: LONG, task: { en: 'Deck of cards', ru: 'Колода карт' } },
      { id: 'o-chat', path: 'ood/online-chat/', timelines: LONG, task: { en: 'Online chat', ru: 'Онлайн-чат' } },
    ],
  },
  {
    id: 'real',
    title: { en: 'Learn from real systems', ru: 'Учиться на реальных системах' },
    aim: {
      short: { en: 'Read about the companies you are interviewing with.', ru: 'Почитать о компаниях, в которые вы идёте на собеседование.' },
      medium: { en: 'Read about your target companies and a few well-known architectures.', ru: 'Почитать о целевых компаниях и нескольких известных архитектурах.' },
      long: { en: 'Add the classic papers: they explain why today’s systems look the way they do.', ru: 'Добавить классические статьи: они объясняют, почему современные системы устроены именно так.' },
    },
    steps: [
      { id: 'r-blogs', path: 'real-world/engineering-blogs/', timelines: ALL, task: { en: 'Read 2–3 engineering-blog posts from your target companies', ru: 'Прочитать 2–3 статьи из инженерных блогов целевых компаний' } },
      { id: 'r-arch', path: 'real-world/company-architectures/', timelines: ALL, task: { en: 'Read a few real-world architectures', ru: 'Разобрать несколько реальных архитектур' } },
      { id: 'r-papers', path: 'real-world/foundational-papers/', timelines: LONG, task: { en: 'Read 3–4 foundational papers (Dynamo, Bigtable, Spanner…)', ru: 'Прочитать 3–4 основополагающие статьи (Dynamo, Bigtable, Spanner…)' } },
      { id: 'flashcards', path: 'reference/flashcards/', timelines: ALL, task: { en: 'Review the key facts with the flashcards (a few minutes a day)', ru: 'Повторять ключевые факты по карточкам (несколько минут в день)' } },
      { id: 'r-mock', path: 'start/interview-framework/', timelines: ALL, task: { en: 'Do a timed mock interview out loud with a friend or a recorder', ru: 'Провести пробное собеседование на время, вслух — с другом или на диктофон' } },
    ],
  },
];

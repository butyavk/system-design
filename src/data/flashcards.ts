// Flashcards for the Flashcards component (/reference/flashcards/) and the
// Anki export (`npm run flashcards` → public/flashcards/*.tsv).
//
// Every answer restates what the linked page says, so numbers and definitions
// must match it (latency values match src/data/latency.ts). `link` is a page
// path from scripts/pages.json, root-relative, without base and locale.
//
// Light markup in front/back text: `code`, **bold**, *italic*, and lines starting with
// "- " (bullets) or "1. " (numbered steps). Rendered by cardHtml() below.
//
// Keep this file free of imports and of non-erasable TypeScript (no enums,
// no namespaces): scripts/export-flashcards.mjs loads it directly with Node's
// type stripping.

export type FlashSection =
  | 'fundamentals'
  | 'traffic'
  | 'architecture'
  | 'data'
  | 'caching'
  | 'async'
  | 'communication'
  | 'reliability'
  | 'numbers'
  | 'interview'
  | 'practice'
  | 'ood';

export interface FlashText {
  en: string;
  ru: string;
}

export interface Flashcard {
  /** Stable id: progress in the browser and Anki GUIDs are keyed by it. */
  id: string;
  section: FlashSection;
  /** Page to read more, e.g. "/data/replication/". */
  link: string;
  front: FlashText;
  back: FlashText;
}

export const flashSections: { id: FlashSection; label: FlashText }[] = [
  { id: 'fundamentals', label: { en: 'Fundamentals', ru: 'Основы' } },
  { id: 'traffic', label: { en: 'Networking & traffic', ru: 'Сеть и трафик' } },
  { id: 'architecture', label: { en: 'Architecture', ru: 'Архитектура' } },
  { id: 'data', label: { en: 'Databases & storage', ru: 'Базы данных' } },
  { id: 'caching', label: { en: 'Caching', ru: 'Кэширование' } },
  { id: 'async', label: { en: 'Async & messaging', ru: 'Асинхронность' } },
  { id: 'communication', label: { en: 'Communication & APIs', ru: 'Коммуникация и API' } },
  { id: 'reliability', label: { en: 'Reliability & security', ru: 'Надёжность и безопасность' } },
  { id: 'numbers', label: { en: 'Numbers', ru: 'Цифры' } },
  { id: 'interview', label: { en: 'Interview framework', ru: 'Схема собеседования' } },
  { id: 'practice', label: { en: 'Case studies', ru: 'Разборы задач' } },
  { id: 'ood', label: { en: 'Object-oriented design', ru: 'ООП-дизайн' } },
];

export const flashcards: Flashcard[] = [
  // ---------------------------------------------------------------- fundamentals
  {
    id: 'fund-perf-vs-scale',
    section: 'fundamentals',
    link: '/fundamentals/performance-vs-scalability/',
    front: {
      en: "Performance problem or scalability problem: how do you tell them apart?",
      ru: "Проблема производительности или масштабируемости: как их различить?",
    },
    back: {
      en: "A **performance** problem shows up with one user: every request is slow, even on an idle system. Fix it with profiling, indexes and better algorithms.\nA **scalability** problem shows up under load: one user is fine, ten thousand are not. Fix it by adding capacity, removing the shared bottleneck, caching or partitioning.",
      ru: "Проблема **производительности** видна уже при одном пользователе: медленный каждый запрос, даже на простаивающей системе. Лечится профилированием, индексами и лучшими алгоритмами.\nПроблема **масштабируемости** проявляется под нагрузкой: одному пользователю всё быстро, десяти тысячам — нет. Лечится добавлением мощности, устранением общего узкого места, кэшем или разделением данных.",
    },
  },
  {
    id: 'fund-scale-up-out',
    section: 'fundamentals',
    link: '/fundamentals/performance-vs-scalability/',
    front: {
      en: "Scale up or scale out: what does each buy and cost?",
      ru: "Вертикальное или горизонтальное масштабирование: что даёт и чего стоит каждое?",
    },
    back: {
      en: "**Scale up** (a bigger machine): no code changes and simple operations, but a hard ceiling, a steep price at the top and a single point of failure.\n**Scale out** (more machines): near-linear capacity and redundancy, but only for stateless tiers or data you can partition.\nDefault: scale up while it is cheap, and design for scale-out where you know you will need it.",
      ru: "**Вертикальное** (машина побольше): без изменений кода и с простой эксплуатацией, но с жёстким потолком, крутой ценой на верхних конфигурациях и единой точкой отказа.\n**Горизонтальное** (больше машин): почти линейный рост мощности и избыточность, но только для stateless-слоёв или данных, которые можно разделить.\nПо умолчанию растите вертикально, пока это дёшево, и закладывайте горизонтальное там, где оно точно понадобится.",
    },
  },
  {
    id: 'fund-amdahl',
    section: 'fundamentals',
    link: '/fundamentals/performance-vs-scalability/',
    front: {
      en: "What does Amdahl's law say about adding workers?",
      ru: "Что закон Амдала говорит о добавлении исполнителей?",
    },
    back: {
      en: "With a parallel fraction `p` on `N` workers, the speed-up is `1 / ((1 − p) + p / N)`, and it can never exceed `1 / (1 − p)`. At 95% parallel the limit is 20×, at 99% it is 100×.\nIn a web system the serial part is whatever every request passes through one at a time: a single primary, a global lock, a hot row.",
      ru: "При доле параллельной работы `p` и `N` исполнителях ускорение равно `1 / ((1 − p) + p / N)` и никогда не превышает `1 / (1 − p)`. При 95% параллельной работы предел — 20×, при 99% — 100×.\nВ веб-системе последовательная часть — всё, через что каждый запрос проходит по одному: единственный основной узел, глобальная блокировка, горячая строка.",
    },
  },
  {
    id: 'fund-percentiles',
    section: 'fundamentals',
    link: '/fundamentals/latency-vs-throughput/',
    front: {
      en: "Why report latency as percentiles rather than an average?",
      ru: "Почему задержку описывают перцентилями, а не средним?",
    },
    back: {
      en: "Latency is skewed, so the mean describes no real request. In the page's example of 1,000 requests, the mean is 38.9 ms, while p50 is 20 ms and p99 is 400 ms.\nSet targets on p99 or p99.9, and never average percentiles across servers: merge histograms and compute the percentile from the merged data.",
      ru: "Распределение задержек скошено, поэтому среднее не описывает ни один реальный запрос. В примере со страницы из 1000 запросов среднее — 38,9 мс, а p50 — 20 мс и p99 — 400 мс.\nЦели ставьте на p99 или p99.9 и никогда не усредняйте перцентили разных серверов: объединяйте гистограммы и считайте перцентиль по общим данным.",
    },
  },
  {
    id: 'fund-fanout-tail',
    section: 'fundamentals',
    link: '/fundamentals/latency-vs-throughput/',
    front: {
      en: "1% of servers are slow at any moment. How often does a request that touches 100 servers hit at least one slow one?",
      ru: "В каждый момент 1% серверов тормозит. Как часто запрос к 100 серверам попадёт хотя бы на один медленный?",
    },
    back: {
      en: "`1 − 0.99^100 ≈ 63%`. The response is only as fast as the slowest shard, so at a fan-out of about 70 a backend's p99 becomes the frontend's median.\nMitigations: hedged requests, partial results, fewer hops, and a deadline for each hop.",
      ru: "`1 − 0.99^100 ≈ 63%`. Ответ не быстрее самого медленного шарда, поэтому при fan-out около 70 p99 бэкенда становится медианой фронтенда.\nЧто помогает: дублирующие запросы (hedged requests), частичные результаты, меньше переходов и дедлайн на каждый переход.",
    },
  },
  {
    id: 'fund-little',
    section: 'fundamentals',
    link: '/fundamentals/latency-vs-throughput/',
    front: {
      en: "State Little's law and size a thread pool with it.",
      ru: "Сформулируйте закон Литтла и рассчитайте по нему пул потоков.",
    },
    back: {
      en: "`L = λW`: requests in flight = arrival rate × time in system.\nAn API at 2,000 requests/s with 150 ms per request has 300 requests in flight. A pool of 200 threads therefore caps out at about 1,333 requests/s at that latency. The same arithmetic sizes connection pools and queues.",
      ru: "`L = λW`: число запросов в обработке = интенсивность потока × время в системе.\nAPI на 2000 запросов/с при 150 мс на запрос держит в обработке 300 запросов. Значит, пул из 200 потоков при такой задержке упрётся примерно в 1333 запроса/с. Так же считают пулы соединений и очереди.",
    },
  },
  {
    id: 'fund-utilisation',
    section: 'fundamentals',
    link: '/fundamentals/latency-vs-throughput/',
    front: {
      en: "What happens to latency as a server's utilisation approaches 100%?",
      ru: "Что происходит с задержкой, когда загрузка сервера приближается к 100%?",
    },
    back: {
      en: "It explodes. In the single-queue model, mean response time is `W = S / (1 − ρ)`: 2× the service time at 50% busy, 10× at 90%, 100× at 99%.\nKeep headroom for peaks and failover, bound every queue, and treat a rising p99 as an early warning.",
      ru: "Она взрывается. В модели с одной очередью среднее время ответа `W = S / (1 − ρ)`: 2× времени обслуживания при загрузке 50%, 10× при 90%, 100× при 99%.\nДержите запас на пики и переключение на резерв, ограничивайте каждую очередь и считайте рост p99 ранним предупреждением.",
    },
  },
  {
    id: 'fund-cap',
    section: 'fundamentals',
    link: '/fundamentals/cap-theorem/',
    front: {
      en: "What does the CAP theorem actually say?",
      ru: "Что на самом деле утверждает теорема CAP?",
    },
    back: {
      en: "Only **during a network partition** must a replicated system choose, per operation: stay consistent (linearizable, so some requests fail or time out) or stay available (every non-failing node answers, possibly with stale data).\nPartitions are not optional, so “pick 2 of 3” is misleading, and only a single-node system is truly “CA”.",
      ru: "Только **во время разделения сети** реплицированная система должна выбрать для каждой операции: остаться согласованной (линеаризуемой — часть запросов падает или уходит в тайм-аут) или доступной (каждый исправный узел отвечает, возможно, устаревшими данными).\nРазделения сети неизбежны, поэтому «выберите 2 из 3» вводит в заблуждение; по-настоящему «CA» только система из одного узла.",
    },
  },
  {
    id: 'fund-pacelc',
    section: 'fundamentals',
    link: '/fundamentals/cap-theorem/',
    front: {
      en: "What does PACELC add to CAP?",
      ru: "Что PACELC добавляет к CAP?",
    },
    back: {
      en: "If **P**artitioned, choose **A**vailability or **C**onsistency; **E**lse, choose **L**atency or **C**onsistency. The “else” half is paid on every request, not only during failures.\nCassandra and the original Dynamo are PA/EL; Spanner, CockroachDB and etcd are PC/EC. Modern databases are consistent by default and offer stale reads on request.",
      ru: "При разделении (**P**artition) выбираем доступность (**A**) или согласованность (**C**); иначе (**E**lse) — задержку (**L**atency) или согласованность (**C**). Цену второй половины платит каждый запрос, а не только во время сбоев.\nCassandra и исходный Dynamo — PA/EL; Spanner, CockroachDB и etcd — PC/EC. Современные базы согласованы по умолчанию и дают устаревшие чтения по запросу.",
    },
  },
  {
    id: 'fund-quorum',
    section: 'fundamentals',
    link: '/fundamentals/cap-theorem/',
    front: {
      en: "When does a quorum read see the latest write, and is that enough for linearizability?",
      ru: "Когда чтение с кворумом видит последнюю запись и достаточно ли этого для линеаризуемости?",
    },
    back: {
      en: "With `N` replicas, a write waits for `W` acks and a read asks `R` replicas. If `R + W > N` (say N = 3, W = 2, R = 2), every read set overlaps every write set.\nOverlap is not linearizability: concurrent writes, partially failed writes and sloppy quorums can still produce anomalies.",
      ru: "При `N` репликах запись ждёт `W` подтверждений, а чтение опрашивает `R` реплик. Если `R + W > N` (например, N = 3, W = 2, R = 2), любое множество чтения пересекается с любым множеством записи.\nПересечение — ещё не линеаризуемость: конкурентные записи, частично неудачные записи и нестрогие кворумы (sloppy quorums) всё равно дают аномалии.",
    },
  },
  {
    id: 'fund-read-your-writes',
    section: 'fundamentals',
    link: '/fundamentals/consistency-patterns/',
    front: {
      en: "A user edits their profile, refreshes and sees the old version. Which guarantee is missing, and how do you provide it?",
      ru: "Пользователь правит профиль, обновляет страницу и видит старую версию. Какой гарантии не хватает и как её обеспечить?",
    },
    back: {
      en: "**Read-your-writes.** Options:\n- read from the leader for a short window after the user writes;\n- pin the session to one replica (sticky routing);\n- return the write's log position (an LSN or version) and read only from a replica that has applied it.",
      ru: "**Чтения своих записей** (read-your-writes). Варианты:\n- в течение короткого окна после записи читать с лидера;\n- закрепить сессию за одной репликой (sticky routing);\n- вернуть позицию записи в журнале (LSN или версию) и читать только с реплики, которая её уже применила.",
    },
  },
  {
    id: 'fund-linearizable',
    section: 'fundamentals',
    link: '/fundamentals/consistency-patterns/',
    front: {
      en: "Linearizability vs serializability: what is the difference?",
      ru: "Линеаризуемость и сериализуемость: в чём разница?",
    },
    back: {
      en: "**Linearizability**: single-object operations appear atomic and in real-time order, as if there were one copy. You need it for “check then act”: locks, claiming a username.\n**Serializability**: transactions appear in *some* serial order, not necessarily the real-time one. **Strict serializability** (Spanner's external consistency) is both.",
      ru: "**Линеаризуемость**: операции над одним объектом выглядят атомарными и упорядоченными в реальном времени, как будто копия одна. Нужна для логики «проверить, потом действовать»: блокировки, занятие имени пользователя.\n**Сериализуемость**: транзакции выглядят выполненными в *каком-то* последовательном порядке, не обязательно в реальном времени. **Строгая сериализуемость** (external consistency в Spanner) — это и то и другое.",
    },
  },
  {
    id: 'fund-series-parallel',
    section: 'fundamentals',
    link: '/fundamentals/availability-patterns/',
    front: {
      en: "How do availabilities combine in series and in parallel?",
      ru: "Как складывается доступность последовательных и параллельных компонентов?",
    },
    back: {
      en: "**In series** (every part is needed) availabilities multiply: 99.99% × 99.95% × 99.95% ≈ 99.89%, worse than any single part.\n**In parallel** (any copy will do) failure probabilities multiply: two servers at 99.5% give `1 − 0.005² = 99.9975%`. That holds only if the copies fail independently.",
      ru: "**Последовательно** (нужна каждая часть) доступности перемножаются: 99,99% × 99,95% × 99,95% ≈ 99,89% — хуже любой отдельной части.\n**Параллельно** (подойдёт любая копия) перемножаются вероятности отказа: два сервера по 99,5% дают `1 − 0,005² = 99,9975%`. Это верно, только если копии отказывают независимо.",
    },
  },
  {
    id: 'fund-rto-rpo',
    section: 'fundamentals',
    link: '/fundamentals/availability-patterns/',
    front: {
      en: "RTO vs RPO, and what do hot, warm and cold standbys give you?",
      ru: "RTO и RPO: что это и что дают горячий, тёплый и холодный резерв?",
    },
    back: {
      en: "**RTO**: how long you may be down. **RPO**: how much recent data you may lose.\n- Hot standby: seconds to a minute; zero RPO with synchronous replication; about 2× the cost.\n- Warm: minutes, because it must scale up; seconds of data.\n- Cold: hours; everything since the last backup.",
      ru: "**RTO** — сколько можно простаивать. **RPO** — сколько последних данных можно потерять.\n- Горячий резерв: от секунд до минуты; RPO ноль при синхронной репликации; стоит около 2×.\n- Тёплый: минуты, потому что нужно масштабироваться; теряются секунды данных.\n- Холодный: часы; теряется всё с момента последнего бэкапа.",
    },
  },
  {
    id: 'fund-error-budget',
    section: 'fundamentals',
    link: '/fundamentals/availability-patterns/',
    front: {
      en: "What is an error budget, and what happens when it runs out?",
      ru: "Что такое бюджет ошибок и что происходит, когда он исчерпан?",
    },
    back: {
      en: "The budget is `1 − SLO`. A 99.9% SLO over 30 days allows 43.2 minutes of full outage, or 100,000 failed requests out of 100 million.\nWhile budget remains, ship features and take risks. When it is spent, the error budget policy freezes risky releases until the service is back within its SLO.",
      ru: "Бюджет — это `1 − SLO`. SLO 99,9% за 30 дней допускает 43,2 минуты полного простоя или 100 000 неудачных запросов из 100 млн.\nПока бюджет есть, выпускайте фичи и рискуйте. Когда он потрачен, политика бюджета ошибок замораживает рискованные релизы, пока сервис не вернётся в рамки SLO.",
    },
  },

  {
    id: 'fund-consensus-majority',
    section: 'fundamentals',
    link: '/fundamentals/consensus-and-coordination/',
    front: {
      en: "How many voting nodes does a consensus group need, and why use odd sizes?",
      ru: "Сколько голосующих узлов нужно группе консенсуса и почему их число нечётное?",
    },
    back: {
      en: "A decision needs a **majority**, so `2f + 1` nodes tolerate `f` failures: 3 survive 1, 5 survive 2, 7 is the practical ceiling.\nFour nodes need 3 votes and still tolerate only one failure, so the fourth adds cost and latency, not resilience. To scale reads, add non-voting members (etcd learners, ZooKeeper observers); spread voters across zones.",
      ru: "Решение требует **большинства**, поэтому `2f + 1` узлов переживают `f` отказов: 3 переживают 1, 5 — два, 7 — практический потолок.\nЧетырём узлам нужно 3 голоса, и они всё равно переживают только один отказ: четвёртый добавляет стоимость и задержку, а не надёжность. Чтение масштабируют неголосующими участниками (learners в etcd, observers в ZooKeeper); голосующих разносят по зонам.",
    },
  },
  {
    id: 'fund-raft',
    section: 'fundamentals',
    link: '/fundamentals/consensus-and-coordination/',
    front: {
      en: "How does Raft elect a leader and commit a log entry?",
      ru: "Как Raft выбирает лидера и фиксирует запись журнала?",
    },
    back: {
      en: "Time is split into numbered **terms** with at most one leader each; a node that sees a higher term steps down, which makes a deposed leader harmless. A follower that hears no heartbeat for a randomised **election timeout** asks for votes; a majority makes it leader, and only candidates with an up-to-date log can win.\nThe leader appends commands and replicates them; an entry is **committed** once a majority has stored it.",
      ru: "Время делится на пронумерованные **сроки** (terms), в каждом не больше одного лидера; узел, увидевший срок старше своего, уступает — поэтому смещённый лидер безвреден. Фолловер, не получивший heartbeat за случайный **тайм-аут выборов**, просит голоса; большинство делает его лидером, причём победить может только кандидат с актуальным журналом.\nЛидер дописывает команды и реплицирует их; запись **зафиксирована**, когда её сохранило большинство.",
    },
  },
  {
    id: 'fund-fencing',
    section: 'fundamentals',
    link: '/fundamentals/consensus-and-coordination/',
    front: {
      en: "A client holds a lease-based lock, pauses for a long GC, and the lease expires. How do you keep it from corrupting data?",
      ru: "Клиент держит блокировку-аренду, надолго засыпает на сборке мусора, и аренда истекает. Как не дать ему испортить данные?",
    },
    back: {
      en: "No lease can stop a paused client by itself, so the **resource** must protect itself. A **fencing token** grows with every lock grant (an etcd revision, a ZooKeeper zxid); the client sends it with each write, and storage rejects any token lower than the highest it has seen.\nOr use conditional writes. A Redis lock without fencing is fine for efficiency, not for correctness.",
      ru: "Никакая аренда сама по себе не остановит «уснувшего» клиента, поэтому защищаться должен **ресурс**. **Токен изоляции** (fencing token) растёт при каждой выдаче блокировки (ревизия etcd, zxid ZooKeeper); клиент передаёт его с каждой записью, а хранилище отвергает токены меньше наибольшего уже виденного.\nИли используйте условные записи. Блокировка в Redis без токенов годится для экономии работы, но не для корректности.",
    },
  },
  {
    id: 'fund-consensus-cost',
    section: 'fundamentals',
    link: '/fundamentals/consensus-and-coordination/',
    front: {
      en: "What does a consensus commit cost, and when should you avoid running consensus yourself?",
      ru: "Сколько стоит фиксация через консенсус и когда не стоит делать консенсус самому?",
    },
    back: {
      en: "About one round trip to the nearest follower plus an `fsync`: ≈ 1.2 ms in one zone, ≈ 2 ms across three zones, ≈ 81 ms with followers across an ocean.\nDon't implement Raft or Paxos. Prefer, in order: your database (unique constraint, transaction, conditional write), your platform (Kubernetes Leases), a coordination service with 3 or 5 voters. Many “exactly once” problems need idempotency, not a lock.",
      ru: "Примерно один сетевой круг до ближайшего фолловера плюс `fsync`: ≈ 1,2 мс в одной зоне, ≈ 2 мс в трёх зонах, ≈ 81 мс с фолловерами за океаном.\nНе реализуйте Raft или Paxos сами. По порядку: ваша база данных (ограничение уникальности, транзакция, условная запись), платформа (Lease в Kubernetes), сервис координации с 3 или 5 голосующими. Многим задачам «ровно один раз» нужна идемпотентность, а не блокировка.",
    },
  },

  // ---------------------------------------------------------------- traffic
  {
    id: 'traffic-dns-lookup',
    section: 'traffic',
    link: '/traffic/dns/',
    front: {
      en: "Walk through a DNS lookup from the browser to the answer.",
      ru: "Опишите DNS-запрос от браузера до ответа.",
    },
    back: {
      en: "The OS **stub resolver** asks a **recursive resolver**, which follows referrals from a **root** server to the **TLD** server to the **authoritative** server for the zone.\nRoot and TLD referrals carry long TTLs, so a warm resolver usually goes straight to the authoritative server, and caches at every layer make most lookups a single local hop.",
      ru: "**Stub-резолвер** ОС спрашивает **рекурсивный резолвер**, а тот идёт по ссылкам: **корневой** сервер → сервер **TLD** → **авторитативный** сервер зоны.\nУ ссылок от корня и TLD длинные TTL, поэтому «прогретый» резолвер обычно сразу идёт к авторитативному серверу, а кэши на каждом уровне превращают большинство запросов в один локальный шаг.",
    },
  },
  {
    id: 'traffic-dns-ttl',
    section: 'traffic',
    link: '/traffic/dns/',
    front: {
      en: "How do you pick a DNS TTL, and how do you prepare a migration?",
      ru: "Как выбрать TTL в DNS и как подготовить миграцию?",
    },
    back: {
      en: "Short TTLs (30–60 s) move traffic quickly but raise query volume and cache misses; long TTLs (hours) are cheap but slow to change.\nBefore a migration: lower the TTL, wait at least one *old* TTL, switch, then raise it again. Some clients ignore TTLs, so don't plan on DNS failover faster than about a minute.",
      ru: "Короткий TTL (30–60 с) позволяет быстро перевести трафик, но увеличивает число запросов и промахов кэша; длинный (часы) дёшев, но медленно меняется.\nПеред миграцией понизьте TTL, подождите хотя бы один *старый* TTL, переключите и снова повысьте. Некоторые клиенты игнорируют TTL, так что не рассчитывайте на переключение через DNS быстрее чем примерно за минуту.",
    },
  },
  {
    id: 'traffic-geodns-anycast',
    section: 'traffic',
    link: '/traffic/dns/',
    front: {
      en: "GeoDNS vs anycast: how does each steer users, and how fast does it react to a failure?",
      ru: "GeoDNS и anycast: как каждый направляет пользователей и как быстро реагирует на отказ?",
    },
    back: {
      en: "**GeoDNS** returns different answers per resolver location: fine-grained control, but it sees the resolver rather than the user and reacts only after a TTL and client caches.\n**Anycast** announces one IP from many sites over BGP: failover in seconds to a minute, and attack traffic spreads over all sites, but control is coarse. Large providers combine both.",
      ru: "**GeoDNS** отдаёт разные ответы в зависимости от местоположения резолвера: точное управление, но видит резолвер, а не пользователя, и реагирует только через TTL и клиентские кэши.\n**Anycast** анонсирует один IP из многих точек через BGP: переключение за секунды или минуту, атака размазывается по всем площадкам, но управление грубое. Крупные провайдеры сочетают оба подхода.",
    },
  },
  {
    id: 'traffic-cdn-push-pull',
    section: 'traffic',
    link: '/traffic/cdn/',
    front: {
      en: "Push CDN vs pull CDN: when do you use each?",
      ru: "Push-CDN и pull-CDN: когда что использовать?",
    },
    back: {
      en: "**Pull**: the edge fetches from the origin on the first miss and keeps what users request. Suits busy sites, long-tail catalogues and APIs.\n**Push**: you upload content ahead of time. Suits large files with predictable demand (installers, game patches) and small sites that rarely change.\nThe common setup today is a pull CDN in front of object storage.",
      ru: "**Pull**: край сети забирает контент с origin при первом промахе и держит то, что запрашивают пользователи. Подходит для нагруженных сайтов, каталогов с длинным хвостом и API.\n**Push**: контент загружается заранее. Подходит для больших файлов с предсказуемым спросом (установщики, патчи игр) и небольших редко меняющихся сайтов.\nТипичная схема сегодня — pull-CDN перед объектным хранилищем.",
    },
  },
  {
    id: 'traffic-cdn-invalidation',
    section: 'traffic',
    link: '/traffic/cdn/',
    front: {
      en: "What is the best way to change content that a CDN has cached?",
      ru: "Как лучше всего обновить контент, закэшированный в CDN?",
    },
    back: {
      en: "Best: **versioned URLs**. Put a content hash in the file name (`app.3f9c2b.js`) and cache it forever; a deploy publishes new names, with no purge and no races.\nNext best: tag-based purge, then URL or prefix purge. Purging everything is a last resort: every PoP misses at once and the origin takes a stampede.",
      ru: "Лучше всего — **версионированные URL**. Добавьте хеш содержимого в имя файла (`app.3f9c2b.js`) и кэшируйте навсегда: деплой публикует новые имена, без очистки и без гонок.\nДалее — очистка по тегам, затем по URL или префиксу. Очистка всего — крайняя мера: все PoP одновременно промахиваются, и на origin обрушивается лавина запросов.",
    },
  },
  {
    id: 'traffic-origin-shield',
    section: 'traffic',
    link: '/traffic/cdn/',
    front: {
      en: "What does an origin shield do, in numbers?",
      ru: "Что делает origin shield — в цифрах?",
    },
    back: {
      en: "It adds one upper-tier cache between the PoPs and the origin and collapses concurrent misses into a single origin fetch.\nWithout it, 300 PoPs with a 60-second TTL can send up to 5 requests per second for one popular object. With a shield it is one request per object per 60 seconds, at the cost of an extra hop on misses.",
      ru: "Он добавляет между PoP и origin один кэш верхнего уровня и схлопывает одновременные промахи в один запрос к origin.\nБез него 300 PoP с TTL 60 секунд могут слать до 5 запросов в секунду за один популярный объект. Со щитом — один запрос на объект раз в 60 секунд ценой лишнего перехода при промахах.",
    },
  },
  {
    id: 'traffic-l4-l7',
    section: 'traffic',
    link: '/traffic/load-balancers/',
    front: {
      en: "Layer 4 vs layer 7 load balancing: what is the difference?",
      ru: "Балансировка на L4 и на L7: в чём разница?",
    },
    back: {
      en: "**L4** works on TCP/UDP flows: it picks a backend once per connection by IP and port, without reading the payload. Fast, cheap, any protocol.\n**L7** terminates the connection, parses HTTP or gRPC and picks a backend per request: routing by path, header or cookie, TLS, retries, per-request metrics.\nGotcha: under L4, long-lived HTTP/2 or gRPC connections pin a client's load to one backend.",
      ru: "**L4** работает с потоками TCP/UDP: выбирает бэкенд один раз на соединение по IP и порту, не читая содержимое. Быстро, дёшево, любой протокол.\n**L7** завершает соединение, разбирает HTTP или gRPC и выбирает бэкенд для каждого запроса: маршрутизация по пути, заголовку или cookie, TLS, повторы, метрики по запросам.\nПодвох: при L4 долгоживущие соединения HTTP/2 или gRPC привязывают всю нагрузку клиента к одному бэкенду.",
    },
  },
  {
    id: 'traffic-lb-algorithms',
    section: 'traffic',
    link: '/traffic/load-balancers/',
    front: {
      en: "Some requests take 10 ms and others 2 s. Which balancing algorithm do you choose?",
      ru: "Одни запросы идут 10 мс, другие 2 с. Какой алгоритм балансировки выбрать?",
    },
    back: {
      en: "**Least outstanding requests**, or **power of two choices**: pick two servers at random and send to the less loaded one. P2C removes most of the imbalance of pure random choice and suits many independent balancers or sidecars.\nRound robin only fits uniform requests. For key affinity use consistent hashing: growing from 10 to 11 servers moves about 9% of keys, versus about 91% with `hash mod N`.",
      ru: "**Least outstanding requests** или **«сила двух случайных выборов»** (power of two choices): взять два случайных сервера и отправить запрос менее загруженному. P2C убирает большую часть перекоса случайного выбора и подходит, когда решают много независимых балансировщиков или sidecar-прокси.\nRound robin годится только для одинаковых запросов. Для привязки по ключу — консистентное хеширование: при росте с 10 до 11 серверов переезжает около 9% ключей против примерно 91% при `hash mod N`.",
    },
  },
  {
    id: 'traffic-sticky-sessions',
    section: 'traffic',
    link: '/traffic/load-balancers/',
    front: {
      en: "Sticky sessions or stateless app servers?",
      ru: "Липкие сессии или серверы приложений без состояния?",
    },
    back: {
      en: "Sticky sessions pin a user to the server holding their state: load becomes uneven, a crash loses those sessions, and scaling in waits for sessions to drain.\nDefault to **stateless** servers: keep sessions in a signed token or a shared store such as Redis or Valkey, and files in object storage. Use stickiness only as an optimisation that nothing depends on.",
      ru: "Липкие сессии привязывают пользователя к серверу с его состоянием: нагрузка становится неравномерной, падение сервера теряет сессии, а сокращение пула ждёт, пока сессии истекут.\nПо умолчанию — серверы **без состояния**: сессии в подписанном токене или общем хранилище вроде Redis или Valkey, файлы — в объектном хранилище. Липкость — только как оптимизация, от которой ничего не зависит.",
    },
  },
  {
    id: 'traffic-health-checks',
    section: 'traffic',
    link: '/traffic/load-balancers/',
    front: {
      en: "What can go wrong with load balancer health checks?",
      ru: "Что может пойти не так с проверками здоровья у балансировщика?",
    },
    back: {
      en: "- A deep check that queries a shared database fails on every server when the database blips, and the balancer has nowhere to send traffic. Keep checks mostly local.\n- Detection is slow: with AWS ALB defaults (30-second interval, 2 failures) a dead server gets traffic for about a minute.\n- Know whether the balancer fails open when every check fails; drain connections on deploy and slow-start new instances.",
      ru: "- Глубокая проверка, которая ходит в общую базу, проваливается на всех серверах сразу, когда база моргнёт, и трафик некуда отправить. Делайте проверки в основном локальными.\n- Обнаружение небыстрое: с настройками AWS ALB по умолчанию (интервал 30 секунд, 2 неудачи) мёртвый сервер получает трафик около минуты.\n- Знайте, переходит ли балансировщик в режим fail open, когда провалены все проверки; при деплое делайте draining, а новые экземпляры разгоняйте постепенно (slow start).",
    },
  },
  {
    id: 'traffic-proxy-gateway',
    section: 'traffic',
    link: '/traffic/reverse-proxy-and-api-gateway/',
    front: {
      en: "Reverse proxy, load balancer, API gateway: what does each do?",
      ru: "Обратный прокси, балансировщик, API-шлюз: что делает каждый?",
    },
    back: {
      en: "- **Reverse proxy**: one controlled front door for TLS, caching, compression, static files and filtering; useful even with a single backend.\n- **Load balancer**: a reverse proxy whose main job is spreading load across identical servers and surviving their failures.\n- **API gateway**: cross-cutting API concerns for many services: authentication, quotas, routing, versioning. Keep business logic out of it.",
      ru: "- **Обратный прокси**: единая контролируемая точка входа для TLS, кэширования, сжатия, статики и фильтрации; полезен даже перед одним бэкендом.\n- **Балансировщик нагрузки**: обратный прокси, главная задача которого — распределять нагрузку по одинаковым серверам и переживать их отказы.\n- **API-шлюз**: сквозные задачи API для многих сервисов — аутентификация, квоты, маршрутизация, версии. Бизнес-логике в нём не место.",
    },
  },

  // ---------------------------------------------------------------- architecture
  {
    id: 'arch-modular-monolith',
    section: 'architecture',
    link: '/architecture/monolith-and-microservices/',
    front: {
      en: "What is a modular monolith, and why is it the default?",
      ru: "Что такое модульный монолит и почему это вариант по умолчанию?",
    },
    back: {
      en: "One deployable whose modules have explicit public interfaces, enforced dependency rules and their own tables.\nIt keeps one build, one deploy and in-process calls, while getting most of the design benefits of services. Its seams also make it the easiest system to split later. Shopify is the best-known example.",
      ru: "Одна развёртываемая единица, модули которой имеют явные публичные интерфейсы, проверяемые правила зависимостей и собственные таблицы.\nОн сохраняет одну сборку, один деплой и вызовы внутри процесса, но даёт большую часть проектных преимуществ сервисов. Готовые швы делают его и самым простым кандидатом на разделение в будущем. Самый известный пример — Shopify.",
    },
  },
  {
    id: 'arch-microservices-when',
    section: 'architecture',
    link: '/architecture/monolith-and-microservices/',
    front: {
      en: "When do microservices pay off, and what do they cost?",
      ru: "Когда микросервисы окупаются и чего они стоят?",
    },
    back: {
      en: "They pay off for mostly organisational reasons: many teams that need to deploy independently, very different scaling profiles, fault or security isolation.\nCosts: network calls instead of function calls, partial failure, no cross-service transactions or joins, and heavy platform work. Ten services in sequence at 99.9% each succeed only about 99.0% of the time. The worst outcome is a distributed monolith.",
      ru: "Они окупаются в основном по организационным причинам: много команд, которым нужно деплоиться независимо, сильно разные профили масштабирования, изоляция отказов или безопасности.\nЦена: сетевые вызовы вместо вызовов функций, частичные отказы, нет транзакций и join между сервисами, много платформенной работы. Десять последовательных сервисов по 99,9% успешны лишь примерно в 99,0% случаев. Худший исход — распределённый монолит.",
    },
  },
  {
    id: 'arch-strangler-fig',
    section: 'architecture',
    link: '/architecture/monolith-and-microservices/',
    front: {
      en: "How do you migrate away from a legacy system without a big-bang rewrite?",
      ru: "Как уйти от унаследованной системы без переписывания «с нуля разом»?",
    },
    back: {
      en: "The **strangler fig** pattern:\n1. Put a routing layer (reverse proxy or API gateway) in front of the legacy system.\n2. Rebuild one capability with a clear seam and shift its traffic gradually.\n3. Keep data in sync with CDC or an outbox during the move.\n4. Delete the old code path, then repeat.",
      ru: "Паттерн **strangler fig** («фикус-душитель»):\n1. Поставить перед старой системой слой маршрутизации (обратный прокси или API-шлюз).\n2. Заново построить одну возможность с ясной границей и постепенно перевести на неё трафик.\n3. На время переезда синхронизировать данные через CDC или outbox.\n4. Удалить старый путь в коде и повторить.",
    },
  },
  {
    id: 'arch-discovery',
    section: 'architecture',
    link: '/architecture/service-discovery-and-mesh/',
    front: {
      en: "Client-side vs server-side service discovery?",
      ru: "Обнаружение сервисов на клиенте или на сервере?",
    },
    back: {
      en: "**Client-side**: the caller queries the registry, caches the list and balances itself. No extra hop and smart per-request balancing, but every language needs a library.\n**Server-side**: the caller hits a load balancer or virtual IP that does the lookup. Simple clients, but an extra component, and an L4 VIP pins long-lived gRPC connections.\nOn Kubernetes, Services, EndpointSlices and cluster DNS provide discovery out of the box.",
      ru: "**На клиенте**: вызывающий опрашивает реестр, кэширует список и сам балансирует. Нет лишнего перехода и умная балансировка по запросам, но нужна библиотека для каждого языка.\n**На сервере**: вызывающий обращается к балансировщику или виртуальному IP, который сам ищет экземпляры. Клиенты простые, но появляется лишний компонент, а L4 VIP привязывает долгие gRPC-соединения.\nВ Kubernetes обнаружение «из коробки» дают Service, EndpointSlice и DNS кластера.",
    },
  },
  {
    id: 'arch-mesh',
    section: 'architecture',
    link: '/architecture/service-discovery-and-mesh/',
    front: {
      en: "What does a service mesh give you, and when is it overkill?",
      ru: "Что даёт service mesh и когда он избыточен?",
    },
    back: {
      en: "Without code changes: mTLS with workload identities, timeouts, retries with budgets, traffic splitting for canaries, and uniform per-service metrics. Data planes are sidecars, sidecar-less “ambient” mode, eBPF or proxyless gRPC.\nIt is overkill with a few services owned by one team, or when nobody can own the control plane. Start from a concrete need such as “we need mTLS”.",
      ru: "Без изменений кода: mTLS с идентичностями нагрузок, тайм-ауты, повторы с бюджетом, разделение трафика для канареечных релизов и единые метрики по сервисам. Плоскость данных — sidecar-прокси, режим ambient без sidecar, eBPF или gRPC без прокси.\nИзбыточен, если сервисов несколько и ими владеет одна команда или если некому сопровождать плоскость управления. Начинайте с конкретной задачи вроде «нам нужен mTLS».",
    },
  },

  {
    id: 'arch-llm-latency',
    section: 'architecture',
    link: '/architecture/llm-applications/',
    front: {
      en: "How do you reason about latency for an LLM response, and why stream it?",
      ru: "Как рассуждать о задержке ответа LLM и зачем его стримить?",
    },
    back: {
      en: "End-to-end ≈ `TTFT + TPOT × (output tokens − 1)`. Time to first token covers queueing, retrieval and prefill (grows with prompt length); time per output token is a decode step (memory-bandwidth-bound).\nWith 0.5 s TTFT, 20 ms per token and 300 tokens, the answer takes about 6.5 s, but streaming over SSE shows text after half a second. Don't buffer on the path, and cancel generation when the client leaves.",
      ru: "Полная задержка ≈ `TTFT + TPOT × (выходные токены − 1)`. Время до первого токена — это очередь, поиск и предзаполнение (растёт с длиной промпта); время на выходной токен — шаг декодирования (упирается в пропускную способность памяти).\nПри TTFT 0,5 с, 20 мс на токен и 300 токенах ответ занимает около 6,5 с, но при стриминге через SSE текст появляется через полсекунды. Не буферизуйте поток по пути и отменяйте генерацию, когда клиент ушёл.",
    },
  },
  {
    id: 'arch-llm-tokens',
    section: 'architecture',
    link: '/architecture/llm-applications/',
    front: {
      en: "Why budget, price and rate-limit an LLM feature in tokens rather than requests?",
      ru: "Почему мощности, стоимость и лимиты LLM-функции считают в токенах, а не в запросах?",
    },
    back: {
      en: "One request can cost a hundred times another. In the page's example (5 M requests a day, 2,000-token prompts, 300-token answers) input is 57% of a $17,500/day bill even though input tokens are five times cheaper; caching a repeated 60% prefix cuts the total by about 31%.\nSo use token buckets charged in tokens, concurrency limits on open streams and per-tenant budgets.",
      ru: "Один запрос может стоить в сто раз дороже другого. В примере со страницы (5 млн запросов в сутки, промпт 2000 токенов, ответ 300) вход даёт 57% счёта в $17 500 в сутки, хотя входной токен в пять раз дешевле; кэширование повторяющихся 60% префикса снижает итог примерно на 31%.\nПоэтому нужны token bucket с оплатой в токенах, лимиты на число открытых потоков и бюджеты на клиента.",
    },
  },
  {
    id: 'arch-llm-rag',
    section: 'architecture',
    link: '/architecture/llm-applications/',
    front: {
      en: "RAG over company documents: what are the hard parts?",
      ru: "RAG по документам компании: где сложности?",
    },
    back: {
      en: "- **Chunking** into passages of a few hundred tokens, keeping titles and section paths.\n- **Hybrid search**: vectors plus BM25 for exact terms, then a **reranker** over a broad candidate set.\n- **Freshness**: the index is derived data fed by change events; deletions must apply fast.\n- **Permissions**: store ACLs with each chunk and filter at retrieval time — never ask the model to hide what the user may not see.",
      ru: "- **Нарезка** на фрагменты по несколько сотен токенов с сохранением заголовков и пути раздела.\n- **Гибридный поиск**: векторы плюс BM25 для точных терминов, затем **переранжирование** широкого набора кандидатов.\n- **Актуальность**: индекс — производные данные из событий изменений; удаления должны применяться быстро.\n- **Права доступа**: хранить ACL с каждым фрагментом и фильтровать при поиске — никогда не просить модель скрыть то, что пользователю видеть нельзя.",
    },
  },
  {
    id: 'arch-llm-reliability',
    section: 'architecture',
    link: '/architecture/llm-applications/',
    front: {
      en: "How do resilience patterns change when the dependency is an LLM?",
      ru: "Как меняются паттерны устойчивости, когда зависимость — LLM?",
    },
    back: {
      en: "- Separate timeouts for the first token, idle gaps between tokens and the whole call.\n- **Retry before the stream starts, not during it**: a mid-stream retry produces a different second half.\n- Fall back to another model behind a model gateway, with a circuit breaker per provider, and run the fallback through the same evals.\n- Validate structured output; give each tool call an idempotency key.\n- Treat output as untrusted input: no prompt-level defence fully stops prompt injection.",
      ru: "- Отдельные тайм-ауты на первый токен, на паузы между токенами и на весь вызов.\n- **Повторять до начала потока, а не во время**: повтор посреди потока даст другую вторую половину ответа.\n- Переключаться на другую модель через шлюз моделей, с предохранителем на каждого провайдера, и проверять запасную модель теми же тестами.\n- Проверять структурированный вывод; давать каждому вызову инструмента ключ идемпотентности.\n- Считать ответ модели недоверенным вводом: никакая защита на уровне промпта не останавливает prompt injection полностью.",
    },
  },

  // ---------------------------------------------------------------- data
  {
    id: 'data-acid',
    section: 'data',
    link: '/data/relational-databases/',
    front: {
      en: "Define each letter of ACID precisely.",
      ru: "Точно определите каждую букву ACID.",
    },
    back: {
      en: "- **Atomicity**: all of a transaction's writes take effect, or none do.\n- **Consistency**: each transaction keeps declared invariants; mostly your job, and not the C in CAP.\n- **Isolation**: concurrent transactions don't see each other's partial work, to a chosen level.\n- **Durability**: once `COMMIT` returns, the change survives a crash, because the WAL is flushed first.",
      ru: "- **Атомарность**: либо все записи транзакции применяются, либо ни одна.\n- **Согласованность**: каждая транзакция сохраняет объявленные инварианты; это во многом задача приложения и не та C, что в CAP.\n- **Изоляция**: параллельные транзакции не видят незавершённую работу друг друга — в выбранной степени.\n- **Долговечность**: после возврата `COMMIT` изменение переживает сбой, потому что WAL сначала сбрасывается на диск.",
    },
  },
  {
    id: 'data-isolation-defaults',
    section: 'data',
    link: '/data/relational-databases/',
    front: {
      en: "What are the default isolation levels of PostgreSQL and MySQL, and do they prevent write skew?",
      ru: "Какие уровни изоляции по умолчанию у PostgreSQL и MySQL и защищают ли они от искажения записи?",
    },
    back: {
      en: "PostgreSQL: **read committed**. MySQL InnoDB: **repeatable read**. Neither prevents write skew.\nWrite skew: two transactions read the same data and write *different* rows, breaking an invariant together (both on-call doctors go off duty). Fix it with `SELECT … FOR UPDATE`, a constraint, or serializable isolation plus retries.",
      ru: "PostgreSQL — **read committed**. MySQL InnoDB — **repeatable read**. Ни один не защищает от искажения записи (write skew).\nWrite skew: две транзакции читают одни данные и пишут *разные* строки, вместе нарушая инвариант (оба дежурных врача уходят с дежурства). Лечится через `SELECT … FOR UPDATE`, ограничение (constraint) или уровень serializable с повторами.",
    },
  },
  {
    id: 'data-mvcc',
    section: 'data',
    link: '/data/relational-databases/',
    front: {
      en: "What is MVCC, and what is its operational catch?",
      ru: "Что такое MVCC и в чём его эксплуатационный подвох?",
    },
    back: {
      en: "Multi-version concurrency control keeps several versions of each row; a reader sees the newest version committed before its snapshot, so readers and writers don't block each other.\nCatch: old versions must be cleaned up (`VACUUM` in PostgreSQL, purge of the undo log in InnoDB). A transaction left open for hours pins them, bloating tables or the undo history.",
      ru: "Многоверсионное управление конкурентным доступом хранит несколько версий строки; читатель видит самую новую версию, зафиксированную до его снимка, поэтому читатели и писатели не блокируют друг друга.\nПодвох: старые версии нужно убирать (`VACUUM` в PostgreSQL, purge журнала отката в InnoDB). Транзакция, открытая часами, удерживает их — раздуваются таблицы или история отката.",
    },
  },
  {
    id: 'data-btree-lsm',
    section: 'data',
    link: '/data/relational-databases/',
    front: {
      en: "B-tree vs LSM-tree: which workloads does each favour?",
      ru: "B-дерево и LSM-дерево: какие нагрузки любит каждое?",
    },
    back: {
      en: "**B-tree** (PostgreSQL, InnoDB): change pages in place, predictable point reads and range scans. Read-heavy OLTP.\n**LSM-tree** (RocksDB, Cassandra, CockroachDB): append to a log and memory buffer, flush sorted files and compact later. High write throughput; reads may check several files, with Bloom filters skipping most. Write-heavy ingestion.",
      ru: "**B-дерево** (PostgreSQL, InnoDB): страницы меняются на месте, предсказуемые точечные чтения и диапазонные сканы. OLTP с преобладанием чтения.\n**LSM-дерево** (RocksDB, Cassandra, CockroachDB): запись в журнал и буфер в памяти, сброс отсортированных файлов и уплотнение позже. Высокая скорость записи; чтение может проверить несколько файлов, но фильтры Блума отсекают большинство. Интенсивная загрузка данных.",
    },
  },
  {
    id: 'data-scaling-ladder',
    section: 'data',
    link: '/data/relational-databases/',
    front: {
      en: "In what order do you scale a relational database?",
      ru: "В каком порядке масштабировать реляционную базу?",
    },
    back: {
      en: "1. Tune queries, indexes and schema (often 10× to 1000× for one query).\n2. Scale up.\n3. Pool connections and cache.\n4. Add read replicas.\n5. Federate or shard.\nEach step costs more complexity than the last, so climb only when measurements show the current step is exhausted.",
      ru: "1. Настроить запросы, индексы и схему (часто это 10×–1000× для отдельного запроса).\n2. Вертикальное масштабирование.\n3. Пул соединений и кэш.\n4. Реплики для чтения.\n5. Федерация или шардирование.\nКаждый шаг сложнее предыдущего, поэтому поднимайтесь выше, только когда измерения показывают, что текущий исчерпан.",
    },
  },
  {
    id: 'data-sync-async',
    section: 'data',
    link: '/data/replication/',
    front: {
      en: "Synchronous, asynchronous or semi-synchronous replication: what do you trade?",
      ru: "Синхронная, асинхронная или полусинхронная репликация: чем жертвуем?",
    },
    back: {
      en: "- **Async**: no commit latency, but failover can lose the last transactions.\n- **Sync**: no loss if a sync replica is promoted, but every commit waits a round trip, and writes stall if the replica is unreachable.\n- **Semi-sync / quorum**: wait for the fastest *k* replicas.\nWatch out: MySQL semi-sync silently falls back to async after a 10-second timeout.",
      ru: "- **Асинхронная**: фиксация без задержки, но при переключении на резерв можно потерять последние транзакции.\n- **Синхронная**: без потерь, если повышают синхронную реплику, но каждая фиксация ждёт сетевой круг, а при недоступной реплике запись встаёт.\n- **Полусинхронная / кворумная**: ждём самые быстрые *k* реплик.\nОсторожно: полусинхронная репликация MySQL после 10-секундного тайм-аута молча переходит в асинхронный режим.",
    },
  },
  {
    id: 'data-split-brain',
    section: 'data',
    link: '/data/replication/',
    front: {
      en: "What is split brain, and how do you prevent it?",
      ru: "Что такое split brain и как его предотвратить?",
    },
    back: {
      en: "Two nodes both believe they are the leader and both accept writes, so the data diverges and merging is manual.\nDefences: a **majority quorum** for leader election, **fencing tokens** (a higher epoch per leader, and storage rejects older ones), and **STONITH**. GitHub's 43-second partition in 2018 left the site degraded for 24 hours and 11 minutes.",
      ru: "Два узла одновременно считают себя лидерами и оба принимают записи — данные расходятся, а слияние делается вручную.\nЗащита: **кворум большинства** при выборе лидера, **токены изоляции** (fencing tokens: у каждого нового лидера эпоха выше, а хранилище отвергает старые) и **STONITH**. Разделение сети на 43 секунды у GitHub в 2018 году обернулось деградацией на 24 часа 11 минут.",
    },
  },
  {
    id: 'data-multi-leader',
    section: 'data',
    link: '/data/replication/',
    front: {
      en: "Multi-leader replication: how are write conflicts resolved?",
      ru: "Репликация с несколькими лидерами: как разрешают конфликты записи?",
    },
    back: {
      en: "From crude to careful:\n- **Avoid** them: route each record's writes to one home leader (the most effective).\n- **Last-writer-wins**: simple, but silently drops writes and lets clock skew pick the winner.\n- **Merge** siblings tracked by version vectors.\n- **CRDTs**, which always converge.\n- **Detect and abort**, as MySQL Group Replication does.",
      ru: "От грубого к аккуратному:\n- **Избегать**: направлять записи каждой сущности её «домашнему» лидеру (самый действенный способ).\n- **Last-writer-wins**: просто, но молча теряет записи, а победителя выбирает рассинхронизация часов.\n- **Слияние** версий, отслеживаемых векторами версий.\n- **CRDT**, которые всегда сходятся.\n- **Обнаружить и откатить**, как в MySQL Group Replication.",
    },
  },
  {
    id: 'data-replicas-writes',
    section: 'data',
    link: '/data/replication/',
    front: {
      en: "Can read replicas fix a write bottleneck? Are replicas backups?",
      ru: "Помогут ли реплики для чтения при узком месте в записи? Являются ли реплики бэкапом?",
    },
    back: {
      en: "No to both. Every replica applies every write, so replicas add read capacity, never write capacity; for writes you need partitioning.\nA bad migration or `DROP TABLE` replicates within milliseconds, so keep point-in-time backups and delayed replicas as well.",
      ru: "Нет и нет. Каждая реплика применяет каждую запись, поэтому реплики добавляют мощность чтения, но не записи; для записи нужно разделение данных.\nНеудачная миграция или `DROP TABLE` реплицируется за миллисекунды, поэтому нужны ещё бэкапы с восстановлением на момент времени и отложенные реплики.",
    },
  },
  {
    id: 'data-federation-sharding',
    section: 'data',
    link: '/data/partitioning-and-sharding/',
    front: {
      en: "Federation vs sharding?",
      ru: "Федерация и шардирование: в чём разница?",
    },
    back: {
      en: "**Federation** splits by function: users, orders and catalogue each get their own database. It matches service ownership, but there are no cross-database joins or transactions, and it stops helping once one domain outgrows a server.\n**Sharding** splits one dataset by key across servers, so it scales writes and data size within a domain.",
      ru: "**Федерация** делит по функциям: у пользователей, заказов и каталога свои базы. Это совпадает с владением сервисов, но нет join и транзакций между базами, и она перестаёт помогать, когда один домен перерастает сервер.\n**Шардирование** делит один набор данных по ключу между серверами и масштабирует запись и объём внутри домена.",
    },
  },
  {
    id: 'data-shard-key',
    section: 'data',
    link: '/data/partitioning-and-sharding/',
    front: {
      en: "What makes a good shard key?",
      ru: "Каким должен быть хороший ключ шардирования?",
    },
    back: {
      en: "- **High cardinality**: millions of distinct values.\n- **Even spread** of both data and traffic.\n- **Matches the dominant queries**, so they stay on one shard (`tenant_id` for B2B SaaS, `user_id` for consumer apps).\n- **Stable**: changing it means moving the row.\nAvoid a raw timestamp: in a range-sharded cluster all new writes land on the last shard.",
      ru: "- **Высокая кардинальность**: миллионы различных значений.\n- **Равномерное распределение** и данных, и трафика.\n- **Совпадает с основными запросами**, чтобы они оставались в одном шарде (`tenant_id` для B2B SaaS, `user_id` для потребительских приложений).\n- **Стабильность**: смена ключа означает перенос строки.\nИзбегайте голой метки времени: при шардировании по диапазону все новые записи попадут в последний шард.",
    },
  },
  {
    id: 'data-hash-range-dir',
    section: 'data',
    link: '/data/partitioning-and-sharding/',
    front: {
      en: "Hash, range and directory sharding: the strength and weakness of each?",
      ru: "Шардирование по хешу, диапазону и справочнику: сильная и слабая сторона каждого?",
    },
    back: {
      en: "- **Hash**: even spread even with sequential keys, but range queries hit every shard.\n- **Range**: efficient range scans and easy splits, but sequential keys create a hot last shard.\n- **Directory**: any placement and per-tenant moves, but the lookup service must be fast, cached and highly available.\nA common hybrid: hash into many logical shards and map them to servers with a small directory.",
      ru: "- **По хешу**: равномерно даже при последовательных ключах, но диапазонные запросы идут во все шарды.\n- **По диапазону**: эффективные диапазонные сканы и простое деление, но последовательные ключи перегружают последний шард.\n- **По справочнику**: любое размещение и перенос по одному клиенту, но сервис поиска должен быть быстрым, кэшируемым и высокодоступным.\nЧастый гибрид: хешировать в множество логических шардов и сопоставлять их серверам небольшим справочником.",
    },
  },
  {
    id: 'data-consistent-hashing',
    section: 'data',
    link: '/data/partitioning-and-sharding/',
    front: {
      en: "Why consistent hashing instead of `hash % N`, and why virtual nodes?",
      ru: "Зачем консистентное хеширование вместо `hash % N` и зачем виртуальные узлы?",
    },
    back: {
      en: "With `hash % N`, going from 4 to 5 servers moves about 80% of keys. On a ring, a key belongs to the first server clockwise, so a joining node takes only about 1/(N+1) of the keys (20% going from 4 to 5).\n**Virtual nodes** (many ring positions per server; Cassandra uses 16 tokens per node by default) even out the arcs, let bigger machines take more, and spread a failed server's load over all survivors.",
      ru: "При `hash % N` переход с 4 на 5 серверов перемещает около 80% ключей. На кольце ключ принадлежит первому серверу по часовой стрелке, поэтому новый узел забирает лишь около 1/(N+1) ключей (20% при переходе с 4 на 5).\n**Виртуальные узлы** (много позиций на кольце у каждого сервера; Cassandra по умолчанию ставит 16 токенов на узел) выравнивают дуги, позволяют мощным машинам брать больше и распределяют нагрузку упавшего сервера по всем оставшимся.",
    },
  },
  {
    id: 'data-hot-key',
    section: 'data',
    link: '/data/partitioning-and-sharding/',
    front: {
      en: "One celebrity key overloads its shard. What are your options?",
      ru: "Ключ одной знаменитости перегружает свой шард. Какие есть варианты?",
    },
    back: {
      en: "- **Split the key**: append a suffix 0–9 so writes spread over ten shards (50,000 writes/s becomes about 5,000 per shard); reads gather all ten.\n- **Cache it**: most celebrity traffic is reads.\n- **Give it its own shard** through a directory.\n- **Handle it on read**, as timelines do for celebrity posts.\nAutomatic splitting cannot divide a single row's traffic.",
      ru: "- **Разделить ключ**: добавить суффикс 0–9, чтобы записи шли в десять шардов (50 000 записей/с превращаются примерно в 5000 на шард); чтение собирает все десять.\n- **Закэшировать**: трафик знаменитостей — в основном чтение.\n- **Выделить отдельный шард** через справочник.\n- **Обработать при чтении**, как ленты делают с постами знаменитостей.\nАвтоматическое деление не может разделить трафик одной строки.",
    },
  },
  {
    id: 'data-cross-shard',
    section: 'data',
    link: '/data/partitioning-and-sharding/',
    front: {
      en: "What do queries without the shard key cost, and how do you handle cross-shard transactions?",
      ru: "Чего стоят запросы без ключа шардирования и как быть с транзакциями между шардами?",
    },
    back: {
      en: "They become **scatter-gather** across every shard, paced by the slowest: with a 1% chance of a slow shard, a 32-shard fan-out hits one 27.5% of the time. Add global secondary indexes, co-locate related tables by the same key, and copy small reference tables to every shard.\nTwo-phase commit blocks if the coordinator fails, so keep invariants within one shard and use sagas for workflows.",
      ru: "Они превращаются в **scatter-gather** по всем шардам, и скорость задаёт самый медленный: при шансе 1% на медленный шард fan-out на 32 шарда натыкается на него в 27,5% случаев. Добавляйте глобальные вторичные индексы, размещайте связанные таблицы по одному ключу (co-location) и копируйте небольшие справочники во все шарды.\nДвухфазная фиксация блокируется при отказе координатора, поэтому держите инварианты в одном шарде, а для процессов используйте саги.",
    },
  },
  {
    id: 'data-denormalize',
    section: 'data',
    link: '/data/denormalization-and-tuning/',
    front: {
      en: "When does denormalization pay off, and what must you decide?",
      ru: "Когда окупается денормализация и что нужно решить заранее?",
    },
    back: {
      en: "When reads vastly outnumber writes and joins are the bottleneck. A join costing 2 ms at 10,000 reads/s burns 20 s of database time per second; keeping a copy at 1 ms × 100 writes/s costs 0.1 s.\nDecide who keeps the copies in sync (same transaction, trigger, materialized view or CDC) and run a reconciliation job to catch drift.",
      ru: "Когда чтений намного больше, чем записей, и узкое место — join. Join за 2 мс при 10 000 чтений/с сжигает 20 с времени базы в секунду, а копия за 1 мс × 100 записей/с стоит 0,1 с.\nРешите, кто поддерживает копии в согласии (та же транзакция, триггер, материализованное представление или CDC), и запускайте задачу сверки, чтобы ловить расхождения.",
    },
  },
  {
    id: 'data-composite-index',
    section: 'data',
    link: '/data/denormalization-and-tuning/',
    front: {
      en: "How do you design a composite index for a query?",
      ru: "Как спроектировать составной индекс под запрос?",
    },
    back: {
      en: "Equality columns first, then the range or sort column: `(customer_id, created_at)` serves `WHERE customer_id = ? ORDER BY created_at`. Make it covering if possible. In the page's example the plan dropped from about 17,000 pages and 143 ms to 7 pages and under 0.1 ms.\nIndexes don't help unselective filters (a status matching a quarter of the table), and every index slows writes.",
      ru: "Сначала столбцы с равенством, затем столбец диапазона или сортировки: `(customer_id, created_at)` обслуживает `WHERE customer_id = ? ORDER BY created_at`. По возможности делайте индекс покрывающим. В примере со страницы план сократился примерно с 17 000 страниц и 143 мс до 7 страниц и меньше 0,1 мс.\nИндекс не помогает неселективным фильтрам (статус, совпадающий с четвертью таблицы), а каждый индекс замедляет запись.",
    },
  },
  {
    id: 'data-n1-keyset',
    section: 'data',
    link: '/data/denormalization-and-tuning/',
    front: {
      en: "What are N+1 queries and OFFSET pagination costing you?",
      ru: "Во что обходятся запросы N+1 и пагинация через OFFSET?",
    },
    back: {
      en: "**N+1**: 50 posts then each author is 51 queries, about 25 ms of round trips at 0.5 ms each; eager loading or a join makes it two (about 1 ms).\n**OFFSET**: `OFFSET 1000000` reads and discards a million rows, and pages shift on inserts. **Keyset** pagination (`WHERE (created_at, id) < ($1, $2)`) served page 50,001 in 0.18 ms instead of 226 ms.",
      ru: "**N+1**: 50 постов, а потом автор каждого — это 51 запрос, около 25 мс сетевых кругов по 0,5 мс; жадная загрузка или join сводят их к двум (около 1 мс).\n**OFFSET**: `OFFSET 1000000` читает и выбрасывает миллион строк, а страницы сдвигаются при вставках. **Пагинация по ключу** (keyset, `WHERE (created_at, id) < ($1, $2)`) отдала страницу 50 001 за 0,18 мс вместо 226 мс.",
    },
  },
  {
    id: 'data-pooling',
    section: 'data',
    link: '/data/denormalization-and-tuning/',
    front: {
      en: "Why put a connection pooler in front of PostgreSQL, and what does transaction mode break?",
      ru: "Зачем ставить пулер соединений перед PostgreSQL и что ломает режим transaction?",
    },
    back: {
      en: "PostgreSQL runs one OS process per connection, so thousands of mostly idle connections from autoscaled app servers waste memory and throughput. PgBouncer multiplexes them onto a few dozen server connections, sized near the core count times a small factor.\nTransaction mode, the usual choice, breaks session state: `SET`, `LISTEN`, session advisory locks and `WITH HOLD` cursors.",
      ru: "PostgreSQL запускает отдельный процесс ОС на каждое соединение, поэтому тысячи почти простаивающих соединений от автомасштабируемых серверов тратят память и пропускную способность. PgBouncer мультиплексирует их на несколько десятков серверных соединений — по числу ядер с небольшим множителем.\nРежим transaction, обычный выбор, ломает состояние сессии: `SET`, `LISTEN`, сессионные advisory-блокировки и курсоры `WITH HOLD`.",
    },
  },
  {
    id: 'data-nosql-families',
    section: 'data',
    link: '/data/nosql/',
    front: {
      en: "Name the four classic NoSQL families and what each is good at.",
      ru: "Назовите четыре классических семейства NoSQL и сильную сторону каждого.",
    },
    back: {
      en: "- **Key-value** (Redis, DynamoDB): lookups by key at extreme throughput.\n- **Document** (MongoDB, Firestore): whole aggregates read in one go, flexible fields.\n- **Wide-column** (Cassandra, Bigtable): write-heavy, time-ordered data at scale.\n- **Graph** (Neo4j, Neptune): multi-hop traversals.\nThree more matter in 2026: time-series, search engines and vector stores.",
      ru: "- **«Ключ-значение»** (Redis, DynamoDB): поиск по ключу с огромной пропускной способностью.\n- **Документные** (MongoDB, Firestore): агрегат целиком за одно чтение, гибкие поля.\n- **Колоночные (wide-column)** (Cassandra, Bigtable): интенсивная запись упорядоченных по времени данных в большом масштабе.\n- **Графовые** (Neo4j, Neptune): обходы в несколько шагов.\nВ 2026 году важны ещё три: временные ряды, поисковые движки и векторные хранилища.",
    },
  },
  {
    id: 'data-access-patterns',
    section: 'data',
    link: '/data/nosql/',
    front: {
      en: "How does NoSQL data modelling differ from relational modelling?",
      ru: "Чем моделирование данных в NoSQL отличается от реляционного?",
    },
    back: {
      en: "Relational modelling starts from entities; NoSQL starts from **queries**.\n1. List every access pattern with its rate and latency target.\n2. Choose partition and sort keys so each pattern reads one partition.\n3. Denormalise the fields each query needs.\n4. Add secondary indexes for the rest.\n5. Check for hot partitions (DynamoDB: 3,000 read and 1,000 write units per second per partition).",
      ru: "Реляционное моделирование начинается с сущностей, NoSQL — с **запросов**.\n1. Перечислить все шаблоны доступа с частотой и целевой задержкой.\n2. Выбрать ключи партиции и сортировки так, чтобы каждый шаблон читал одну партицию.\n3. Денормализовать поля, нужные каждому запросу.\n4. Для остального добавить вторичные индексы.\n5. Проверить горячие партиции (в DynamoDB — 3000 единиц чтения и 1000 единиц записи в секунду на партицию).",
    },
  },
  {
    id: 'data-sql-or-nosql',
    section: 'data',
    link: '/data/sql-or-nosql/',
    front: {
      en: "SQL or NoSQL for a new product?",
      ru: "SQL или NoSQL для нового продукта?",
    },
    back: {
      en: "Start relational (usually PostgreSQL) unless a clear requirement rules it out: writes beyond one primary, single-digit-ms latency at huge scale, or a data model it handles badly. If you cannot list the queries yet, you need SQL's flexibility.\nChoose NoSQL for a specific workload with known access patterns. Keep one system of record per piece of data; treat every other copy as a rebuildable cache or index.",
      ru: "Начинайте с реляционной базы (обычно PostgreSQL), если явное требование её не исключает: запись сверх одного основного узла, задержка в единицы миллисекунд при огромном масштабе или модель данных, которая ей плохо подходит. Если запросы ещё нельзя перечислить, нужна гибкость SQL.\nNoSQL выбирают под конкретную нагрузку с известными шаблонами доступа. Для каждого фрагмента данных — одна система-источник истины, а все остальные копии — перестраиваемые кэши или индексы.",
    },
  },
  {
    id: 'data-distributed-sql',
    section: 'data',
    link: '/data/sql-or-nosql/',
    front: {
      en: "What does distributed SQL (Spanner, CockroachDB, YugabyteDB) give you, and at what price?",
      ru: "Что даёт распределённый SQL (Spanner, CockroachDB, YugabyteDB) и какой ценой?",
    },
    back: {
      en: "SQL and ACID transactions with horizontal write scaling, automatic rebalancing and survival of node or zone failures without manual failover.\nPrice: every commit needs a consensus round trip, so writes take a few ms within a region and tens to hundreds across regions; cross-range transactions cost more; some features are missing; hot rows still serialise.",
      ru: "SQL и ACID-транзакции с горизонтальным масштабированием записи, автоматической перебалансировкой и переживанием отказа узла или зоны без ручного переключения.\nЦена: каждая фиксация требует сетевого круга консенсуса, поэтому запись занимает несколько мс внутри региона и десятки–сотни мс между регионами; транзакции через диапазоны дороже; части возможностей нет; горячие строки всё равно выполняются последовательно.",
    },
  },
  {
    id: 'data-object-storage',
    section: 'data',
    link: '/data/object-storage/',
    front: {
      en: "What is the standard storage pattern for user uploads?",
      ru: "Какова стандартная схема хранения пользовательских файлов?",
    },
    back: {
      en: "**Metadata in a database, bytes in object storage, a CDN in front.** Clients upload and download directly with short-lived presigned URLs, so app servers never proxy bytes.\nGive each version a new key so CDN caches never need purging, validate uploads asynchronously, and reconcile orphans between the two stores.",
      ru: "**Метаданные — в базе, байты — в объектном хранилище, перед ними — CDN.** Клиенты загружают и скачивают файлы напрямую по короткоживущим presigned URL, и серверы приложений не пропускают байты через себя.\nКаждой версии давайте новый ключ, чтобы кэши CDN не приходилось чистить, проверяйте загрузки асинхронно и сверяйте «сирот» между двумя хранилищами.",
    },
  },
  {
    id: 'data-durability-availability',
    section: 'data',
    link: '/data/object-storage/',
    front: {
      en: "Durability vs availability for object storage such as S3 Standard?",
      ru: "Долговечность и доступность объектного хранилища на примере S3 Standard?",
    },
    back: {
      en: "**Durability** (will the data survive?) is designed at 11 nines: store 10 million objects and expect to lose one about once every 10,000 years. **Availability** (can I read it now?) is 99.99%, about 53 minutes of errors a year.\nThe bigger durability risk is people and software, so use versioning, object lock and cross-account replication. S3 has been strongly consistent since December 2020.",
      ru: "**Долговечность** (сохранятся ли данные?) заложена на уровне 11 девяток: при 10 млн объектов ожидается потеря одного примерно раз в 10 000 лет. **Доступность** (можно ли прочитать сейчас?) — 99,99%, около 53 минут ошибок в год.\nБольший риск для долговечности — люди и ПО, поэтому включайте версионирование, object lock и репликацию в отдельный аккаунт. S3 строго согласован с декабря 2020 года.",
    },
  },

  // ---------------------------------------------------------------- caching
  {
    id: 'cache-why',
    section: 'caching',
    link: '/caching/caching-layers/',
    front: {
      en: "Why does caching work, and what makes a cache “load-bearing”?",
      ru: "Почему кэширование работает и что делает кэш «несущим»?",
    },
    back: {
      en: "Access is **skewed**: with a Zipf exponent of 1 over a million items, the top 1% get about 68% of requests. Recently used data is also likely to be used again.\nAt a 95% hit ratio the database sees 5% of reads; if the cache is flushed or restarted, it suddenly gets 20× its usual load. Plan for that cold-cache case.",
      ru: "Доступ **неравномерен**: при показателе Ципфа 1 на миллионе элементов верхний 1% получает около 68% запросов. Кроме того, недавно прочитанные данные, скорее всего, понадобятся снова.\nПри доле попаданий 95% база видит 5% чтений; если кэш сбросят или перезапустят, на неё внезапно придётся 20× обычной нагрузки. Планируйте этот случай холодного кэша.",
    },
  },
  {
    id: 'cache-hit-ratio',
    section: 'caching',
    link: '/caching/caching-layers/',
    front: {
      en: "How does hit ratio translate into latency and database load?",
      ru: "Как доля попаданий в кэш переводится в задержку и нагрузку на базу?",
    },
    back: {
      en: "Effective latency = `h·t_cache + (1−h)·t_origin`. With Redis at 0.5 ms, a 20 ms query and 50,000 reads/s:\n- 90% hits: 2.5 ms, 5,000 reads/s reach the database;\n- 99% hits: 0.7 ms, 500 reads/s.\nThe last few percent matter most: 90% → 99% cuts database load tenfold.",
      ru: "Эффективная задержка = `h·t_cache + (1−h)·t_origin`. При Redis 0,5 мс, запросе к базе 20 мс и 50 000 чтений/с:\n- 90% попаданий: 2,5 мс, до базы доходит 5000 чтений/с;\n- 99% попаданий: 0,7 мс, 500 чтений/с.\nВажнее всего последние проценты: переход с 90% на 99% снижает нагрузку на базу в десять раз.",
    },
  },
  {
    id: 'cache-object-vs-query',
    section: 'caching',
    link: '/caching/caching-layers/',
    front: {
      en: "Why cache objects rather than query results?",
      ru: "Почему лучше кэшировать объекты, а не результаты запросов?",
    },
    back: {
      en: "A query-level key is a hash of SQL and parameters; when one row changes you cannot tell which cached queries included it. That is why MySQL's query cache was removed in 8.0.\nAn object-level key comes from domain identity (`user:v1:42`), so a change maps to known keys to delete, and every reader of the object shares the entry.",
      ru: "Ключ на уровне запроса — хеш SQL и параметров; когда меняется строка, неизвестно, какие закэшированные запросы её включали. Поэтому кэш запросов MySQL убрали в 8.0.\nКлюч на уровне объекта строится из идентичности сущности (`user:v1:42`): изменение указывает на известные ключи для удаления, а все читатели объекта делят одну запись.",
    },
  },
  {
    id: 'cache-aside',
    section: 'caching',
    link: '/caching/cache-strategies/',
    front: {
      en: "Describe cache-aside (lazy loading): the read path, the write path and the risks.",
      ru: "Опишите cache-aside (ленивую загрузку): чтение, запись и риски.",
    },
    back: {
      en: "Read: check the cache; on a miss, load from the database and store it with a TTL. Write: update the database, then **delete** the key.\nOnly requested data is cached and the cache can fail without losing data. Costs: a miss takes three round trips, data is stale until TTL or delete, and slow first reads after a flush.",
      ru: "Чтение: проверить кэш; при промахе загрузить из базы и положить с TTL. Запись: обновить базу, затем **удалить** ключ.\nВ кэше только запрошенные данные, а отказ кэша не теряет данные. Цена: промах — три сетевых обмена, данные устаревают до TTL или удаления, первые чтения после сброса медленные.",
    },
  },
  {
    id: 'cache-write-strategies',
    section: 'caching',
    link: '/caching/cache-strategies/',
    front: {
      en: "Write-through vs write-behind?",
      ru: "Write-through и write-behind: в чём разница?",
    },
    back: {
      en: "**Write-through**: write to the cache, which writes the database synchronously. Fresh after every write through that path, but each write pays both latencies, and writes that bypass the cache go stale.\n**Write-behind**: acknowledge after the cache write and flush to the database later, often batched. Very fast and coalesces updates, but data is lost if the cache fails before flushing. Never for payments without a durable log.",
      ru: "**Write-through**: запись в кэш, а он синхронно пишет в базу. Данные свежие после каждой записи по этому пути, но каждая запись платит обе задержки, а записи в обход кэша устаревают.\n**Write-behind**: подтверждение после записи в кэш, сброс в базу позже, часто пачками. Очень быстро и объединяет обновления, но данные теряются, если кэш упадёт до сброса. Для платежей — никогда без надёжного журнала.",
    },
  },
  {
    id: 'cache-delete-not-update',
    section: 'caching',
    link: '/caching/cache-strategies/',
    front: {
      en: "On write, why delete the cache key instead of setting the new value, and in which order?",
      ru: "Почему при записи ключ кэша удаляют, а не обновляют новым значением, и в каком порядке?",
    },
    back: {
      en: "Two writers that **set** values can reach the cache in a different order from their database commits and leave the older value cached. A **delete** is idempotent, so the order doesn't matter, and the next reader loads the latest value.\nCommit first, then delete; deleting first lets a reader refill the old value. Keep a TTL as the backstop for the remaining race.",
      ru: "Два писателя, которые **записывают** значения, могут попасть в кэш в другом порядке, чем их коммиты в базу, и оставить старое значение. **Удаление** идемпотентно, порядок неважен, а следующий читатель загрузит последнее значение.\nСначала коммит, потом удаление: удаление до коммита позволяет читателю вернуть старое значение. TTL остаётся страховкой от оставшейся гонки.",
    },
  },
  {
    id: 'cache-stampede',
    section: 'caching',
    link: '/caching/cache-strategies/',
    front: {
      en: "What is a cache stampede, and how do you prevent it?",
      ru: "Что такое лавина запросов к кэшу (cache stampede) и как её предотвратить?",
    },
    back: {
      en: "A hot key expires (or the cache restarts) and hundreds of concurrent misses hit the database with the same expensive query. Fixes:\n- TTL jitter;\n- request coalescing (single-flight);\n- a short lock or lease: Facebook's leases cut the peak from 17,000 to 1,300 queries/s;\n- serve stale while one request revalidates;\n- probabilistic early expiration (XFetch).",
      ru: "Горячий ключ истекает (или кэш перезапускается), и сотни одновременных промахов бьют в базу одним и тем же тяжёлым запросом. Что помогает:\n- разброс TTL (jitter);\n- объединение запросов (single-flight);\n- короткая блокировка или аренда: аренды Facebook снизили пик с 17 000 до 1300 запросов/с;\n- отдавать устаревшее значение, пока один запрос обновляет;\n- вероятностное досрочное обновление (XFetch).",
    },
  },
  {
    id: 'cache-penetration-hotkeys',
    section: 'caching',
    link: '/caching/cache-strategies/',
    front: {
      en: "Cache penetration and hot keys: what are they and how do you fix them?",
      ru: "Промахи по несуществующим ключам и горячие ключи: что это и как лечить?",
    },
    back: {
      en: "**Penetration**: requests for keys that don't exist always miss and always reach the database. Fix with negative caching (cache “not found” briefly), a Bloom filter of valid IDs, and input validation.\n**Hot keys**: one key saturates its cache shard. Fix with a local L1 cache with a TTL of a second or two, or key replicas (`item:42#0` … `#7`), reading one at random.",
      ru: "**Промахи по несуществующим ключам** (cache penetration): запросы к отсутствующим ключам всегда промахиваются и доходят до базы. Лечится отрицательным кэшированием («не найдено» с коротким TTL), фильтром Блума по допустимым ID и проверкой ввода.\n**Горячие ключи**: один ключ насыщает свой шард кэша. Лечится локальным L1-кэшем с TTL в секунду-две или копиями ключа (`item:42#0` … `#7`) со случайным чтением одной из них.",
    },
  },
  {
    id: 'cache-eviction',
    section: 'caching',
    link: '/caching/cache-strategies/',
    front: {
      en: "LRU, LFU or W-TinyLFU? And what is the Redis/Valkey default eviction policy?",
      ru: "LRU, LFU или W-TinyLFU? И какая политика вытеснения в Redis/Valkey по умолчанию?",
    },
    back: {
      en: "**LRU** suits recency-driven workloads, but one scan flushes the hot set. **LFU** suits stable popularity but is slow to forget. **W-TinyLFU** (Caffeine) admits a newcomer only if a frequency sketch says it beats the victim, so it resists scans.\nRedis and Valkey default to `noeviction`: writes fail when memory is full. For a cache set `maxmemory` and `allkeys-lru` or `allkeys-lfu`.",
      ru: "**LRU** подходит, когда важна свежесть обращений, но один полный проход вытесняет горячие данные. **LFU** подходит при стабильной популярности, но медленно забывает. **W-TinyLFU** (Caffeine) впускает новичка, только если скетч частот считает его популярнее вытесняемого, поэтому устойчив к проходам.\nВ Redis и Valkey по умолчанию `noeviction`: при заполнении памяти запись падает. Для кэша задайте `maxmemory` и `allkeys-lru` или `allkeys-lfu`.",
    },
  },

  // ---------------------------------------------------------------- async
  {
    id: 'async-why-queue',
    section: 'async',
    link: '/async/queues-and-back-pressure/',
    front: {
      en: "When should a step go through a queue, and when not?",
      ru: "Когда шаг стоит отправить через очередь, а когда нет?",
    },
    back: {
      en: "Use a queue for **slow work** (answer `202 Accepted` with a job ID), **bursty load** (absorb a 10× spike and process at a steady rate) and **decoupling** producers from consumers.\nDon't when the user needs the answer now, the work is cheap, read-your-writes matters, or the system is small. A table with `SELECT … FOR UPDATE SKIP LOCKED` is a fine queue at modest volume.",
      ru: "Очередь нужна для **медленной работы** (ответ `202 Accepted` с ID задания), **всплесков нагрузки** (принять 10× пик и обрабатывать равномерно) и **развязки** производителей и потребителей.\nНе нужна, если пользователю нужен ответ сразу, работа дешёвая, важно чтение своих записей или система маленькая. Таблица с `SELECT … FOR UPDATE SKIP LOCKED` — нормальная очередь при умеренном объёме.",
    },
  },
  {
    id: 'async-at-least-once',
    section: 'async',
    link: '/async/queues-and-back-pressure/',
    front: {
      en: "Why do message queues deliver duplicates, and how do you get effectively-once processing?",
      ru: "Почему очереди доставляют дубликаты и как получить обработку «фактически один раз»?",
    },
    back: {
      en: "Real brokers deliver **at least once**: a worker can commit and crash before the ack, a lease can expire mid-job, or a producer can resend after a timeout.\nEffectively-once = at-least-once + an **idempotent consumer**: a natural upsert, or recording processed message IDs in the same transaction as the side effect. External calls need an idempotency key.",
      ru: "Реальные брокеры доставляют **хотя бы один раз**: воркер может зафиксировать результат и упасть до подтверждения, аренда может истечь посреди работы, производитель может отправить повторно после тайм-аута.\n«Фактически один раз» = хотя бы один раз + **идемпотентный потребитель**: естественный upsert или запись ID обработанных сообщений в той же транзакции, что и побочный эффект. Внешним вызовам нужен ключ идемпотентности.",
    },
  },
  {
    id: 'async-dlq',
    section: 'async',
    link: '/async/queues-and-back-pressure/',
    front: {
      en: "How should a consumer handle acks, retries and poison messages?",
      ru: "Как потребителю обращаться с подтверждениями, повторами и «ядовитыми» сообщениями?",
    },
    back: {
      en: "- **Ack after commit**, never before.\n- Set the visibility timeout above p99 processing time, extending it from a heartbeat for long jobs.\n- Retry transient errors with a delay; dead-letter malformed payloads at once.\n- **Cap attempts** and move failures to a **dead-letter queue**; alert when it holds anything and keep a redrive tool.",
      ru: "- **Подтверждать после коммита**, никогда до.\n- Тайм-аут видимости — больше p99 времени обработки; для долгих задач продлевать его по heartbeat.\n- Временные ошибки повторять с задержкой, повреждённые сообщения сразу отправлять в DLQ.\n- **Ограничить число попыток** и переносить провалы в **очередь недоставленных сообщений** (DLQ); алертить, если в ней что-то есть, и иметь инструмент повторной отправки.",
    },
  },
  {
    id: 'async-back-pressure',
    section: 'async',
    link: '/async/queues-and-back-pressure/',
    front: {
      en: "What is back pressure, and how do you apply it?",
      ru: "Что такое обратное давление (backpressure) и как его применять?",
    },
    back: {
      en: "Pushing overload back to the source instead of letting an unbounded queue turn it into minutes of latency and memory exhaustion.\n- Bound every queue.\n- Reject at the edge: `429` for one client over quota, `503` when the service is saturated, both with `Retry-After`.\n- Shed low-value or expired work first.\n- Watch the age of the oldest message, not just depth.\nClients retry with exponential backoff and full jitter.",
      ru: "Возврат перегрузки к источнику, вместо того чтобы неограниченная очередь превращала её в минуты задержки и исчерпание памяти.\n- Ограничивать каждую очередь.\n- Отказывать на входе: `429`, если один клиент превысил квоту, `503`, если перегружен весь сервис, в обоих случаях с `Retry-After`.\n- Первой сбрасывать малоценную или просроченную работу.\n- Следить за возрастом самого старого сообщения, а не только за длиной очереди.\nКлиенты повторяют с экспоненциальной задержкой и полным разбросом.",
    },
  },
  {
    id: 'async-little-workers',
    section: 'async',
    link: '/async/queues-and-back-pressure/',
    front: {
      en: "Size a worker pool: 400 jobs/s, 0.5 s per job. And how long does a 10-minute backlog take to drain?",
      ru: "Рассчитайте пул воркеров: 400 заданий/с по 0,5 с. И сколько будет разбираться отставание за 10 минут?",
    },
    back: {
      en: "In flight: 400 × 0.5 = 200. For 70% utilisation, 286 slots: 18 pods × 16 = 288 slots, maximum 576 jobs/s.\nA 10-minute outage leaves 240,000 jobs. They drain at 576 − 400 = 176 jobs/s, about 23 minutes; 25 pods would take 10 minutes. Headroom decides how fast you recover.",
      ru: "В обработке: 400 × 0,5 = 200. Для загрузки 70% нужно 286 слотов: 18 подов × 16 = 288 слотов, максимум 576 заданий/с.\nПростой 10 минут оставляет 240 000 заданий. Они разбираются со скоростью 576 − 400 = 176 заданий/с — около 23 минут; 25 подов справились бы за 10 минут. Запас мощности определяет скорость восстановления.",
    },
  },
  {
    id: 'async-partitions-order',
    section: 'async',
    link: '/async/event-streaming/',
    front: {
      en: "How does ordering work in a Kafka-style log, and how do you choose the partition key?",
      ru: "Как устроен порядок в журнале вроде Kafka и как выбрать ключ партиционирования?",
    },
    back: {
      en: "Order exists **per partition only**. Pick the key by the invariant: if “payment captured” must follow “order placed”, both use the order ID.\nWatch out: hot keys make hot partitions; adding partitions remaps keys and breaks per-key order during the change (so over-provision up front); and retries reorder unless the producer is idempotent.",
      ru: "Порядок существует **только внутри партиции**. Ключ выбирают по инварианту: если «платёж проведён» должен идти после «заказ создан», у обоих событий ключ — ID заказа.\nОсторожно: горячие ключи дают горячие партиции; добавление партиций меняет соответствие ключей и ломает порядок на время изменения (поэтому партиций закладывают с запасом); повторы переупорядочивают записи, если производитель не идемпотентный.",
    },
  },
  {
    id: 'async-consumer-groups',
    section: 'async',
    link: '/async/event-streaming/',
    front: {
      en: "How do consumer groups and offsets work, and what is the key health metric?",
      ru: "Как работают группы потребителей и смещения и какая метрика здоровья главная?",
    },
    back: {
      en: "Each partition goes to at most one member of a group: 12 partitions and 4 members means 3 each, and a 13th member sits idle. Parallelism is capped by the partition count. Other groups read independently with their own offsets.\nCommit after processing for at-least-once. Watch **consumer lag**, converted to time, and alert when it keeps growing.",
      ru: "Каждую партицию читает не более одного участника группы: при 12 партициях и 4 участниках каждый читает 3, а тринадцатый участник будет простаивать. Параллелизм ограничен числом партиций. Другие группы читают независимо, со своими смещениями.\nФиксация смещения после обработки даёт доставку хотя бы один раз. Главная метрика — **отставание потребителя** (consumer lag), переведённое во время; алерт — когда оно продолжает расти.",
    },
  },
  {
    id: 'async-exactly-once',
    section: 'async',
    link: '/async/event-streaming/',
    front: {
      en: "What does “exactly-once” in Kafka really cover?",
      ru: "Что на самом деле покрывает exactly-once в Kafka?",
    },
    back: {
      en: "A consume → transform → produce loop that stays **inside Kafka**, built from the idempotent producer, transactions that write outputs and commit offsets atomically, and `read_committed` consumers.\nOnce you write to Postgres, call an API or send an email, you are back to at-least-once plus idempotence, which is why “effectively-once” is the more honest name.",
      ru: "Цикл «прочитать → преобразовать → записать», который остаётся **внутри Kafka**: идемпотентный производитель, транзакции, атомарно записывающие результат и фиксирующие смещения, и потребители с `read_committed`.\nКак только вы пишете в Postgres, вызываете API или шлёте письмо, вы снова в режиме «хотя бы один раз» плюс идемпотентность. Поэтому честнее говорить effectively-once.",
    },
  },
  {
    id: 'async-outbox',
    section: 'async',
    link: '/async/event-streaming/',
    front: {
      en: "A service must update its database and publish an event. How do you avoid a dual write?",
      ru: "Сервис должен обновить базу и опубликовать событие. Как избежать двойной записи?",
    },
    back: {
      en: "**Transactional outbox**: insert the event into an `outbox` table in the same local transaction as the business change. A relay publishes it, usually via **CDC** that tails the replication log (Debezium).\nThe event is published if and only if the transaction commits, in commit order. The relay may publish twice, so consumers dedupe by event ID.",
      ru: "**Transactional outbox**: событие вставляется в таблицу `outbox` в той же локальной транзакции, что и бизнес-изменение. Ретранслятор публикует его, обычно через **CDC**, читающий журнал репликации (Debezium).\nСобытие публикуется тогда и только тогда, когда транзакция зафиксирована, и в порядке фиксации. Ретранслятор может опубликовать дважды, поэтому потребители убирают дубли по ID события.",
    },
  },
  {
    id: 'async-queue-vs-log',
    section: 'async',
    link: '/async/event-streaming/',
    front: {
      en: "Message queue or log: when do you use which?",
      ru: "Очередь сообщений или журнал: когда что использовать?",
    },
    back: {
      en: "**Queue** (RabbitMQ, SQS): a message is deleted on ack; competing workers share one queue; per-message retries and DLQ are built in. Use it to distribute *work*.\n**Log** (Kafka, Kinesis, Pulsar): records stay until retention; many independent groups read with their own offsets and can replay; strict order per partition. Use it to distribute *facts*.",
      ru: "**Очередь** (RabbitMQ, SQS): сообщение удаляется после подтверждения; конкурирующие воркеры делят одну очередь; повторы по сообщению и DLQ встроены. Ею распределяют *работу*.\n**Журнал** (Kafka, Kinesis, Pulsar): записи живут до конца срока хранения; много независимых групп читают со своими смещениями и могут перечитать; строгий порядок внутри партиции. Им распределяют *факты*.",
    },
  },

  // ---------------------------------------------------------------- communication
  {
    id: 'comm-http-methods',
    section: 'communication',
    link: '/communication/http/',
    front: {
      en: "Which HTTP methods are safe, which are idempotent, and how do you retry a POST safely?",
      ru: "Какие методы HTTP безопасны, какие идемпотентны и как безопасно повторить POST?",
    },
    back: {
      en: "**Safe** (no state change requested): GET, HEAD, OPTIONS, TRACE and the new QUERY (RFC 10008). **Idempotent**: the safe ones plus PUT and DELETE, so clients and proxies can retry them.\nPOST and PATCH are neither; make them retry-safe with an **idempotency key**. In practice caches store GET and HEAD responses; QUERY is cacheable, but support is still new.",
      ru: "**Безопасные** (не запрашивают изменения состояния): GET, HEAD, OPTIONS, TRACE и новый QUERY (RFC 10008). **Идемпотентные**: безопасные плюс PUT и DELETE, поэтому клиенты и прокси могут их повторять.\nPOST и PATCH — ни то ни другое; для безопасного повтора им нужен **ключ идемпотентности**. На практике кэши хранят ответы на GET и HEAD; QUERY тоже кэшируемый, но его поддержка пока только появляется.",
    },
  },
  {
    id: 'comm-cache-control',
    section: 'communication',
    link: '/communication/http/',
    front: {
      en: "`no-cache` vs `no-store`, `private` vs `s-maxage`: what does each mean?",
      ru: "`no-cache` и `no-store`, `private` и `s-maxage`: что означает каждый?",
    },
    back: {
      en: "- `no-cache`: may be stored, but must be **revalidated** before each use. `no-store`: must not be stored at all.\n- `private`: keep out of shared caches (anything personalised). `s-maxage`: freshness for shared caches such as CDNs, overriding `max-age`.\nRevalidate cheaply with `ETag` + `If-None-Match` → `304 Not Modified`.",
      ru: "- `no-cache`: хранить можно, но перед каждым использованием нужно **перепроверить**. `no-store`: хранить нельзя вообще.\n- `private`: не класть в общие кэши (всё персональное). `s-maxage`: срок свежести для общих кэшей вроде CDN, перекрывает `max-age`.\nДешёвая перепроверка — `ETag` + `If-None-Match` → `304 Not Modified`.",
    },
  },
  {
    id: 'comm-http3',
    section: 'communication',
    link: '/communication/http/',
    front: {
      en: "What does HTTP/3 fix compared with HTTP/2, and what does it cost?",
      ru: "Что HTTP/3 исправляет по сравнению с HTTP/2 и чего это стоит?",
    },
    back: {
      en: "HTTP/2 multiplexes streams over one TCP connection, but one lost packet stalls all of them. HTTP/3 runs over **QUIC** (UDP): loss stalls only its own stream, transport and TLS handshakes are combined, and connections survive a network change.\nCosts: UDP is blocked on some networks (keep a fallback), more CPU per byte, and less mature self-hosted tooling.",
      ru: "HTTP/2 мультиплексирует потоки в одном TCP-соединении, но потеря одного пакета тормозит их все. HTTP/3 работает поверх **QUIC** (UDP): потеря тормозит только свой поток, рукопожатия транспорта и TLS совмещены, а соединение переживает смену сети.\nЦена: UDP блокируется в некоторых сетях (нужен запасной вариант), больше CPU на байт, менее зрелые инструменты для самостоятельного хостинга.",
    },
  },
  {
    id: 'comm-handshake-cost',
    section: 'communication',
    link: '/communication/http/',
    front: {
      en: "How many round trips before the first response byte on a new HTTPS connection?",
      ru: "Сколько сетевых кругов до первого байта ответа на новом HTTPS-соединении?",
    },
    back: {
      en: "- New TCP + TLS 1.2: 4 (400 ms at 100 ms RTT).\n- New TCP + TLS 1.3: 3.\n- New QUIC (HTTP/3): 2.\n- QUIC resumption with 0-RTT, or a reused warm connection: 1.\nSo reuse and pool connections. Accept 0-RTT early data only for safe, idempotent requests, because it can be replayed.",
      ru: "- Новое TCP + TLS 1.2: 4 (400 мс при RTT 100 мс).\n- Новое TCP + TLS 1.3: 3.\n- Новое QUIC (HTTP/3): 2.\n- Возобновление QUIC с 0-RTT или переиспользованное «тёплое» соединение: 1.\nПоэтому соединения переиспользуют и держат в пулах. Ранние данные 0-RTT принимайте только для безопасных идемпотентных запросов: их можно воспроизвести повторно.",
    },
  },
  {
    id: 'comm-tcp-udp',
    section: 'communication',
    link: '/communication/tcp-and-udp/',
    front: {
      en: "TCP vs UDP: what do you get and give up with each?",
      ru: "TCP и UDP: что получаем и чем жертвуем в каждом?",
    },
    back: {
      en: "**TCP**: a one-round-trip handshake, then reliable, in-order bytes with flow control (protects the receiver) and congestion control (protects the network). One lost segment stalls everything behind it.\n**UDP**: an 8-byte header and nothing else — no connection, ordering, retransmission or congestion control. Used when late data is useless (voice, games), for DNS and DHCP, and for broadcast. You own congestion control and amplification protection.",
      ru: "**TCP**: рукопожатие за один сетевой круг, затем надёжная упорядоченная доставка байтов с управлением потоком (защищает получателя) и управлением перегрузкой (защищает сеть). Один потерянный сегмент тормозит всё, что за ним.\n**UDP**: 8-байтовый заголовок и ничего больше — ни соединения, ни порядка, ни повторной передачи, ни управления перегрузкой. Применяется, когда опоздавшие данные бесполезны (голос, игры), для DNS и DHCP и для широковещания. Управление перегрузкой и защита от усиления — на вас.",
    },
  },
  {
    id: 'comm-connection-cost',
    section: 'communication',
    link: '/communication/tcp-and-udp/',
    front: {
      en: "Why are new TCP connections expensive, and why pool them?",
      ru: "Почему новые TCP-соединения дороги и зачем нужны пулы?",
    },
    back: {
      en: "- Handshake round trips, plus TLS.\n- **Slow start**: a new connection starts with 10 segments (about 14.6 KB), so a 1 MB response needs about 7 round trips, 0.7 s at 100 ms RTT.\n- TIME_WAIT: about 28,000 ephemeral ports run out at roughly 470 new connections/s to one backend.\n- 500 app instances × 20 database connections = 10,000 server connections.",
      ru: "- Сетевые круги на рукопожатие плюс TLS.\n- **Медленный старт**: новое соединение начинает с 10 сегментов (около 14,6 КБ), поэтому ответ на 1 МБ требует примерно 7 сетевых кругов — 0,7 с при RTT 100 мс.\n- TIME_WAIT: около 28 000 эфемерных портов заканчиваются примерно на 470 новых соединениях в секунду к одному бэкенду.\n- 500 экземпляров приложения × 20 соединений с базой = 10 000 серверных соединений.",
    },
  },
  {
    id: 'comm-rpc-rest',
    section: 'communication',
    link: '/communication/rpc-and-rest/',
    front: {
      en: "RPC (gRPC) or REST: which do you choose, and where?",
      ru: "RPC (gRPC) или REST: что и где выбрать?",
    },
    back: {
      en: "**REST + JSON + OpenAPI** for public APIs: any HTTP client works, HTTP caching applies, conventions are familiar.\n**gRPC** between internal services: typed Protobuf contracts, compact encoding, deadlines, streaming and generated clients over HTTP/2. Browsers need gRPC-Web or Connect.\nMany organisations run gRPC inside and expose REST through a gateway.",
      ru: "**REST + JSON + OpenAPI** — для публичных API: работает любой HTTP-клиент, действует HTTP-кэширование, соглашения привычны.\n**gRPC** — между внутренними сервисами: типизированные контракты Protobuf, компактная кодировка, дедлайны, потоки и сгенерированные клиенты поверх HTTP/2. Браузерам нужен gRPC-Web или Connect.\nЧасто внутри используют gRPC, а наружу отдают REST через шлюз.",
    },
  },
  {
    id: 'comm-pagination-versioning',
    section: 'communication',
    link: '/communication/rpc-and-rest/',
    front: {
      en: "How do you paginate and version a public API?",
      ru: "Как делать пагинацию и версионирование публичного API?",
    },
    back: {
      en: "**Pagination**: cursors, not offsets. An opaque token encoding the last position stays fast at any depth and stable under inserts; offsets slow down with depth and skip or duplicate items.\n**Versioning**: prefer additive, backward-compatible changes; reserve a new major version (`/v1/…`) for breaking ones, and announce retirement with `Deprecation` and `Sunset` headers.",
      ru: "**Пагинация**: курсоры, а не смещения. Непрозрачный токен с последней позицией работает быстро на любой глубине и устойчив к вставкам; смещения замедляются с глубиной и пропускают или дублируют элементы.\n**Версионирование**: предпочитайте добавляющие, обратно совместимые изменения; новую мажорную версию (`/v1/…`) оставляйте для ломающих, а вывод из эксплуатации объявляйте заголовками `Deprecation` и `Sunset`.",
    },
  },
  {
    id: 'comm-graphql',
    section: 'communication',
    link: '/communication/api-styles/',
    front: {
      en: "GraphQL: when does it fit, and what problems must you handle?",
      ru: "GraphQL: когда он подходит и с какими проблемами придётся справиться?",
    },
    back: {
      en: "Fits many clients needing different views of a rich, connected domain: one round trip per screen and no over-fetching.\nHandle **N+1** resolvers with a per-request DataLoader (batch and memoise), **weak HTTP caching** (all POST to one endpoint; use persisted queries) and **query cost**: limit depth and page size and rate-limit by cost. Avoid it for simple CRUD or internal calls.",
      ru: "Подходит, когда многим клиентам нужны разные представления богатой связной предметной области: один запрос на экран и никаких лишних полей.\nНужно справиться с **N+1** в резолверах (DataLoader на каждый запрос: пакетирование и запоминание), **слабым HTTP-кэшированием** (всё идёт POST на один адрес; помогают persisted queries) и **стоимостью запросов**: ограничения глубины и размера страницы, лимиты по стоимости. Для простого CRUD или внутренних вызовов он не нужен.",
    },
  },
  {
    id: 'comm-push',
    section: 'communication',
    link: '/communication/api-styles/',
    front: {
      en: "Long polling, SSE or WebSockets: which do you pick for server push?",
      ru: "Long polling, SSE или WebSocket: что выбрать для отправки данных с сервера?",
    },
    back: {
      en: "- **SSE**: one-way server → client over plain HTTP, with built-in reconnect via `Last-Event-ID`. Notifications, dashboards, LLM token streams.\n- **WebSockets**: full duplex, low latency. Chat, collaboration, games; you must build reconnect, heartbeats and acks.\n- **Long polling**: the universal fallback when streaming is blocked.\nA message reaches a user on another server through a pub/sub layer between connection gateways.",
      ru: "- **SSE**: в одну сторону, сервер → клиент, по обычному HTTP, с встроенным переподключением через `Last-Event-ID`. Уведомления, дашборды, потоки токенов LLM.\n- **WebSocket**: полный дуплекс и низкая задержка. Чаты, совместная работа, игры; переподключение, heartbeat и подтверждения придётся строить самим.\n- **Long polling**: универсальный запасной вариант, когда потоковая передача заблокирована.\nСообщение доходит до пользователя на другом сервере через слой pub/sub между шлюзами соединений.",
    },
  },
  {
    id: 'comm-webhooks',
    section: 'communication',
    link: '/communication/api-styles/',
    front: {
      en: "What must the sender and the receiver of webhooks do?",
      ru: "Что должны делать отправитель и получатель вебхуков?",
    },
    back: {
      en: "**Sender**: deliver from a queue; retry with backoff and jitter for hours or days (Stripe retries for up to three days); sign each delivery with HMAC-SHA256 over ID, timestamp and raw body; block private addresses to prevent SSRF.\n**Receiver**: verify the signature on the raw body, reject stale timestamps, answer `2xx` fast, dedupe by event ID (delivery is at least once) and don't assume order.",
      ru: "**Отправитель**: доставлять из очереди; повторять с экспоненциальной задержкой и разбросом часами или днями (Stripe — до трёх дней); подписывать каждую доставку HMAC-SHA256 по ID, метке времени и сырому телу; блокировать приватные адреса против SSRF.\n**Получатель**: проверять подпись по сырому телу, отвергать устаревшие метки времени, быстро отвечать `2xx`, убирать дубли по ID события (доставка — хотя бы один раз) и не полагаться на порядок.",
    },
  },

  // ---------------------------------------------------------------- reliability & security
  {
    id: 'rel-three-signals',
    section: 'reliability',
    link: '/reliability/observability/',
    front: {
      en: "Metrics, traces, logs: which question does each answer, and how are they linked?",
      ru: "Метрики, трассировки, логи: на какой вопрос отвечает каждый сигнал и как они связаны?",
    },
    back: {
      en: "**Metrics** say *that* something is wrong, cheaply. **Traces** say *where* the time went. **Logs** say *why*.\nLink them with a shared trace ID: alert on a metric, open an exemplar trace from the bad minute, then find its logs by trace ID. OpenTelemetry is the vendor-neutral standard for all three.",
      ru: "**Метрики** дёшево говорят, *что* что-то сломалось. **Трассировки** — *где* ушло время. **Логи** — *почему*.\nСвязывает их общий trace ID: алерт по метрике → трассировка-пример (exemplar) из плохой минуты → её логи по trace ID. Нейтральный к вендорам стандарт для всех трёх — OpenTelemetry.",
    },
  },
  {
    id: 'rel-red-use',
    section: 'reliability',
    link: '/reliability/observability/',
    front: {
      en: "What do RED and USE stand for, and where does each apply?",
      ru: "Что означают RED и USE и где применяется каждый?",
    },
    back: {
      en: "**RED**, for every request-driven service: **R**ate, **E**rrors, **D**uration (a latency distribution).\n**USE**, for every resource, including thread pools, connection pools and queues: **U**tilisation, **S**aturation (work waiting), **E**rrors.\nGoogle's four golden signals (latency, traffic, errors, saturation) combine the two. Measure the latency of successes and failures separately.",
      ru: "**RED** — для каждого сервиса, обрабатывающего запросы: **R**ate (частота), **E**rrors (ошибки), **D**uration (распределение задержки).\n**USE** — для каждого ресурса, включая пулы потоков, пулы соединений и очереди: **U**tilisation (загрузка), **S**aturation (насыщение, ожидающая работа), **E**rrors (ошибки).\nЧетыре золотых сигнала Google (задержка, трафик, ошибки, насыщение) объединяют оба подхода. Задержку успешных и неудачных запросов измеряйте отдельно.",
    },
  },
  {
    id: 'rel-burn-rate',
    section: 'reliability',
    link: '/reliability/observability/',
    front: {
      en: "How do you alert on an SLO? Give the burn-rate thresholds for a 99.9% SLO.",
      ru: "Как алертить по SLO? Назовите пороги скорости сгорания для SLO 99,9%.",
    },
    back: {
      en: "Alert on the **burn rate**: how fast the error budget is being spent (1 = exactly the whole budget in 30 days).\n- Page: burn rate 14.4 over 1 h and 5 min (2% of the budget used).\n- Page: 6 over 6 h and 30 min (5%).\n- Ticket: 1 over 3 days and 6 h (10%).\nThe long window makes the alert significant; the short one lets it stop soon after the problem does.",
      ru: "Алертить по **скорости сгорания**: как быстро тратится бюджет ошибок (1 — ровно весь бюджет за 30 дней).\n- Вызов дежурного: скорость 14,4 за 1 ч и 5 мин (израсходовано 2% бюджета).\n- Вызов: 6 за 6 ч и 30 мин (5%).\n- Тикет: 1 за 3 дня и 6 ч (10%).\nДлинное окно делает алерт значимым, короткое позволяет ему погаснуть вскоре после окончания проблемы.",
    },
  },
  {
    id: 'rel-cardinality',
    section: 'reliability',
    link: '/reliability/observability/',
    front: {
      en: "Why must metric labels be bounded?",
      ru: "Почему у меток метрик должно быть ограниченное число значений?",
    },
    back: {
      en: "Every distinct label combination is a separate time series, and they multiply: 50 endpoints × 4 methods × 5 status classes × 200 pods × 14 histogram series = 2.8 million. Add `customer_id` with 10,000 values and you get 28 billion.\nKeep metric labels bounded (endpoint template, region, status class); put user IDs, order IDs and URLs into traces and logs.",
      ru: "Каждая уникальная комбинация меток — отдельный временной ряд, и они перемножаются: 50 эндпоинтов × 4 метода × 5 классов статусов × 200 подов × 14 рядов гистограммы = 2,8 млн. Добавьте `customer_id` с 10 000 значений — получится 28 млрд.\nВ метках метрик — только ограниченные значения (шаблон эндпоинта, регион, класс статуса); ID пользователей, заказов и URL — в трассировки и логи.",
    },
  },
  {
    id: 'rel-token-bucket',
    section: 'reliability',
    link: '/reliability/rate-limiting/',
    front: {
      en: "How does a token bucket rate limiter work?",
      ru: "Как работает ограничитель частоты token bucket?",
    },
    back: {
      en: "A bucket holds up to `b` tokens and refills at `r` per second; each request takes a token or is rejected (or delayed). Over any interval `t`, at most `b + r·t` requests pass: bursts up to `b`, long-run average `r`.\nYou store just two numbers per key (tokens and last refill time) and refill lazily. It is the default for APIs.",
      ru: "Корзина вмещает до `b` токенов и пополняется со скоростью `r` в секунду; каждый запрос забирает токен, иначе отклоняется (или ждёт). За любой интервал `t` проходит не больше `b + r·t` запросов: всплески до `b`, средняя частота `r`.\nНа ключ хранятся всего два числа (токены и время последнего пополнения), пополнение — лениво при запросе. Это выбор по умолчанию для API.",
    },
  },
  {
    id: 'rel-windows',
    section: 'reliability',
    link: '/reliability/rate-limiting/',
    front: {
      en: "What is wrong with a fixed-window limiter, and how does the sliding-window counter fix it?",
      ru: "Чем плох лимит с фиксированным окном и как его исправляет счётчик скользящего окна?",
    },
    back: {
      en: "With 100 per minute, a client can send 100 at 10:15:59 and 100 at 10:16:00: up to **2× the limit** at a boundary.\nThe sliding-window counter weights the previous window by its overlap: 15 s into the minute, `84 × 45/60 + 36 = 99`, so one more request is allowed. Cloudflare measured only 0.003% wrong decisions over 400 million requests.",
      ru: "При лимите 100 в минуту клиент может отправить 100 запросов в 10:15:59 и ещё 100 в 10:16:00 — до **2× лимита** на стыке окон.\nСчётчик скользящего окна учитывает предыдущее окно с весом перекрытия: на 15-й секунде минуты `84 × 45/60 + 36 = 99`, значит, можно пропустить ещё один запрос. Cloudflare на 400 млн запросов насчитал всего 0,003% ошибочных решений.",
    },
  },
  {
    id: 'rel-distributed-limit',
    section: 'reliability',
    link: '/reliability/rate-limiting/',
    front: {
      en: "Distributed rate limiting in Redis: what are the classic bugs, and what if Redis is down?",
      ru: "Распределённое ограничение частоты в Redis: какие ошибки классические и что делать, если Redis недоступен?",
    },
    back: {
      en: "Bug 1: **check-then-act** (`GET`, compare, `INCR`) lets two nodes both allow at 99. Bug 2: `INCR` then a separate `EXPIRE`; a crash in between leaves a key that never expires.\nFix: `INCR` with `EXPIRE … NX` in one `MULTI`, or a Lua script using the server's `TIME`.\nIf the store fails, decide in advance: fail open (most public APIs, with a coarse local limit) or fail closed. Reject with `429` and `Retry-After`.",
      ru: "Ошибка 1: **проверить, потом действовать** (`GET`, сравнить, `INCR`) — два узла одновременно видят 99 и оба пропускают. Ошибка 2: `INCR`, а потом отдельный `EXPIRE`; падение между ними оставляет ключ, который никогда не истечёт.\nИсправление: `INCR` с `EXPIRE … NX` в одном `MULTI` или Lua-скрипт со временем сервера (`TIME`).\nНа случай отказа хранилища решите заранее: fail open (так делают большинство публичных API, с грубым локальным лимитом) или fail closed. Отказ — `429` с `Retry-After`.",
    },
  },
  {
    id: 'rel-cascading',
    section: 'reliability',
    link: '/reliability/resilience-patterns/',
    front: {
      en: "How do cascading failures happen? What is a metastable failure?",
      ru: "Как возникают каскадные отказы? Что такое метастабильный отказ?",
    },
    back: {
      en: "A feedback loop: failure causes more load or waiting, which causes more failures. Survivors take the dead replica's load; a slow dependency fills pools (by Little's law, 20 ms → 2 s means 100× in flight); 3 attempts at each of 4 layers turn one request into 3⁴ = 81 calls.\n**Metastable**: the trigger is gone, but retries, queues and cold caches keep load above capacity. Recovery needs load well below the original level.",
      ru: "Это петля обратной связи: отказ создаёт больше нагрузки или ожидания, а они — новые отказы. Уцелевшие реплики забирают нагрузку упавшей; медленная зависимость заполняет пулы (по закону Литтла рост с 20 мс до 2 с — это в 100 раз больше запросов в обработке); по 3 попытки на каждом из 4 уровней превращают один запрос в 3⁴ = 81 вызов.\n**Метастабильный отказ**: причина ушла, но повторы, очереди и холодные кэши держат нагрузку выше мощности. Для восстановления её нужно опустить намного ниже исходного уровня.",
    },
  },
  {
    id: 'rel-timeouts',
    section: 'reliability',
    link: '/reliability/resilience-patterns/',
    front: {
      en: "How do you set timeouts, and why propagate a deadline?",
      ru: "Как выбирать тайм-ауты и зачем передавать дедлайн?",
    },
    back: {
      en: "Every remote call needs a timeout (gRPC sets no deadline by default). Set it slightly above the dependency's p99.9, not a round “30 s”, and separate connect from request timeouts.\nBetter, the edge sets an end-to-end budget (say 800 ms) and each hop passes on the *remaining* time, so services stop working on requests nobody is waiting for. Dropping abandoned work is the cheapest load shedding there is.",
      ru: "У каждого удалённого вызова должен быть тайм-аут (в gRPC дедлайна по умолчанию нет). Ставьте его чуть выше p99.9 зависимости, а не круглые «30 с», и разделяйте тайм-ауты подключения и запроса.\nЕщё лучше: входной узел задаёт сквозной бюджет (например, 800 мс), а каждый переход передаёт дальше *оставшееся* время — тогда сервисы не работают над запросами, которых уже никто не ждёт. Брошенная работа, которую не делают, — самый дешёвый сброс нагрузки.",
    },
  },
  {
    id: 'rel-retries',
    section: 'reliability',
    link: '/reliability/resilience-patterns/',
    front: {
      en: "What are the rules for retries that don't cause retry storms?",
      ru: "Каковы правила повторов, которые не вызывают «шторма повторов»?",
    },
    back: {
      en: "- Retry only safe operations: reads, idempotent writes, writes with an idempotency key. Never retry 4xx except 408 and 429.\n- Exponential backoff with **full jitter**: `sleep = random(0, min(cap, base × 2^attempt))`.\n- Cap attempts (about three) and respect the caller's deadline.\n- Retry at **one layer** only.\n- Use a **retry budget** (about 10% of requests): worst-case load grows about 1.1× instead of 3×.",
      ru: "- Повторять только безопасное: чтение, идемпотентную запись, запись с ключом идемпотентности. Ошибки 4xx не повторять, кроме 408 и 429.\n- Экспоненциальная задержка с **полным разбросом**: `sleep = random(0, min(cap, base × 2^attempt))`.\n- Ограничить число попыток (около трёх) и не выходить за дедлайн вызывающего.\n- Повторять только на **одном уровне**.\n- Держать **бюджет повторов** (около 10% запросов): в худшем случае нагрузка растёт примерно в 1,1 раза вместо 3.",
    },
  },
  {
    id: 'rel-idempotency-key',
    section: 'reliability',
    link: '/reliability/resilience-patterns/',
    front: {
      en: "The payment call timed out. How does an idempotency key make the retry safe?",
      ru: "Вызов оплаты ушёл в тайм-аут. Как ключ идемпотентности делает повтор безопасным?",
    },
    back: {
      en: "The client generates one unique key per *logical* operation and sends it with every attempt. The server:\n1. stores the key with a request fingerprint, atomically, before doing the work;\n2. replays the stored response for a repeat with the same parameters;\n3. returns an error if the parameters differ;\n4. answers `409` while the original is still running;\n5. expires keys after a retention period (Stripe: 24 hours).\nStore the key in the same transaction as the effect.",
      ru: "Клиент генерирует один уникальный ключ на *логическую* операцию и отправляет его с каждой попыткой. Сервер:\n1. атомарно сохраняет ключ с отпечатком запроса до начала работы;\n2. на повтор с теми же параметрами возвращает сохранённый ответ;\n3. при других параметрах возвращает ошибку;\n4. пока первый запрос ещё выполняется, отвечает `409`;\n5. удаляет ключи после срока хранения (у Stripe — 24 часа).\nКлюч сохраняется в той же транзакции, что и сам эффект.",
    },
  },
  {
    id: 'rel-circuit-breaker',
    section: 'reliability',
    link: '/reliability/resilience-patterns/',
    front: {
      en: "Explain the three states of a circuit breaker.",
      ru: "Объясните три состояния предохранителя (circuit breaker).",
    },
    back: {
      en: "- **Closed**: calls pass through; failures and slow calls are counted over a sliding window.\n- **Open**: calls fail immediately or go to a fallback, giving the dependency room to recover.\n- **Half-open**: after a wait, a few trial calls go through; success closes it, failure opens it again.\nKeep one breaker per endpoint and shard, and alert on its state, because breakers hide failures.",
      ru: "- **Закрыт**: вызовы проходят; отказы и медленные вызовы считаются в скользящем окне.\n- **Открыт**: вызовы сразу завершаются ошибкой или уходят в запасной путь, давая зависимости восстановиться.\n- **Полуоткрыт**: после паузы пропускается несколько пробных вызовов; успех закрывает его, неудача снова открывает.\nДержите отдельный предохранитель на эндпоинт и шард и алертите по его состоянию: предохранители скрывают отказы.",
    },
  },
  {
    id: 'rel-bulkhead-shedding',
    section: 'reliability',
    link: '/reliability/resilience-patterns/',
    front: {
      en: "Bulkheads and load shedding: what does each protect against?",
      ru: "Переборки и сброс нагрузки: от чего защищает каждый приём?",
    },
    back: {
      en: "**Bulkhead**: each dependency or tenant gets its own bounded pool of threads or connections, so a hung recommendations service fills only its own 20 connections and checkout keeps working. At scale this becomes a cell-based architecture.\n**Load shedding**: under overload, reject early and cheaply, by priority, so the rest finish within their deadlines. Otherwise goodput (useful completed work) collapses while throughput still looks high.",
      ru: "**Переборка** (bulkhead): у каждой зависимости или клиента свой ограниченный пул потоков или соединений, поэтому зависший сервис рекомендаций занимает только свои 20 соединений, а оформление заказа продолжает работать. В большом масштабе это архитектура ячеек (cell-based).\n**Сброс нагрузки**: при перегрузке отказывать рано, дёшево и по приоритету, чтобы остальные запросы успели к дедлайну. Иначе полезная пропускная способность (goodput) обрушивается, хотя пропускная способность выглядит высокой.",
    },
  },
  {
    id: 'rel-hedged',
    section: 'reliability',
    link: '/reliability/resilience-patterns/',
    front: {
      en: "What are hedged requests, and what do they buy?",
      ru: "Что такое дублирующие запросы (hedged requests) и что они дают?",
    },
    back: {
      en: "If a request has not answered within about the p95 latency, send a copy to another replica and take whichever reply comes first.\nIn *The Tail at Scale*, hedging after 10 ms cut p99.9 from 1,800 ms to 74 ms for only 2% more requests. Only for idempotent reads; cancel the slower copy and cap hedges with a budget.",
      ru: "Если запрос не ответил примерно за время p95, отправить копию на другую реплику и взять первый пришедший ответ.\nВ *The Tail at Scale* дублирование через 10 мс снизило p99.9 с 1800 мс до 74 мс ценой всего 2% лишних запросов. Только для идемпотентных чтений; более медленную копию отменять, а число дублей ограничивать бюджетом.",
    },
  },
  {
    id: 'rel-authn-authz',
    section: 'reliability',
    link: '/reliability/security/',
    front: {
      en: "Authentication vs authorization, and where do you check each?",
      ru: "Аутентификация и авторизация: в чём разница и где проверять каждую?",
    },
    back: {
      en: "**AuthN** proves *who* you are; **authZ** decides *what* you may do with this object. AuthZ failures, such as fetching `/invoices/1043` after being allowed only `/invoices/1042`, are far more common: broken access control is the top web risk.\nAuthenticate at the gateway, but check authorization in the service, on every request and every object. Store passwords only as slow salted hashes (Argon2id).",
      ru: "**Аутентификация** доказывает, *кто* вы; **авторизация** решает, *что* вам можно делать с этим объектом. Ошибки авторизации — например, получить `/invoices/1043`, имея доступ только к `/invoices/1042`, — встречаются гораздо чаще: нарушение контроля доступа — главный риск веб-приложений.\nАутентифицируйте на шлюзе, а авторизацию проверяйте в сервисе — на каждом запросе и для каждого объекта. Пароли храните только как медленные хеши с солью (Argon2id).",
    },
  },
  {
    id: 'rel-sessions-jwt',
    section: 'reliability',
    link: '/reliability/security/',
    front: {
      en: "Server-side sessions or JWTs?",
      ru: "Серверные сессии или JWT?",
    },
    back: {
      en: "**Session**: a random ID in a cookie, looked up in a shared store. Revocation is immediate. Best for browser apps, with `HttpOnly`, `Secure` and `SameSite` cookies.\n**JWT**: signed claims verified locally, with no lookup, so any service can check them, but revocation is hard. Keep them short-lived with revocable refresh tokens, pin the algorithm, validate `iss`, `aud` and `exp`, and never keep them in `localStorage`.",
      ru: "**Сессия**: случайный ID в cookie, который ищут в общем хранилище. Отзыв мгновенный. Лучший вариант для браузерных приложений с cookie `HttpOnly`, `Secure` и `SameSite`.\n**JWT**: подписанные утверждения проверяются локально, без обращения к хранилищу, поэтому их может проверить любой сервис, но отзыв сложен. Делайте их короткоживущими с отзываемыми refresh-токенами, фиксируйте алгоритм, проверяйте `iss`, `aud` и `exp` и не храните в `localStorage`.",
    },
  },
  {
    id: 'rel-envelope',
    section: 'reliability',
    link: '/reliability/security/',
    front: {
      en: "What is envelope encryption, and why is it the standard?",
      ru: "Что такое конвертное шифрование и почему это стандарт?",
    },
    back: {
      en: "Data is encrypted locally with a per-object **data key**; only that small key is encrypted by a KMS whose root keys never leave its HSMs.\nBulk data never travels to the KMS, every KMS call is authorised and audited, rotating the root key needs no re-encryption of terabytes, and destroying a key makes everything under it unreadable. Encryption at rest doesn't stop someone with valid credentials: control who can use the keys.",
      ru: "Данные шифруются локально **ключом данных** для каждого объекта; KMS шифрует только этот маленький ключ, а корневые ключи никогда не покидают его HSM.\nОбъёмные данные не идут в KMS, каждый вызов KMS авторизуется и журналируется, ротация корневого ключа не требует перешифровывать терабайты, а уничтожение ключа делает нечитаемым всё, что им зашифровано. Шифрование при хранении не остановит того, у кого есть действующие учётные данные: контролируйте, кто может пользоваться ключами.",
    },
  },
  {
    id: 'rel-input',
    section: 'reliability',
    link: '/reliability/security/',
    front: {
      en: "Injection, XSS, CSRF, SSRF: the main defence against each?",
      ru: "Инъекции, XSS, CSRF, SSRF: главная защита от каждой атаки?",
    },
    back: {
      en: "- **Injection**: parameterized queries; allowlists for identifiers.\n- **XSS**: context-aware output encoding, HTML sanitization, plus a Content Security Policy.\n- **CSRF**: `SameSite` cookies, rejecting cross-site requests via `Sec-Fetch-Site`, and never changing state on GET.\n- **SSRF** (webhooks, link previews): resolve the host, block private and link-local ranges, send traffic through an egress proxy.",
      ru: "- **Инъекции**: параметризованные запросы; списки разрешённых значений для идентификаторов.\n- **XSS**: кодирование вывода с учётом контекста, санитизация HTML и Content Security Policy.\n- **CSRF**: cookie с `SameSite`, отказ кросс-сайтовым запросам по `Sec-Fetch-Site` и никаких изменений состояния через GET.\n- **SSRF** (вебхуки, превью ссылок): разрешить имя хоста, блокировать приватные и link-local диапазоны, пускать трафик через исходящий прокси.",
    },
  },

  // ---------------------------------------------------------------- numbers
  {
    id: 'num-cpu-memory',
    section: 'numbers',
    link: '/reference/latency-numbers/',
    front: {
      en: "Typical latency of an L1 cache hit, an L2 hit and a main memory (DRAM) reference?",
      ru: "Типичная задержка попадания в кэш L1, в L2 и обращения к оперативной памяти (DRAM)?",
    },
    back: {
      en: "L1 about **1 ns**, L2 about **3.5 ns**, DRAM about **100 ns** (70 ns on a DDR5 desktop, 110–130 ns on many-core servers).\nThey have barely changed since 2012, because clock speeds stopped at 3–6 GHz and cache latency is a fixed number of cycles. Memory bandwidth grew; latency did not.",
      ru: "L1 — около **1 нс**, L2 — около **3,5 нс**, DRAM — около **100 нс** (70 нс на настольном DDR5, 110–130 нс на многоядерных серверах).\nС 2012 года они почти не изменились: частоты остановились на 3–6 ГГц, а задержка кэша — фиксированное число тактов. Выросла пропускная способность памяти, а не задержка.",
    },
  },
  {
    id: 'num-nvme-vs-network',
    section: 'numbers',
    link: '/reference/latency-numbers/',
    front: {
      en: "Random 4 KB read from NVMe vs a round trip inside an availability zone: which is faster?",
      ru: "Случайное чтение 4 КБ с NVMe или сетевой круг внутри зоны доступности: что быстрее?",
    },
    back: {
      en: "The NVMe read: about **50 µs** at queue depth 1, against about **200 µs** for a same-zone round trip.\nIn 2012 a network round trip beat a disk seek by twenty times. Today a local NVMe read is cheaper than a network hop, so a remote cache earns its place when it saves a query, computation or a cross-region trip, not just a disk read.",
      ru: "Чтение с NVMe: около **50 мкс** при глубине очереди 1 против примерно **200 мкс** на сетевой круг внутри зоны.\nВ 2012 году сетевой круг был в двадцать раз быстрее позиционирования головки диска. Сегодня локальное чтение с NVMe дешевле сетевого перехода, поэтому удалённый кэш оправдан, когда экономит запрос, вычисление или межрегиональный круг, а не просто чтение с диска.",
    },
  },
  {
    id: 'num-network-rtt',
    section: 'numbers',
    link: '/reference/latency-numbers/',
    front: {
      en: "Round-trip times: within a zone, between zones, US East ↔ Western Europe, California ↔ Netherlands, the other side of the world?",
      ru: "Круговые задержки: внутри зоны, между зонами, Восток США ↔ Западная Европа, Калифорния ↔ Нидерланды, другая сторона планеты?",
    },
    back: {
      en: "- Within a zone: ~200 µs (about 5,000 sequential trips per second)\n- Between zones: ~1 ms (~1,000/s)\n- US East ↔ Western Europe: ~80 ms (~12/s)\n- California ↔ Netherlands: ~145 ms (~7/s)\n- Other side of the world: ~280 ms (3–4/s)\nLight in fibre covers about 200 km per ms, so sequential cross-region calls are the most expensive part of most requests.",
      ru: "- Внутри зоны: ~200 мкс (около 5000 последовательных кругов в секунду)\n- Между зонами: ~1 мс (~1000/с)\n- Восток США ↔ Западная Европа: ~80 мс (~12/с)\n- Калифорния ↔ Нидерланды: ~145 мс (~7/с)\n- Другая сторона планеты: ~280 мс (3–4/с)\nСвет в оптоволокне проходит около 200 км за мс, поэтому последовательные межрегиональные вызовы — самая дорогая часть большинства запросов.",
    },
  },
  {
    id: 'num-disks',
    section: 'numbers',
    link: '/reference/latency-numbers/',
    front: {
      en: "How fast are hard disks, NVMe drives and cloud block volumes?",
      ru: "Насколько быстры жёсткие диски, NVMe и облачные блочные тома?",
    },
    back: {
      en: "- HDD random read (seek + rotation): ~**10 ms**, so only about 100 random IOPS per drive; 1 MB sequential ~5 ms.\n- NVMe: 1 MB sequential ~100 µs (7 GB/s on PCIe 4, 14 GB/s on PCIe 5), ten times the 2012 SSD.\n- Network-attached cloud block volume I/O: ~**1 ms**, ten times a local NVMe drive, because every I/O crosses the network.",
      ru: "- Случайное чтение с HDD (позиционирование + оборот): ~**10 мс**, поэтому всего около 100 случайных IOPS на диск; 1 МБ последовательно — ~5 мс.\n- NVMe: 1 МБ последовательно — ~100 мкс (7 ГБ/с на PCIe 4, 14 ГБ/с на PCIe 5), в десять раз быстрее SSD 2012 года.\n- Ввод-вывод облачного блочного тома по сети: ~**1 мс**, в десять раз медленнее локального NVMe: каждый запрос идёт по сети.",
    },
  },
  {
    id: 'num-services',
    section: 'numbers',
    link: '/reference/latency-numbers/',
    front: {
      en: "Typical latency of a Redis/Valkey GET, an indexed PostgreSQL query, a TLS 1.3 handshake and an object storage GET?",
      ru: "Типичная задержка GET в Redis/Valkey, запроса к PostgreSQL по индексу, рукопожатия TLS 1.3 и GET из объектного хранилища?",
    },
    back: {
      en: "- Redis/Valkey GET in the same zone: ~**250 µs**; the server needs well under 1 µs, the rest is the network.\n- Indexed PostgreSQL query over the network: ~**500 µs** (19 µs over a Unix socket).\n- TLS 1.3 handshake within a region: ~**1 ms**.\n- Object storage first byte: ~**30 ms** median, with a tail to 200 ms.\nAll of them are dominated by the round trip, so fewer round trips beat faster servers.",
      ru: "- GET в Redis/Valkey в той же зоне: ~**250 мкс**; серверу нужно намного меньше 1 мкс, остальное — сеть.\n- Запрос к PostgreSQL по индексу через сеть: ~**500 мкс** (19 мкс через Unix-сокет).\n- Рукопожатие TLS 1.3 в пределах региона: ~**1 мс**.\n- Первый байт из объектного хранилища: медиана ~**30 мс**, хвост до 200 мс.\nВсё это определяется сетевым кругом, поэтому меньше кругов лучше, чем более быстрые серверы.",
    },
  },
  {
    id: 'num-dns',
    section: 'numbers',
    link: '/reference/latency-numbers/',
    front: {
      en: "How long does a DNS lookup take with and without a resolver cache hit?",
      ru: "Сколько длится DNS-запрос при попадании в кэш резолвера и при промахе?",
    },
    back: {
      en: "Resolver cache hit: ~**10 ms**, roughly one round trip to the resolver (under 1 ms inside a cloud VPC, 5–30 ms from home or mobile networks).\nCache miss with full recursion: ~**100 ms**, about 130 ms on average when servers answer, 300–400 ms with timeouts and retries. OS and browser caches answer in microseconds.",
      ru: "Попадание в кэш резолвера: ~**10 мс**, примерно один сетевой круг до резолвера (меньше 1 мс внутри облачной VPC, 5–30 мс из домашних и мобильных сетей).\nПромах с полной рекурсией: ~**100 мс** — в среднем около 130 мс, если серверы отвечают, и 300–400 мс с тайм-аутами и повторами. Кэши ОС и браузера отвечают за микросекунды.",
    },
  },
  {
    id: 'num-nines',
    section: 'numbers',
    link: '/reference/availability-numbers/',
    front: {
      en: "How much downtime do 99.9%, 99.99% and 99.999% allow per year and per month?",
      ru: "Сколько простоя допускают 99,9%, 99,99% и 99,999% в год и в месяц?",
    },
    back: {
      en: "- 99.9%: **8 h 46 min** a year, 43 min 50 s a month. A human can be paged and roll back.\n- 99.99%: **52 min 36 s** a year, 4 min 23 s a month. Detection and failover must be automatic.\n- 99.999%: **5 min 16 s** a year, 26 s a month. No single global dependency.\nEach extra nine divides the budget by ten and costs roughly ten times the effort.",
      ru: "- 99,9%: **8 ч 46 мин** в год, 43 мин 50 с в месяц. Дежурного можно вызвать, и он успеет откатить.\n- 99,99%: **52 мин 36 с** в год, 4 мин 23 с в месяц. Обнаружение и переключение — только автоматические.\n- 99,999%: **5 мин 16 с** в год, 26 с в месяц. Никаких глобальных единых зависимостей.\nКаждая девятка делит бюджет на десять и стоит примерно в десять раз больше усилий.",
    },
  },
  {
    id: 'num-mttr',
    section: 'numbers',
    link: '/reference/availability-numbers/',
    front: {
      en: "How do failure rate and recovery time determine availability?",
      ru: "Как частота отказов и время восстановления определяют доступность?",
    },
    back: {
      en: "`A = MTBF / (MTBF + MTTR)`. A component that fails once a month and takes 30 minutes to recover is about 99.93% available; cutting recovery to 5 minutes raises it to 99.99% without making failures any rarer.\nThat is why high-availability work focuses on fast detection and recovery: health checks, automatic failover, quick rollbacks, small blast radii.",
      ru: "`A = MTBF / (MTBF + MTTR)`. Компонент, который отказывает раз в месяц и восстанавливается 30 минут, доступен примерно на 99,93%; сокращение восстановления до 5 минут поднимает доступность до 99,99%, хотя отказы не стали реже.\nПоэтому работа над высокой доступностью — это быстрое обнаружение и восстановление: проверки здоровья, автоматическое переключение, быстрые откаты, небольшой радиус поражения.",
    },
  },
  {
    id: 'num-powers-of-two',
    section: 'numbers',
    link: '/reference/powers-of-two/',
    front: {
      en: "Which powers of two should you know for estimates?",
      ru: "Какие степени двойки нужно знать для прикидок?",
    },
    back: {
      en: "- 2¹⁰ ≈ 10³: every ten powers add about three zeros, so 2²⁰ ≈ a million, 2³⁰ ≈ a billion, 2⁴⁰ ≈ a trillion.\n- 2³² ≈ 4.3 billion: IPv4 addresses, unsigned 32-bit integers.\n- 2³¹ − 1 ≈ 2.1 billion: the classic signed-integer overflow.\n- 2⁶⁴ ≈ 1.8 × 10¹⁹: does not run out at web scale.",
      ru: "- 2¹⁰ ≈ 10³: каждые десять степеней добавляют примерно три нуля, так что 2²⁰ ≈ миллион, 2³⁰ ≈ миллиард, 2⁴⁰ ≈ триллион.\n- 2³² ≈ 4,3 млрд: адреса IPv4, беззнаковые 32-битные целые.\n- 2³¹ − 1 ≈ 2,1 млрд: классическое переполнение знакового целого.\n- 2⁶⁴ ≈ 1,8 × 10¹⁹: в веб-масштабе не заканчивается.",
    },
  },
  {
    id: 'num-units',
    section: 'numbers',
    link: '/reference/powers-of-two/',
    front: {
      en: "KB vs KiB, and bits vs bytes: what are the traps?",
      ru: "КБ и КиБ, биты и байты: в чём ловушки?",
    },
    back: {
      en: "**KB, MB, GB** are powers of 1,000; **KiB, MiB, GiB** are powers of 1,024. The gap grows from 2.4% at kilo to 10% at tera, which is why a “1 TB” disk shows up as 931 GB.\nNetwork bandwidth is quoted in **bits** per second, storage in **bytes**: a 10 Gbit/s link moves about 1 GB/s of payload. Mixing bits and bytes is the more common slip.",
      ru: "**КБ, МБ, ГБ** — степени 1000; **КиБ, МиБ, ГиБ** — степени 1024. Разница растёт от 2,4% на «кило» до 10% на «тера», поэтому диск на «1 ТБ» показывается как 931 ГБ.\nПропускную способность сети указывают в **битах** в секунду, объём хранилища — в **байтах**: канал 10 Гбит/с переносит около 1 ГБ/с полезных данных. Путаница битов и байтов — более частая ошибка.",
    },
  },
  {
    id: 'num-daily-to-rate',
    section: 'numbers',
    link: '/start/estimation/',
    front: {
      en: "Convert 1 million, 100 million and 1 billion requests per day into requests per second.",
      ru: "Переведите 1 млн, 100 млн и 1 млрд запросов в сутки в запросы в секунду.",
    },
    back: {
      en: "A day is 86,400 s ≈ 10⁵ s.\n- 1 million/day ≈ **12/s**\n- 100 million/day ≈ **1,000/s**\n- 1 billion/day ≈ **12,000/s**\nThen find the peak: typically 2–3× the daily average, up to 10× for launches. Size servers for the peak and storage for the average.",
      ru: "Сутки — 86 400 с ≈ 10⁵ с.\n- 1 млн в сутки ≈ **12/с**\n- 100 млн в сутки ≈ **1000/с**\n- 1 млрд в сутки ≈ **12 000/с**\nЗатем найдите пик: обычно 2–3× от среднего за сутки, до 10× на запусках. Серверы считают по пику, хранилище — по среднему.",
    },
  },
  {
    id: 'num-machine-capacity',
    section: 'numbers',
    link: '/start/estimation/',
    front: {
      en: "Roughly what can one machine handle in 2026?",
      ru: "Сколько примерно выдерживает одна машина в 2026 году?",
    },
    back: {
      en: "- Stateless web or API server: 1,000–10,000 requests/s.\n- PostgreSQL or MySQL primary on a large instance: 10,000+ simple writes/s, 50,000+ indexed reads/s, tens of TB.\n- Valkey or Redis node: 100,000+ operations/s.\n- Kafka-style broker: hundreds of MB/s of writes.\n- Server memory 256 GB – 2 TB; network port 25–100 Gbit/s.",
      ru: "- Stateless веб- или API-сервер: 1000–10 000 запросов/с.\n- Основной узел PostgreSQL или MySQL на крупном инстансе: 10 000+ простых записей/с, 50 000+ чтений по индексу в секунду, десятки ТБ.\n- Узел Valkey или Redis: 100 000+ операций/с.\n- Брокер в стиле Kafka: сотни МБ/с на запись.\n- Память сервера 256 ГБ – 2 ТБ; сетевой порт 25–100 Гбит/с.",
    },
  },
  {
    id: 'num-photo-estimate',
    section: 'numbers',
    link: '/start/estimation/',
    front: {
      en: "Photo sharing: 20 M daily users, a 2 MB photo every other day, 50 views each. What dominates the design?",
      ru: "Фотохостинг: 20 млн пользователей в сутки, фото на 2 МБ раз в два дня, 50 просмотров на фото. Что определяет дизайн?",
    },
    back: {
      en: "Request rates are modest (about 120 uploads/s and 6,000 views/s), but **egress and storage dominate**: about 90 Gbit/s of views (370 Gbit/s at peak) and about 7 PB of new data a year, 220 PB over ten years with three copies.\nSo: a CDN in front, object storage with erasure coding and colder tiers, and metadata as a separate, much smaller problem.",
      ru: "Частота запросов умеренная (около 120 загрузок/с и 6000 просмотров/с), но **исходящий трафик и хранение доминируют**: около 90 Гбит/с на просмотры (370 Гбит/с в пик) и около 7 ПБ новых данных в год, 220 ПБ за десять лет при трёх копиях.\nЗначит: CDN впереди, объектное хранилище с помехоустойчивым кодированием (erasure coding) и холодными классами, а метаданные — отдельная, гораздо меньшая задача.",
    },
  },

  // ---------------------------------------------------------------- interview framework
  {
    id: 'int-seven-steps',
    section: 'interview',
    link: '/start/interview-framework/',
    front: {
      en: "What are the seven steps of the system design interview framework?",
      ru: "Какие семь шагов у схемы ответа на собеседовании по системному дизайну?",
    },
    back: {
      en: "1. Clarify requirements.\n2. Estimate.\n3. Define the API and data model.\n4. Sketch the high-level design.\n5. Deep-dive into one or two components.\n6. Scale it and break it: bottlenecks, failures, trade-offs.\n7. Wrap up against the requirements.",
      ru: "1. Уточнить требования.\n2. Прикинуть цифры.\n3. Описать API и модель данных.\n4. Набросать высокоуровневый дизайн.\n5. Углубиться в один-два компонента.\n6. Масштабировать и ломать: узкие места, отказы, компромиссы.\n7. Подвести итог относительно требований.",
    },
  },
  {
    id: 'int-time-budget',
    section: 'interview',
    link: '/start/interview-framework/',
    front: {
      en: "How do you budget time in a 45-minute design interview?",
      ru: "Как распределить время на 45-минутном собеседовании по дизайну?",
    },
    back: {
      en: "About 40 minutes of design time: requirements 4, estimates 3, API and data model 4, high-level design 10, deep dives 11, scaling and failures 6, wrap-up 2.\nCheckpoint: by the halfway mark a complete high-level design should be on the board. If you are still on requirements at minute 15, state your assumptions and move on.",
      ru: "Около 40 минут на дизайн: требования — 4, оценки — 3, API и модель данных — 4, высокоуровневый дизайн — 10, углубление — 11, масштабирование и отказы — 6, итог — 2.\nКонтрольная точка: к середине на доске должен быть полный высокоуровневый дизайн. Если на 15-й минуте вы ещё на требованиях, назовите допущения и идите дальше.",
    },
  },
  {
    id: 'int-requirements',
    section: 'interview',
    link: '/start/interview-framework/',
    front: {
      en: "Functional vs non-functional requirements: how do you capture them?",
      ru: "Функциональные и нефункциональные требования: как их фиксировать?",
    },
    back: {
      en: "**Functional**: what the system does — agree on three to five core use cases and explicitly park the rest.\n**Non-functional**: how well it does it — as numbers, not adjectives: “p99 under 200 ms”, “99.99% for redirects”, “no lost links”.\nAsk about users, scale, read/write ratio, data size, latency, consistency, geography and constraints. If told “you decide”, decide out loud.",
      ru: "**Функциональные**: что делает система — договоритесь о трёх–пяти основных сценариях и явно отложите остальные.\n**Нефункциональные**: насколько хорошо — числами, а не прилагательными: «p99 меньше 200 мс», «99,99% для редиректов», «ни одна ссылка не теряется».\nСпросите о пользователях, масштабе, соотношении чтения и записи, объёме данных, задержке, согласованности, географии и ограничениях. Если говорят «решайте сами» — решайте вслух.",
    },
  },
  {
    id: 'int-estimates-conclusion',
    section: 'interview',
    link: '/start/estimation/',
    front: {
      en: "What makes a back-of-the-envelope estimate useful in an interview?",
      ru: "Что делает прикидочный расчёт полезным на собеседовании?",
    },
    back: {
      en: "A **conclusion**. “About 3,500 reads a second at peak, so one database with a cache is enough”; “220 PB, so object storage with tiering.”\nState assumptions first, keep units on every number, size for the peak, count replicas and overhead, round to one significant figure. A table of numbers without “so we need X” is half an answer.",
      ru: "**Вывод**. «В пике около 3500 чтений в секунду — значит, хватит одной базы с кэшем»; «220 ПБ — значит, объектное хранилище с классами хранения».\nСначала назовите допущения, пишите единицы у каждого числа, считайте по пику, учитывайте реплики и накладные расходы, округляйте до одной значащей цифры. Таблица чисел без «значит, нам нужно X» — половина ответа.",
    },
  },
  {
    id: 'int-deep-dive',
    section: 'interview',
    link: '/start/interview-framework/',
    front: {
      en: "How do you run a deep dive, and what do you stress-test afterwards?",
      ru: "Как вести углубление и что проверять на прочность после него?",
    },
    back: {
      en: "Pick one or two components where the requirements are hardest (uniqueness, a hot path, consistency, data growth). Lay out two or three options, compare them against the written requirements, pick one and say what you give up.\nThen, component by component: what breaks first at 10× load, and what happens when it fails? Name the fixes and their costs.",
      ru: "Выберите один-два компонента, где требования выполнить труднее всего (уникальность, горячий путь, согласованность, рост данных). Предложите два-три варианта, сравните их с записанными требованиями, выберите один и скажите, чем жертвуете.\nЗатем по каждому компоненту: что сломается первым при 10× нагрузке и что будет при его отказе? Назовите решения и их цену.",
    },
  },
  {
    id: 'int-mistakes',
    section: 'interview',
    link: '/start/interview-framework/',
    front: {
      en: "Name the most common mistakes in system design interviews.",
      ru: "Назовите самые частые ошибки на собеседовании по системному дизайну.",
    },
    back: {
      en: "- Jumping to the diagram before requirements and scale.\n- Over-engineering: microservices, Kafka and five databases for a one-server problem.\n- Buzzwords without saying what they do here and cost.\n- Estimates that are never used.\n- No trade-offs and no answer to “what if this node dies?”\n- Going deep too early, monologuing, losing track of time.",
      ru: "- Рисовать схему до требований и масштаба.\n- Переусложнять: микросервисы, Kafka и пять баз для задачи на один сервер.\n- Модные слова без объяснения, что они делают здесь и чего стоят.\n- Оценки, которые потом не используются.\n- Ни компромиссов, ни ответа на «а если этот узел умрёт?»\n- Слишком раннее углубление, монолог, потеря счёта времени.",
    },
  },
  {
    id: 'int-senior-signals',
    section: 'interview',
    link: '/start/interview-framework/',
    front: {
      en: "What separates a senior performance from a mid-level one?",
      ru: "Чем ответ уровня senior отличается от ответа уровня middle?",
    },
    back: {
      en: "**Mid-level**: drives with some help and produces a working end-to-end design with standard components.\n**Senior**: drives the whole interview, lets numbers justify choices, goes deep on the hardest component, raises bottlenecks and failure modes before being asked, and compares alternatives with clear trade-offs.\n**Staff+**: also frames or challenges the problem and covers operations, cost, migration and when not to build.",
      ru: "**Middle**: ведёт разговор с небольшой помощью и строит работающий сквозной дизайн из стандартных компонентов.\n**Senior**: сам ведёт всё собеседование, обосновывает решения цифрами, глубоко разбирает самый сложный компонент, сам поднимает узкие места и сценарии отказов и сравнивает альтернативы с ясными компромиссами.\n**Staff и выше**: вдобавок формулирует или оспаривает задачу и обсуждает эксплуатацию, стоимость, миграцию и то, когда строить не нужно.",
    },
  },

  // ---------------------------------------------------------------- case studies
  {
    id: 'prac-short-keys',
    section: 'practice',
    link: '/practice/url-shortener-pastebin/',
    front: {
      en: "URL shortener: how do you generate short keys?",
      ru: "Сокращатель ссылок: как генерировать короткие ключи?",
    },
    back: {
      en: "Default: a **random 7–8 character Base62 key** plus an atomic “insert if absent”; on conflict, draw again. 62⁷ ≈ 3.5 × 10¹², so with 360 M keys only about 1 insert in 9,800 retries — but the retry path is mandatory.\nFor the shortest keys, lease counter ranges and pass them through a scrambling permutation, because raw counters are enumerable.",
      ru: "По умолчанию — **случайный ключ Base62 из 7–8 символов** плюс атомарная вставка «только если нет»; при конфликте — новая попытка. 62⁷ ≈ 3,5 × 10¹², так что при 360 млн ключей повтор нужен примерно одной вставке из 9800, но путь повтора обязателен.\nДля самых коротких ключей — арендуемые диапазоны счётчика с перемешивающей перестановкой: голый счётчик можно перебрать.",
    },
  },
  {
    id: 'prac-301-302',
    section: 'practice',
    link: '/practice/url-shortener-pastebin/',
    front: {
      en: "URL shortener: 301 or 302 redirect?",
      ru: "Сокращатель ссылок: редирект 301 или 302?",
    },
    back: {
      en: "**301** is cacheable by default, so repeat clicks may never reach you: less load, but lost analytics, and a takedown doesn't reach browsers that cached it.\n**302** brings every click back: accurate counts, editable links and instant takedown of a phishing link, at the cost of serving every repeat visit. A middle ground is a 301 with a short `max-age`.",
      ru: "**301** кэшируется по умолчанию, поэтому повторные клики могут до вас не дойти: меньше нагрузки, но теряется аналитика, а блокировка не дойдёт до браузеров с кэшем.\n**302** возвращает к вам каждый клик: точные счётчики, редактируемые ссылки и мгновенная блокировка фишинга ценой обслуживания каждого повторного визита. Компромисс — 301 с коротким `max-age`.",
    },
  },
  {
    id: 'prac-fanout',
    section: 'practice',
    link: '/practice/twitter-timeline/',
    front: {
      en: "Twitter home timeline: fan-out on write or fan-out on read?",
      ru: "Домашняя лента Twitter: рассылка при записи или при чтении?",
    },
    back: {
      en: "**Hybrid.** Push an ordinary user's tweet ID into each active follower's cached timeline (about 800 IDs per user); reads are one list fetch plus a multiget. **Pull** tweets from accounts with millions of followers and merge them at read time.\nWhy: reads outnumber tweets about 17×, so push is cheaper overall, but one celebrity tweet would mean 5 M inserts.",
      ru: "**Гибрид.** ID твита обычного пользователя добавляется в закэшированную ленту каждого активного подписчика (около 800 ID на пользователя); чтение — одна выборка списка и multiget. Твиты аккаунтов с миллионами подписчиков **подтягиваются** и вливаются при чтении.\nПочему: чтений примерно в 17 раз больше, чем твитов, поэтому push в целом дешевле, но один твит знаменитости — это 5 млн вставок.",
    },
  },
  {
    id: 'prac-twitter-search',
    section: 'practice',
    link: '/practice/twitter-timeline/',
    front: {
      en: "Twitter search: how do you partition the inverted index?",
      ru: "Поиск в Twitter: как разделить инвертированный индекс?",
    },
    back: {
      en: "By **document** (tweet ID), not by term: term sharding sends every popular term to one hot shard and makes multi-term queries cross shards.\nEach query scatters to all shards in the relevant time tiers (an in-memory realtime tier, older tiers on SSD), takes the top K per shard, merges, re-ranks and hydrates. An indexer fed from the tweet stream keeps it fresh.",
      ru: "По **документам** (ID твита), а не по терминам: при шардировании по терминам каждый популярный термин попадает в один горячий шард, а запросы из нескольких слов ходят между шардами.\nКаждый запрос рассылается во все шарды нужных временных слоёв (свежий слой в памяти, старые на SSD), берёт top-K с каждого, объединяет, переранжирует и гидратирует. Свежесть обеспечивает индексатор, читающий поток твитов.",
    },
  },
  {
    id: 'prac-crawler-frontier',
    section: 'practice',
    link: '/practice/web-crawler/',
    front: {
      en: "Web crawler: how does the URL frontier keep both priority and politeness?",
      ru: "Веб-краулер: как очередь URL (frontier) сочетает приоритет и вежливость?",
    },
    back: {
      en: "**Front queues** hold URLs by priority; a selector routes them to **back queues**, one per host; a **heap** keyed by “earliest time this host may be contacted” picks the next host.\nIf each host gets one request about every 10 s, sustaining 1,650 fetches/s needs at least 16,500 hosts with queued work. Respect robots.txt (RFC 9309), cached up to 24 hours.",
      ru: "**Передние очереди** держат URL по приоритету; селектор раскладывает их по **задним очередям**, по одной на хост; **куча**, упорядоченная по «самому раннему времени, когда к хосту можно обратиться», выбирает следующий хост.\nЕсли каждый хост получает запрос примерно раз в 10 с, то для 1650 загрузок/с нужно не меньше 16 500 хостов с ожидающей работой. Соблюдайте robots.txt (RFC 9309) и кэшируйте его не дольше 24 часов.",
    },
  },
  {
    id: 'prac-crawler-dedup',
    section: 'practice',
    link: '/practice/web-crawler/',
    front: {
      en: "Web crawler: how do you deduplicate URLs and content?",
      ru: "Веб-краулер: как убирать дубли URL и содержимого?",
    },
    back: {
      en: "**URLs**, before they enter the frontier: normalise, then check a “seen” set or a Bloom filter (about 12 GB for 10 B URLs at 1% false positives, which only skips a few new URLs).\n**Content**, after fetching: an exact hash for identical bodies, and **SimHash** for near-duplicates — 64-bit fingerprints within Hamming distance 3, found with the block trick.",
      ru: "**URL** — до попадания во frontier: нормализовать и проверить по множеству «уже видели» или фильтру Блума (около 12 ГБ на 10 млрд URL при 1% ложных срабатываний, из-за которых пропускается лишь немного новых URL).\n**Содержимое** — после загрузки: точный хеш для одинаковых тел и **SimHash** для почти-дублей — 64-битные отпечатки с расстоянием Хэмминга не больше 3, которые ищут приёмом с блоками.",
    },
  },
  {
    id: 'prac-social-bfs',
    section: 'practice',
    link: '/practice/social-graph/',
    front: {
      en: "Social graph: how do you find the shortest path between two users at scale?",
      ru: "Социальный граф: как найти кратчайший путь между двумя пользователями в большом масштабе?",
    },
    back: {
      en: "**Bidirectional BFS**, always expanding the smaller frontier. With 50 friends each, a path of length 4 touches about 5,000 nodes instead of about 6 million.\nAdjacency lists live in memory on person servers sharded by user ID. Fetch each BFS level with one batched call per shard, in parallel, so round trips equal the depth (about 4), not the number of friends.",
      ru: "**Двунаправленный BFS**, всегда расширяющий меньший фронт. При 50 друзьях путь длины 4 затрагивает около 5000 вершин вместо примерно 6 млн.\nСписки смежности лежат в памяти person-серверов, шардированных по ID пользователя. Каждый уровень BFS загружается одним пакетным вызовом на шард, параллельно, так что сетевых кругов столько, какова глубина (около 4), а не сколько друзей.",
    },
  },
  {
    id: 'prac-query-cache',
    section: 'practice',
    link: '/practice/search-query-cache/',
    front: {
      en: "Search query cache: what goes into the key, and how do results stay fresh?",
      ru: "Кэш поисковых запросов: что входит в ключ и как результаты остаются свежими?",
    },
    back: {
      en: "Key: the **normalised query plus everything that changes the page** — locale, safe-search, page number, index version. Leaving one out serves the wrong results.\nFreshness: a TTL with jitter plus the **index version in the key**, so a new snapshot gives new keys and old entries age out. Shard with consistent hashing, keep a local tier for the hottest queries, and coalesce misses.",
      ru: "Ключ — **нормализованный запрос и всё, что меняет страницу выдачи**: локаль, безопасный поиск, номер страницы, версия индекса. Пропуск любого из них отдаёт чужие результаты.\nСвежесть — TTL с разбросом и **версия индекса в ключе**: новый снимок даёт новые ключи, а старые записи вытесняются со временем. Шардирование консистентным хешированием, локальный уровень для самых горячих запросов и объединение промахов.",
    },
  },
  {
    id: 'prac-sales-rank',
    section: 'practice',
    link: '/practice/sales-rank/',
    front: {
      en: "Sales rank by category: how do you compute and serve top-N lists?",
      ru: "Рейтинг продаж по категориям: как считать и отдавать списки top-N?",
    },
    back: {
      en: "Sales events go to a durable log; checkout never waits for ranking. Count units per `(category, product)` over a sliding 7-day window — an hourly batch job classically, a windowed stream job today — and keep a **bounded heap per category**, not a global sort.\nThe read side is tiny (top 100 × 1,000 categories ≈ 1.6 MB): publish versioned snapshots and cache them in memory and at the CDN.",
      ru: "События продаж идут в надёжный журнал; оформление заказа не ждёт рейтинга. Проданные единицы по паре `(категория, товар)` считаются в скользящем 7-дневном окне — классически ежечасной пакетной задачей, сегодня оконной потоковой — с **ограниченной кучей на категорию**, а не глобальной сортировкой.\nСторона чтения крошечная (top-100 × 1000 категорий ≈ 1,6 МБ): публикуем версионированные снимки и кэшируем их в памяти и на CDN.",
    },
  },
  {
    id: 'prac-mint',
    section: 'practice',
    link: '/practice/personal-finance-mint/',
    front: {
      en: "Personal finance tracker: how do you ingest bank transactions without duplicates or lost data?",
      ru: "Трекер личных финансов: как загружать банковские транзакции без дублей и потерь?",
    },
    back: {
      en: "Store only a consented token, encrypted in a vault — never the bank password. A scheduler and provider webhooks feed a job queue; sync workers pull incremental changes **by cursor** and **upsert** on a unique provider transaction ID, saving the cursor in the same transaction.\nA circuit breaker per institution keeps a 6-hour bank outage contained; money is integer cents, never floats.",
      ru: "Храним только токен согласия, зашифрованный в хранилище секретов, — никогда не пароль от банка. Планировщик и вебхуки провайдера кладут задания в очередь; воркеры забирают изменения **по курсору** и делают **upsert** по уникальному ID транзакции провайдера, сохраняя курсор в той же транзакции.\nПредохранитель на каждый банк локализует его 6-часовой простой; деньги — целые копейки, никогда не float.",
    },
  },
  {
    id: 'prac-scaling-order',
    section: 'practice',
    link: '/practice/scaling-to-millions/',
    front: {
      en: "Scaling a web app from one box to millions of users: in what order?",
      ru: "Масштабирование веб-приложения от одного сервера до миллионов пользователей: в каком порядке?",
    },
    back: {
      en: "It is a loop: load test → profile → fix the top bottleneck → repeat. The usual order:\n1. Separate the database.\n2. Stateless app tier behind a load balancer.\n3. Cache and read replicas.\n4. Object storage and a CDN for static content.\n5. Queues and async workers.\n6. Then partition data and go multi-region.\nName what each step buys and costs.",
      ru: "Это цикл: нагрузочный тест → профилирование → устранение главного узкого места → повтор. Обычный порядок:\n1. Вынести базу данных.\n2. Stateless-слой приложения за балансировщиком.\n3. Кэш и реплики для чтения.\n4. Объектное хранилище и CDN для статики.\n5. Очереди и асинхронные воркеры.\n6. Затем разделение данных и несколько регионов.\nНазывайте, что даёт и чего стоит каждый шаг.",
    },
  },
  {
    id: 'prac-core-difficulty',
    section: 'practice',
    link: '/practice/more-questions/',
    front: {
      en: "How do you approach an unfamiliar design question?",
      ru: "Как подходить к незнакомой задаче по дизайну?",
    },
    back: {
      en: "Find its **one core difficulty** — fan-out, ordering, hot keys, exactly-once or geography — in the first five minutes, and spend most of the interview there.\nUse the framework: requirements, estimates, high-level design, deep dive, scaling. Read reference architectures only after sketching your own answer, and compare trade-offs rather than copying a company's design.",
      ru: "Найдите её **ключевую трудность** — рассылку по подписчикам, порядок, горячие ключи, exactly-once или географию — за первые пять минут и проведите там большую часть собеседования.\nИдите по схеме: требования, оценки, высокоуровневый дизайн, углубление, масштабирование. Чужие архитектуры читайте только после собственного наброска и сравнивайте компромиссы, а не копируйте решения компаний.",
    },
  },

  // ---------------------------------------------------------------- object-oriented design
  {
    id: 'ood-hash-map',
    section: 'ood',
    link: '/ood/hash-map/',
    front: {
      en: "Hash map: how do you keep operations O(1) on average?",
      ru: "Хеш-таблица: как сохранить операции за O(1) в среднем?",
    },
    back: {
      en: "Buckets indexed by `hash(key) % capacity`, each a short list of entries (separate chaining). Keep the **load factor** (`size / capacity`) under 0.75; when it goes over, **double** the array and rehash every entry. Doubling means each entry moves a constant number of times on average, so inserts are amortised `O(1)`.\nWorst case is `O(n)` when all keys collide; defences are randomised hashing (SipHash) or tree-ified buckets.",
      ru: "Корзины с индексом `hash(key) % capacity`, каждая — короткий список записей (метод цепочек). **Коэффициент заполнения** (`size / capacity`) держим ниже 0,75; при превышении массив **удваивается**, а все записи перехешируются. Благодаря удвоению каждая запись в среднем переезжает константное число раз, и вставка амортизированно `O(1)`.\nХудший случай — `O(n)`, когда все ключи совпали по корзине; защита — рандомизированный хеш (SipHash) или корзины-деревья.",
    },
  },
  {
    id: 'ood-lru',
    section: 'ood',
    link: '/ood/lru-cache/',
    front: {
      en: "LRU cache: which data structures, and what is the key trick?",
      ru: "LRU-кэш: какие структуры данных и в чём главный приём?",
    },
    back: {
      en: "A **dict** (key → node) for `O(1)` lookup plus a **doubly linked list** in recency order. `get` and `put` move the node to the head; eviction removes the tail.\nThe trick: each node stores **its own key**, so after unlinking the tail you can delete it from the dict in `O(1)`. Sentinel head and tail nodes remove the empty-list special cases.",
      ru: "**Словарь** (ключ → узел) для поиска за `O(1)` плюс **двусвязный список**, упорядоченный по свежести обращений. `get` и `put` переносят узел в голову, вытеснение снимает хвост.\nПриём: узел хранит **свой ключ**, поэтому после отцепления хвоста его можно за `O(1)` удалить из словаря. Узлы-ограничители в голове и хвосте убирают особые случаи пустого списка.",
    },
  },
  {
    id: 'ood-parking-lot',
    section: 'ood',
    link: '/ood/parking-lot/',
    front: {
      en: "Parking lot: how do you model “does this vehicle fit this spot?”",
      ru: "Парковка: как смоделировать «помещается ли машина на это место?»",
    },
    back: {
      en: "Make `Size` an **ordered** enum; then fitting is one comparison, `spot.size >= vehicle.size`, and vehicle subclasses carry only a size and the number of spots they need.\nSingle-spot vehicles take the **smallest** spot that fits (best fit), keeping large spots for buses; a bus needs 5 adjacent large spots in one row. `park` returns a `Ticket` that `leave` uses to free the spots.",
      ru: "`Size` — **упорядоченное** перечисление; тогда проверка — одно сравнение `spot.size >= vehicle.size`, а подклассы транспорта несут только размер и число нужных мест.\nТранспорт на одно место занимает **самое маленькое** подходящее место (best fit), сохраняя большие для автобусов; автобусу нужно 5 соседних больших мест в одном ряду. `park` возвращает `Ticket`, по которому `leave` освобождает места.",
    },
  },
  {
    id: 'ood-call-center',
    section: 'ood',
    link: '/ood/call-center/',
    front: {
      en: "Call center: how does escalation work without special routing code?",
      ru: "Колл-центр: как работает эскалация без отдельного кода маршрутизации?",
    },
    back: {
      en: "Each `Call` records the **minimum rank** allowed to take it (`OPERATOR < SUPERVISOR < DIRECTOR`). Escalation just **raises that minimum and dispatches the call again**, so one routing path handles new, escalated and queued calls.\nOnly `CallCenter` routes. With one FIFO queue per rank, a freed employee takes the waiting call needing the highest rank they have.",
      ru: "Каждый `Call` хранит **минимальный ранг**, которому его можно отдать (`OPERATOR < SUPERVISOR < DIRECTOR`). Эскалация лишь **повышает этот минимум и заново распределяет звонок**, так что один путь маршрутизации обслуживает новые, эскалированные и ожидающие звонки.\nМаршрутизирует только `CallCenter`. При FIFO-очереди на каждый ранг освободившийся сотрудник берёт ожидающий звонок самого высокого доступного ему ранга.",
    },
  },
  {
    id: 'ood-deck-of-cards',
    section: 'ood',
    link: '/ood/deck-of-cards/',
    front: {
      en: "Deck of cards: how do you model cards and score aces in blackjack?",
      ru: "Колода карт: как смоделировать карты и считать тузов в блэкджеке?",
    },
    back: {
      en: "`Card` is an immutable value (`rank`, `suit`, both enums) with no game logic; `Deck` builds, shuffles and deals; `Hand.score()` is overridden only in `BlackjackHand`.\nAces: count each as 1, then add 10 **once** if that doesn't bust. Two aces as 11 would be 22, so at most one ace can ever count high.",
      ru: "`Card` — неизменяемое значение (`rank`, `suit`, оба — перечисления) без игровой логики; `Deck` создаёт, тасует и раздаёт; `Hand.score()` переопределяется только в `BlackjackHand`.\nТузы: каждый считаем за 1, а потом **один раз** добавляем 10, если это не даёт перебора. Два туза по 11 — уже 22, поэтому «дорогим» может быть максимум один туз.",
    },
  },
  {
    id: 'ood-online-chat',
    section: 'ood',
    link: '/ood/online-chat/',
    front: {
      en: "Online chat: what keeps the object model consistent?",
      ru: "Онлайн-чат: что держит объектную модель согласованной?",
    },
    back: {
      en: "Entities refer to each other by **id**, not by object, so a friendship or membership changes in one place and the model maps directly to tables later. One `ChatService` owns everything and enforces cross-user rules.\nA private chat is keyed by the **unordered pair** of users (`frozenset`), so A→B and B→A find the same chat.",
      ru: "Сущности ссылаются друг на друга по **id**, а не по объекту: дружба или членство меняются в одном месте, а модель потом напрямую ложится на таблицы. Всем владеет один `ChatService`, который проверяет правила между пользователями.\nЛичный чат ищется по **неупорядоченной паре** пользователей (`frozenset`), поэтому A→B и B→A находят один и тот же чат.",
    },
  },
];

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ESC[c]);

/** One line of card text → HTML: escapes it, then renders `code`, **bold** and *italic*. */
export function inlineHtml(s: string): string {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\s][^*]*)\*/g, '<em>$1</em>');
}

/**
 * Card text → simple HTML. Lines starting with "- " become a bulleted list,
 * lines starting with "1. " a numbered one; other lines are paragraphs.
 * Shared by the component and the Anki export so both render the same.
 */
export function cardHtml(text: string): string {
  const out: string[] = [];
  let list: 'ul' | 'ol' | null = null;
  const close = () => {
    if (list) out.push(`</${list}>`);
    list = null;
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const bullet = line.match(/^- (.*)$/);
    const step = line.match(/^\d+\. (.*)$/);
    const kind = bullet ? 'ul' : step ? 'ol' : null;
    if (kind) {
      if (list !== kind) {
        close();
        out.push(`<${kind}>`);
        list = kind;
      }
      out.push(`<li>${inlineHtml((bullet ?? step)![1])}</li>`);
    } else {
      close();
      out.push(`<p>${inlineHtml(line)}</p>`);
    }
  }
  close();
  return out.join('');
}

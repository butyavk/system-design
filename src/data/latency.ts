// Latency numbers for the LatencyExplorer component and the
// /reference/latency-numbers/ page.
//
// All values are in nanoseconds. They are *typical, order-of-magnitude* figures
// for 2026-era hardware and cloud networks, not guarantees: `low`/`high` give the
// spread you will meet in practice. `value2012` is the classic "numbers every
// programmer should know" table (Jeff Dean / Peter Norvig, as published in the
// 2012 gist) where it has a comparable row.
//
// Research notes (2026-10-08):
// - CPU caches: L1D is 4–5 cycles on Zen 5, Lion Cove, Neoverse V2 and Xeon 6;
//   L2 is 11–16 cycles; L3 is ~9 ns (Zen 5 client) to ~33 ns (Xeon 6 mesh).
//   At 2.8–5.7 GHz that is ~0.7–1.8 ns for L1 and ~2.5–5.5 ns for L2.
// - DRAM: ~70 ns on a DDR5 desktop (Ryzen 9950X), 100+ ns on Arrow Lake,
//   114–131 ns on current server parts (Graviton 4, Turin, Xeon 6).
// - Branch mispredict: LLVM scheduling models use 13 cycles (Zen 4, "11 to 18")
//   and 14 cycles (Golden Cove) → ~3 ns at 4–5 GHz.
// - Mutex / thread wake-up: ~18 ns uncontended on Zen 4 (nazquadri.com);
//   9 ns lock+unlock and ~6–10 µs per thread hand-off measured for this page on a
//   2-vCPU cloud VM (Xeon @ 2.8 GHz, glibc, gcc -O2).
// - Compression: zstd -1 510 MB/s, LZ4 675 MB/s compress / 3,850 MB/s
//   decompress, Snappy 520 MB/s (zstd README, i7-9700K @ 4.9 GHz).
// - NVMe: Samsung 990 PRO (PCIe 4) is rated 22K IOPS at QD1 → ~45 µs per 4 KB
//   read; enterprise TLC drives sit around 60–100 µs; PCIe 5 drives read
//   ~14 GB/s sequentially (Samsung 9100 PRO measured 14.7 GB/s).
// - HDD: 7,200 rpm → 4.16 ms average rotational latency plus ~5–9 ms seek;
//   ~285 MB/s on outer tracks (Seagate Exos X24).
// - Network: wire time is arithmetic (bits / line rate). Same-AZ RTT in AWS is
//   "typically sub-millisecond" (300 µs p50 in AWS's own example; 50–260 µs
//   measured with netperf), cross-AZ ~1–1.5 ms. Inter-region medians from
//   Azure's round-trip statistics (30 days to 2026-07-30).
// - Services: Redis processes a GET in < 1 µs, the network dominates.
//   PostgreSQL PK lookup: 19 µs over a Unix socket, 0.42 ms over a LAN
//   (Cybertec, Dec 2025). S3 first byte: ~30 ms median measured (Durner et al.,
//   VLDB 2023); AWS plans for 100–200 ms; S3 Express One Zone single-digit ms.
//   DNS: cache misses average ~130 ms at Google Public DNS.

export type LatencyCategory = 'cpu' | 'storage' | 'network' | 'ops';

export interface Localized {
  en: string;
  ru: string;
}

export interface LatencyItem {
  id: string;
  label: Localized;
  category: LatencyCategory;
  /** Typical 2026 value, ns. */
  value2026: number;
  /** Spread you will meet in practice, ns. */
  low?: number;
  high?: number;
  /** Value in the classic ~2012 table, ns. */
  value2012?: number;
  /** Label used by the classic table, when it differs. */
  classicLabel?: string;
  note: Localized;
  /** Keys into `latencySources`. */
  sources: string[];
}

export interface LatencySource {
  key: string;
  title: string;
  /** Omitted for measurements made for this page. */
  url?: string;
  /** What we took from it. */
  used: Localized;
}

export const latencyCategories: { id: LatencyCategory; label: Localized }[] = [
  { id: 'cpu', label: { en: 'CPU & memory', ru: 'Процессор и память' } },
  { id: 'storage', label: { en: 'Storage', ru: 'Хранилища' } },
  { id: 'network', label: { en: 'Network', ru: 'Сеть' } },
  { id: 'ops', label: { en: 'Distributed systems & everyday ops', ru: 'Распределённые системы и типовые операции' } },
];

const NS = 1;
const US = 1_000;
const MS = 1_000_000;

export const latencyItems: LatencyItem[] = [
  {
    id: 'l1',
    label: { en: 'L1 cache reference', ru: 'Обращение к кэшу L1' },
    category: 'cpu',
    value2026: 1 * NS,
    low: 0.7 * NS,
    high: 2 * NS,
    value2012: 0.5 * NS,
    note: {
      en: '4–5 cycles on current x86 and Arm cores. Clock speeds plateaued at 3–6 GHz, so this has not shrunk in nanoseconds since 2012; the classic 0.5 ns was a rounded-down figure.',
      ru: '4–5 тактов на современных ядрах x86 и Arm. Частоты упёрлись в 3–6 ГГц, поэтому в наносекундах L1 с 2012 года не ускорился; классические 0,5 нс — округление вниз.',
    },
    sources: ['cnc-strix', 'cnc-graviton4', 'cnc-xeon6'],
  },
  {
    id: 'branch',
    label: { en: 'Branch mispredict', ru: 'Неверно предсказанный переход' },
    category: 'cpu',
    value2026: 3 * NS,
    low: 2 * NS,
    high: 6 * NS,
    value2012: 5 * NS,
    note: {
      en: 'About 13–14 cycles in the common case (11–18 on Zen 4): the pipeline is flushed and refilled. Cheap alone, expensive in a hot loop over unpredictable data.',
      ru: 'Обычно 13–14 тактов (11–18 на Zen 4): конвейер сбрасывается и заполняется заново. Сам по себе дёшев, но дорог в горячем цикле по непредсказуемым данным.',
    },
    sources: ['llvm-zen4', 'llvm-adl'],
  },
  {
    id: 'l2',
    label: { en: 'L2 cache reference', ru: 'Обращение к кэшу L2' },
    category: 'cpu',
    value2026: 3.5 * NS,
    low: 2.5 * NS,
    high: 5.5 * NS,
    value2012: 7 * NS,
    note: {
      en: '11–16 cycles (14 on Zen 5, 11 on Neoverse V2, 16 on Xeon 6). L2 grew to 1–3 MB per core while staying this fast.',
      ru: '11–16 тактов (14 у Zen 5, 11 у Neoverse V2, 16 у Xeon 6). L2 вырос до 1–3 МБ на ядро, оставаясь таким же быстрым.',
    },
    sources: ['cnc-strix', 'cnc-graviton4', 'cnc-xeon6'],
  },
  {
    id: 'mutex',
    label: { en: 'Mutex lock/unlock (uncontended)', ru: 'Захват и освобождение мьютекса (без конкуренции)' },
    category: 'cpu',
    value2026: 15 * NS,
    low: 8 * NS,
    high: 25 * NS,
    value2012: 25 * NS,
    classicLabel: 'Mutex lock/unlock',
    note: {
      en: 'One atomic instruction on the fast path. Under contention the loser sleeps in the kernel and pays a thread wake-up (microseconds) instead.',
      ru: 'На быстром пути — одна атомарная инструкция. При конкуренции проигравший поток засыпает в ядре и платит уже за пробуждение (микросекунды).',
    },
    sources: ['nazquadri', 'local'],
  },
  {
    id: 'l3',
    label: { en: 'L3 cache reference', ru: 'Обращение к кэшу L3' },
    category: 'cpu',
    value2026: 15 * NS,
    low: 9 * NS,
    high: 35 * NS,
    note: {
      en: 'Not in the classic table. ~46 cycles on a Zen 5 laptop, 80+ cycles on Arrow Lake, 25–33 ns on big server meshes (Graviton 4, Xeon 6).',
      ru: 'В классической таблице нет. ~46 тактов на ноутбучном Zen 5, 80+ тактов на Arrow Lake, 25–33 нс на больших серверных сетках (Graviton 4, Xeon 6).',
    },
    sources: ['hwcooling-zen5', 'cnc-arrowlake', 'cnc-graviton4', 'cnc-xeon6'],
  },
  {
    id: 'decompress1k',
    label: { en: 'Decompress 1 KB (LZ4 / zstd)', ru: 'Распаковать 1 КБ (LZ4 / zstd)' },
    category: 'cpu',
    value2026: 300 * NS,
    low: 250 * NS,
    high: 700 * NS,
    note: {
      en: 'LZ4 decompresses at ~3.9 GB/s per core, zstd at ~1.5 GB/s. Decompression is several times cheaper than compression.',
      ru: 'LZ4 распаковывает ~3,9 ГБ/с на ядро, zstd — ~1,5 ГБ/с. Распаковка в разы дешевле сжатия.',
    },
    sources: ['zstd', 'lz4'],
  },
  {
    id: 'dram',
    label: { en: 'Main memory reference (DRAM)', ru: 'Обращение к оперативной памяти (DRAM)' },
    category: 'cpu',
    value2026: 100 * NS,
    low: 70 * NS,
    high: 130 * NS,
    value2012: 100 * NS,
    classicLabel: 'Main memory reference',
    note: {
      en: 'Barely changed in 15 years. ~70 ns on a DDR5 desktop, 110–130 ns on many-core servers. Bandwidth grew a lot; latency did not.',
      ru: 'За 15 лет почти не изменилась. ~70 нс на настольном DDR5, 110–130 нс на многоядерных серверах. Росла пропускная способность, а не задержка.',
    },
    sources: ['cnc-9950x', 'cnc-graviton4', 'cnc-xeon6', 'cnc-arrowlake'],
  },
  {
    id: 'compress1k',
    label: { en: 'Compress 1 KB (zstd -1 / LZ4 / Snappy)', ru: 'Сжать 1 КБ (zstd -1 / LZ4 / Snappy)' },
    category: 'cpu',
    value2026: 2 * US,
    low: 1.5 * US,
    high: 3 * US,
    value2012: 3 * US,
    classicLabel: 'Compress 1K bytes with Zippy',
    note: {
      en: 'Fast codecs compress ~500–700 MB/s per core. Zippy is today’s Snappy. Single cores got only modestly faster since 2012.',
      ru: 'Быстрые кодеки сжимают ~500–700 МБ/с на ядро. Zippy — это нынешний Snappy. Одно ядро с 2012 года ускорилось лишь умеренно.',
    },
    sources: ['zstd', 'lz4'],
  },
  {
    id: 'wake',
    label: { en: 'Wake up a blocked thread (context switch)', ru: 'Разбудить заблокированный поток (переключение контекста)' },
    category: 'cpu',
    value2026: 5 * US,
    low: 2 * US,
    high: 10 * US,
    note: {
      en: 'What a contended lock or a blocking queue really costs: futex syscall, scheduler, cold caches. Higher in VMs.',
      ru: 'Реальная цена захваченной блокировки или блокирующей очереди: системный вызов futex, планировщик, холодные кэши. В виртуальных машинах — больше.',
    },
    sources: ['nazquadri', 'local'],
  },
  {
    id: 'mem1mb',
    label: { en: 'Read 1 MB sequentially from memory (one core)', ru: 'Последовательно прочитать 1 МБ из памяти (одно ядро)' },
    category: 'cpu',
    value2026: 30 * US,
    low: 15 * US,
    high: 100 * US,
    value2012: 250 * US,
    classicLabel: 'Read 1 MB sequentially from memory',
    note: {
      en: 'One core streams roughly 10–70 GB/s: ~52 GB/s on a Zen 5 server core, far less on older cloud VMs. The whole socket reaches hundreds of GB/s.',
      ru: 'Одно ядро читает потоком примерно 10–70 ГБ/с: ~52 ГБ/с у серверного Zen 5, намного меньше на старых облачных ВМ. Весь сокет — сотни ГБ/с.',
    },
    sources: ['cnc-turin', 'local'],
  },
  {
    id: 'ssd4k',
    label: { en: 'Read 4 KB randomly from NVMe SSD (QD1)', ru: 'Случайно прочитать 4 КБ с NVMe SSD (QD1)' },
    category: 'storage',
    value2026: 50 * US,
    low: 20 * US,
    high: 100 * US,
    value2012: 150 * US,
    classicLabel: 'Read 4K randomly from SSD',
    note: {
      en: 'One outstanding I/O at a time. Rated 22K IOPS at QD1 for a Samsung 990 PRO (≈45 µs). The flash read itself sets the floor; queue depth buys throughput, not latency.',
      ru: 'По одному запросу за раз. У Samsung 990 PRO заявлено 22 тыс. IOPS при QD1 (≈45 мкс). Нижнюю границу задаёт само чтение флеш-памяти; глубина очереди даёт пропускную способность, а не меньшую задержку.',
    },
    sources: ['samsung-990pro', 'storagereview-cm7'],
  },
  {
    id: 'ssd1mb',
    label: { en: 'Read 1 MB sequentially from NVMe SSD', ru: 'Последовательно прочитать 1 МБ с NVMe SSD' },
    category: 'storage',
    value2026: 100 * US,
    low: 70 * US,
    high: 300 * US,
    value2012: 1 * MS,
    classicLabel: 'Read 1 MB sequentially from SSD',
    note: {
      en: '~7 GB/s on PCIe 4, ~14 GB/s on PCIe 5 drives — ten times the ~1 GB/s SSDs of 2012.',
      ru: '~7 ГБ/с на PCIe 4, ~14 ГБ/с на PCIe 5 — в десять раз больше, чем ~1 ГБ/с у SSD 2012 года.',
    },
    sources: ['samsung-990pro', 'pcper-9100pro'],
  },
  {
    id: 'ebs',
    label: { en: 'Cloud block volume I/O (network-attached SSD)', ru: 'Ввод-вывод облачного блочного тома (SSD по сети)' },
    category: 'storage',
    value2026: 1 * MS,
    low: 300 * US,
    high: 5 * MS,
    note: {
      en: 'EBS io2 Block Express averages under 500 µs for 16 KiB I/O; gp3 is “single-digit millisecond”. Ten times a local NVMe drive — every I/O crosses the network.',
      ru: 'EBS io2 Block Express — в среднем меньше 500 мкс на операцию 16 КиБ; gp3 — «единицы миллисекунд». В десять раз медленнее локального NVMe: каждый запрос идёт по сети.',
    },
    sources: ['aws-ebs'],
  },
  {
    id: 'hdd1mb',
    label: { en: 'Read 1 MB sequentially from HDD', ru: 'Последовательно прочитать 1 МБ с HDD' },
    category: 'storage',
    value2026: 5 * MS,
    low: 3.5 * MS,
    high: 8 * MS,
    value2012: 20 * MS,
    classicLabel: 'Read 1 MB sequentially from disk',
    note: {
      en: 'Modern 7,200 rpm drives stream ~285 MB/s on outer tracks and about half that on inner ones. The primer’s copy of the classic table said 30 ms.',
      ru: 'Современные диски на 7200 об/мин читают ~285 МБ/с на внешних дорожках и примерно вдвое меньше на внутренних. В копии классической таблицы в Primer было 30 мс.',
    },
    sources: ['storagereview-x24', 'wiki-hdd'],
  },
  {
    id: 'hddseek',
    label: { en: 'HDD random read (seek + rotation)', ru: 'Случайное чтение с HDD (позиционирование + оборот)' },
    category: 'storage',
    value2026: 10 * MS,
    low: 8 * MS,
    high: 15 * MS,
    value2012: 10 * MS,
    classicLabel: 'Disk seek',
    note: {
      en: 'Mechanics did not change: 4.16 ms average rotational latency at 7,200 rpm plus a ~5–9 ms seek. Still ~100–200 random IOPS per drive.',
      ru: 'Механика не изменилась: 4,16 мс средней задержки вращения на 7200 об/мин плюс ~5–9 мс позиционирования головки. По-прежнему ~100–200 случайных IOPS на диск.',
    },
    sources: ['storagereview-x24', 'wiki-hdd'],
  },
  {
    id: 'net1kb',
    label: { en: 'Send 1 KB over a 25 Gbit/s link (wire time)', ru: 'Передать 1 КБ по каналу 25 Гбит/с (время в проводе)' },
    category: 'network',
    value2026: 330 * NS,
    low: 82 * NS,
    high: 820 * NS,
    value2012: 10 * US,
    classicLabel: 'Send 1K bytes over 1 Gbps network',
    note: {
      en: 'Pure serialization: 8,192 bits ÷ line rate (82 ns at 100 GbE, 820 ns at 10 GbE). Classic row assumed 1 Gbps. NICs, kernels and switches add tens of µs on top.',
      ru: 'Только сериализация: 8192 бита ÷ скорость линии (82 нс при 100 GbE, 820 нс при 10 GbE). Классическая строка — для 1 Гбит/с. Сетевая карта, ядро ОС и коммутаторы добавляют ещё десятки микросекунд.',
    },
    sources: ['arith'],
  },
  {
    id: 'rttaz',
    label: { en: 'Round trip within an availability zone', ru: 'Круговая задержка внутри зоны доступности' },
    category: 'network',
    value2026: 200 * US,
    low: 50 * US,
    high: 500 * US,
    value2012: 500 * US,
    classicLabel: 'Round trip within same datacenter',
    note: {
      en: 'AWS: “typically sub-millisecond” between instances in one AZ; 300 µs p50 in its own example; 50–260 µs measured with netperf. Kernel-bypass stacks reach ~10 µs.',
      ru: 'AWS: между инстансами одной AZ — «обычно меньше миллисекунды»; в их примере p50 = 300 мкс; netperf показывает 50–260 мкс. Стеки с обходом ядра (kernel bypass) дают ~10 мкс.',
    },
    sources: ['aws-az-affinity', 'zenn-az'],
  },
  {
    id: 'net1mb',
    label: { en: 'Send 1 MB over a 25 Gbit/s link (wire time)', ru: 'Передать 1 МБ по каналу 25 Гбит/с (время в проводе)' },
    category: 'network',
    value2026: 340 * US,
    low: 84 * US,
    high: 840 * US,
    value2012: 10 * MS,
    classicLabel: 'Read 1 MB sequentially from 1 Gbps',
    note: {
      en: '~3 GB/s of payload per 25 GbE port (84 µs at 100 GbE). The 10 ms classic row is from the primer’s 1 Gbps version of the table.',
      ru: '~3 ГБ/с полезной нагрузки на порт 25 GbE (84 мкс при 100 GbE). Классические 10 мс — из версии таблицы в Primer для 1 Гбит/с.',
    },
    sources: ['arith', 'primer'],
  },
  {
    id: 'pgquery',
    label: { en: 'Indexed PostgreSQL query over the network', ru: 'Запрос к PostgreSQL по индексу через сеть' },
    category: 'ops',
    value2026: 500 * US,
    low: 200 * US,
    high: 1.5 * MS,
    note: {
      en: 'Primary-key lookup: 19 µs over a Unix socket, 34 µs over localhost TCP, 0.42 ms over a LAN. The database work is tiny; the round trip dominates.',
      ru: 'Поиск по первичному ключу: 19 мкс через Unix-сокет, 34 мкс через localhost TCP, 0,42 мс по локальной сети. Работа самой СУБД мизерна — всё решает сетевой круг.',
    },
    sources: ['cybertec-pg'],
  },
  {
    id: 'redisget',
    label: { en: 'Redis / Valkey GET over the network (same AZ)', ru: 'GET в Redis / Valkey по сети (та же AZ)' },
    category: 'ops',
    value2026: 250 * US,
    low: 100 * US,
    high: 500 * US,
    note: {
      en: 'The server needs well under 1 µs; you pay the network round trip. A Unix socket gets ~30 µs. Pipelining amortises the trip over many keys.',
      ru: 'Серверу нужно намного меньше 1 мкс; платим за сетевой круг. Через Unix-сокет — ~30 мкс. Конвейеризация (pipelining) делит один круг на много ключей.',
    },
    sources: ['redis-latency', 'aws-az-affinity'],
  },
  {
    id: 'rttxaz',
    label: { en: 'Round trip between availability zones (same region)', ru: 'Круговая задержка между зонами доступности (один регион)' },
    category: 'network',
    value2026: 1 * MS,
    low: 300 * US,
    high: 2 * MS,
    note: {
      en: 'AZs are up to ~100 km apart; AWS quotes “single-digit millisecond” and uses ~1–1.5 ms per crossing in its examples. Fine for synchronous replication.',
      ru: 'Зоны разнесены до ~100 км; AWS говорит о «единицах миллисекунд» и в примерах закладывает ~1–1,5 мс на пересечение. Достаточно для синхронной репликации.',
    },
    sources: ['aws-az-affinity', 'aws-fault-isolation', 'zenn-az'],
  },
  {
    id: 'tls',
    label: { en: 'TLS 1.3 handshake (same region)', ru: 'Рукопожатие TLS 1.3 (в пределах региона)' },
    category: 'network',
    value2026: 1 * MS,
    low: 500 * US,
    high: 2 * MS,
    note: {
      en: 'One extra round trip (TLS 1.2 needed two) plus ~0.1–0.7 ms of crypto. Across an ocean the round trip dominates: add ~80–150 ms. Resumption with 0-RTT removes it.',
      ru: 'Один дополнительный сетевой круг (TLS 1.2 требовал двух) плюс ~0,1–0,7 мс криптографии. Через океан доминирует круг: +80–150 мс. Возобновление сессии с 0-RTT убирает его.',
    },
    sources: ['cloudflare-tls13', 'local'],
  },
  {
    id: 'dnscached',
    label: { en: 'DNS lookup, resolver cache hit', ru: 'DNS-запрос, попадание в кэш резолвера' },
    category: 'ops',
    value2026: 10 * MS,
    low: 1 * MS,
    high: 30 * MS,
    note: {
      en: 'Roughly one round trip to the recursive resolver: under 1 ms inside a cloud VPC, 5–30 ms from home or mobile networks. OS and browser caches answer in microseconds.',
      ru: 'Примерно один сетевой круг до рекурсивного резолвера: меньше 1 мс внутри облачной VPC, 5–30 мс из домашних и мобильных сетей. Кэши ОС и браузера отвечают за микросекунды.',
    },
    sources: ['oreilly-dns', 'google-dns'],
  },
  {
    id: 's3get',
    label: { en: 'Object storage GET, time to first byte', ru: 'GET из объектного хранилища, время до первого байта' },
    category: 'ops',
    value2026: 30 * MS,
    low: 10 * MS,
    high: 200 * MS,
    note: {
      en: 'S3 Standard: ~30 ms median measured in-region, with a tail to 200 ms (AWS says plan for 100–200 ms). S3 Express One Zone: single-digit ms.',
      ru: 'S3 Standard: медиана ~30 мс внутри региона, хвост до 200 мс (AWS советует закладывать 100–200 мс). S3 Express One Zone: единицы миллисекунд.',
    },
    sources: ['durner-vldb', 'aws-s3-perf', 'aws-s3-express'],
  },
  {
    id: 'rttuseu',
    label: { en: 'Round trip US East ↔ Western Europe', ru: 'Круговая задержка Восток США ↔ Западная Европа' },
    category: 'network',
    value2026: 80 * MS,
    low: 70 * MS,
    high: 90 * MS,
    note: {
      en: 'Median 83–85 ms between Azure East US and West Europe, 71–73 ms to North Europe. Light in fibre covers ~200 km per ms; distance sets the floor.',
      ru: 'Медиана 83–85 мс между Azure East US и West Europe, 71–73 мс до North Europe. Свет в оптоволокне проходит ~200 км за мс — нижнюю границу задаёт расстояние.',
    },
    sources: ['azure-latency'],
  },
  {
    id: 'dnsmiss',
    label: { en: 'DNS lookup, cache miss (full recursion)', ru: 'DNS-запрос, промах кэша (полная рекурсия)' },
    category: 'ops',
    value2026: 100 * MS,
    low: 30 * MS,
    high: 400 * MS,
    note: {
      en: 'The resolver talks to one or more authoritative servers: ~130 ms average when they answer, 300–400 ms once timeouts and retries are included.',
      ru: 'Резолвер обращается к одному или нескольким авторитативным серверам: в среднем ~130 мс, если они отвечают, и 300–400 мс с учётом тайм-аутов и повторов.',
    },
    sources: ['google-dns', 'oreilly-dns'],
  },
  {
    id: 'rttcanl',
    label: { en: 'Round trip California ↔ Netherlands', ru: 'Круговая задержка Калифорния ↔ Нидерланды' },
    category: 'network',
    value2026: 145 * MS,
    low: 130 * MS,
    high: 150 * MS,
    value2012: 150 * MS,
    classicLabel: 'Send packet CA->Netherlands->CA',
    note: {
      en: 'Median 145–146 ms between Azure West US and West Europe — the classic 150 ms still holds, because the speed of light did not change.',
      ru: 'Медиана 145–146 мс между Azure West US и West Europe — классические 150 мс по-прежнему верны: скорость света не изменилась.',
    },
    sources: ['azure-latency'],
  },
  {
    id: 'rttfar',
    label: { en: 'Round trip to the other side of the world', ru: 'Круговая задержка на другую сторону планеты' },
    category: 'network',
    value2026: 280 * MS,
    low: 250 * MS,
    high: 300 * MS,
    note: {
      en: 'West Europe ↔ Australia East 265 ms, Brazil South ↔ Australia East 295 ms (Azure medians). About 3–4 sequential round trips per second.',
      ru: 'West Europe ↔ Australia East — 265 мс, Brazil South ↔ Australia East — 295 мс (медианы Azure). Это всего 3–4 последовательных круга в секунду.',
    },
    sources: ['azure-latency'],
  },
];

export const latencySources: LatencySource[] = [
  {
    key: 'jboner',
    title: 'Latency Numbers Every Programmer Should Know (gist, 2012)',
    url: 'https://gist.github.com/jboner/2841832',
    used: { en: 'Classic values (Jeff Dean, Peter Norvig)', ru: 'Классические значения (Джефф Дин, Питер Норвиг)' },
  },
  {
    key: 'dean',
    title: 'Jeff Dean — Designs, Lessons and Advice from Building Large Distributed Systems (LADIS 2009)',
    url: 'http://www.cs.cornell.edu/projects/ladis2009/talks/dean-keynote-ladis2009.pdf',
    used: { en: 'Original “Numbers everyone should know” slide', ru: 'Исходный слайд «Numbers everyone should know»' },
  },
  {
    key: 'primer',
    title: 'The System Design Primer — Appendix',
    url: 'https://github.com/donnemartin/system-design-primer#latency-numbers-every-programmer-should-know',
    used: { en: 'The primer’s copy of the table (1 Gbps row)', ru: 'Копия таблицы в Primer (строка про 1 Гбит/с)' },
  },
  {
    key: 'cnc-strix',
    title: 'Chips and Cheese — AMD’s Strix Point: Zen 5 Hits Mobile',
    url: 'https://chipsandcheese.com/p/amds-strix-point-zen-5-hits-mobile',
    used: { en: 'Zen 5: L1D 4 cycles, L2 14 cycles', ru: 'Zen 5: L1D 4 такта, L2 14 тактов' },
  },
  {
    key: 'hwcooling-zen5',
    title: 'HWCooling — Zen 5 tested: mobile core differs considerably from desktop one',
    url: 'https://www.hwcooling.net/en/zen-5-tested-mobile-core-differs-considerably-from-desktop-one/',
    used: { en: 'Zen 5: L3 ≈ 46 cycles', ru: 'Zen 5: L3 ≈ 46 тактов' },
  },
  {
    key: 'cnc-9950x',
    title: 'Chips and Cheese — AMD’s Ryzen 9950X: Zen 5 on Desktop',
    url: 'https://chipsandcheese.com/p/amds-ryzen-9950x-zen-5-on-desktop',
    used: { en: 'DDR5-6000 memory latency just over 70 ns', ru: 'Задержка памяти DDR5-6000 — чуть больше 70 нс' },
  },
  {
    key: 'cnc-arrowlake',
    title: 'Chips and Cheese — Examining Intel’s Arrow Lake, at the System Level',
    url: 'https://chipsandcheese.com/p/examining-intels-arrow-lake-at-the',
    used: { en: 'L3 80+ cycles; DRAM over 100 ns', ru: 'L3 — 80+ тактов; DRAM — больше 100 нс' },
  },
  {
    key: 'cnc-graviton4',
    title: 'Chips and Cheese — Arm’s Neoverse V2, in AWS’s Graviton 4',
    url: 'https://chipsandcheese.com/p/arms-neoverse-v2-in-awss-graviton-4',
    used: { en: 'L1D 4 cycles, L2 11 cycles, L3 25 ns, DRAM 114 ns', ru: 'L1D 4 такта, L2 11 тактов, L3 25 нс, DRAM 114 нс' },
  },
  {
    key: 'cnc-xeon6',
    title: 'Chips and Cheese — A Look into Intel Xeon 6’s Memory Subsystem',
    url: 'https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory',
    used: { en: 'L1D 5 cycles, L2 16 cycles, L3 ~33 ns; Turin DRAM 125.6 ns', ru: 'L1D 5 тактов, L2 16 тактов, L3 ~33 нс; DRAM у Turin 125,6 нс' },
  },
  {
    key: 'cnc-turin',
    title: 'Chips and Cheese — AMD’s Turin: 5th Gen EPYC Launched',
    url: 'https://chipsandcheese.com/p/amds-turin-5th-gen-epyc-launched',
    used: { en: 'Single-thread read bandwidth ≈ 52 GB/s', ru: 'Пропускная способность чтения одним потоком ≈ 52 ГБ/с' },
  },
  {
    key: 'llvm-zen4',
    title: 'LLVM — X86ScheduleZnver4.td (Zen 4 scheduling model)',
    url: 'https://github.com/llvm/llvm-project/blob/main/llvm/lib/Target/X86/X86ScheduleZnver4.td',
    used: { en: 'Mispredict penalty 13 cycles (range 11–18)', ru: 'Штраф за неверное предсказание — 13 тактов (11–18)' },
  },
  {
    key: 'llvm-adl',
    title: 'LLVM — X86SchedAlderlakeP.td (Golden Cove scheduling model)',
    url: 'https://github.com/llvm/llvm-project/blob/main/llvm/lib/Target/X86/X86SchedAlderlakeP.td',
    used: { en: 'Mispredict penalty 14 cycles', ru: 'Штраф за неверное предсказание — 14 тактов' },
  },
  {
    key: 'nazquadri',
    title: 'Naz Quadri — The Lock You Didn’t Know You Were Taking',
    url: 'https://nazquadri.com/blog/the-layer-below/sync-primitives/',
    used: { en: 'Uncontended pthread lock ~18 ns; sleep/wake 3–10 µs (Zen 4)', ru: 'Неконкурентный pthread-мьютекс ~18 нс; сон/пробуждение 3–10 мкс (Zen 4)' },
  },
  {
    key: 'zstd',
    title: 'Zstandard README — benchmark table',
    url: 'https://github.com/facebook/zstd',
    used: { en: 'zstd -1, LZ4, Snappy compression and decompression speeds', ru: 'Скорости сжатия и распаковки zstd -1, LZ4, Snappy' },
  },
  {
    key: 'lz4',
    title: 'LZ4 README — benchmarks',
    url: 'https://github.com/lz4/lz4',
    used: { en: 'LZ4 vs Snappy vs zstd speeds', ru: 'Скорости LZ4, Snappy и zstd' },
  },
  {
    key: 'samsung-990pro',
    title: 'Samsung NVMe SSD 990 PRO data sheet',
    url: 'https://download.semiconductor.samsung.com/resources/data-sheet/Samsung_NVMe_SSD_990_PRO_Datasheet_Rev.1.0_10129514072296.pdf',
    used: { en: '22K IOPS random 4 KB read at QD1; 7,450 MB/s sequential', ru: '22 тыс. IOPS случайного чтения 4 КБ при QD1; 7450 МБ/с последовательно' },
  },
  {
    key: 'pcper-9100pro',
    title: 'PC Perspective — Samsung 9100 PRO PCIe 5.0 NVMe SSD review',
    url: 'https://pcper.com/2025/03/samsung-9100-pro-pcie-5-0-nvme-ssd-review/',
    used: { en: '14.7 GB/s sequential read measured (PCIe 5)', ru: 'Измерено 14,7 ГБ/с последовательного чтения (PCIe 5)' },
  },
  {
    key: 'storagereview-cm7',
    title: 'StorageReview — KIOXIA CM7-R E3.S SSD review',
    url: 'https://www.storagereview.com/review/kioxia-cm7-r-e3-s-ssd-review',
    used: { en: 'Enterprise 4K random read: 78–123 µs under load', ru: 'Случайное чтение 4K у серверных SSD: 78–123 мкс под нагрузкой' },
  },
  {
    key: 'aws-ebs',
    title: 'Amazon EBS volume types',
    url: 'https://aws.amazon.com/ebs/volume-types/',
    used: { en: 'io2 Block Express < 500 µs; gp3 single-digit ms', ru: 'io2 Block Express < 500 мкс; gp3 — единицы мс' },
  },
  {
    key: 'storagereview-x24',
    title: 'StorageReview — Seagate Exos X24 (spec table)',
    url: 'https://www.storagereview.com/?p=131160',
    used: { en: '4.16 ms average latency; 285 MB/s max sustained', ru: '4,16 мс средней задержки; до 285 МБ/с последовательно' },
  },
  {
    key: 'wiki-hdd',
    title: 'Wikipedia — Hard disk drive performance characteristics',
    url: 'https://en.wikipedia.org/wiki/Hard_disk_drive_performance_characteristics',
    used: { en: 'Seek time and rotational latency', ru: 'Время позиционирования и задержка вращения' },
  },
  {
    key: 'aws-az-affinity',
    title: 'AWS Architecture Blog — Improving performance and reducing cost using Availability Zone affinity',
    url: 'https://aws.amazon.com/blogs/architecture/improving-performance-and-reducing-cost-using-availability-zone-affinity/',
    used: { en: 'Sub-ms within an AZ (300 µs p50); ~1–1.5 ms per AZ crossing', ru: 'Меньше 1 мс внутри AZ (p50 300 мкс); ~1–1,5 мс на пересечение AZ' },
  },
  {
    key: 'aws-fault-isolation',
    title: 'AWS Fault Isolation Boundaries — Availability Zones',
    url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/availability-zones.html',
    used: { en: 'AZs up to ~100 km apart, single-digit ms', ru: 'AZ разнесены до ~100 км, единицы мс' },
  },
  {
    key: 'zenn-az',
    title: 'Measuring latency among AWS Availability Zones (netperf, 2023)',
    url: 'https://zenn.dev/tsumita7/articles/aws-mesuring-latency-among-az-2023',
    used: { en: 'Same-AZ 49–259 µs; cross-AZ 0.2–1.8 ms', ru: 'Внутри AZ 49–259 мкс; между AZ 0,2–1,8 мс' },
  },
  {
    key: 'azure-latency',
    title: 'Microsoft Learn — Azure network round-trip latency statistics',
    url: 'https://learn.microsoft.com/en-us/azure/networking/azure-network-latency',
    used: { en: 'Median inter-region RTTs (30 days to 2026-07-30)', ru: 'Медианные RTT между регионами (30 дней до 30.07.2026)' },
  },
  {
    key: 'cloudflare-tls13',
    title: 'Cloudflare — A Detailed Look at RFC 8446 (a.k.a. TLS 1.3)',
    url: 'https://blog.cloudflare.com/rfc-8446-aka-tls-1-3/',
    used: { en: '1-RTT handshake, 0-RTT resumption', ru: 'Рукопожатие за 1 RTT, возобновление 0-RTT' },
  },
  {
    key: 'redis-latency',
    title: 'Redis docs — Diagnosing latency issues',
    url: 'https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/',
    used: { en: 'Sub-µs command processing; network ~200 µs, Unix socket ~30 µs', ru: 'Обработка команды меньше 1 мкс; сеть ~200 мкс, Unix-сокет ~30 мкс' },
  },
  {
    key: 'cybertec-pg',
    title: 'Cybertec — PostgreSQL performance: latency in the cloud and on premise',
    url: 'https://www.cybertec-postgresql.com/en/postgresql-performance-latency-in-the-cloud-and-on-premise/',
    used: { en: 'pgbench -S: 0.019 ms socket, 0.034 ms localhost, 0.42 ms LAN', ru: 'pgbench -S: 0,019 мс через сокет, 0,034 мс localhost, 0,42 мс по LAN' },
  },
  {
    key: 'google-dns',
    title: 'Google Public DNS — Performance benefits',
    url: 'https://developers.google.com/speed/public-dns/docs/performance',
    used: { en: 'Cache misses dominate; ~130 ms average resolution', ru: 'Главная причина задержки — промахи кэша; в среднем ~130 мс' },
  },
  {
    key: 'oreilly-dns',
    title: 'Steve Souders — High Performance Web Sites, ch. 11: Reduce DNS Lookups',
    url: 'https://www.oreilly.com/library/view/high-performance-web/9780596529307/ch11.html',
    used: { en: 'Browser DNS lookups typically 20–120 ms', ru: 'DNS-запросы браузера — обычно 20–120 мс' },
  },
  {
    key: 'aws-s3-perf',
    title: 'Amazon S3 — Best practices design patterns: optimizing performance',
    url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance.html',
    used: { en: 'Small-object latency roughly 100–200 ms', ru: 'Задержка для небольших объектов — примерно 100–200 мс' },
  },
  {
    key: 'aws-s3-express',
    title: 'Amazon S3 — Optimizing S3 Express One Zone performance',
    url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-performance.html',
    used: { en: 'Single-digit ms first byte, up to 10× faster than Standard', ru: 'Первый байт за единицы мс, до 10× быстрее Standard' },
  },
  {
    key: 'durner-vldb',
    title: 'Durner, Leis, Neumann — Exploiting Cloud Object Storage for High-Performance Analytics (VLDB 2023)',
    url: 'https://www.vldb.org/pvldb/vol16/p2769-durner.pdf',
    used: { en: 'S3 median base latency ~30 ms; < 5% above 200 ms', ru: 'Медианная базовая задержка S3 ~30 мс; < 5% выше 200 мс' },
  },
  {
    key: 'arith',
    title: 'Arithmetic: bits ÷ line rate',
    used: { en: '1 KB = 8,192 bits; 25 Gbit/s → 328 ns', ru: '1 КБ = 8192 бита; 25 Гбит/с → 328 нс' },
  },
  {
    key: 'local',
    title: 'Measured for this page (2-vCPU cloud VM, Xeon @ 2.8 GHz, Linux, glibc, OpenSSL 3.0)',
    used: {
      en: 'Mutex lock+unlock 9 ns; thread hand-off 6–10 µs; DRAM pointer chase 180 ns and 1 MB memcpy 160 µs (VM); X25519 ~42 µs, ECDSA P-256 sign ~29 µs, RSA-2048 sign ~0.7 ms',
      ru: 'Мьютекс lock+unlock 9 нс; передача управления потоку 6–10 мкс; случайный обход DRAM 180 нс и memcpy 1 МБ за 160 мкс (ВМ); X25519 ~42 мкс, подпись ECDSA P-256 ~29 мкс, RSA-2048 ~0,7 мс',
    },
  },
];

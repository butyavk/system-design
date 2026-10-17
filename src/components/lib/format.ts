// Shared, dependency-free formatting helpers for the interactive reference
// components (latency, availability, estimation, powers of two).
// Used both at build time (Astro frontmatter) and in the browser.

export type Locale = 'en' | 'ru';

const TAG: Record<Locale, string> = { en: 'en-US', ru: 'ru-RU' };
const cache = new Map<string, Intl.NumberFormat>();

/** Cached Intl.NumberFormat for the locale. */
export function nf(locale: Locale, opts: Intl.NumberFormatOptions = {}): Intl.NumberFormat {
  const key = locale + JSON.stringify(opts);
  let f = cache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(TAG[locale], opts);
    cache.set(key, f);
  }
  return f;
}

/** Number with a given count of significant digits (trailing zeros dropped). */
export function sig(value: number, locale: Locale, digits = 3): string {
  if (!Number.isFinite(value)) return '—';
  return nf(locale, { maximumSignificantDigits: digits }).format(value);
}

/** Integer with grouping, e.g. 1,234,567 / 1 234 567. */
export function int(value: number, locale: Locale): string {
  return nf(locale, { maximumFractionDigits: 0 }).format(value);
}

/** Fixed fraction digits, grouping on. */
export function fixed(value: number, locale: Locale, min = 0, max = min): string {
  return nf(locale, { minimumFractionDigits: min, maximumFractionDigits: max }).format(value);
}

const TIME_UNITS: Record<Locale, [string, number][]> = {
  en: [['ns', 1], ['µs', 1e3], ['ms', 1e6], ['s', 1e9]],
  ru: [['нс', 1], ['мкс', 1e3], ['мс', 1e6], ['с', 1e9]],
};

/** Nanoseconds → "330 ns", "1.5 µs", "145 ms", "1.2 s". */
export function formatNs(ns: number, locale: Locale, digits = 3): string {
  const units = TIME_UNITS[locale];
  let [u, d] = units[0];
  for (const [name, div] of units) {
    if (ns >= div * 0.9995) {
      u = name;
      d = div;
    }
  }
  return `${sig(ns / d, locale, digits)} ${u}`;
}

const HUMAN_STEPS: [Intl.NumberFormatOptions['unit'], number][] = [
  ['second', 1],
  ['minute', 60],
  ['hour', 3600],
  ['day', 86400],
  ['month', 2_629_800],
  ['year', 31_557_600],
];

/** Seconds → "1.7 minutes", "12 days", "4.6 years" in long, localized words. */
export function formatHumanSeconds(seconds: number, locale: Locale): string {
  if (seconds > 0 && seconds < 0.9995) {
    return nf(locale, { style: 'unit', unit: 'millisecond', unitDisplay: 'long', maximumSignificantDigits: 2 }).format(seconds * 1000);
  }
  let unit = HUMAN_STEPS[0][0];
  let div = 1;
  for (const [u, d] of HUMAN_STEPS) {
    if (seconds >= d * 0.9995) {
      unit = u;
      div = d;
    }
  }
  const v = seconds / div;
  const digits = v >= 100 ? 3 : 2;
  return nf(locale, { style: 'unit', unit, unitDisplay: 'long', maximumSignificantDigits: digits }).format(v);
}

const SHORT_DUR: Record<Locale, { y: string; d: string; h: string; m: string; s: string; ms: string }> = {
  en: { y: 'y', d: 'd', h: 'h', m: 'min', s: 's', ms: 'ms' },
  ru: { y: 'г', d: 'д', h: 'ч', m: 'мин', s: 'с', ms: 'мс' },
};

/**
 * Seconds → "3 d 15 h 40 min", "8 h 45 min 58 s", "4 min 23 s", "8.64 s", "864 ms".
 * At most three parts; with days, seconds are dropped and the minutes rounded.
 */
export function formatDuration(seconds: number, locale: Locale): string {
  const u = SHORT_DUR[locale];
  const sp = ' ';
  if (!Number.isFinite(seconds) || seconds < 0) return '—';
  if (seconds === 0) return `0${sp}${u.s}`;
  // Thresholds sit just below the next unit, so 3-digit rounding never shows "1,000 ms" or "60 s".
  if (seconds < 0.9995) return `${sig(seconds * 1000, locale, 3)}${sp}${u.ms}`;
  if (seconds < 59.95) return `${sig(seconds, locale, 3)}${sp}${u.s}`;
  let rest = seconds >= 86400 ? Math.round(seconds / 60) * 60 : Math.round(seconds);
  const parts: string[] = [];
  const push = (n: number, label: string) => parts.push(`${int(n, locale)}${sp}${label}`);
  const days = Math.floor(rest / 86400);
  rest -= days * 86400;
  const h = Math.floor(rest / 3600);
  rest -= h * 3600;
  const m = Math.floor(rest / 60);
  const s = rest - m * 60;
  if (days) push(days, u.d);
  if (h) push(h, u.h);
  if (m && parts.length < 3) push(m, u.m);
  if (s && parts.length < 3 && !days) push(s, u.s);
  return parts.slice(0, 3).join(' ');
}

const SI: Record<Locale, string[]> = {
  en: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'],
  ru: ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ', 'ЭБ'],
};
const IEC: Record<Locale, string[]> = {
  en: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB'],
  ru: ['Б', 'КиБ', 'МиБ', 'ГиБ', 'ТиБ', 'ПиБ', 'ЭиБ'],
};

export function unitNames(locale: Locale, system: 'si' | 'iec'): string[] {
  return (system === 'si' ? SI : IEC)[locale];
}

/** Bytes → "495 MB" (SI, powers of 1000) or "472 MiB" (IEC, powers of 1024). */
export function formatBytes(bytes: number, locale: Locale, system: 'si' | 'iec' = 'si', digits = 3): string {
  const base = system === 'si' ? 1000 : 1024;
  const names = unitNames(locale, system);
  let i = 0;
  let v = bytes;
  while (v >= base * 0.9995 && i < names.length - 1) {
    v /= base;
    i++;
  }
  return `${sig(v, locale, digits)} ${names[i]}`;
}

/** Ratio for "≈N×": 1 decimal below 10, otherwise 2 significant digits. */
export function formatRatio(r: number, locale: Locale): string {
  if (r < 10) return nf(locale, { maximumFractionDigits: 1 }).format(r);
  return nf(locale, { maximumSignificantDigits: 2 }).format(r);
}

/** Russian "раз/раза" after a number: в 2 раза, в 5 раз, в 1,5 раза, в 21 раз. */
export function ruTimes(r: number): string {
  const rounded = r < 10 ? Math.round(r * 10) / 10 : Number(r.toPrecision(2));
  if (!Number.isInteger(rounded)) return 'раза';
  const n = rounded % 100;
  const last = n % 10;
  if (n >= 11 && n <= 14) return 'раз';
  if (last >= 2 && last <= 4) return 'раза';
  return 'раз';
}

/**
 * Parse a user-entered number. Accepts "10,000,000", "10 000 000", "2.5", "2,5",
 * "1e6" and the suffixes k/K, M, B (and тыс, млн, млрд).
 * With both "," and "." present, the last one is the decimal separator.
 * A single comma is a decimal comma, except "1,000"-style input in English.
 */
export function parseNum(raw: string, locale: Locale = 'en'): number {
  let s = raw.trim().toLowerCase().replace(/[\s  '_]/g, '');
  if (s === '') return NaN;
  let mult = 1;
  const suffix = s.match(/(k|m|b|тыс\.?|млн|млрд)$/);
  if (suffix && !/e[+-]?\d*$/.test(s)) {
    mult = { k: 1e3, m: 1e6, b: 1e9, 'тыс': 1e3, 'тыс.': 1e3, 'млн': 1e6, 'млрд': 1e9 }[suffix[1]] ?? 1;
    s = s.slice(0, -suffix[1].length);
  }
  const commas = (s.match(/,/g) || []).length;
  const dots = (s.match(/\./g) || []).length;
  if (commas && dots) {
    const dec = s.lastIndexOf(',') > s.lastIndexOf('.') ? ',' : '.';
    const grp = dec === ',' ? '.' : ',';
    s = s.split(grp).join('').replace(',', '.');
  } else if (commas > 1) {
    s = s.replace(/,/g, '');
  } else if (commas === 1) {
    s = locale === 'en' && /^-?\d{1,3},\d{3}$/.test(s) ? s.replace(',', '') : s.replace(',', '.');
  } else if (dots > 1) {
    s = s.replace(/\./g, '');
  }
  if (!/^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/.test(s)) return NaN;
  return Number(s) * mult;
}

// Reading progress shared by the skill map, the study plan and the block at the end of
// each topic page. Stored in this browser only (localStorage); every access is guarded,
// so pages work the same when storage is blocked — progress then lasts for the page view.

export const PROGRESS_KEY = 'sdp-progress';
const EVENT = 'sdp-progress';

export interface Progress {
  v: 1;
  /** Pages the reader marked as learned → timestamp. */
  learned: Record<string, number>;
  /** Pages the reader opened → last visit timestamp. */
  visited: Record<string, number>;
  /** Study-plan activities that are not pages (e.g. the mock interview) → timestamp. */
  activities: Record<string, number>;
  /** Last topic page opened. */
  last?: string;
  /** Old per-timeline study-plan ticks have been merged in. */
  migrated?: boolean;
}

let memory: Progress | null = null;

const empty = (): Progress => ({ v: 1, learned: {}, visited: {}, activities: {} });

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const v = JSON.parse(raw);
      if (v && typeof v === 'object' && v.v === 1) {
        return { ...empty(), ...v, learned: { ...v.learned }, visited: { ...v.visited }, activities: { ...v.activities } };
      }
    }
  } catch {
    /* storage blocked or corrupt: fall back to memory */
  }
  return memory ? structuredClone(memory) : empty();
}

export function saveProgress(p: Progress): void {
  memory = structuredClone(p);
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable: keep the in-memory copy */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function update(fn: (p: Progress) => void): Progress {
  const p = loadProgress();
  fn(p);
  saveProgress(p);
  return p;
}

export function setLearned(path: string, on: boolean): Progress {
  return update((p) => {
    if (on) p.learned[path] = Date.now();
    else delete p.learned[path];
  });
}

export function setActivity(id: string, on: boolean): Progress {
  return update((p) => {
    if (on) p.activities[id] = Date.now();
    else delete p.activities[id];
  });
}

export function markVisited(path: string): Progress {
  return update((p) => {
    p.visited[path] = Date.now();
    p.last = path;
  });
}

/** Calls `cb` when progress changes in this tab or in another tab. */
export function onProgressChange(cb: () => void): void {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', (e) => {
    if (e.key === PROGRESS_KEY || e.key === null) cb();
  });
}

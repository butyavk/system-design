// Layout of the skill-map overview: every topic as a socket in a left-to-right tree.
// Columns follow prerequisites (a topic always sits right of everything it needs), with a
// floor per stage so practice and real-world topics stay on the right. Rows are arranged so
// that topics sit near what they need, which keeps the links short and mostly straight.
// Computed at build time; the page only toggles classes.
import { skillNodes, stages, trackOf } from '~/data/skill-map';

export const OV = {
  colW: 124,
  rowH: 66,
  socket: 34,
  padX: 16,
  padY: 14,
  /** Columns hold at most this many topics before topics without dependents move right. */
  cap: 9,
  /** Label box under a socket: text width, line height and line limit (match .sm-onode__t). */
  labelW: 120,
  lineH: 14,
  maxLines: 3,
};

// Advance widths of the label font (Onest at 0.72rem = 11.52px), measured in the browser.
// Regenerate them if the label font or size changes; the overview test checks for clipped labels.
const GLYPHS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZабвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ0123456789 -/().,:&+'’—–";
const WIDTHS = [6.4,7,6.4,7,6.6,4.2,7,6.8,2.5,2.9,6,2.5,9.4,6.8,6.9,7,7,4.3,5.9,4.3,6.6,6.2,9.7,5.9,6.9,6,7.7,7.5,8.1,8.3,7,6.9,8.3,8.4,3,6.4,7.2,6.6,9.9,8.5,8.8,7.3,8.8,7.6,7.5,6.6,8.4,7.9,11.3,6.8,7.1,6.9,6.4,6.6,6.3,5.2,6.8,6.6,6.6,8.8,5.9,6.9,6.9,6,6.4,8,6.5,6.9,6.6,6.9,6.4,5.4,6.3,8.3,5.9,6.7,6.1,9.1,9.3,6.8,7.8,6,6.3,9,6.1,7.7,7.5,7.5,6.6,8.2,7,7,9.9,7.2,8.4,8.4,7.2,8,9.9,8.4,8.8,8.4,7.2,8.2,6.6,7.1,9.6,6.8,8.3,7.6,11.1,11.3,8.4,9.7,7.3,8.2,11.4,7.6,7.7,4.2,6.5,6.9,7.3,7.1,7.2,5.8,7.2,7.1,3.1,5.3,5.5,3.5,3.5,2.9,3,2.9,7.8,6.3,2.6,3,8.7,6.7];
const ADV = new Map([...GLYPHS].map((ch, i) => [ch, WIDTHS[i]]));
const advance = (ch: string) => ADV.get(ch) ?? 8;
const textWidth = (s: string) => [...s].reduce((w, ch) => w + advance(ch), 0);

/** Lines a label wraps to in the overview (greedy wrapping, like the browser). */
export function labelLines(label: string): number {
  const lines = wrapLines(label);
  if (lines > OV.maxLines)
    throw new Error(`Skill map: the label "${label}" needs ${lines} lines on the overview (max ${OV.maxLines}). Give the node a shorter label in src/data/skill-map.ts.`);
  return lines;
}

function wrapLines(label: string): number {
  const space = advance(' ');
  // Lines are packed into a slightly narrower box than the real one, which covers kerning and
  // rendering differences between browsers: the estimate may only come out too high.
  const fit = OV.labelW / 1.04;
  let lines = 1;
  let cur = 0;
  for (const word of label.split(/\s+/).filter(Boolean)) {
    const w = textWidth(word);
    if (!cur) cur = w;
    else if (cur + space + w <= fit) cur += space + w;
    else {
      lines++;
      cur = w;
    }
    if (w > OV.labelW) lines += Math.ceil(w / OV.labelW) - 1;
  }
  return lines;
}

export interface OverviewNode {
  p: string;
  col: number;
  x: number; // socket centre
  y: number;
}
export interface OverviewEdge {
  from: string;
  to: string;
  d: string;
}
export interface Overview {
  width: number;
  height: number;
  nodes: OverviewNode[];
  edges: OverviewEdge[];
}

/** A link from a prerequisite (left) to the topic that needs it (right), between socket edges. */
export function edgePath(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const r = OV.socket / 2 + 2;
  const x1 = a.x + r;
  const x2 = b.x - r - 3;
  const dx = Math.max(24, (x2 - x1) / 2);
  return `M${x1} ${a.y}C${x1 + dx} ${a.y} ${x2 - dx} ${b.y} ${x2} ${b.y}`;
}

// Stage → first column it may use.
const STAGE_FLOOR = [0, 1, 2, 3, 5, 6];

export function overviewLayout(labelOf: (path: string) => string, include: (path: string) => boolean = () => true): Overview {
  const list = skillNodes.filter((n) => include(n.path));
  const needsOf = new Map(list.map((n) => [n.path, n.needs.filter(include)]));
  // Vertical room a topic takes: socket, then its label (one to three lines).
  const lines = new Map(list.map((n) => [n.path, labelLines(labelOf(n.path))]));
  const step = (p: string) => OV.socket + 3 + lines.get(p)! * OV.lineH + 7;
  const stageOf = (p: string) => stages.findIndex((s) => s.tracks.includes(trackOf(p)));
  const deps = new Map<string, string[]>();
  for (const n of list) for (const d of needsOf.get(n.path)!) deps.set(d, [...(deps.get(d) ?? []), n.path]);

  // 1. Columns: longest path from the roots, but never left of the stage floor.
  const col = new Map<string, number>();
  const colOf = (p: string): number => {
    if (col.has(p)) return col.get(p)!;
    const c = Math.max(STAGE_FLOOR[stageOf(p)], ...needsOf.get(p)!.map((d) => colOf(d) + 1));
    col.set(p, c);
    return c;
  };
  list.forEach((n) => colOf(n.path));

  // 2. Balance: topics nothing depends on may move right out of a crowded column.
  const maxCol = () => Math.max(...col.values());
  const count = (c: number) => [...col.values()].filter((v) => v === c).length;
  for (let c = 0; c <= maxCol(); c++) {
    const sinks = list.filter((n) => col.get(n.path) === c && !(deps.get(n.path)?.length)).reverse();
    while (count(c) > OV.cap && sinks.length) {
      const n = sinks.shift()!;
      let target = c + 1;
      while (count(target) >= OV.cap && target < maxCol()) target++;
      col.set(n.path, target);
    }
  }
  // A smaller plan can leave a stage's columns empty: close the gaps.
  const used = [...new Set(col.values())].sort((a, b) => a - b);
  for (const [p, c] of col) col.set(p, used.indexOf(c));

  // 3. Rows: start grouped by section, then pull each topic towards its neighbours.
  const order = new Map(list.map((n, i) => [n.path, i]));
  const columns: string[][] = [];
  for (const n of list) (columns[col.get(n.path)!] ??= []).push(n.path);
  columns.forEach((c) => c.sort((a, b) => order.get(a)! - order.get(b)!));
  // Topics with no links at all are placed last, into free rows of their column.
  const isolated = new Set(list.filter((n) => !needsOf.get(n.path)!.length && !deps.get(n.path)?.length).map((n) => n.path));
  const linked = columns.map((c) => (c ?? []).filter((p) => !isolated.has(p)));
  const y = new Map<string, number>();
  linked.forEach((c) => c.forEach((p, i) => y.set(p, i * OV.rowH)));

  const place = (c: string[], want: (p: string) => number) => {
    const desired = new Map(c.map((p) => [p, want(p)]));
    c.sort((a, b) => desired.get(a)! - desired.get(b)! || order.get(a)! - order.get(b)!);
    // Lay out top-down without overlaps, then shift so the column's centre matches.
    const pos: number[] = [];
    c.forEach((p, i) => (pos[i] = Math.max(desired.get(p)!, i ? pos[i - 1] + step(c[i - 1]) : -Infinity)));
    const shift = c.reduce((s, p, i) => s + desired.get(p)! - pos[i], 0) / c.length;
    c.forEach((p, i) => y.set(p, pos[i] + shift));
    // Re-run the overlap pass after the shift.
    c.forEach((p, i) => i && y.set(p, Math.max(y.get(p)!, y.get(c[i - 1])! + step(c[i - 1]))));
  };
  const mean = (ps: string[], fallback: number) => (ps.length ? ps.reduce((s, q) => s + y.get(q)!, 0) / ps.length : fallback);
  for (let pass = 0; pass < 8; pass++) {
    for (let c = 1; c < linked.length; c++) if (linked[c]?.length) place(linked[c], (p) => mean(needsOf.get(p)!, y.get(p)!));
    for (let c = linked.length - 2; c >= 0; c--) if (linked[c]?.length) place(linked[c], (p) => mean(deps.get(p) ?? [], y.get(p)!));
  }
  const top = y.size ? Math.min(...y.values()) : 0;
  columns.forEach((c) => {
    for (const p of (c ?? []).filter((q) => isolated.has(q))) {
      const taken = (c ?? []).filter((q) => q !== p && y.has(q));
      const clash = (slot: number) => taken.some((q) => slot < y.get(q)! + step(q) && y.get(q)! < slot + step(p));
      let slot = top;
      while (clash(slot)) slot += 6;
      y.set(p, slot);
    }
  });

  // 4. Normalise and build geometry.
  const minY = Math.min(...y.values());
  const nodes: OverviewNode[] = list.map((n) => ({
    p: n.path,
    col: col.get(n.path)!,
    x: OV.padX + col.get(n.path)! * OV.colW + OV.colW / 2,
    y: Math.round(OV.padY + y.get(n.path)! - minY + OV.socket / 2),
  }));
  const at = new Map(nodes.map((n) => [n.p, n]));
  const edges: OverviewEdge[] = [];
  for (const n of list) for (const d of needsOf.get(n.path)!) edges.push({ from: d, to: n.path, d: edgePath(at.get(d)!, at.get(n.path)!) });
  const width = OV.padX * 2 + (Math.max(...nodes.map((n) => n.col)) + 1) * OV.colW;
  const height = Math.max(...nodes.map((n) => n.y + OV.socket / 2 + 3 + lines.get(n.p)! * OV.lineH)) + OV.padY;
  return { width, height, nodes, edges };
}

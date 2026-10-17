#!/usr/bin/env python3
"""Check internal links and anchors in the built site.

Usage: python3 scripts/check_links.py dist [--base /system-design]
Reports links under the base path that point to missing pages or missing #anchors,
and stylesheets, scripts, icons and images that point to missing files.
"""
from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class Collector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []
        self.assets: list[str] = []
        self.ids: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])  # type: ignore[arg-type]
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])  # type: ignore[arg-type]
        elif tag == "link" and a.get("href") and a.get("rel") not in ("canonical", "alternate", "sitemap"):
            self.assets.append(a["href"])  # type: ignore[arg-type]
        elif tag in ("script", "img", "source") and a.get("src"):
            self.assets.append(a["src"])  # type: ignore[arg-type]


def parse(path: Path) -> Collector:
    c = Collector()
    c.feed(path.read_text(encoding="utf-8", errors="replace"))
    return c


def resolve(dist: Path, base: str, url_path: str) -> Path | None:
    rel = url_path[len(base):].lstrip("/")
    candidates = [dist / rel, dist / rel / "index.html", dist / (rel.rstrip("/") + ".html")]
    for c in candidates:
        if c.is_file():
            return c
    return None


def main() -> int:
    dist = Path(sys.argv[1] if len(sys.argv) > 1 else "dist")
    base = "/system-design"
    if "--base" in sys.argv:
        base = sys.argv[sys.argv.index("--base") + 1]
    pages = sorted(dist.rglob("*.html"))
    cache: dict[Path, Collector] = {}
    problems: list[str] = []
    checked = 0
    for page in pages:
        if page.name == "404.html":
            continue
        col = cache.setdefault(page, parse(page))
        for href in col.links:
            parts = urlsplit(href)
            if parts.scheme or parts.netloc:
                continue
            path, frag = unquote(parts.path), unquote(parts.fragment)
            if not path:  # same-page anchor
                target = page
            elif path.startswith("/"):
                if not path.startswith(base):
                    problems.append(f"{page.relative_to(dist)}: link outside base -> {href}")
                    continue
                target = resolve(dist, base, path)
                if target is None:
                    problems.append(f"{page.relative_to(dist)}: missing page -> {href}")
                    continue
            else:
                continue  # relative links are rare here; skip
            checked += 1
            if frag and target.suffix == ".html":
                tcol = cache.setdefault(target, parse(target))
                if frag not in tcol.ids and frag != "_top":
                    problems.append(f"{page.relative_to(dist)}: missing anchor -> {href}")
        for src in col.assets:
            parts = urlsplit(src)
            if parts.scheme or parts.netloc or not parts.path.startswith(base):
                continue
            checked += 1
            if resolve(dist, base, unquote(parts.path)) is None:
                problems.append(f"{page.relative_to(dist)}: missing file -> {src}")
    for p in problems:
        print(p)
    print(f"checked {checked} internal links in {len(pages)} pages; {len(problems)} problems")
    return 1 if problems else 0


if __name__ == "__main__":
    raise SystemExit(main())

# System Design Primer — restructured, updated, bilingual

**Site:** https://butyavk.github.io/system-design/ · [Русская версия](https://butyavk.github.io/system-design/ru/)

Learn how to design large-scale systems and prepare for system design interviews.
This is an adaptation of Donne Martin's
[The System Design Primer](https://github.com/donnemartin/system-design-primer)
(CC BY 4.0): the single 1,800-line README is rebuilt into a navigable site, every page is
rewritten and updated for 2026, and the whole thing is available in English and Russian.

## What's different from the original

| | Original | This site |
|---|---|---|
| Format | One long README | 61 pages in 13 sections, sidebar, full-text search, dark mode |
| Languages | English (+ community translations) | English and Russian, kept in sync page by page |
| Currency | Mostly 2017–2019 | Updated: HTTP/3, Kafka-style logs, distributed SQL, Valkey/Redis 8, SLOs, edge compute, OWASP Top 10:2025… |
| New topics | — | Object storage, event streaming, rate limiting, resilience patterns, observability, API styles, service meshes, consistent hashing, consensus and coordination, LLM-powered systems |
| Navigation | Table of contents | A skill map of every topic with its prerequisites, your progress, skipped topics and what to read next, shared with a 1–12-week study plan |
| Numbers | Static 2012 latency table | 2026 latency numbers with sources, interactive explorer, availability and estimation calculators |
| Flashcards | Anki decks to download | 150 on-site flashcards with spaced repetition, plus Anki decks in English and Russian exported from the same cards (`npm run flashcards`) |
| Diagrams | PNG images | Mermaid diagrams that follow the light/dark theme, stay readable on phones and open full-screen with zoom |
| Case studies | 8 system design + 6 OOD | Same problems, recomputed estimates, fixed code (Python 3.12), "what's different in 2026" sections |
| Links | Many dead | Every external link checked; dead ones replaced or removed |

## Sections

1. **Start here** — introduction, study plan, skill map, interview framework, back-of-the-envelope estimation
2. **Fundamentals & trade-offs** — performance vs scalability, latency vs throughput, CAP/PACELC, consistency, availability, consensus and coordination
3. **Networking & traffic** — DNS, CDN, load balancers, reverse proxy and API gateway
4. **Application architecture** — monolith vs microservices, service discovery and mesh, LLM-powered systems
5. **Databases & storage** — relational databases, replication, sharding, denormalization and tuning, NoSQL, SQL vs NoSQL, object storage
6. **Caching** — caching layers, cache strategies
7. **Asynchronism & messaging** — queues and back pressure, event streaming
8. **Communication & APIs** — HTTP, TCP/UDP, RPC vs REST, GraphQL/WebSockets/SSE/webhooks
9. **Reliability & security** — rate limiting, resilience patterns, observability, security
10. **Numbers & reference** — latency numbers, powers of two, availability numbers, flashcards (with Anki export)
11. **Practice: system design** — 8 case studies + more questions
12. **Practice: object-oriented design** — 6 problems with typed Python solutions
13. **Real-world systems** — foundational papers, company architectures, engineering blogs

## Run locally

Requires Node.js 22.12+.

```bash
npm install
npm run dev        # http://localhost:4321/system-design/
npm run build      # static site in dist/
```

Content lives in `src/content/docs/` (English) and `src/content/docs/ru/` (Russian).
Read [CONTENT_GUIDE.md](CONTENT_GUIDE.md) before editing, then run the checks:

```bash
npm run check:content     # MDX syntax, frontmatter, links, EN/RU twins
npm run check:diagrams    # every diagram renders and is at most 800px wide (needs: npx playwright install chromium)
npm run build             # also validates the skill map graph
npm run check:links       # internal links and anchors in dist/
npm run flashcards        # re-export the Anki decks after editing src/data/flashcards.ts
```

Pushes to `main` run the same checks, then build and deploy to GitHub Pages (`.github/workflows/deploy.yml`).
To publish your own copy, set **Settings → Pages → Source** to **GitHub Actions** and change `site`/`base` in `astro.config.mjs`.

## Credits and license

Based on [The System Design Primer](https://github.com/donnemartin/system-design-primer)
© Donne Martin, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
This adaptation restructures, rewrites, translates and updates the material and adds
interactive tools; it is not endorsed by the original author.

The content of this repository is licensed under [CC BY 4.0](LICENSE).

---

### По-русски

Переработанный и обновлённый к 2026 году System Design Primer на русском и английском:
61 страница в 13 разделах, поиск, тёмная тема, карта навыков с зависимостями между темами
и прогрессом, актуальные цифры задержек с источниками,
калькуляторы доступности и прикидочных расчётов, разборы задач с пересчитанными оценками,
новые страницы о консенсусе и координации и о системах на базе LLM, 150 карточек
с интервальными повторениями и колоды для импорта в Anki.
Сайт: https://butyavk.github.io/system-design/ru/

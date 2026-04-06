# lazy

**Type `start`. Get a startup.**

[![Claude Code](https://img.shields.io/badge/Runs%20on-Claude%20Code-blue?style=flat)](https://claude.ai/code)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

---

`lazy` is an autonomous startup factory built on top of [Claude Code](https://claude.ai/code). Drop `CLAUDE.md` into any directory, open Claude Code, type **start** — and watch seven AI agents research, name, design, architect, build, and code-review a complete startup from scratch.

No templates. No prompts to fill in. No configuration. Just `start`.

---

## What it builds

Every run produces a fully realized, unique startup based on what's actually trending that week:

```
factory-output/
  idea.md           trending idea with demand evidence
  business.md       product name, features, personas, pricing, roadmap
  frontend-spec.md  typography, colors, spacing, components, motion — zero AI slop
  backend-spec.md   stack, schema, API design, auth, infra — every decision justified
  frontend/         working Next.js app (13+ pages, real components, real data)
  backend/          working Hono API (routes, DB schema, jobs, AI integration)
  frontend-review.md  what the frontend reviewer found and fixed
  backend-review.md   what the backend reviewer found and fixed
```

---

## How it works

Seven agents run in four phases. Each one is a fully autonomous Claude instance with web access and file system permissions.

```
PHASE 1 — Research (sequential)
  scout        →  scrapes HN, Product Hunt, Reddit, LinkedIn for the week's best idea
  founder      →  names the product, writes the full business spec

PHASE 2 — Specification (parallel)
  design-strategist  →  every visual decision: exact fonts, hex values, component specs
  backend-architect  →  full stack architecture: DB schema, API design, auth, deployment

PHASE 3 — Build (parallel, plan-first)
  frontend-builder   →  plans then builds all pages and components
  backend-builder    →  plans then builds routes, schema, jobs, and AI integration

PHASE 4 — Review & Fix (parallel)
  frontend-reviewer  →  reviews the frontend, fixes every issue found, writes a report
  backend-reviewer   →  reviews the backend, fixes every issue found, writes a report
```

A live dashboard streams the status of every agent in real time.

```
┌─────────────────────────────────────────────────────┐
│  ◈ STARTUP FACTORY                       [ START ]  │
├─────────────────────────────────────────────────────┤
│  PHASE 1 — RESEARCH                                 │
│  [ scout ●running ]    [ founder ··pending ]        │
│                                                     │
│  PHASE 2 — SPECIFICATION                            │
│  [ design ··pending ]  [ backend-arch ··pending ]   │
│                                                     │
│  PHASE 3 — BUILD                                    │
│  [ frontend ··pending ] [ backend ··pending ]       │
│                                                     │
│  PHASE 4 — REVIEW                                   │
│  [ code-reviewer ··pending ]                        │
├─────────────────────────────────────────────────────┤
│  LIVE LOG                                           │
│  00:00:03  scout       started                      │
│  00:02:14  scout       completed ✓                  │
│  00:02:15  founder     started                      │
└─────────────────────────────────────────────────────┘
```

---

## Requirements

- [Claude Code](https://claude.ai/code) (CLI or desktop app)
- Node.js 18+ (for the dashboard)
- A Claude account with sufficient context (the full pipeline is token-heavy)

---

## Setup

```bash
# 1. Clone the repo into any working directory
git clone https://github.com/khaledbaccour/lazy
cd lazy

# 2. Install dashboard dependencies
cd dashboard && npm install && cd ..

# 3. Open Claude Code in this directory
claude .

# 4. Type this and press enter:
start
```

That's it. The dashboard auto-launches. Agents spin up. You watch.

---

## The dashboard

The dashboard runs locally at `http://localhost:3004` (ports 3000–3002 are often occupied — adjust `dashboard/server.js` if needed).

- **Agent cards** pulse green when running, turn blue when complete, red on error
- **Live log** streams every agent transition in real time
- **View output** button appears on each card when its file is ready — click to read it inline
- **Start button** re-triggers the pipeline from the dashboard (for future runs)

---

## Output example

Here's what a recent run produced:

**Signyl** — *AI-native product discovery for PMs*

> The scout found: YC's Spring 2026 RFS listed "AI for product discovery" as one of 8 funded categories. ChatPRD has 100K+ users proving demand for just the PRD piece. No tool covers the full loop from raw customer signal to evidence-backed PRD.

The founder named it **Signyl** (signal → product decisions), wrote a full business spec with 6 MVP features, two personas, three pricing tiers ($79–$149/seat), and a competitive analysis against 5 existing tools.

The design-strategist chose: Geist Sans + Geist Mono, warm parchment background (not white), amber brand accent, forest green interactive color, 4px base spacing unit, and a 240px collapsible sidebar — all justified against the product's "intelligence briefing" aesthetic.

The backend-architect chose: TypeScript + Hono + Neon Postgres + Drizzle + Inngest + OpenAI (GPT-4o for PRD generation, text-embedding-3-small for semantic clustering), deployed to Railway.

The builders produced 44 frontend files and 56 backend files. The frontend reviewer found 7 issues and fixed all 7. The backend reviewer found 5 issues and fixed 4 — one left unfixed (requires a real Clerk webhook secret to test).

---

## Design philosophy

The design-strategist has a hard anti-slop mandate baked into its prompt. It explicitly rejects:

- Blue primary color "because it's trustworthy"
- Inter font "because it's neutral"
- Rounded corners everywhere with the same radius
- Shadow-md on every card
- Testimonial carousels
- Generic hero with a gradient and a big centered headline
- Stock photography of laptops on desks

Every visual decision is justified, specific, and tied to the product's personality — not a template.

---

## Customization

The entire system lives in `CLAUDE.md`. Every agent prompt, phase rule, and output format is defined there in plain language. Edit it to:

- Change the research sources the scout searches
- Adjust naming constraints for the founder
- Add or remove components from the design spec
- Swap the backend stack (e.g., Go instead of TypeScript)
- Add more build agents (mobile, documentation, landing page)
- Change the reviewer's severity thresholds

The pipeline is just Claude reading a markdown file and following instructions. You have full control.

---

## Limitations

- **Cost:** A full run uses significant tokens across 7 agents. Expect meaningful Claude API usage.
- **Time:** The full pipeline takes 20–45 minutes depending on how thorough the builders are.
- **No deployment:** The output is a codebase, not a deployed product. You still need to add real API keys, run migrations, and deploy.
- **Research quality:** The scout uses web search, but trending topics vary. Some runs find stronger ideas than others.
- **Code quality:** The builders produce good starting codebases, not production-grade code. The reviewer flags issues — you still need to fix them.

---

## Contributing

PRs welcome. Ideas that would make this better:

- A mobile builder agent (React Native / Expo)
- A landing page agent (separate from the app)
- A documentation agent (API docs, user guides)
- A deployment agent (auto-deploys to Railway/Render/Vercel)
- Persistent memory across runs (so the scout remembers past ideas)
- A web UI for configuring the pipeline without editing CLAUDE.md

---

## License

MIT — do whatever you want with it.

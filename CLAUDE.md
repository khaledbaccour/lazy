# CLAUDE.md — Autonomous Startup Factory

## Overview

This project is an autonomous multi-agent startup factory. When the user types **"start"**, Claude Code orchestrates a full team of specialized agents that research a trending startup idea, name it, design it, architect it, and build it — all visualized in a locally hosted dashboard.

---

## Trigger: The "start" Command

When the user sends the message **"start"** (case-insensitive), you must immediately do the following:

1. Launch the local visualization website (if not already running) on port **3001**
2. Create the agent team using `TeamCreate`
3. Execute the full multi-phase agent pipeline described below
4. Stream all agent status updates to the visualization website in real-time via a local SSE (Server-Sent Events) endpoint

Do not ask clarifying questions. Do not describe what you are about to do at length. Simply say **"Factory starting."** and begin.

---

## Directory Structure

All generated outputs live under `./factory-output/`:

```
factory-output/
  idea.md              # Output from Agent 1 (raw research)
  business.md          # Output from Agent 2 (full business spec + name)
  frontend-spec.md     # Output from Agent 3 (design system + UI spec)
  backend-spec.md      # Output from Agent 4 (backend + DB architecture)
  frontend/            # Output from Agent 5 (actual frontend code)
  backend/             # Output from Agent 6 (actual backend code)
  review.md            # Output from Agent 7 (code review of frontend + backend)
```

Create this directory before launching agents.

---

## The Agent Pipeline

### PHASE 1 — Research (Sequential)

#### Agent 1: The Scout

**Name:** `scout`  
**Type:** `general-purpose`  
**Role:** Find the single best trending startup idea from the past 7 days.

**Instructions to give this agent:**

> Search the web for the most discussed, upvoted, and trending startup ideas, products, and launches from the past 7 days. Look at: Hacker News (Show HN), Product Hunt launches, Reddit r/startups, r/SideProject, r/entrepreneur, Twitter/X startup community, and any startup newsletters. Focus on ideas that are: (1) technically feasible to build as an MVP in weeks, (2) solving a real problem with clear demand signals, (3) not yet saturated or over-built. Pick ONE idea — the most compelling one. Write your findings to `factory-output/idea.md` in this format:
>
> ```
> # Trending Startup Idea
> 
> ## The Idea
> [2-3 sentence description]
> 
> ## Problem Being Solved
> [Clear, specific problem statement]
> 
> ## Why Now
> [Why is this trending this week specifically]
> 
> ## Target User
> [Exact persona — not "everyone", be specific]
> 
> ## Evidence of Demand
> [Links, upvote counts, comment counts, discussion threads]
> 
> ## Competitive Landscape
> [Who exists, what gap is open]
> 
> ## MVP Scope
> [What the smallest valuable version looks like]
> ```

**Output:** `factory-output/idea.md`  
**On completion:** Pass `idea.md` contents to Agent 2.

---

#### Agent 2: The Founder

**Name:** `founder`  
**Type:** `general-purpose`  
**Role:** Transform the raw idea into a full business specification and give it a memorable name.

**Instructions to give this agent:**

> Read `factory-output/idea.md`. You are a first-time founder with strong product instincts. Your job is to:
>
> 1. **Name the startup.** The name must be: one word, 4–8 characters, easy to spell, not a dictionary word (or a warped version of one), evokes the product's feeling without being literal. Good examples of the naming style: "Stripe", "Notion", "Loom", "Linear", "Supabase", "Vercel", "Retool", "Render". Bad examples: "StartupHelper", "IdeaGenius", "AppMaker". The name cannot be "Lazy", "Whisper", "Loom", "Notion", "Linear", "Stripe", or any already-used brand name. Check the web to confirm the .com domain availability vibe (don't need to verify, just make sure it doesn't already belong to a major product).
>
> 2. **Write the full business specification** in `factory-output/business.md`:
>
> ```markdown
> # [Product Name]
> ## Tagline
> [One sentence, punchy, no buzzwords]
>
> ## Problem
> [Detailed problem statement with user pain points]
>
> ## Solution
> [How this product solves it — product description, not pitch]
>
> ## Target User
> - Primary persona: [name, job, context]
> - Secondary persona: [if applicable]
>
> ## Core Features (MVP)
> ### Feature 1: [Name]
> [Description, user story, why it matters]
> ### Feature 2: [Name]
> [...]
> [4–6 features total]
>
> ## User Journey
> [Step-by-step: how a user discovers, signs up, and gets value in their first session]
>
> ## Monetization
> [How this makes money — be specific: pricing tiers, who pays, when]
>
> ## Competitive Advantage
> [What makes this defensible or differentiated]
>
> ## Success Metrics (First 90 Days)
> [3–5 concrete KPIs]
>
> ## Risks & Mitigations
> [Top 3 risks and how to handle them]
>
> ## Name Rationale
> [Why this name, what it evokes, how it fits the brand]
> ```

**Input:** `factory-output/idea.md`  
**Output:** `factory-output/business.md`  
**On completion:** Trigger Phase 2 (both Agent 3 and Agent 4 in parallel).

---

### PHASE 2 — Specification (Parallel)

Launch Agent 3 and Agent 4 simultaneously. Both receive `factory-output/business.md` as their primary context.

---

#### Agent 3: The Design Strategist

**Name:** `design-strategist`  
**Type:** `general-purpose`  
**Role:** Research and document every front-end design decision with anti-AI-slop specificity.

**Instructions to give this agent:**

> Read `factory-output/business.md`. You are a senior product designer who hates generic AI-generated UI. Your job is to research and specify every visual and UX decision for this product.
>
> **Anti-Slop Mandate:** Every choice you make must be deliberate and specific. No "clean and modern". No "professional look". No "blue and white color scheme". No "sans-serif font". No "card-based layout". If your output sounds like it could describe any SaaS product, rewrite it until it couldn't.
>
> Research the following using web search to find current, opinionated, specific recommendations from top designers in 2024–2025:
>
> **Typography**
> - Primary typeface: exact font name, weight range, where to get it (Google Fonts, Fontshare, etc.), what it communicates emotionally
> - Secondary/mono typeface: same detail
> - Type scale: exact px/rem values at each step (xs, sm, base, lg, xl, 2xl, 3xl, 4xl)
> - Line height values per scale step
> - Letter-spacing rules: when to use tracking, how much
> - Which text elements get which font (headings, body, labels, UI, code)
>
> **Color System**
> - Primary color: exact hex, HSL, RGB — not just "a warm orange", the specific value and why
> - Background: the exact shade (often not pure white or pure black — specify)
> - Surface colors: card backgrounds, input backgrounds, sidebar backgrounds
> - Text colors: primary text, secondary text, muted text (3 levels)
> - Accent/interactive color
> - Destructive/error color
> - Success color
> - Border color (subtle, default, strong — 3 levels)
> - Dark mode variants for all the above
> - Rationale: why these specific values match the product's personality
>
> **Spacing & Layout**
> - Base spacing unit (4px? 6px? 8px?)
> - Grid system: columns, gutters, max-width
> - Component spacing rules
> - Responsive breakpoints (exact px values)
> - Density: compact / comfortable / spacious — which and why
>
> **Components & Patterns**
> - Button styles: shape (radius), size variants, weight, states
> - Card design: radius, shadow (exact values), border or borderless
> - Input fields: height, radius, border treatment, focus ring
> - Navigation pattern: top nav / sidebar / hybrid — which and why for this product
> - Table/list patterns: when to use which
> - Loading states: skeleton or spinner — which and how
> - Empty states: philosophy and pattern
> - Modals/sheets: when to use, preferred pattern
>
> **Motion & Animation**
> - Easing curves: exact CSS cubic-bezier values for: entrance, exit, hover, press
> - Duration values: fast (UI feedback), medium (transitions), slow (page-level)
> - What gets animated and what stays static (strong opinions required)
>
> **Anti-AI-Slop Patterns to explicitly avoid:**
> - Generic hero with a gradient and a big centered headline
> - Blue primary color "because it's trustworthy"
> - Inter font "because it's neutral"
> - Rounded corners everywhere with the same radius
> - Shadow-md on every card
> - Testimonial carousels
> - Feature grids with icons that all look the same
> - Pricing tables that look like every SaaS pricing page
> - Stock photography of laptops on desks
> - "Get started for free" as the primary CTA
>
> Write everything to `factory-output/frontend-spec.md` with the following structure:
>
> ```markdown
> # Frontend Design Specification: [Product Name]
>
> ## Design Philosophy
> [3–5 sentences: what this product should feel like, what it should NOT feel like]
>
> ## Typography System
> [Full typeface spec as described above]
>
> ## Color System
> [Full color spec as described above, with hex values]
>
> ## Spacing & Layout System
> [Full spacing spec as described above]
>
> ## Component Specifications
> [Full component spec as described above]
>
> ## Motion System
> [Full animation spec as described above]
>
> ## Anti-Patterns Rejected
> [List every generic choice you explicitly decided against and why]
>
> ## Reference Inspirations
> [3–5 real products or design systems you drew from, with specific elements cited]
> ```

**Input:** `factory-output/business.md`  
**Output:** `factory-output/frontend-spec.md`

---

#### Agent 4: The Backend Architect

**Name:** `backend-architect`  
**Type:** `general-purpose`  
**Role:** Research and document every backend and infrastructure decision in exhaustive detail.

**Instructions to give this agent:**

> Read `factory-output/business.md`. You are a senior backend engineer who has built and scaled multiple products. Your job is to make every technical decision for the backend and document it completely.
>
> **Philosophy:** Choose boring, proven technology where reliability matters. Choose modern, sharp tools where developer velocity matters. Never choose something because it is trendy. Always justify every choice with a concrete reason tied to this specific product's needs.
>
> Document the following:
>
> **Runtime & Language**
> - Language and version: exact (e.g., Node.js 22, Python 3.12, Go 1.22)
> - Why this language for this product specifically
> - Package manager
>
> **Framework**
> - Exact framework name and version
> - Why this framework (performance? ecosystem? DX?)
> - What the router/handler pattern looks like
>
> **API Design**
> - REST vs GraphQL vs tRPC vs other — which and why
> - Versioning strategy
> - Authentication: JWT vs sessions vs OAuth — which, with which library
> - Authorization pattern: RBAC / ABAC / policy-based — which and how implemented
> - Rate limiting strategy
>
> **Database**
> - Primary database: exact name, version, managed service (e.g., Supabase Postgres, PlanetScale MySQL, Turso SQLite)
> - Why this database for this specific data model
> - Schema design: list every table/collection, columns, indexes, relationships
> - Migration strategy: which tool, how applied
> - Caching layer: Redis / Dragonfly / none — which and why
> - Full-text search: Postgres FTS / Meilisearch / Typesense / Algolia — which and why
>
> **File Storage**
> - Where user uploads go (S3/R2/Supabase Storage/local)
> - Max file size, accepted types, virus scanning strategy
>
> **Background Jobs**
> - Job queue: BullMQ / Inngest / Trigger.dev / none — which and why
> - What jobs exist and their retry/failure strategy
>
> **Email**
> - Transactional email provider (Resend / Postmark / SES)
> - Email templates strategy
>
> **Real-time**
> - WebSockets / SSE / polling — which and why
> - Library/service used
>
> **Deployment & Infrastructure**
> - Where it runs: Railway / Render / Fly.io / Vercel / AWS — which and why
> - Environment variables: full list with descriptions (no values)
> - CI/CD pipeline: what triggers what
> - Logging: what gets logged, where it goes
> - Error tracking: which service
> - Uptime monitoring: which service
>
> **Security**
> - Input validation library
> - SQL injection prevention strategy
> - XSS prevention strategy
> - CORS configuration
> - Secrets management
> - Rate limiting implementation
>
> **Development Environment**
> - How to set up locally (step by step)
> - Required services for local dev
> - `.env.example` contents with descriptions
>
> Write everything to `factory-output/backend-spec.md`:
>
> ```markdown
> # Backend Architecture Specification: [Product Name]
>
> ## Tech Stack Summary
> [Quick reference table: category → choice]
>
> ## Runtime & Framework
> [Full spec]
>
> ## API Design
> [Full spec]
>
> ## Database Architecture
> [Full spec including schema]
>
> ## Infrastructure & Deployment
> [Full spec]
>
> ## Security Model
> [Full spec]
>
> ## Background Processing
> [Full spec]
>
> ## Third-Party Integrations
> [Full list with rationale]
>
> ## Development Setup
> [Step-by-step local setup]
>
> ## Architecture Decisions Log
> [Every major choice and the reason it beat alternatives]
> ```

**Input:** `factory-output/business.md`  
**Output:** `factory-output/backend-spec.md`

---

### PHASE 3 — Build (Parallel, after Phase 2 completes)

Wait for BOTH `factory-output/frontend-spec.md` AND `factory-output/backend-spec.md` to exist and be complete before launching Phase 3.

Launch Agent 5 and Agent 6 simultaneously.

---

#### Agent 5: The Frontend Builder

**Name:** `frontend-builder`  
**Type:** `general-purpose`  
**Mode:** Start in **plan mode**, then switch to **build mode**

**Instructions to give this agent:**

> Read `factory-output/business.md` and `factory-output/frontend-spec.md` thoroughly.
>
> **PLAN MODE FIRST:** Before writing any code, create a complete implementation plan covering:
> - Directory and file structure
> - Every page/route and what it renders
> - Component tree for each page
> - State management approach
> - Data fetching strategy
> - Which third-party UI primitives to use (Radix UI, Headless UI, etc.)
> - How design tokens from the spec map to CSS variables or Tailwind config
> - Build tooling (Vite / Next.js / etc.)
>
> Present this plan clearly. Then switch to build mode and implement:
>
> - Full project scaffold with all config files
> - Design token system (CSS variables or Tailwind theme) matching `frontend-spec.md` exactly
> - All pages listed in the business spec
> - All reusable components
> - Navigation
> - Responsive layouts
> - Loading and empty states
> - Dark mode (if specified)
>
> **Code Quality Rules:**
> - No placeholder "TODO" comments — implement or omit
> - No console.log statements
> - Tailwind classes must match the design spec values (don't use default Tailwind if the spec calls for custom values)
> - All interactive elements must have hover, focus, and active states
> - No Lorem Ipsum — use realistic dummy content that matches the product
>
> Output all code to `factory-output/frontend/`.

**Input:** `factory-output/business.md`, `factory-output/frontend-spec.md`  
**Output:** `factory-output/frontend/`

---

#### Agent 6: The Backend Builder

**Name:** `backend-builder`  
**Type:** `general-purpose`  
**Mode:** Start in **plan mode**, then switch to **build mode**

**Instructions to give this agent:**

> Read `factory-output/business.md` and `factory-output/backend-spec.md` thoroughly.
>
> **PLAN MODE FIRST:** Before writing any code, create a complete implementation plan covering:
> - File/folder structure
> - Every API endpoint (method, path, request body, response body)
> - Every database model with exact fields and types
> - Middleware chain
> - Auth flow step by step
> - Error handling strategy
> - How environment variables are loaded and validated
>
> Present this plan clearly. Then switch to build mode and implement:
>
> - Full project scaffold with all config files
> - Database schema with migrations
> - All API routes
> - Auth middleware
> - Input validation on every endpoint
> - Error handling middleware
> - All background jobs if specified
> - Environment variable validation at startup
> - Health check endpoint
> - README with setup instructions
>
> **Code Quality Rules:**
> - Every endpoint must validate its inputs — no raw `req.body` access without validation
> - Every database query must handle errors explicitly
> - No hardcoded values — all config via environment variables
> - SQL queries must use parameterized statements always
> - No dead code or unused imports
>
> Output all code to `factory-output/backend/`.

**Input:** `factory-output/business.md`, `factory-output/backend-spec.md`  
**Output:** `factory-output/backend/`

---

### PHASE 4 — Code Review (Sequential, after Phase 3 completes)

Wait for BOTH `factory-output/frontend/` AND `factory-output/backend/` to be complete before launching Phase 4.

---

#### Agent 7: The Code Reviewer

**Name:** `code-reviewer`  
**Type:** `general-purpose`  
**Role:** Review all generated frontend and backend code for bugs, security issues, quality problems, and spec compliance.

**Instructions to give this agent:**

> You are a senior staff engineer doing a thorough code review of a freshly generated codebase. You are reviewing two codebases:
>
> 1. `factory-output/frontend/` — a Next.js 14 frontend
> 2. `factory-output/backend/` — a Hono + TypeScript backend
>
> Also read the specs the builders were supposed to follow:
> - `factory-output/frontend-spec.md` — design system the frontend must match
> - `factory-output/backend-spec.md` — architecture the backend must match
> - `factory-output/business.md` — product requirements both must satisfy
>
> **Your review must cover:**
>
> **Security**
> - Any hardcoded secrets, API keys, or credentials
> - SQL injection risks (unparameterized queries)
> - XSS vulnerabilities (unescaped output, unsafe innerHTML)
> - Missing input validation on API endpoints
> - Exposed sensitive data in API responses
> - Insecure authentication or authorization gaps
> - Missing rate limiting on sensitive endpoints
>
> **Correctness**
> - Logic errors or wrong assumptions
> - Unhandled error cases or missing error boundaries
> - Broken or missing TypeScript types (any abuse, missing interfaces)
> - Incorrect async/await usage or unhandled promise rejections
> - Missing null/undefined guards
> - Dead code or unreachable branches
>
> **Spec Compliance — Frontend**
> - Do the CSS variables in `globals.css` match the exact hex values in `frontend-spec.md`?
> - Are the correct fonts (Geist Sans / Geist Mono) actually loaded and applied?
> - Are spacing values consistent with the spec's base unit and scale?
> - Do components have hover, focus, and active states as required?
> - Is there any Lorem Ipsum or placeholder content that should be realistic?
>
> **Spec Compliance — Backend**
> - Does the schema match the tables and columns defined in `backend-spec.md`?
> - Are all required API endpoints present?
> - Is env validation (Zod at startup) actually implemented?
> - Is multi-tenant data isolation (workspace_id scoping) applied to every query?
> - Are all background jobs from the spec implemented?
>
> **Code Quality**
> - Unnecessary complexity or over-engineering
> - Duplicated logic that should be shared utilities
> - Missing indexes on frequently queried columns
> - N+1 query patterns in route handlers
> - Inconsistent error response formats
> - Missing or incorrect HTTP status codes
>
> **For each finding, use this format:**
>
> ```
> ### [SEVERITY] [Category] — File: path/to/file.ts (line X)
> **Finding:** [What the problem is]
> **Risk:** [Why it matters]
> **Fix:** [Concrete code or change to resolve it]
> ```
>
> Severity levels: `CRITICAL` (security/data loss) · `HIGH` (broken functionality) · `MEDIUM` (quality/spec drift) · `LOW` (style/minor)
>
> Write the full review to `factory-output/review.md`:
>
> ```markdown
> # Code Review — [Product Name]
>
> ## Summary
> - Files reviewed: [N frontend files, N backend files]
> - Total findings: [N] ([N] critical, [N] high, [N] medium, [N] low)
> - Overall assessment: [one sentence verdict]
>
> ## Critical Findings
> [All CRITICAL items]
>
> ## High Findings
> [All HIGH items]
>
> ## Medium Findings
> [All MEDIUM items]
>
> ## Low Findings
> [All LOW items]
>
> ## Spec Compliance
> ### Frontend vs frontend-spec.md
> [Checklist of spec requirements — ✓ met or ✗ missed with details]
>
> ### Backend vs backend-spec.md
> [Checklist of spec requirements — ✓ met or ✗ missed with details]
>
> ## What Was Done Well
> [3–5 genuinely good things about the code — be specific]
>
> ## Recommended Fix Order
> [Prioritized list: fix these first, in this order, and why]
> ```

**Input:** `factory-output/frontend/`, `factory-output/backend/`, `factory-output/frontend-spec.md`, `factory-output/backend-spec.md`, `factory-output/business.md`  
**Output:** `factory-output/review.md`  
**On completion:** Report findings summary to team lead. Pipeline is done.

---

## The Visualization Website

### Purpose

A locally hosted single-page application that:
1. Shows the pipeline status in real-time (which agent is running, what it's doing)
2. Has a **"Start"** button that triggers the entire agent flow by sending a message to the Claude Code session
3. Displays each agent's output files as they complete
4. Shows a live log of agent activity

### Tech Stack

- **Server:** Node.js with Express (single file, `dashboard/server.js`)
- **Client:** Single HTML file with vanilla JS + CSS (`dashboard/index.html`) — no build step, no framework
- **Real-time updates:** Server-Sent Events (SSE) at `GET /events`
- **Start trigger:** `POST /start` endpoint that invokes the Claude Code pipeline
- **File reading:** `GET /output/:filename` to read files from `factory-output/`

> **Port note:** Ports 3000–3002 are occupied on this machine. Dashboard runs on **3004**.

### Dashboard UI Spec

The dashboard must look like a **mission control panel**, not a generic SaaS app. Think: dark background, monospace font for logs, colored status indicators, agent cards that animate when active.

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  ◈ STARTUP FACTORY              [START]              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PHASE 1 — RESEARCH                                 │
│  ┌──────────────┐  ┌──────────────────────────────┐ │
│  │ 🔍 SCOUT     │→ │ 🚀 FOUNDER                   │ │
│  │ [status]     │  │ [status]                     │ │
│  └──────────────┘  └──────────────────────────────┘ │
│                                                     │
│  PHASE 2 — SPECIFICATION                            │
│  ┌──────────────┐  ┌──────────────────────────────┐ │
│  │ 🎨 DESIGN    │  │ ⚙️  BACKEND ARCHITECT         │ │
│  │ [status]     │  │ [status]                     │ │
│  └──────────────┘  └──────────────────────────────┘ │
│                                                     │
│  PHASE 3 — BUILD                                    │
│  ┌──────────────┐  ┌──────────────────────────────┐ │
│  │ 💻 FRONTEND  │  │ 🗄️  BACKEND BUILDER           │ │
│  │ [status]     │  │ [status]                     │ │
│  └──────────────┘  └──────────────────────────────┘ │
│                                                     │
├─────────────────────────────────────────────────────┤
│  LIVE LOG                                           │
│  > [timestamp] Agent scout: searching web...        │
│  > [timestamp] Agent founder: naming product...     │
│  > ...                                              │
└─────────────────────────────────────────────────────┘
```

**Visual style:**
- Background: `#0a0a0a`
- Surface: `#111111`
- Border: `#1f1f1f`
- Text primary: `#f0f0f0`
- Text muted: `#666666`
- Active agent glow: `#22c55e` (green pulse animation)
- Pending agent: `#333333`
- Complete agent: `#3b82f6` (blue)
- Error agent: `#ef4444` (red)
- Font: `'Berkeley Mono'` or `'JetBrains Mono'` or `monospace` fallback
- START button: white background, black text, no rounded corners — stark and intentional

**Agent card states:**
- `pending`: dim, dashed border, gray icon
- `running`: bright border, pulsing green dot, animated gradient background
- `complete`: solid border, static blue, checkmark
- `error`: red border, error icon

### How "Start" Works

The `POST /start` endpoint should write a trigger file `factory-output/.start_trigger` with a timestamp. The Claude Code process polls for this file (or the dashboard can use `RemoteTrigger` if available). When triggered, Claude Code picks up the signal and begins the agent pipeline.

Alternatively: the dashboard can use `mcp__commands__run_process` to directly invoke the Claude Code CLI with the "start" message if running in an MCP context.

**Status updates:** As each agent progresses, Claude Code writes status JSON to `factory-output/status.json`:

```json
{
  "started_at": "ISO timestamp",
  "agents": {
    "scout": { "status": "complete", "started_at": "...", "completed_at": "...", "log": ["..."] },
    "founder": { "status": "running", "started_at": "...", "log": ["..."] },
    "design-strategist": { "status": "pending", "log": [] },
    "backend-architect": { "status": "pending", "log": [] },
    "frontend-builder": { "status": "pending", "log": [] },
    "backend-builder": { "status": "pending", "log": [] },
    "code-reviewer": { "status": "pending", "log": [] }
  }
}
```

The SSE endpoint streams this file's contents every 2 seconds to the browser.

---

## TeamCreate Configuration

When the user says "start", create the team with:

```
TeamCreate({
  name: "startup-factory",
  agents: [
    { name: "scout",              role: "Trending startup idea researcher" },
    { name: "founder",            role: "Business developer and namer" },
    { name: "design-strategist",  role: "Frontend design specification author" },
    { name: "backend-architect",  role: "Backend architecture specification author" },
    { name: "frontend-builder",   role: "Frontend code implementer" },
    { name: "backend-builder",    role: "Backend code implementer" },
    { name: "code-reviewer",      role: "Frontend and backend code reviewer" }
  ]
})
```

Agents are launched in sequence / parallel as described in the pipeline above. Use `SendMessage` to pass context between agents as each phase completes.

---

## Status File Management

Before launching each agent, update `factory-output/status.json` to set that agent's status to `"running"`. When the agent's `SendMessage` resolves, set it to `"complete"`. On any exception, set it to `"error"` with the error message in the log.

Example update flow:

```
1.  Write status.json: scout → running
2.  Launch scout agent (await completion)
3.  Write status.json: scout → complete
4.  Write status.json: founder → running
5.  Launch founder agent (await completion)
6.  Write status.json: founder → complete
7.  Write status.json: design-strategist → running, backend-architect → running
8.  Launch both in parallel (await both)
9.  Write status.json: design-strategist → complete, backend-architect → complete
10. Write status.json: frontend-builder → running, backend-builder → running
11. Launch both in parallel (await both)
12. Write status.json: frontend-builder → complete, backend-builder → complete
13. Write status.json: code-reviewer → running
14. Launch code-reviewer agent (await completion)
15. Write status.json: code-reviewer → complete, phase → done
```

---

## First-Run Setup

When the user says "start" for the very first time (or if `dashboard/` does not exist):

1. Create `factory-output/` directory
2. Create `dashboard/server.js` and `dashboard/index.html` (the visualization website)
3. Install dashboard dependencies: `express` (if not present)
4. Launch dashboard on port **3001**
5. Tell the user: "Dashboard running at http://localhost:3001 — beginning agent pipeline."
6. Proceed with the agent pipeline

---

## Constraints & Rules

- **Never skip phases.** Phase 2 cannot start until Phase 1 is complete. Phase 3 cannot start until Phase 2 is complete.
- **Never fabricate research.** Agent 1 must use real web search — no hallucinated startup ideas.
- **Never write generic code.** Agent 5 must use the exact design tokens from `frontend-spec.md`. Spot-checking the color and font values is acceptable.
- **Never hardcode secrets.** Agent 6 must use environment variables for all credentials.
- **Always validate inputs.** Every API endpoint Agent 6 builds must validate its request body.
- **Plan before build.** Agents 5 and 6 must complete a written plan before writing code. This is not optional.
- **Do not stop on partial failure.** If one parallel agent errors, the other should continue. Log the error in `status.json` and continue the pipeline with whatever is available.

---

## Output on Completion

When all six agents have completed, print a summary:

```
Factory complete.

Product: [Name from business.md]
Tagline: [Tagline from business.md]

Output files:
  factory-output/idea.md
  factory-output/business.md
  factory-output/frontend-spec.md
  factory-output/backend-spec.md
  factory-output/frontend/
  factory-output/backend/
  factory-output/review.md

Review summary: [N critical, N high, N medium, N low findings]

Dashboard: http://localhost:3004
```

---

## Error Recovery

If an agent fails:
- Log the error to that agent's `status.json` entry
- Do not retry automatically
- Continue the pipeline with a warning if the failure is non-blocking (e.g., one of two parallel agents fails)
- Halt the pipeline if a blocking agent fails (scout or founder), and tell the user which agent failed and why

---

## Notes for Future Claude Sessions

- This file defines the full system. When "start" is typed, follow it exactly.
- The pipeline is deterministic in sequence but parallel within phases.
- The dashboard is a static HTML + Express server — keep it simple, no build tools.
- Every agent writes its own output file. Claude orchestrates by reading those files and passing their content via `SendMessage`.
- The `status.json` file is the single source of truth for the dashboard.
- Port **3004** is the canonical dashboard port (3000, 3001, and 3002 are all occupied on this machine).

# LaunchX — Product Requirements Document

> **The AI-native product launch platform built for the age of agents.**

---

## Table of Contents

1. [Vision & First Principles](#1-vision--first-principles)
2. [Problem Statement](#2-problem-statement)
3. [Target Users](#3-target-users)
4. [The Two-Sided Marketplace](#4-the-two-sided-marketplace)
5. [Current State](#5-current-state)
6. [Epic Map](#6-epic-map)
7. [Phase 0 — Engineering Foundation](#phase-0--engineering-foundation)
8. [Phase 1 — Core Platform](#phase-1--core-platform)
9. [Phase 2 — Agent-Native Experience](#phase-2--agent-native-experience)
10. [Phase 3 — Marketplace & Monetisation](#phase-3--marketplace--monetisation)
11. [Data Model Reference](#data-model-reference)
12. [Technical Architecture](#technical-architecture)
13. [Success Metrics](#success-metrics)

---

## 1. Vision & First Principles

LaunchX is not a Product Hunt clone on X. It is a fundamentally different product built from first principles for how information will be created and consumed in the AI era.

### First Principles

**1. Agents are the primary interface, not browsers.**
The majority of future product discovery will happen through AI agents acting on behalf of knowledge workers — not through humans scrolling a feed. Every feature must work agent-first, with human UI as a secondary surface.

**2. Launch is a protocol, not a page.**
A product launch is a structured data event — not a webpage with an upvote button. Launches should be submittable from a terminal, an agent, an API call, or a CI/CD pipeline. The medium is irrelevant; the signal is everything.

**3. X engagement is the ranking signal, not internal votes.**
Product Hunt's upvote system is gameable and insular. LaunchX uses real-world X engagement (likes, reposts, replies, bookmarks, impressions) as the truth signal. If the market cares, X shows it.

**4. Curation must be personalised and autonomous.**
Knowledge brokers don't have time to scroll. Their agents should deliver a daily briefing of what matters *to them* — filtered by domain, scored by relevance, ranked by signal. The platform's job is to make every agent's feed uniquely valuable.

**5. The advertising model must be native to the protocol.**
Promoted launches are not banner ads. They are higher-priority signals injected into agent feeds and daily drops with full transparency. If it's promoted, agents and humans both know — and it still has to earn engagement to rank.

---

## 2. Problem Statement

Knowledge brokers — analysts, VCs, consultants, CTOs, developers, content creators — are drowning. Every day hundreds of new AI tools, developer products, and SaaS platforms launch. There is no curated, trustworthy, agent-accessible feed that tells them: *"Here's what launched today that matters to your work."*

Product Hunt solved this a decade ago for humans with browsers. But:

- **It's manual.** You have to visit, scroll, and click.
- **It's gameable.** Upvote rings distort signal.
- **It's not agent-accessible.** No MCP server, no structured API for agent consumption.
- **It's not personalised.** Everyone sees the same front page.
- **It doesn't meet knowledge workers where they are** — in terminals, in agent workflows, on X.

LaunchX solves this by building the platform agents need, that also happens to work for humans.

---

## 3. Target Users

### Supply Side: Makers

| Persona | How They Launch | What They Need |
|---------|----------------|----------------|
| **Solo developer** | `lx submit` from terminal after shipping | Instant, frictionless submission. No signup flow. |
| **Startup with AI agent** | Agent calls MCP `submit_launch` as part of release pipeline | Programmatic submission. Structured response. Status tracking. |
| **Marketing team** | API call from internal tooling or Zapier | API key auth. Scheduling. Analytics on engagement. |
| **Open source maintainer** | GitHub Action triggers launch on new release | CI/CD integration. Automatic enrichment. |

### Demand Side: Consumers

| Persona | How They Consume | What They Need |
|---------|------------------|----------------|
| **VC analyst** | Agent delivers daily brief filtered by category + funding stage | Personalised agent feed. Category filtering. AI summaries. |
| **CTO / Tech lead** | Agent monitors "developer-tools" + "infrastructure" categories | Real-time notifications via agent. Relevance scoring. |
| **Content creator** | Searches trending to find content topics | Trending endpoints. Engagement data. Embeddable cards. |
| **Developer** | Browses via CLI or MCP during work | Terminal-first experience. Fast search. Minimal friction. |
| **Casual browser** | X feed — sees daily drop threads | Native X experience. Video-first posts. Thread format. |

---

## 4. The Two-Sided Marketplace

```
 SUPPLY SIDE                          PLATFORM                         DEMAND SIDE
 ─────────                          ────────                         ───────────

 Terminal (CLI)  ──┐                                              ┌── Agent Feed (MCP)
 Agent (MCP)    ──┤                ┌─────────────┐               ├── CLI Search
 API            ──┼── Submit ────> │   LaunchX    │ ── Deliver ──┼── X Daily Drops
 CI/CD          ──┤                │   ────────   │               ├── API / Webhooks
 Web Form       ──┘                │  AI Enrich   │               └── Web Browse
                                   │  X Post      │
                                   │  Score/Rank  │
                                   │  Schedule    │
                                   └─────────────┘
                                         │
                                    Promoted Launches
                                    (transparent, native)
```

**The flywheel:**
1. Makers submit launches → platform enriches with AI and posts to X
2. X engagement generates signal → signal ranks launches
3. Agents deliver ranked, personalised feeds to consumers
4. Consumers engage on X → more signal → better ranking
5. Better ranking → more makers want to launch here
6. More makers → promoted launch revenue → platform sustainability

---

## 5. Current State

The initial codebase (`launchx-initial/`) provides a working skeleton:

| Component | Status | Notes |
|-----------|--------|-------|
| Shared types | Functional | Good domain model, needs expansion for agent feeds |
| REST API | Functional (bugs) | Inner join bug, no rate limiting, no tests |
| CLI | Functional | Submit, search, trending, categories |
| MCP Server | Functional (duplicated) | Reimplements API logic, needs to share service layer |
| Tests | None | Zero coverage |
| CI/CD | None | No GitHub Actions, no linting config |
| AI enrichment | Stubbed | Fields exist, no implementation |
| X integration | Stubbed | Fields exist, no implementation |
| Daily drops | Stubbed | Types exist, no service logic |
| Database schema | Undocumented | Must be inferred from TypeScript types |
| `.env.example` | Missing | README references it but it doesn't exist |

**See:** [`REVIEW.md`](../REVIEW.md) for the detailed code review with specific bugs and line references.

---

## 6. Epic Map

Epics are organised into four phases. Phase 0 is engineering hygiene — the foundation everything else builds on. Phases 1-3 deliver product value.

```
Phase 0: Engineering Foundation       Phase 1: Core Platform
├── E0.1 System Setup                 ├── E1.1 Launch Submission (Maker)
├── E0.2 CI/CD Pipeline               ├── E1.2 Search & Discovery (Consumer)
├── E0.3 Branch Strategy               ├── E1.3 AI Enrichment Pipeline
├── E0.4 PR Management                 ├── E1.4 X Integration
├── E0.5 Code Quality & Linting        └── E1.5 Daily Drops
└── E0.6 Bug Fixes from Review

Phase 2: Agent-Native Experience       Phase 3: Marketplace & Monetisation
├── E2.1 MCP Consumer Feeds            ├── E3.1 Promoted Launches
├── E2.2 Agent Personalisation          ├── E3.2 Analytics Dashboard
├── E2.3 Webhook / Push Delivery       ├── E3.3 Maker Profiles & Reputation
└── E2.4 CLI Power User Features       └── E3.4 Web Experience
```

---

## Phase 0 — Engineering Foundation

> *Get the house in order before building new rooms.*

### E0.1 — System Setup

**Goal:** Any contributor can clone the repo, run one command, and have a working dev environment with clear documentation of every dependency.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E0.1.1 | **Create `.env.example`** with all required environment variables documented | File exists at repo root with `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT`, `LAUNCHX_API_URL` — each with a comment explaining its purpose. README `cp .env.example .env` command works. |
| E0.1.2 | **Create Supabase database migration files** defining all tables, indexes, and RLS policies | `supabase/migrations/` directory contains SQL files that create `launches`, `makers`, `categories`, `daily_drops`, `daily_drop_launches`, `api_keys` tables. Schema matches TypeScript types in `shared/src/types.ts`. Running `supabase db push` creates a working database. |
| E0.1.3 | **Add seed data script** for local development | `supabase/seed.sql` populates categories, a test maker, a test API key, and 5 sample launches across different statuses. Developers can immediately test search/trending after seeding. |
| E0.1.4 | **Document local development setup** in README | README includes: prerequisites (Node 20+, Supabase CLI), step-by-step setup, how to run each package, how to run tests, how to create a migration. |
| E0.1.5 | **Add `engines` field and `.nvmrc`** for Node version pinning | `.nvmrc` set to `20`. `package.json` engines field already present — verify it's respected. Add `engine-strict=true` to `.npmrc`. |
| E0.1.6 | **Verify monorepo workspace resolution** | `npm install` from root installs all workspace dependencies. `npm run build` compiles all packages. `npm run typecheck` passes. Cross-package imports (`@launchx/shared`) resolve correctly. |

---

### E0.2 — CI/CD Pipeline

**Goal:** Every push and pull request is automatically validated. Nothing merges to `main` without passing checks.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E0.2.1 | **Create GitHub Actions CI workflow** for pull requests | `.github/workflows/ci.yml` runs on every PR to `main`. Jobs: install deps, typecheck, lint, test. Runs on Node 20. Uses npm cache for speed. |
| E0.2.2 | **Create GitHub Actions CI workflow** for pushes to `main` | Same checks as PR workflow, plus: build all packages to verify production compilation succeeds. |
| E0.2.3 | **Add status checks as required** in branch protection | `main` branch requires all CI checks to pass before merge. At least 1 approving review required. No direct pushes to `main`. |
| E0.2.4 | **Add Dependabot configuration** for dependency updates | `.github/dependabot.yml` monitors npm dependencies. Weekly update schedule. Auto-opens PRs for patch and minor updates. Groups updates by package ecosystem. |
| E0.2.5 | **Add a build matrix** for future Node version compatibility | CI workflow tests against Node 20 and Node 22 to ensure forward compatibility. |

---

### E0.3 — Branch Strategy

**Goal:** Clear, documented branching model that supports parallel development without merge conflicts or confusion.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E0.3.1 | **Document branching strategy** in `CONTRIBUTING.md` | File defines: `main` is production-ready, always deployable. Feature branches: `feat/<epic>/<short-description>`. Bug fixes: `fix/<short-description>`. Releases: `release/vX.Y.Z`. Hotfixes: `hotfix/<description>`. Branch naming examples provided. |
| E0.3.2 | **Configure branch protection rules** on `main` | Direct pushes disabled. Force pushes disabled. Require PR with at least 1 review. Require status checks to pass. Require branches to be up to date before merging. Require linear history (squash merge default). |
| E0.3.3 | **Add branch naming validation** in CI | GitHub Action or pre-push hook validates branch names match the pattern: `(feat|fix|hotfix|release|chore|docs)/[a-z0-9-]+`. Blocks pushes with non-conforming names. Exception for `main` and `claude/*` branches. |
| E0.3.4 | **Document stale branch cleanup policy** | `CONTRIBUTING.md` states: branches are deleted after merge. Branches inactive for 30+ days are flagged for cleanup. GitHub auto-delete head branches on merge is enabled. |

---

### E0.4 — PR Management

**Goal:** Every PR tells a clear story, is easy to review, and creates an auditable history of decisions.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E0.4.1 | **Create PR template** | `.github/pull_request_template.md` includes: Summary (what and why), Test plan (how it was verified), Checklist (tests pass, types pass, no console.logs, docs updated if needed). |
| E0.4.2 | **Create issue templates** for bugs, features, and tasks | `.github/ISSUE_TEMPLATE/bug_report.md` with reproduction steps, expected/actual behaviour. `.github/ISSUE_TEMPLATE/feature_request.md` with problem statement, proposed solution, alternatives considered. `.github/ISSUE_TEMPLATE/task.md` for engineering chores. |
| E0.4.3 | **Configure PR labels** | Labels created: `bug`, `feature`, `chore`, `docs`, `breaking`, `needs-review`, `blocked`, `phase-0`, `phase-1`, `phase-2`, `phase-3`. Documented in `CONTRIBUTING.md`. |
| E0.4.4 | **Add CODEOWNERS file** | `.github/CODEOWNERS` assigns: `packages/api/` to API owners, `packages/cli/` to CLI owners, `packages/mcp-server/` to MCP owners, `packages/shared/` to all. Root config files to maintainers. |
| E0.4.5 | **Document PR review standards** in `CONTRIBUTING.md` | Standards include: PRs should be small (< 400 lines diff preferred). One logical change per PR. Reviewers check for: correctness, test coverage, type safety, security implications. Review SLA: 24 hours for first review. |
| E0.4.6 | **Configure squash merge as default** with conventional commit format | Repository settings: default merge strategy is squash. Squash commit message uses PR title. PR titles must follow conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`. |

---

### E0.5 — Code Quality & Linting

**Goal:** Consistent code style enforced automatically. No style debates in PRs.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E0.5.1 | **Configure ESLint** across all packages | Root `.eslintrc.cjs` with TypeScript parser. Rules: no `any` (warn), no unused vars (error), no console in production code (warn). Package-specific overrides where needed. `npm run lint` exits 0 on current codebase after fixes. |
| E0.5.2 | **Configure Prettier** for code formatting | Root `.prettierrc` with: 2 space indent, double quotes, trailing commas, 100 char line width. `.prettierignore` for dist/node_modules. `npm run format` command added. |
| E0.5.3 | **Add pre-commit hooks** via Husky + lint-staged | `npx husky install` configured. Pre-commit hook runs lint-staged: ESLint fix + Prettier format on staged `.ts` files. Typecheck runs on commit. |
| E0.5.4 | **Replace placeholder lint/test scripts** | Every workspace `package.json` has real `lint`, `test`, and `typecheck` scripts. Root scripts delegate to workspaces. `npm run lint` and `npm run test` from root run all workspace checks. |
| E0.5.5 | **Add EditorConfig** for cross-editor consistency | `.editorconfig` at repo root: UTF-8, LF line endings, 2 space indent for TS/JSON, trim trailing whitespace, final newline. |

---

### E0.6 — Bug Fixes from Review

**Goal:** Address all critical and moderate bugs identified in the initial code review before building new features.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E0.6.1 | **Fix inner join in search query** | `launch.ts` search method uses left join (remove `!inner` from categories and makers). Launches without a category appear in search results. Test: insert a launch with `category_id: null`, verify it appears in search. |
| E0.6.2 | **Fix `ai_tags` array search** | Replace `ai_tags.cs.{${query}}` with a working approach — either remove array search from the `or` clause and handle separately, or use proper PostgREST array contains syntax. Test: search for a term that exists in `ai_tags` returns the launch. |
| E0.6.3 | **Fix MCP `agent_id` default** | Change `agent_id: input.agent_id ?? "unknown"` to `agent_id: input.agent_id ?? null` in `mcp-server/src/index.ts`. Test: submit via MCP without `agent_id`, verify null stored in database. |
| E0.6.4 | **Deduplicate MCP server data access** | Refactor MCP server to import and use `LaunchService` from `@launchx/api` (or extract service into `@launchx/shared`) instead of direct Supabase queries. All 5 MCP tools delegate to service methods. Test: MCP tools return identical results to equivalent API calls. |
| E0.6.5 | **Fix route ordering** | Move `GET /launches/trending` before `GET /launches` in `routes/launches.ts`. Move `GET /launches/:id` after both. Test: `GET /launches/trending` returns trending data, not a 400 from search validation. |
| E0.6.6 | **Add Express request type extension** | Create `types/express.d.ts` that extends `Express.Request` with `makerId: string`. Remove all `(req as any)` casts. Test: `npm run typecheck` passes. |
| E0.6.7 | **Add body size limit and rate limiting** | `express.json({ limit: '100kb' })`. Add `express-rate-limit` with: 100 req/min for public endpoints, 20 req/min for submit. Test: oversized payload returns 413. Excessive requests return 429. |
| E0.6.8 | **Rename `min_score` to `min_engagement`** | Rename in: Zod schema, TypeScript interface, service method. Update CLI and MCP server if they reference it. Test: API accepts `min_engagement` param and filters by `x_likes`. |
| E0.6.9 | **Add duplicate URL detection on submit** | Before inserting, check if a launch with the same URL exists and is not archived. Return 409 Conflict with existing launch ID. Test: submitting the same URL twice returns 409 on second attempt. |
| E0.6.10 | **Escape wildcard characters in search** | Sanitize `%` and `_` in search queries before interpolating into ilike filter. Test: searching for `100%` doesn't match everything. |

---

## Phase 1 — Core Platform

> *Make the existing product actually work end-to-end.*

### E1.1 — Launch Submission (Maker Journey)

**Goal:** A maker can submit a product launch from any interface (CLI, API, MCP) and have it flow through review, enrichment, and scheduling to go live on X.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E1.1.1 | **As a maker, I can register and get an API key** via CLI | `lx register --x-handle @myhandle` prompts for confirmation, calls API, returns `lx_...` key, saves it locally. API endpoint `POST /auth/register` creates maker + API key, returns key (shown once). |
| E1.1.2 | **As a maker, I can submit a launch** and receive a confirmation with status | Submit via CLI/API/MCP returns: launch ID, status (`pending`), estimated time to review, and link to track status. Zod validates all fields. Duplicate URL returns 409. |
| E1.1.3 | **As a maker, I can check the status of my launch** | `lx status <launch-id>` or `GET /launches/:id/status` returns current status, position in review queue, scheduled drop date (if approved). |
| E1.1.4 | **As an admin, I can review and approve/reject launches** | `POST /admin/launches/:id/review` with `action: "approve" | "reject"` and optional `reason`. Approved launches move to scheduling queue. Rejected launches notify maker with reason. |
| E1.1.5 | **As a maker, I can update my launch before it goes live** | `PUT /launches/:id` allows updating description, video URL, and category while status is `pending` or `approved`. Cannot change name or URL (identity fields). Auth required — must own the launch. |
| E1.1.6 | **As a maker, I can schedule my launch for a specific date** | `--schedule "2025-03-15"` on submit, or `PATCH /launches/:id/schedule`. Must be at least 24 hours in the future. Overrides automatic scheduling. |
| E1.1.7 | **As a CI/CD pipeline, I can trigger a launch on new release** | Document GitHub Action example that calls the API on `release` event. Provide reusable action in `.github/actions/launchx-submit/`. |

---

### E1.2 — Search & Discovery (Consumer Journey)

**Goal:** Consumers (human or agent) can find relevant launches through search, browsing, and personalised trending.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E1.2.1 | **As a consumer, I can search launches by keyword** with full-text search | Replace `ilike` with PostgreSQL `tsvector` full-text search across name, one_liner, description, and ai_tags. Supports stemming and ranking. Test: searching "monitor" matches "monitoring". |
| E1.2.2 | **As a consumer, I can filter by multiple categories** | `?category=ai-ml,developer-tools` accepts comma-separated slugs. Returns launches in any of the specified categories. Works in CLI: `lx search --category ai-ml,devtools`. |
| E1.2.3 | **As a consumer, I can view trending with engagement breakdown** | Trending endpoint returns: likes, reposts, replies, bookmarks, impressions, and a composite engagement score. CLI displays a formatted leaderboard. |
| E1.2.4 | **As a consumer, I can paginate through results** | All list endpoints support `limit` and `offset` (or cursor-based pagination). CLI supports `--page` flag. MCP tools support pagination parameters. Response includes `total`, `has_more`, `next_offset`. |
| E1.2.5 | **As a consumer, I can get a "what launched today" summary** | `GET /launches/today` or `lx today` returns today's launches sorted by engagement. MCP tool `get_todays_launches` provides the same. Designed as the primary daily touchpoint. |
| E1.2.6 | **As a consumer, I can view a single launch with full detail** | `GET /launches/:id` returns full launch data including: maker profile, category, AI summary, AI tags, all engagement metrics, video URL, related launches (same category). |

---

### E1.3 — AI Enrichment Pipeline

**Goal:** Every launch is automatically enriched with AI-generated metadata that powers search, categorisation, and agent feeds.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E1.3.1 | **System generates an AI summary for each launch** on submission | Background job calls Claude API with launch name, URL, one_liner, description. Generates 2-3 sentence summary. Stored in `ai_summary`. Runs within 60 seconds of submission. |
| E1.3.2 | **System generates AI tags for each launch** | Same job generates 3-8 relevant tags (e.g., `["api", "monitoring", "devops", "saas"]`). Stored in `ai_tags` array. Tags power search and agent filtering. |
| E1.3.3 | **System generates an AI relevance score** | Score 0-100 based on: product quality signals (description completeness, video presence), maker reputation, category demand. Stored in `ai_score`. Used as a secondary ranking signal alongside X engagement. |
| E1.3.4 | **System auto-categorises launches** when no category is specified | If `category_slug` is null, AI selects the best-fit category from the existing category list. Maker can override. |
| E1.3.5 | **AI enrichment is idempotent and retriable** | Failed enrichment jobs are retried 3 times with exponential backoff. Manual re-enrichment available via admin endpoint. Partial failures (e.g., tags succeed but summary fails) don't block the launch. |

---

### E1.4 — X Integration

**Goal:** Approved launches are automatically posted to X with engagement tracked in real-time.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E1.4.1 | **System posts a launch to X** when it goes live | Background job creates an X post with: product name, one-liner, maker handle mention, product URL, category hashtag. Post ID and URL stored in `x_post_id` and `x_post_url`. |
| E1.4.2 | **System tracks X engagement metrics** on a schedule | Cron job polls X API every 15 minutes for active launches (last 7 days). Updates `x_likes`, `x_reposts`, `x_replies`, `x_bookmarks`, `x_impressions`. |
| E1.4.3 | **System posts a daily drop thread** | At a configured time (e.g., 9 AM ET), system creates an X thread: intro post + one reply per launch in the day's drop, ranked by AI score. Thread ID stored in `DailyDrop.x_thread_id`. |
| E1.4.4 | **Engagement metrics are reflected in real-time** in API responses | Search and trending endpoints return latest engagement data. Agents calling MCP tools see up-to-date metrics. Cache TTL: 5 minutes max. |

---

### E1.5 — Daily Drops

**Goal:** Curated daily batches of launches that drive the X engagement flywheel.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E1.5.1 | **System schedules approved launches into daily drops** | Scheduler assigns approved launches to the next available drop date. Max 10 launches per drop. Featured launch (highest AI score) gets the thread's lead position. |
| E1.5.2 | **Admin can override drop scheduling** | Admin endpoint to: move a launch between drop dates, set featured launch, remove a launch from a drop. Changes reflected immediately. |
| E1.5.3 | **As a consumer, I can browse past daily drops** | `GET /drops` returns paginated list of past drops with their launches. `GET /drops/:date` returns a specific day's drop. `lx drops` CLI command. |

---

## Phase 2 — Agent-Native Experience

> *Build the experience that doesn't exist yet — agent-to-agent product discovery.*

### E2.1 — MCP Consumer Feeds

**Goal:** AI agents can subscribe to personalised launch feeds and receive curated content on behalf of their users.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E2.1.1 | **As an agent, I can get a personalised feed** via MCP | New MCP tool: `get_feed` accepts `interests` (list of category slugs or keywords), `timeframe`, `limit`. Returns launches ranked by relevance to stated interests, weighted by engagement. |
| E2.1.2 | **As an agent, I can register persistent preferences** | MCP tool: `set_preferences` stores category interests, keyword watchlist, minimum score threshold, and preferred update frequency per agent ID. Preferences persist across sessions. |
| E2.1.3 | **As an agent, I can get a "what's new since last check" feed** | MCP tool: `get_updates_since` accepts a timestamp (or uses last-checked cursor). Returns only launches that are new or have significant engagement changes since that time. Enables efficient polling. |
| E2.1.4 | **As an agent, I can get AI-generated briefings** | MCP tool: `get_briefing` returns a natural-language summary of the day's most relevant launches for the agent's registered interests. Not just data — a readable brief the agent can relay to its user. |

---

### E2.2 — Agent Personalisation

**Goal:** The platform learns what each agent's user cares about and improves recommendations over time.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E2.2.1 | **System tracks which launches each agent retrieves** | When an agent calls `get_launch` or interacts with a specific launch, the interaction is logged (agent_id, launch_id, action, timestamp). This is the implicit signal for personalisation. |
| E2.2.2 | **System computes interest profiles from interaction history** | Background job analyses agent interaction patterns: which categories, tags, and makers an agent's user engages with. Builds a weighted interest vector. |
| E2.2.3 | **Personalised feed ranking uses interest profile** | `get_feed` and `get_briefing` incorporate the agent's interest profile into ranking. New launches matching strong interests surface first. Cold-start: falls back to global trending. |
| E2.2.4 | **Agent can provide explicit feedback signals** | MCP tool: `signal_interest` with `launch_id` and `signal: "relevant" | "not_relevant"`. Explicit signals weigh 5x more than implicit interactions in the interest profile. |

---

### E2.3 — Webhook / Push Delivery

**Goal:** Instead of agents polling, the platform pushes updates to registered endpoints.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E2.3.1 | **As a consumer, I can register a webhook** for launch notifications | `POST /webhooks` with `url`, `events` (e.g., `["launch.live", "daily_drop.published"]`), `filters` (categories, min_score). Webhook receives POST with launch data when events occur. |
| E2.3.2 | **System delivers webhook events reliably** | Events are queued and delivered with at-least-once semantics. Failed deliveries retry 3 times with exponential backoff. Dead letter queue for permanently failed endpoints. Webhook status viewable via API. |
| E2.3.3 | **As a consumer, I can subscribe to real-time updates** via SSE | `GET /launches/stream` returns a Server-Sent Events stream. Filters via query params (category, min_score). Agent or frontend can hold open a connection and receive launches as they go live. |

---

### E2.4 — CLI Power User Features

**Goal:** The CLI becomes a genuine daily-driver tool for developers who want to stay informed without leaving their terminal.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E2.4.1 | **As a developer, I can run `lx today`** for a formatted daily brief | Colourised output showing today's launches with engagement metrics, one-liners, and category tags. Sorted by engagement. Links are clickable in supported terminals. |
| E2.4.2 | **As a developer, I can run `lx watch`** for a live-updating feed | `lx watch --category ai-ml` opens a persistent terminal view that updates when new launches go live. Uses SSE endpoint under the hood. `Ctrl+C` to exit. |
| E2.4.3 | **As a developer, I can configure persistent interests** | `lx config set interests ai-ml,developer-tools`. `lx feed` then returns personalised results based on stored interests. Config stored locally via Conf. |
| E2.4.4 | **As a developer, I can bookmark launches** for later | `lx bookmark <launch-id>`. `lx bookmarks` lists saved launches. Stored locally. Optional: sync to server if authenticated. |

---

## Phase 3 — Marketplace & Monetisation

> *Build the business model native to the platform.*

### E3.1 — Promoted Launches

**Goal:** Makers can pay to amplify their launch's visibility across all channels — transparently and natively.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E3.1.1 | **As a maker, I can promote my launch** | `POST /launches/:id/promote` or `lx promote <launch-id>`. Selects a promotion tier (daily drop feature, feed boost, both). Returns pricing and confirmation. |
| E3.1.2 | **Promoted launches are clearly labelled** in all channels | API responses include `is_promoted: true`. CLI shows `[Promoted]` badge. MCP feed includes promotion metadata. X posts include disclosure. Agents can filter promoted content in or out. |
| E3.1.3 | **Promoted launches still require engagement to rank** | Promotion gives a visibility boost (e.g., guaranteed inclusion in daily drop, higher initial feed position) but ranking within the promoted tier is still by engagement. No "pay to be #1" — you pay to be seen, the audience decides the rank. |
| E3.1.4 | **As an admin, I can manage promotion inventory** | Dashboard showing: active promotions, revenue per period, promotion slots available per day, fill rate. Promotion caps per daily drop (max 3 promoted out of 10). |

---

### E3.2 — Analytics Dashboard

**Goal:** Makers get visibility into how their launch is performing. Platform operators understand marketplace health.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E3.2.1 | **As a maker, I can see my launch analytics** | `GET /launches/:id/analytics` or `lx analytics <launch-id>`. Shows: engagement over time (likes, reposts, replies, bookmarks, impressions), AI score, ranking position in category, number of agent retrievals. |
| E3.2.2 | **As a maker, I can see aggregate stats** across all my launches | `GET /makers/me/analytics`. Total launches, total engagement, average AI score, best-performing launch, growth trends. |
| E3.2.3 | **As an admin, I can view platform health metrics** | Dashboard: daily active launches, submissions per day, approval rate, average engagement, agent API calls per day, webhook deliveries, top categories, revenue (if promotions active). |

---

### E3.3 — Maker Profiles & Reputation

**Goal:** Makers build reputation over time that signals quality to consumers and agents.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E3.3.1 | **As a maker, I have a public profile** | `GET /makers/:handle` returns: display name, avatar, bio, X handle, verification status, reputation score, list of launches, total engagement. |
| E3.3.2 | **Reputation score is computed from launch history** | Score (0-100) based on: number of launches, average engagement, consistency (regular launches), approval rate, community standing. Updated daily. |
| E3.3.3 | **Verified makers get a trust signal** | Makers who verify via X OAuth get `is_verified: true`. Verified launches rank higher in search (tie-breaker). Agents can filter for verified-only. |
| E3.3.4 | **As a maker, I can manage my API keys** | `GET /auth/keys` lists active keys. `POST /auth/keys` generates a new key with optional label. `DELETE /auth/keys/:id` revokes a key. `lx keys` CLI command. |

---

### E3.4 — Web Experience

**Goal:** A lightweight web interface for users who aren't in a terminal or using an agent. Not the primary interface — but necessary for reach.

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| E3.4.1 | **Landing page with today's drops** | Simple, fast page showing today's daily drop. Each launch card: name, one-liner, maker, engagement metrics, category tag. Links to X post. Mobile responsive. |
| E3.4.2 | **Search and browse page** | Search bar with category filters. Results display like CLI output but in the browser. Pagination. Deep links to individual launches. |
| E3.4.3 | **Individual launch page** | Full launch detail: description, video embed, maker profile, AI summary, engagement chart, related launches. Open Graph meta tags for rich sharing. |
| E3.4.4 | **Maker dashboard (web)** | Authenticated view: my launches, analytics charts, API key management, promotion management. Minimal — the CLI and API are the power interfaces. |

---

## Data Model Reference

The current domain model from `@launchx/shared` serves as the foundation. Key entities and their planned evolution:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Maker      │────<│   Launch     │>────│  Category    │
│              │     │              │     │              │
│ x_handle     │     │ name         │     │ name         │
│ display_name │     │ url          │     │ slug         │
│ reputation   │     │ one_liner    │     │ description  │
│ is_verified  │     │ ai_summary   │     └──────────────┘
└──────┬───────┘     │ ai_tags[]    │
       │             │ ai_score     │     ┌──────────────┐
       │             │ x_likes      │>────│  DailyDrop   │
┌──────┴───────┐     │ x_reposts    │     │              │
│   ApiKey     │     │ status       │     │ drop_date    │
│              │     │ launched_at  │     │ featured_id  │
│ key_hash     │     └──────────────┘     └──────────────┘
│ is_active    │
│ last_used_at │     ┌──────────────┐     ┌──────────────┐
└──────────────┘     │  AgentPref   │     │  Webhook     │
                     │ (Phase 2)    │     │ (Phase 2)    │
                     │              │     │              │
                     │ agent_id     │     │ url          │
                     │ interests[]  │     │ events[]     │
                     │ min_score    │     │ filters      │
                     └──────────────┘     └──────────────┘
```

**New entities needed (by phase):**

| Entity | Phase | Purpose |
|--------|-------|---------|
| `AgentPreference` | 2 | Stored interests and settings per agent |
| `AgentInteraction` | 2 | Implicit signal log for personalisation |
| `Webhook` | 2 | Registered push endpoints |
| `WebhookDelivery` | 2 | Delivery log with status and retry count |
| `Promotion` | 3 | Paid promotion records with tier, dates, spend |
| `AnalyticsSnapshot` | 3 | Time-series engagement data for charts |

---

## Technical Architecture

```
                    ┌─────────────────────────────────────────────┐
                    │                  Clients                     │
                    │                                             │
                    │  CLI (lx)   MCP Agent   REST Client   Web  │
                    └──────┬──────────┬──────────┬──────────┬────┘
                           │          │          │          │
                    ┌──────▼──────────▼──────────▼──────────▼────┐
                    │              API Gateway                    │
                    │         (Express + Helmet + CORS)           │
                    │         Rate limiting · Auth · Validation   │
                    ├────────────────────────────────────────────┤
                    │              Service Layer                  │
                    │                                             │
                    │  LaunchService · MakerService · DropService │
                    │  EnrichmentService · AnalyticsService       │
                    ├────────────────────────────────────────────┤
                    │              Data Layer                     │
                    │         Supabase (PostgreSQL + RLS)         │
                    └────────────────────┬───────────────────────┘
                                         │
                    ┌────────────────────┼───────────────────────┐
                    │          Background Jobs                    │
                    │                                             │
                    │  AI Enrichment  ·  X Poster  ·  X Metrics  │
                    │  Drop Scheduler ·  Webhook Delivery         │
                    └────────────────────────────────────────────┘
```

**Key architectural decisions:**

1. **Single service layer** shared by API routes and MCP tools (fixes current duplication)
2. **Background job queue** for async work (enrichment, X posting, metrics polling)
3. **Supabase RLS** replaces service-role key for most operations
4. **MCP server connects to service layer**, not directly to database

---

## Success Metrics

| Phase | Metric | Target |
|-------|--------|--------|
| 0 | CI pipeline passes on every PR | 100% |
| 0 | Test coverage across packages | > 80% line coverage |
| 0 | Zero critical bugs from review | All E0.6 stories closed |
| 1 | Launches submitted per week | 50+ by end of Phase 1 |
| 1 | Search queries per day | 200+ |
| 1 | AI enrichment success rate | > 95% |
| 2 | Active MCP agents | 20+ unique agents per week |
| 2 | Agent feed requests per day | 500+ |
| 2 | Webhook delivery success rate | > 99% |
| 3 | Promoted launches per month | 10+ |
| 3 | Maker retention (2+ launches) | > 30% |
| 3 | Platform revenue | Positive unit economics on promotions |

---

## Appendix: Epic Dependency Graph

```
E0.1 System Setup ──────┐
E0.2 CI/CD Pipeline ────┤
E0.3 Branch Strategy ───┼──> E0.6 Bug Fixes ──> E1.1 Submission
E0.4 PR Management ─────┤                   ──> E1.2 Discovery
E0.5 Code Quality ──────┘                   ──> E1.3 AI Enrichment ──> E1.4 X Integration
                                                                    ──> E1.5 Daily Drops
                                                                           │
                                             E2.1 MCP Feeds <─────────────┘
                                             E2.2 Personalisation <── E2.1
                                             E2.3 Webhooks
                                             E2.4 CLI Power User
                                                    │
                                             E3.1 Promotions <────────────┘
                                             E3.2 Analytics
                                             E3.3 Maker Profiles
                                             E3.4 Web Experience
```

**Critical path:** E0.1 → E0.2 → E0.5 → E0.6 → E1.1 → E1.3 → E1.4 → E1.5 → E2.1

---

*This is a living document. Update it as requirements evolve and as each phase delivers learnings that inform the next.*

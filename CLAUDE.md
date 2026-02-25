# CLAUDE.md — Project Context for Claude Code

## What is this project?

LaunchX is an AI-native product launch platform on X (Twitter). It's a two-sided marketplace: makers submit product launches (via CLI, API, or MCP agents), and consumers discover them (via agents, CLI, or X feeds). Think Product Hunt rebuilt from first principles for the age of AI agents.

## Repository layout

```
XLaunch/
├── CLAUDE.md                 # This file
├── REVIEW.md                 # Code review of initial project
├── docs/
│   └── PRD.md                # Product requirements, epics, user stories
└── launchx-initial/          # The application monorepo
    ├── .env.example
    ├── .nvmrc                # Node 20
    ├── .npmrc                # engine-strict=true
    ├── package.json          # npm workspaces root
    ├── tsconfig.json         # Base TS config (strict, ES2022, Node16)
    ├── .github/
    │   ├── workflows/ci.yml  # CI: typecheck (Node 20+22), lint, build (main only)
    │   ├── dependabot.yml    # Weekly dependency update PRs
    │   └── BRANCH_PROTECTION.md  # Manual GitHub settings to configure
    ├── supabase/
    │   ├── migrations/       # 3 SQL migration files (run in order)
    │   └── seed.sql          # Test data (8 categories, test maker, test API key, 5 launches)
    └── packages/
        ├── shared/           # @launchx/shared — types & Supabase utilities
        ├── api/              # @launchx/api — Express REST API (port 3000)
        ├── cli/              # @launchx/cli — `lx` command-line tool
        └── mcp-server/       # @launchx/mcp-server — MCP server (stdio)
```

All application code lives under `launchx-initial/`. The root `XLaunch/` directory contains project-level docs.

## Key files (source of truth)

- **Domain model:** `packages/shared/src/types.ts` — all TypeScript interfaces for database entities and API request/response types
- **Database schema:** `supabase/migrations/` — the SQL definition of all tables, enums, indexes, and triggers
- **API routes:** `packages/api/src/routes/launches.ts`
- **API business logic:** `packages/api/src/services/launch.ts` (LaunchService class)
- **API auth:** `packages/api/src/middleware/auth.ts` (API key validation, SHA-256 hashing)
- **Validation schemas:** `packages/api/src/validation.ts` (Zod schemas)
- **CLI commands:** `packages/cli/src/index.ts`
- **MCP tools:** `packages/mcp-server/src/index.ts`
- **Roadmap and epics:** `docs/PRD.md`
- **Code review findings:** `REVIEW.md`
- **CI workflow:** `.github/workflows/ci.yml`
- **Branch protection guide:** `.github/BRANCH_PROTECTION.md`

## Commands

```bash
# From launchx-initial/
npm install                # Install all workspace dependencies
npm run dev:api            # Run API server
npm run dev:cli -- <args>  # Run CLI (e.g., -- search "ai")
npm run dev:mcp            # Run MCP server
npm run build              # Build all packages
npm run typecheck          # Type-check all packages
npm run lint               # Lint all packages (placeholder — not yet configured)
npm run test               # Run tests (placeholder — no tests yet)
```

## Conventions

### Code style
- TypeScript strict mode — do not use `any` unless unavoidable
- Use `text` over `varchar` in SQL — Zod handles length validation
- Use `timestamptz` in SQL — code uses ISO strings
- Prefer async/await over raw promises
- Use Zod for all request validation at API boundaries

### Git
- **Branch naming:** `feat/<epic>/<description>`, `fix/<description>`, `chore/<description>`, `docs/<description>`
- **Commit messages:** imperative mood, explain the "why". Reference epic/story IDs where applicable.
- **PR scope:** one epic or logical change per PR. Keep diffs under 400 lines when possible.
- **Merge strategy:** squash merge to main

### Database
- All table and column names are snake_case
- UUIDs for all primary keys (gen_random_uuid())
- Foreign keys use ON DELETE CASCADE for required relationships, ON DELETE SET NULL for optional
- The `updated_at` column is managed by a PostgreSQL trigger — do not set it manually in application code

## Known bugs (from REVIEW.md)

These are tracked in Epic E0.6 and should not be worked around — they should be fixed properly:

1. **Inner join in search** — `launch.ts:86-88` uses `!inner` join on categories and makers. Launches without a category are silently excluded. Fix: remove `!inner`.
2. **Broken ai_tags search** — `launch.ts:118` uses `ai_tags.cs.{${query}}` which doesn't work for free-text. Needs proper array search or removal from the `or` clause.
3. **MCP agent_id default** — `mcp-server/index.ts:236` defaults to `"unknown"` instead of `null`.
4. **MCP duplicates service logic** — The MCP server has its own Supabase queries instead of reusing LaunchService. Should share the service layer.
5. **min_score is misleading** — It filters by `x_likes`, not AI score. Should be renamed to `min_engagement`.
6. **Auth middleware sets unused makerId** — `auth.ts:49` sets `(req as any).makerId` but no route uses it. Submit endpoint ignores the authenticated maker.
7. **No rate limiting** — No rate limiter on any endpoint.
8. **No body size limit** — `express.json()` has no `limit` option.
9. **No duplicate URL check** — Same URL can be submitted multiple times.
10. **Search wildcard injection** — `%` and `_` in search queries are not escaped.

## What's not implemented yet

These features are stubbed (types/fields exist) but have no implementation:

- AI enrichment pipeline (ai_summary, ai_tags, ai_score are never populated)
- X posting and engagement tracking (x_post_id, x_likes etc. are never updated)
- Daily drops scheduling (DailyDrop types exist, no service logic)
- Video generation (video_generated field exists, no processing)
- API key management endpoints (generateApiKey() exists but is never called)
- Launch moderation workflow (status transitions have no admin endpoints)

## Test API key

For local development with seed data:

```
Key:  lx_test_key_for_local_development_only
Hash: e62052fa1ac702fbee24a207bc71d46120abea13f8a12b72e3a04efc859d31de
```

## Environment variables

| Variable | Required by | Purpose |
|----------|------------|---------|
| `SUPABASE_URL` | api, mcp-server | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | api, mcp-server | Service role key (full DB access) |
| `PORT` | api | Express server port (default: 3000) |
| `LAUNCHX_API_URL` | cli | API base URL (default: https://api.launchx.dev/api/v1) |

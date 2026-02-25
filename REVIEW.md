# LaunchX — Initial Project Review

## Project Overview

**LaunchX** is an AI-native product launch platform on X (Twitter) that lets makers launch products in 60 seconds and discover them in their feed. It's structured as an npm workspaces monorepo with four packages:

| Package | Purpose |
|---------|---------|
| `@launchx/shared` | Core TypeScript types and Supabase utilities |
| `@launchx/api` | Express REST API (submit, search, trending, categories) |
| `@launchx/cli` | `lx` command-line tool (Commander.js + Chalk + Ora) |
| `@launchx/mcp-server` | MCP server exposing 5 tools for AI agent integration |

**Tech stack:** Node.js 20+, TypeScript 5.7, Express, Supabase (PostgreSQL), Zod, Commander.js, Model Context Protocol SDK.

---

## Architecture Assessment

### Strengths

1. **Clean monorepo structure** — Clear separation of concerns across packages with shared types extracted into `@launchx/shared`.
2. **Well-defined domain model** — `types.ts` provides comprehensive interfaces for Launch, Maker, Category, DailyDrop, and ApiKey with proper nullable fields and union types.
3. **Multiple interfaces** — REST API, CLI, and MCP server give flexibility for human and agent consumers.
4. **Zod validation** — Request schemas with proper coercion and transforms (e.g., stripping `@` from handles).
5. **API key auth** — SHA-256 hashing with `lx_` prefix convention, activity tracking via `last_used_at`.
6. **Security headers** — Helmet middleware applied to Express.

### Weaknesses

1. **No tests whatsoever** — `test` and `lint` scripts are placeholders. No unit, integration, or e2e tests exist.
2. **Duplicated data access logic** — The MCP server reimplements Supabase queries instead of calling the API or reusing the `LaunchService`.
3. **No CI/CD** — README references `.github/` but no workflows are present.
4. **Missing `.env.example`** — README says `cp .env.example .env` but the file doesn't exist.

---

## Bugs & Issues

### Critical

| # | File | Issue |
|---|------|-------|
| 1 | `api/src/services/launch.ts:86-88` | **Search uses `!inner` join on categories and makers.** Launches without a category or maker will be silently excluded from search results. Should use a left join (remove `!inner`) since `category_id` is nullable. |
| 2 | `mcp-server/src/index.ts:236` | **`agent_id` defaults to `"unknown"` string** instead of `null`. Inconsistent with the API service which correctly defaults to `null`. Pollutes data with a magic string. |
| 3 | `api/src/services/launch.ts:118` | **`ai_tags` array search is broken.** `ai_tags.cs.{${query}}` uses Supabase `cs` (contains) operator with brace syntax, but `query` is free text — this will fail unless the query exactly matches a tag. The `or` filter combining `ilike` and `cs` across different column types is fragile. |

### Moderate

| # | File | Issue |
|---|------|-------|
| 4 | `api/src/routes/launches.ts:20-31` | **Route ordering risk.** Express matches routes in registration order. `GET /launches` is registered before `GET /launches/trending`, so `/launches/trending` could potentially match the generic handler first if parameter parsing isn't strict. In practice Express handles this correctly for exact static segments, but the ordering is still unconventional — specific routes should come before generic ones. |
| 5 | `api/src/services/launch.ts:122-123` | **Misleading parameter name.** `min_score` filters by `x_likes` (engagement count), not by AI score (`ai_score`). The parameter name in the Zod schema and the type interface is misleading. |
| 6 | `api/src/middleware/auth.ts:49` | **Type safety gap.** `(req as any).makerId = data.maker_id` uses `any` cast. Should extend Express `Request` type with a proper interface. Also, `makerId` is set but never used by any route handler — the submit endpoint doesn't associate the launch with the authenticated maker. |
| 7 | `api/src/routes/launches.ts:72-88` | **Submit endpoint ignores authenticated maker.** The API key auth middleware resolves the maker from the key, but the submit endpoint creates/upserts a new maker from `x_handle` in the request body. A user could submit launches under a different maker's handle. |

### Minor

| # | File | Issue |
|---|------|-------|
| 8 | `api/src/index.ts:16` | **No body size limit.** `express.json()` without a `limit` option accepts arbitrarily large payloads. Should set a reasonable limit (e.g., `100kb`). |
| 9 | `api/src/services/launch.ts:107` | **`since!` non-null assertion.** The `switch` doesn't have a `default` case, so TypeScript can't prove `since` is initialized. The non-null assertion `since!` is a workaround but masks a potential issue if the timeframe enum expands. |
| 10 | `mcp-server/src/index.ts:47` | **Category filter on nested column.** `.eq("categories.slug", category)` filters on a joined table column. If no join match is found (left join), this silently returns no results rather than an error. |

---

## Security Concerns

1. **Service role key exposure** — Both the API and MCP server use `SUPABASE_SERVICE_ROLE_KEY`, which bypasses Row Level Security. If the key leaks, the entire database is exposed. Should use RLS with scoped keys where possible.

2. **No rate limiting** — The API has no rate limiting on any endpoint. Public endpoints (search, trending) are vulnerable to abuse. The authenticated submit endpoint could be spammed with a single API key.

3. **No duplicate URL check** — The submit flow doesn't check for existing launches with the same URL. A user could submit the same product repeatedly.

4. **No API key revocation endpoint** — `is_active` flag exists in the schema but there's no endpoint to manage or revoke keys.

5. **SQL injection via ilike** — The search query is interpolated directly into the Supabase `or` filter string: `name.ilike.%${query}%`. While Supabase's PostgREST layer parameterizes queries, special characters like `%` and `_` in the query aren't escaped, allowing wildcard injection in the LIKE pattern.

---

## Missing Features (Referenced but Not Implemented)

- **AI enrichment pipeline** — `ai_summary`, `ai_tags`, `ai_score` fields exist in types but are never populated.
- **Daily drops / scheduling** — `DailyDrop` and `DailyDropLaunch` types defined but no service logic exists.
- **X (Twitter) posting** — No X API integration for posting launches or fetching engagement metrics.
- **Video generation** — `video_generated` boolean on Launch but no video processing.
- **Key management** — `generateApiKey()` is defined but never called from any endpoint.
- **Launch moderation** — Status workflow (pending → approved → launched) has no admin endpoints.

---

## Code Quality

### What's Good
- Consistent code style across all packages
- TypeScript strict mode with proper nullable types
- Clean async/await patterns
- Sensible default values in Zod schemas
- Error handling at route level with proper HTTP status codes

### What Needs Work
- `any` type usage in multiple places (`auth.ts:49`, `launch.ts:134`, `launch.ts:204-205`, `cli/index.ts:173`)
- No structured logging — only `console.log` / `console.error`
- No request ID tracing for debugging
- No OpenAPI / Swagger documentation
- No database migrations or schema definition (must be inferred from code)
- Unused `Inquirer` dependency in CLI package.json (never imported)

---

## Recommendations (Priority Order)

1. **Add tests** — At minimum, unit tests for `LaunchService` and integration tests for API routes.
2. **Fix the `!inner` join** — Change to left join so launches without categories appear in search results.
3. **Deduplicate MCP server logic** — Have it call the API or import `LaunchService` rather than reimplementing queries.
4. **Add rate limiting** — Use `express-rate-limit` on public endpoints.
5. **Add `.env.example`** — Document required environment variables.
6. **Extend Express Request type** — Replace `(req as any).makerId` with a proper typed extension.
7. **Escape search wildcards** — Sanitize `%` and `_` characters in user search queries.
8. **Add body size limit** — `app.use(express.json({ limit: '100kb' }))`.
9. **Add CI pipeline** — GitHub Actions for typecheck, lint, and tests on PR.
10. **Add duplicate URL detection** — Check for existing launches with the same URL before inserting.

---

## Summary

LaunchX is a well-structured MVP with clean architecture and good TypeScript practices. The core submission and discovery workflows are functional. The main gaps are: zero test coverage, duplicated logic in the MCP server, several data query bugs (inner joins, broken array search), and missing security hardening (rate limiting, input sanitization). The AI enrichment and X integration features are stubbed out but not implemented. With the bugs fixed and tests added, this is a solid foundation to build on.

# LaunchX

**AI-native product launch platform on X.**

Launch your product in 60 seconds. Discover it in your feed.

## Prerequisites

- **Node.js 20+** — use `nvm use` (`.nvmrc` included)
- **npm 9+** — ships with Node 20
- **Supabase account** ([free tier](https://supabase.com)) or the Supabase CLI for local development

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd launchx-initial
nvm use
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your Supabase project URL and service role key.
# See .env.example comments for where to find each value.
```

### 3. Set up the database

**Option A — Supabase Dashboard (simplest)**

1. Go to your Supabase project > SQL Editor
2. Run each migration file in order:
   - `supabase/migrations/20250225000001_create_enums_and_base_tables.sql`
   - `supabase/migrations/20250225000002_create_dependent_tables.sql`
   - `supabase/migrations/20250225000003_create_indexes_and_triggers.sql`
3. Run `supabase/seed.sql` to populate test data

**Option B — Supabase CLI (recommended for local development)**

```bash
supabase init          # if not already initialised
supabase start         # starts local Supabase stack
supabase db push       # applies migrations
psql "$DATABASE_URL" -f supabase/seed.sql
```

### 4. Run the API

```bash
npm run dev:api
# API available at http://localhost:3000
```

### 5. Test with the CLI

```bash
# Authenticate with the test API key from seed data
npm run dev:cli -- auth lx_test_key_for_local_development_only

# Submit a launch
npm run dev:cli -- submit --name "My Product" --url "https://example.com" \
  --one-liner "A great product" --x-handle "@me"

# Search and browse
npm run dev:cli -- search
npm run dev:cli -- trending
npm run dev:cli -- categories
```

### 6. Run the MCP server

```bash
npm run dev:mcp
```

## Test API Key

A test API key is included in the seed data for local development:

```
lx_test_key_for_local_development_only
```

Use it with the CLI:

```bash
lx auth lx_test_key_for_local_development_only
```

Or with curl:

```bash
curl -H "Authorization: Bearer lx_test_key_for_local_development_only" \
     http://localhost:3000/api/v1/launches
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:api` | Run the Express API server (port 3000) |
| `npm run dev:cli` | Run the CLI tool (pass args after `--`) |
| `npm run dev:mcp` | Run the MCP server on stdio |
| `npm run build` | Compile all packages |
| `npm run typecheck` | Type-check all packages |
| `npm run lint` | Lint all packages |
| `npm run test` | Run tests across all packages |

## How It Works

1. **Makers submit** launches via CLI (`lx submit`), API, or MCP (agents)
2. **AI enrichment** categorizes, summarizes, and scores the launch
3. **Daily drops** go live on X — video-first, engagement-native
4. **Agents discover** products via the MCP server
5. **X engagement** (likes, reposts, replies) = the ranking signal

## Packages

### `@launchx/api`
REST API for submitting and searching launches. Authenticated via API keys.

### `@launchx/cli`
The `lx` command-line tool. Submit, search, and browse launches from your terminal.

```bash
lx auth <api-key>
lx submit --name "Cool Tool" --url "https://cool.tool" --one-liner "It's cool" --x-handle "@maker"
lx search "api monitoring"
lx trending --timeframe week
lx categories
```

### `@launchx/mcp-server`
MCP server exposing 5 tools to AI agents:
- `search_launches` — Search products by query, category, timeframe
- `get_launch` — Get details for a specific launch
- `get_trending` — See what's trending
- `get_categories` — List categories
- `submit_launch` — Submit a new launch

### `@launchx/shared`
TypeScript types and utilities shared across all packages.

## Database Schema

The schema is defined in `supabase/migrations/` and consists of 6 tables:

| Table | Purpose |
|-------|---------|
| `categories` | Product categories (ai-ml, developer-tools, etc.) |
| `makers` | Users identified by their X handle |
| `launches` | The core entity — submitted product launches |
| `daily_drops` | Curated daily batches posted to X |
| `daily_drop_launches` | Junction table for drop-to-launch ordering |
| `api_keys` | SHA-256 hashed authentication keys |

See `packages/shared/src/types.ts` for the corresponding TypeScript interfaces.

## Project Structure

```
launchx-initial/
├── .env.example              # Environment variable template
├── .nvmrc                    # Node.js version (20)
├── .npmrc                    # npm config (engine-strict)
├── package.json              # Workspace root
├── tsconfig.json             # Base TypeScript config
├── supabase/
│   ├── migrations/           # SQL schema migrations (run in order)
│   └── seed.sql              # Test data for local development
└── packages/
    ├── shared/               # @launchx/shared — types & utilities
    ├── api/                  # @launchx/api — Express REST API
    ├── cli/                  # @launchx/cli — `lx` CLI tool
    └── mcp-server/           # @launchx/mcp-server — MCP server
```

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Database:** Supabase (PostgreSQL)
- **API:** Express
- **CLI:** Commander.js + Chalk + Ora
- **Agent Protocol:** MCP (Model Context Protocol)
- **Distribution:** X (Twitter) API

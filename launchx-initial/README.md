# 🚀 LaunchX

**AI-native product launch platform on X.**

Launch your product in 60 seconds. Discover it in your feed.

## Architecture

```
launchx/
├── packages/
│   ├── api/           # Express REST API
│   ├── cli/           # `lx` command-line tool
│   ├── mcp-server/    # MCP server for AI agent discovery
│   └── shared/        # Shared types & utilities
├── docs/              # Documentation
└── .github/           # CI/CD workflows
```

## Quick Start

```bash
# Install dependencies
npm install

# Copy env and fill in your keys
cp .env.example .env

# Run the API
npm run dev:api

# Run the CLI
npm run dev:cli -- submit --name "My Product" --url "https://example.com" --one-liner "A great product" --x-handle "@me"

# Run the MCP server
npm run dev:mcp
```

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

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Database:** Supabase (PostgreSQL)
- **API:** Express
- **CLI:** Commander.js + Chalk + Ora
- **Agent Protocol:** MCP (Model Context Protocol)
- **Distribution:** X (Twitter) API

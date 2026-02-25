# Contributing to LaunchX

## Branch Strategy

### Branch types

| Prefix | Purpose | Example |
|--------|---------|---------|
| `main` | Production-ready, always deployable | — |
| `feat/<epic>/` | New feature work | `feat/e1.1/maker-registration` |
| `fix/` | Bug fixes | `fix/inner-join-search` |
| `chore/` | Tooling, deps, config | `chore/add-eslint` |
| `docs/` | Documentation only | `docs/api-openapi-spec` |
| `hotfix/` | Urgent production fix | `hotfix/auth-bypass` |
| `release/` | Release preparation | `release/v0.2.0` |

Branch names must be lowercase, use hyphens for spaces, and be descriptive. Keep them short.

### Rules

- **Never push directly to `main`.** All changes go through pull requests.
- **Keep branches short-lived.** Merge or close within a few days. Branches inactive for 30+ days will be flagged for cleanup.
- **Branches are deleted after merge.** GitHub auto-deletes head branches on merge.
- **Rebase on main before opening a PR** if your branch has fallen behind.

## Pull Requests

### Opening a PR

1. Create your branch from `main` using the naming convention above.
2. Make your changes. Keep the diff focused — one logical change per PR.
3. Push and open a PR against `main`.
4. Fill in the PR template completely.
5. Add appropriate labels (see below).
6. Request a review.

### PR size guidelines

- **Target: under 400 lines changed.** Smaller PRs get faster, better reviews.
- If your change is larger, consider splitting it into stacked PRs.
- Database migrations, seed data, and generated files don't count toward the line budget.

### Review standards

Reviewers check for:

- **Correctness** — Does it do what the story/issue requires?
- **Type safety** — No `any` usage without justification. No type assertions unless necessary.
- **Security** — No secrets in code, no injection vectors, proper auth checks.
- **Test coverage** — New logic should have tests (once test infra exists).
- **Consistency** — Follows existing patterns in the codebase.

Review SLA: first review within 24 hours.

### Merge strategy

All PRs are **squash merged**. The squash commit message uses the PR title, so write a good title:

- Use conventional commit format: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- Keep it under 70 characters
- Use the PR body for details

Examples:
```
feat: add maker registration and API key generation (E1.1.1)
fix: use left join in search to include uncategorised launches (E0.6.1)
chore: configure ESLint and Prettier (E0.5)
```

## Labels

| Label | Use for |
|-------|---------|
| `bug` | Something is broken |
| `feature` | New functionality |
| `chore` | Tooling, deps, config, CI |
| `docs` | Documentation changes |
| `breaking` | Introduces a breaking change |
| `needs-review` | Ready for review |
| `blocked` | Waiting on something external |
| `phase-0` | Engineering foundation work |
| `phase-1` | Core platform work |
| `phase-2` | Agent-native experience work |
| `phase-3` | Marketplace and monetisation work |

## Commit Messages

Use imperative mood. Explain the "why", not just the "what".

```
# Good
Add rate limiting to public API endpoints

Unauthenticated endpoints were vulnerable to abuse. Adds
express-rate-limit with 100 req/min for reads, 20 req/min for writes.

# Bad
updated stuff
```

Reference epic/story IDs where applicable: `(E0.6.1)`, `(E1.3.2)`.

## Development Workflow

```bash
# 1. Make sure you're on main and up to date
git checkout main
git pull origin main

# 2. Create your branch
git checkout -b feat/e1.1/maker-registration

# 3. Work on your changes
# ...

# 4. Run checks before pushing
cd launchx-initial
npm run typecheck
npm run lint

# 5. Push and open PR
git push -u origin feat/e1.1/maker-registration
```

## Stale Branch Policy

- Branches inactive for 30+ days are flagged for cleanup.
- If you need to keep a long-lived branch, add a comment explaining why.
- Merged branches are auto-deleted by GitHub.

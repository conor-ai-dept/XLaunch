# Branch Protection Rules

Configure these rules in GitHub: **Settings > Branches > Add rule**

## `main` branch

| Setting | Value |
|---------|-------|
| Branch name pattern | `main` |
| Require a pull request before merging | Yes |
| Required approving reviews | 1 |
| Dismiss stale pull request approvals when new commits are pushed | Yes |
| Require status checks to pass before merging | Yes |
| Required status checks | `Typecheck (Node 20)`, `Typecheck (Node 22)`, `Lint` |
| Require branches to be up to date before merging | Yes |
| Do not allow bypassing the above settings | Yes |
| Restrict who can push to matching branches | (admin only) |
| Allow force pushes | No |
| Allow deletions | No |

## After merging PRs

Enable **Settings > General > Pull Requests > Automatically delete head branches** so merged feature branches are cleaned up.

## Default merge method

Set **Settings > General > Pull Requests** to allow only **Squash merging** (uncheck merge commits and rebase). This keeps `main` history linear with one commit per PR.

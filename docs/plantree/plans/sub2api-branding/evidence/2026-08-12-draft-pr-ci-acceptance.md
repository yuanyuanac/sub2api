# Draft PR CI Acceptance

Role: verification evidence
Status: accepted
Verified: 2026-08-12 Asia/Shanghai

## Subject

- Draft PR: [yuanyuanac/sub2api#1](https://github.com/yuanyuanac/sub2api/pull/1)
- Verified head: `d30e73e5a8eab265b5c393833d9930294f87e2e8`
- PR state at verification: open, draft, mergeable
- Local branch and `origin/feature/sub2api-branding` matched the verified head; the worktree was clean.

## Accepted GitHub Checks

- [CI run 31546322270](https://github.com/yuanyuanac/sub2api/actions/runs/31546322270): success
  - `shell`: deployment-script validation passed.
  - `frontend`: dependency install and frontend typecheck/critical Vitest passed.
  - `test`: Go unit and integration tests passed.
  - `golangci-lint`: passed.
- [Security Scan run 31546322155](https://github.com/yuanyuanac/sub2api/actions/runs/31546322155): success
  - `frontend-security`: pnpm audit and audit-exception validation passed.
  - `backend-security`: govulncheck passed.

The same head also received successful push-triggered `CI` and `Security Scan` runs. The PR check rollup contained no pending, cancelled, skipped, or failed check.

## Delivery Boundary

- `CI` and `Security Scan` are active in the fork.
- `Release` and `CLA Assistant` remain manually disabled.
- No merge, deployment, release, image publication, or artifact publication was performed.
- Staging and production validation remain outside the authorized scope.

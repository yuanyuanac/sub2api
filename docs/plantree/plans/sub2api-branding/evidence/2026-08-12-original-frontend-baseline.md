# Original Frontend Baseline

Role: evidence
Status: verified
Verified: 2026-08-12 Asia/Shanghai

- Source commit: `1e618dbc299fc0a82e9a690bcf2d5843be817113`
- Runtime: Node `v24.15.0`; pnpm `10.34.5`
- `lint:check`: passed
- `typecheck`: passed
- Vitest: passed, 221 files / 1533 tests
- Production build: passed
- Stable Vitest invocation: from `frontend`, `NODE_OPTIONS=--max-old-space-size=4096` and `vitest run --maxWorkers=2 --minWorkers=1`
- Go checks: not run because the local machine has no Go toolchain; recorded as an environment blocker, not a source failure.

The original unmodified application passed all locally available frontend gates. Later failures can therefore be evaluated as branding-change regressions unless separately demonstrated otherwise.

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
- Go checks were not run during this original baseline because no Go executable was then available on `PATH`; this historical limitation was superseded on 2026-08-13 when the review used the local cached Go 1.26.5 toolchain and passed both embed-mode and full backend tests.

The original unmodified application passed all locally available frontend gates. Later failures can therefore be evaluated as branding-change regressions unless separately demonstrated otherwise.

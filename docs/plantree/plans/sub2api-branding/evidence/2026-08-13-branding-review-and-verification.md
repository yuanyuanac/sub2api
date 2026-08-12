# Branding Review and Verification

Role: verification-evidence
Verified: 2026-08-13 Asia/Shanghai
Scope: follow-up review and hardening of the AINODE homepage, runtime branding fallback, and embedded first response

## Review outcome

The final source, test, browser, and visual review found no remaining blocking or high-severity issue after the fixes below. Business logic outside public branding and homepage rendering was not changed.

Issues found and fixed:

- Normalized configured site names with `trim()` and made `AINODE` the shared fallback for the store, route titles, initial document title, and both homepage modes.
- Accepted mixed-case HTTP(S) schemes consistently in custom homepage and backend favicon URLs while retaining URL validation.
- Added an accessible iframe title and retained the restrictive sandbox plus `no-referrer` policy.
- Removed all case variants of existing favicon links before inserting a validated replacement, with data URLs restricted to image media types.
- Made every homepage-owned interactive target at least 44 CSS pixels in both built-in modes, including locale and footer controls.
- Corrected homepage heading hierarchy, removed prohibited gradients/translucent treatments, and preserved opaque white text-bearing surfaces.
- Hid provider separators below the `sm` breakpoint so wrapped 360-pixel rows do not retain stray vertical rules.
- Updated embedded static-file tests from the removed legacy PNG path to the tracked SVG fallback.

## Browser and visual acceptance

- Chromium runtime suite: 8/8 scenarios passed.
- Viewports: 360, 768, and 1440 CSS pixels.
- States: default, compact, dark preference, reduced motion, administrator CTA, mixed-case custom HTTP iframe, and whitespace-only configured site name.
- No horizontal overflow, console error, or page error was observed.
- All audited owned controls measured at least 44 by 44 CSS pixels.
- All audited homepage text-bearing surfaces resolved to `rgb(255, 255, 255)`.
- Heading hierarchy and iframe `title`, `sandbox`, and `referrerpolicy` values matched the contract.
- Final 360-pixel default/compact and 1440-pixel default screenshots were manually reviewed with no remaining layout or separator defect.

## Automated verification

Passed locally:

```text
frontend changed-surface Vitest: 4 files / 64 tests
frontend full Vitest: 221 files / 1556 tests
frontend ESLint: passed
vue-tsc --noEmit: passed
vue-tsc -b: passed
vite build: passed
go test -tags embed ./internal/web: passed
go test ./...: passed
python tools/branding/generate_brand_assets.py --check: verified 10 deterministic assets
Pillow asset inspection: verified six PNG dimensions and RGB/RGBA modes
git diff --check: passed
```

The production build emitted only the repository's existing Browserslist age, dynamic/static import, and chunk-size warnings. No dependency or lockfile change was introduced. One redundant full-Vitest invocation was terminated by a command timeout and consequently emitted `EPIPE`; the succeeding quiet invocation completed normally with all 1556 tests passing.

## Delivery and rollback

- Delivery target: existing Draft PR [#1](https://github.com/yuanyuanac/sub2api/pull/1) on `feature/sub2api-branding` by ordinary push only.
- Hardening commit: `e2ef0ad5dd4cf6d557f41a9d9b689a61a76b01a7` (`fix(branding): harden homepage and embed fallbacks`).
- At hardening acceptance, local HEAD, `origin/feature/sub2api-branding`, and the PR head all matched `e2ef0ad5dd4cf6d557f41a9d9b689a61a76b01a7`.
- PR state at acceptance: open, Draft, and not merged.
- PR-triggered [CI run 31623863968](https://github.com/yuanyuanac/sub2api/actions/runs/31623863968): success. `frontend`, `test`, `shell`, and `golangci-lint` all passed.
- PR-triggered [Security Scan run 31623863669](https://github.com/yuanyuanac/sub2api/actions/runs/31623863669): success. `frontend-security` and `backend-security` both passed.
- Push-triggered [Security Scan run 31623861109](https://github.com/yuanyuanac/sub2api/actions/runs/31623861109): success on attempt 1.
- Push-triggered [CI run 31623861089](https://github.com/yuanyuanac/sub2api/actions/runs/31623861089): success on attempt 2. Attempt 1's `golangci-lint` job failed before source analysis because the runner received two `socket hang up` errors while downloading the v2.9.0 binary. A failed-job rerun completed the same lint job successfully without source or workflow changes; the original run's `frontend`, `test`, and `shell` jobs had already passed.
- Merge, Ready-for-review transition, force-push, deployment, release, and publication remain prohibited.
- Rollback is an ordinary revert of the follow-up hardening commit; no schema, migration, dependency, or external-state rollback is required.

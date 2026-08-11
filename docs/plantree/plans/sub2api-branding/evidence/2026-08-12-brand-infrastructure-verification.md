# Brand Infrastructure Verification

Role: landed-evidence
Verified: 2026-08-12 Asia/Shanghai
Scope: B2/B3 source asset, deterministic derivatives, browser/install metadata, runtime favicon handling, and backend first-response injection

## Source And Outputs

- Approved source: `tools/branding/source/ainode-approved-original.png`
- Source dimensions/mode: `83x88`, RGB
- Locked SHA-256: `4498dc6be1de3be9ab417b7de057cc80c057265303685fc9709848c479f24b9d`
- Generator: `tools/branding/generate_brand_assets.py`
- Deterministic outputs: 10 total, covering `/logo.svg`, versioned logo/favicon SVG, 16/32 favicon PNG, 180 Apple Touch PNG, 192/512 PWA PNG, 512 maskable PNG, and `/site.webmanifest`.
- Versioned files under `frontend/public/brand/` total about 301 KiB; this is source/static asset size, not repeated build storage.

## Verification Results

Passed:

```text
python tools/branding/generate_brand_assets.py --check
  verified 10 deterministic AINODE assets

CI=true corepack pnpm@9.15.9 exec vitest run src/utils/__tests__/branding.spec.ts
  5/5 tests passed

corepack pnpm@9.15.9 run lint:check
corepack pnpm@9.15.9 run typecheck
corepack pnpm@9.15.9 run build
git diff --check
```

The production build emitted only the repository's existing chunk/dynamic-import warnings. No dependency or lockfile change was introduced.

## Environment Blockers

- `go`: command not found. The repository requests Go `1.26.5`, so `go test ./internal/web` and the backend embed test cannot be executed on this workstation.
- `docker`: command not found. No image was built or published, consistent with the current authorization boundary.
- These are explicit environment blockers; they are not recorded as passing gates. GitHub CI is expected to supply independent validation after the Draft PR is opened.

## Delivery Boundary

This evidence authorizes only the first local implementation commit. It does not authorize pushing `main`, force-pushing, merging, releasing, deploying, or publishing a container image.

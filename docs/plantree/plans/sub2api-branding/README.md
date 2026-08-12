# AINODE Branding and Opaque-White Homepage

Role: active-plan entrypoint
Status: B1-B6G and follow-up hardening accepted in the open Draft PR

## Outcome

Replace public Sub2API identity with the approved `AINODE` brand, unify browser/install assets, and redesign both built-in `/home` modes around opaque white surfaces. Preserve all business behavior and deliver the verified change through a Draft PR.

## Decisions

- The approved blue/cyan S symbol is the only visual source of truth; generated sizes and the SVG fallback must preserve it.
- Every ordinary homepage text-bearing surface is opaque `#FFFFFF`.
- No gradients, decorative grid, glow field, translucent white, glass effect, backdrop blur, or public-home dark mode.
- Existing custom `home_content` precedence remains. Cross-origin iframe contents are outside parent-style control.
- No service worker is added.
- `PRODUCT.md` and `DESIGN.md` are the implementation contracts.

## Scope and Gates

1. Record pristine lint, typecheck, test, build, and Go embed baselines.
2. Generate and validate SVG/favicon/Apple/PWA/maskable assets plus a manifest.
3. Integrate fallback/runtime favicon behavior and protect it with tests.
4. Implement default and compact homepage modes.
5. Capture real-page evidence at 360, 768, and 1440 CSS pixels and iterate on failures.
6. Run the full relevant quality gate and remove only task-generated disposable output.
7. Commit intentional batches, ordinary-push the feature branch, create a Draft PR, and prove local/remote/PR SHA identity.

## Non-goals and Authority

Do not change gateway, authentication, billing, payment, database, Redis, or administrative business behavior. Do not deploy, publish an image, merge, release, force-push, or push `main`.

## Acceptance

- No old fallback logo appears during first render or configuration failure.
- Browser, bookmark, Apple touch, and installed PWA metadata resolve to the AINODE asset family.
- Both built-in homepage modes satisfy the white-surface and prohibited-treatment contracts across the three target widths.
- Navigation, CTA states, language switching, focus behavior, and responsive layout remain functional.
- Relevant automated gates pass, or an independently reproduced pre-existing failure is documented.
- Draft PR contains source, tests, contracts, visual evidence, risk/rollback notes, and no generated output or unrelated changes.

## Current Status

See [Implementation Status](implementation-status.md).

Initial GitHub verification is recorded in [Draft PR CI acceptance](evidence/2026-08-12-draft-pr-ci-acceptance.md). The follow-up hardening review, expanded local verification, and terminal GitHub acceptance are recorded in [Branding review and verification](evidence/2026-08-13-branding-review-and-verification.md).

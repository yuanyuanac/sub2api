# Homepage Browser and Quality Verification

Role: landed-evidence
Verified: 2026-08-12 Asia/Shanghai
Implementation commit: `79abcc45bdf0afa5387ea4dd246408ebffcda9ae`

## Scope

- Built-in `/home` default and compact modes.
- Opaque-white visual contract, responsive behavior, identity-dependent CTA routing, localization, keyboard focus, and embedded custom-content containment.
- This evidence does not cover staging, production, backend behavior, container publication, or deployment.

## Real-browser acceptance

- Chromium scenario suite: 8/8 passed.
- Viewport coverage: 360, 768, and 1440 CSS pixels.
- State coverage: default and compact modes; Chinese and English; visitor, authenticated user, and administrator CTA destinations; explicit dark selection and dark system preference; reduced motion; and intentionally long localized text.
- Every inspected homepage surface resolved to `rgb(255, 255, 255)`.
- No horizontal overflow was observed.
- CTA routing, locale switching, documentation navigation, and visible keyboard focus behaved as required.
- No runtime page exceptions were observed.
- The custom `home_content` precedence path remains intact; its iframe is constrained with `sandbox` and `no-referrer`.

## Automated quality gates

- Focused homepage Vitest: 19/19 passed.
- Full frontend Vitest: 221 files / 1547 tests passed.
- ESLint check: passed.
- `vue-tsc --noEmit`: passed.
- Production frontend build: passed.
- `git diff --check`: passed.

## Environment boundary

- Go was not available on `PATH` during this initial checkpoint. The 2026-08-13 follow-up review later passed embed-mode and full backend tests with the local cached Go 1.26.5 toolchain.
- Docker validation remained unnecessary and outside the authorized scope. No image was built or published, and no staging or production environment was changed.

## Risk and rollback

- Residual risk at this checkpoint was limited to checks unavailable at that time and deployment-specific configuration outside this worktree; the later local Go verification removed the backend-toolchain portion of that risk.
- Source rollback is the ordinary revert of `79abcc45bdf0afa5387ea4dd246408ebffcda9ae`; the preceding branding infrastructure commit can remain independent if only the homepage treatment is withdrawn.

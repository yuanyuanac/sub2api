# AINODE Product Contract

## Product

AINODE is the branded distribution of Sub2API in this repository. This change replaces the public-facing Sub2API identity and homepage presentation without changing the gateway, authentication, billing, payment, storage, or administrative business behavior.

## Users and Jobs

- Visitors need to understand that AINODE provides a stable, unified API access point and need a clear path to sign in or begin using the service.
- Signed-in users need a direct path back to the application without relearning the existing dashboard.
- Operators need one maintainable brand asset set that behaves consistently in the page, browser chrome, bookmarks, Apple touch surfaces, and installed web-app launchers.
- Maintainers need a reproducible source change with tests, immutable Git history, and an upstream-compatible rollback path.

## In Scope

- Brand name `AINODE` and the approved blue/cyan S symbol supplied by the product owner.
- Default site-logo fallback, browser favicons, Apple touch icon, Web App Manifest, and installable PWA icons.
- The built-in default and compact `/home` experiences.
- Responsive behavior at 360, 768, and 1440 CSS pixels.
- Source tests, production build verification, visual evidence, Plan Tree status, a feature branch, and a Draft PR.

## Non-goals

- No changes to API contracts, database schema, authentication, billing, payment, Redis, account pools, or upstream-provider behavior.
- No redesign of authenticated dashboard/admin screens beyond their inherited site logo.
- No service worker or offline-cache behavior.
- No attempt to style the contents of an uncontrolled cross-origin custom `home_content` iframe.
- No deployment, image publication, merge, release, or direct push to `main` in this delivery.

## Acceptance Criteria

- Initial load, refresh, configuration failure, and sign-in transitions never flash the old Sub2API fallback logo.
- Built-in default and compact homepages use opaque `#FFFFFF` for the page canvas and ordinary text-bearing surfaces; they contain no gradients, decorative grids, colored glow fields, translucent white panels, or backdrop blur.
- The public homepage exposes no dark-mode switch. Existing theme capability behind authentication remains intact.
- Visitor, authenticated-user, language, navigation, CTA, and keyboard-focus behavior remains functional.
- Body text meets WCAG AA contrast and the layout has no clipping or unintended horizontal scrolling at 360, 768, or 1440 CSS pixels.
- Manifest icons resolve at the declared sizes and MIME types, and browser metadata uses the same approved identity.
- Relevant frontend tests, type checking, linting, production build, and Go embed tests pass, with any pre-existing baseline failure recorded separately.
- Local HEAD, pushed feature SHA, and Draft PR head are identical; no generated build output, secrets, or unrelated changes enter the PR.

## Delivery Boundary

The authorized endpoint is a verified Draft PR from `feature/sub2api-branding`. Staging and production acceptance remain blocked until deployment topology, runtime artifact identity, redacted homepage settings, endpoints, and separate deployment authorization are available.

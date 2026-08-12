# AINODE Homepage Design Contract

## Design Direction

AINODE should feel precise, calm, and infrastructure-grade: a white editorial canvas, strong typographic hierarchy, fine cool-gray rules, and the blue/cyan S symbol as the recognizable signature. The page should read as a deliberately composed product surface rather than a generic AI SaaS template.

## Brand

- Wordmark: `AINODE`, set adjacent to the approved S symbol without modifying the symbol artwork.
- Primary accent: saturated azure/blue, with cyan reserved for the symbol and small status details.
- Neutral canvas and every ordinary text-bearing surface: opaque `#FFFFFF`.
- Default fallback assets and runtime-configured identity must converge on the same brand.

## Visual System

- Use a crisp sans-serif system stack already compatible with the application; do not introduce a remote font dependency.
- Use large but controlled display type, compact uppercase/monospace labels only where they convey system status, and readable line lengths.
- Structure content with whitespace, alignment, rules, and restrained borders instead of floating card grids.
- Interactive controls may use solid brand color. Information surfaces stay white, with neutral borders and dark text.
- Motion, if retained, must be subtle, purposeful, and disabled by reduced-motion preferences.

## Prohibited Treatments

- Gradients of any kind on the built-in homepage.
- Decorative background grids, radial glows, floating light blobs, glassmorphism, translucent white fills, or `backdrop-blur`.
- Dark homepage variants or a public-home theme toggle.
- Excessive rounded cards, pill-shaped decoration, or a repeated feature-card template.
- Brand color as a large text-panel background.

## Responsive Behavior

- 360 px: single-column reading order, compact navigation, full-width primary actions where needed, no horizontal scroll, and touch targets of at least 44 CSS pixels.
- 768 px: balanced hero and supporting proof layout without crowding or tiny copy.
- 1440 px: constrained content width, deliberate negative space, and no uncontrolled stretching.
- Navigation, CTA labels, brand lockup, feature evidence, and footer links remain legible in Chinese and English.

## Homepage Modes

- Default mode: full AINODE narrative with brand lockup, clear value proposition, primary/secondary CTA, operational proof, product capabilities, and a restrained footer.
- Compact mode: shorter AINODE introduction and direct CTA using the same tokens and white-surface contract.
- Custom `home_content`: preserve existing precedence and sandbox behavior. Parent code may provide a white outer canvas but cannot guarantee the styling of a cross-origin iframe document.

## Accessibility and Interaction

- Normal text contrast is at least 4.5:1; large text and non-text UI meet applicable WCAG AA thresholds.
- All controls expose visible keyboard focus and meaningful accessible names.
- Semantic landmarks and heading order remain coherent.
- Hover cannot be the only indicator of interactivity, and motion is not required to understand content.

## Visual Verification

Capture the real running application, not a mock, at 360, 768, and 1440 CSS pixels. Verify both built-in homepage modes, visitor/authenticated CTA state where feasible, language switching, keyboard focus, favicon/manifest requests, clipping, overflow, and the prohibited-treatment checklist.

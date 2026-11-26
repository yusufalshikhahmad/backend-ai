# Design System Research & Decisions

## Evidence and principles

There is no universally “best” palette used by all leading products. A professional system is defined by a coherent hierarchy, semantic roles, repeatable tokens, tested contrast, typography, spacing and interaction states—not by copying a famous brand.

### Standards and reference systems
- **Material Design 3** organizes themes around semantic color roles, surface/accent/semantic groupings, typography scales, shape scales and reusable design tokens. We adopt role-based tokens and theme mapping rather than hardcoding colors into individual screens.
  - https://developer.android.com/codelabs/m3-design-theming
- **WCAG 2.2** defines measurable accessibility requirements. For normal text, minimum contrast is 4.5:1; for large text, 3:1 under Success Criterion 1.4.3. Color alone must not convey meaning. Keyboard focus must remain visible and not be obscured.
  - https://www.w3.org/TR/wcag/
  - https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- **Google's color contrast guidance** reinforces that contrast depends on luminance and pairings, not simply on choosing a bright hue.
  - https://codelabs.developers.google.com/color-contrast-accessibility

These references provide design and accessibility principles. They do not prescribe one brand palette for this product.

## Brand direction
Premium engineering academy; calm, credible, hands-on, optimistic. Keywords: precision, craft, focus, depth, experimentation. Not cyberpunk, childish, crypto-dashboard, or saturated neon everywhere.

## Proposed dark palette (working tokens; contrast must be verified)
- canvas #0B0D12
- surface-1 #11151D
- surface-2 #171D27
- surface-3 #202938
- border #273242
- text-primary #F4F7FC
- text-secondary #B2BECE
- text-muted #8593A7
- cyan #36D6F4
- violet #8C78FF
- blue #4C8DFF
- success #42C98A
- warning #F3B65C
- error #FF6B78
- info #69B7FF

## Proposed light palette
- canvas #F5F7FB
- surface-1 #FFFFFF
- surface-2 #EDF1F7
- surface-3 #E3EAF4
- border #D5DDE8
- text-primary #111827
- text-secondary #475569
- text-muted #64748B
Use darker brand variants in light theme. Never reuse bright dark-mode cyan for small light-theme text without testing.

## Contrast and semantic color rules
- These palette values are design starting points, not a claim of WCAG conformance. Before shipping, test every text/control pairing in both themes with a contrast checker.
- Target at least 4.5:1 for normal text and 3:1 for large text.
- Use accent colors primarily for surfaces, controls, selected states and decorative cues. Pair each with a tested on-color.
- Success/warning/error must also use iconography and clear labels; never use color alone.
- Disabled controls should remain understandable and perceivable, but must not be confused with active controls.
- Focus ring must be visible against adjacent surfaces and not hidden behind sticky UI.
- Check charts and diagrams for contrast and non-color encodings.

## Token architecture
Primitive: raw color, spacing, radius, typography.
Semantic: text, surface, primary, success, danger, focus, border.
Component: quiz option, code panel, lesson-complete badge, CTA.
Components must consume semantic/component tokens—not raw primitives.

Example naming:
- color.canvas
- color.surface.default
- color.surface.elevated
- color.text.primary
- color.text.secondary
- color.action.primary
- color.action.primary-foreground
- color.border.subtle
- color.status.success
- color.status.warning
- color.status.danger
- color.focus.ring
- radius.card
- spacing.4 / spacing.8 / spacing.16
- motion.duration.fast / motion.duration.normal

## Typography
Arabic: IBM Plex Sans Arabic or Noto Sans Arabic; test weights, numbers and Latin mixing.
English: Inter or system sans.
Code: JetBrains Mono.
Scale proposal: 12, 14, 16, 18, 24, 32, 40, 56. Core lesson body at least 16px; metadata 14px. Avoid ultra-light fonts on dark backgrounds. Ensure the Arabic font has reliable punctuation, numerals and ligature rendering; define fallback stacks.

## Spacing & layout
4px base; scale 4, 8, 12, 16, 24, 32, 40, 48, 64.
Card radius 16px; composer 24px; pill controls fully rounded; borders 1px.
Desktop max width 1200–1280px; reading width 680–760px.
Responsive test widths 360, 768, 1024, 1280.
Dark elevation: slightly lighter surfaces and subtle borders, not pure black.
Glow reserved for composer, focus ring, or active artifact.

## Motion & icons
Micro-interactions 120–200ms, subtle easing, reduced-motion respected. Motion communicates state. Avoid motion that blocks reading or input.
Use one line-icon family, 16/20/24 grid; icons paired with labels for unfamiliar actions. Do not use emoji as primary navigation icons.

## Accessibility checklist
- WCAG 2.2 AA contrast; keyboard-only; visible focus; semantic headings; screen reader labels.
- Arabic RTL and English LTR; isolate code, paths, URLs and command output as LTR.
- 200% zoom and responsive reflow.
- 44px touch targets as a preferred product design target.
- Reduced motion; errors explain recovery; status never color-only.
- Media captions and diagrams with useful alt text.
- Quizzes and terminal simulator keyboard accessible.
- Test empty, error, success, disabled and loading states.
- Test at minimum 360px mobile, tablet and desktop breakpoints.
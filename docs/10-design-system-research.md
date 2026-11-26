# Design System Research & Decisions

## Evidence and principles
Material Design 3 uses theme roles, accent/surface/semantic groupings, typography scales, shape scales and design tokens. We adopt semantic role mapping and themeable values instead of hardcoded colors.
Reference: https://developer.android.com/codelabs/m3-design-theming

Accessible color contrast is about luminance, not hue alone. Start with grayscale hierarchy, assign roles, then check contrast for text and controls in light and dark modes.
Reference: https://codelabs.developers.google.com/color-contrast-accessibility

Accessibility target: WCAG 2.2 AA for interface text, controls, focus and keyboard operation. Automated checks supplement manual keyboard and screen-reader testing.
Reference: https://www.w3.org/WAI/standards-guidelines/wcag/

These are design-system principles; no single palette or visual style is universally “best”.

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

## Token architecture
Primitive: raw color, spacing, radius, typography.
Semantic: text, surface, primary, success, danger, focus, border.
Component: quiz option, code panel, lesson-complete badge, CTA.
Components must consume semantic/component tokens—not raw primitives.

## Typography
Arabic: IBM Plex Sans Arabic or Noto Sans Arabic; test weights, numbers and Latin mixing.
English: Inter or system sans.
Code: JetBrains Mono.
Scale proposal: 12, 14, 16, 18, 24, 32, 40, 56. Core lesson body at least 16px; metadata 14px. Avoid ultra-light fonts on dark backgrounds.

## Spacing & layout
4px base; scale 4, 8, 12, 16, 24, 32, 40, 48, 64.
Card radius 16px; composer 24px; pill controls fully rounded; borders 1px.
Desktop max width 1200–1280px; reading width 680–760px.
Responsive test widths 360, 768, 1024, 1280.
Dark elevation: slightly lighter surfaces and subtle borders, not pure black.
Glow reserved for composer, focus ring, or active artifact.

## Motion & icons
Micro-interactions 120–200ms, subtle easing, reduced-motion respected. Motion communicates state.
Use one line-icon family, 16/20/24 grid; icons paired with labels for unfamiliar actions.

## Accessibility checklist
WCAG 2.2 AA contrast; keyboard-only; visible focus; semantic headings; screen reader labels; RTL/LTR; isolate code direction; 200% zoom; 44px touch targets target; reduced motion; errors explain recovery; status never color-only; media captions; diagrams have alt text; quizzes keyboard accessible.

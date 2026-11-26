# 02 — Design System Prompt

Create the design system for AI Engineering Academy. Use docs/10-design-system-research.md and assets/mockups/design-system-board.svg as the starting direction. The reference screenshot guides the Home page composition, not the entire product.

## Brand personality
Confident, focused, technical, human, welcoming, academically rigorous. Avoid childish gamification, generic purple AI gradients everywhere, glassmorphism overload, excessive glow and template-like LMS visuals.

## Color system
Use semantic tokens:
- canvas / on-canvas
- surface-1 / surface-2 / elevated
- primary / on-primary / primary-container
- secondary / tertiary
- text-primary / text-secondary / text-muted
- border-subtle / border-strong
- success / warning / danger / info and their on-colors
Provide dark and light values. Keep cyan and violet as accents, not body text by default. Check actual contrast combinations and report measured ratios. Never claim AA without tests.

Suggested starting palette (refine only with rationale):
Dark: #0B0D12 canvas, #11151D surface-1, #171D27 surface-2, #F4F7FC text-primary, #B2BECE text-secondary, #36D6F4 cyan, #4C8DFF blue, #8C78FF violet.
Light: #F7F9FC canvas, #FFFFFF surface-1, #EEF2F7 surface-2, #151B26 text-primary, #536174 text-secondary, #087F9C cyan action, #315FC5 blue action, #6952C9 violet accent.
Semantic colors must be tuned separately for both themes.

## Typography
Arabic: evaluate IBM Plex Sans Arabic or Noto Sans Arabic. Latin UI: Inter. Code: JetBrains Mono. Establish display/headline/title/body/label/code roles; readable line-height; support mixed Arabic/English runs and numerals. Load fonts responsibly with fallbacks.

## Shape and layout
4/8px spacing rhythm; 12/16/20px shape scale; consistent 1px borders; readable 640–720px lesson measure; generous max-width on landing; grid-based responsive system.

## Components
Buttons (primary/secondary/tertiary/destructive), prompt composer, chips, nav, cards, progress bars, course nodes, tabs, breadcrumbs, callouts, code blocks, terminal, quiz choices, hint panel, feedback panel, review card, project milestone, dialog, tooltip, toast, skeleton, empty state.

## States
Default, hover, pressed, focus-visible, active, selected, disabled, loading, success, warning, error. Include keyboard focus and reduced motion.

## Deliver
Token table (dark/light), type scale, spacing/shape/elevation, component inventory, behavior/state table, contrast report, responsive breakpoints, RTL rules, and a live design-system showcase. No implementation of unrelated product features.

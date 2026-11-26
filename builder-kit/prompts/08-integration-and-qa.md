# 08 — Integration, Accessibility and QA Prompt

Review the complete prototype as a principal engineer and accessibility specialist. Do not add new product scope while auditing.

## Functional audit
- Every CTA, chip, menu, selector and lesson control works.
- No dead links or placeholder actions.
- Navigation and back behavior are predictable.
- Local progress behavior is truthful and stable.
- Errors and empty states are understandable.

## Visual audit
- Consistent tokens and component states.
- Dark and light themes.
- 360px mobile, tablet and desktop.
- No clipped Arabic or mixed-direction punctuation.
- Text hierarchy, alignment, spacing, responsive navigation and readable lesson width.
- No excessive blur, glow, gradient or low contrast.

## Accessibility audit
Target WCAG 2.2 AA: keyboard access, visible focus, semantic landmarks, labels, contrast, text resize, no color-only meaning, reduced motion, focus not obscured. Test manually, not just automated tools.

## Security / honesty
- No real shell or arbitrary code execution.
- No secrets committed.
- No unsupported backend/auth/AI claims.
- Distinguish mock data from connected services.
- Validate links and user input.
- Do not upload student personal data in demo assets.

## Deliver
List all issues by severity, reproduce steps, fixes applied, tests run and remaining risks. Provide desktop/mobile screenshots and a final release gate PASS/FAIL.

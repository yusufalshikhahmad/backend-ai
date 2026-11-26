# 03 — Home Screen Prompt

Design and implement only the Home screen and its responsive states, using assets/mockups/home-prompt-first.svg and the user's screenshot as composition references.

## Desktop hierarchy
1. Top navigation: Academy brand, المسار, المختبرات, المشاريع, community (only if implemented), account.
2. Optional announcement pill with a meaningful learning update; omit if no real announcement.
3. Centered headline and one-line promise.
4. Large prompt composer as the dominant focus. Arabic RTL placeholder: "شو حاب تتعلم أو تبني اليوم؟"
5. Composer footer: optional path context selector and primary action. Add an attachment or microphone only if fully functional and needed.
6. Suggestion chips: Linux Lab, Python, Data Engineering, RAG Playground, AI Agents.
7. Below fold: Continue Learning, Today's Plan, Review Due and Current Project.

## Behaviors
- Typing updates the composer.
- Enter or CTA submits and routes to a matching local course/lab based on supported intents; unknown intent provides helpful suggested paths.
- Chips route to their actual destinations.
- Nav links open real screens or clearly indicate unavailable future sections without pretending they work.
- Mobile: compact navigation, headline wraps naturally, composer fills width, footer controls wrap, chips horizontal-scroll with keyboard accessibility.

## Visual constraints
Maintain generous whitespace. Avoid copying Gemini title, badge, logo, iconography or exact wording. Use one restrained gradient border around the composer and selected CTA only. Ensure strong focus state and text contrast.

## Acceptance
No dead buttons; no clipped Arabic text; mobile at 360px; keyboard-only use works; screenshot at desktop and mobile; both themes.

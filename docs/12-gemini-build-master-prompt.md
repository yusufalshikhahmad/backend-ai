# Master Prompt — Gemini Build Mode / AI App Builder

Attach the user's screenshot as a visual reference and include our concept SVGs. Use the screenshot for the prompt-first composition only; do not copy Gemini branding or assets.

You are a principal product designer, senior frontend engineer, learning-experience designer and accessibility reviewer. Build **AI Engineering Academy**, an Arabic-first interactive learning platform based on an AI Backend Engineering curriculum. This is a functional product prototype—not just a landing page.

## Product
Students learn through short explanations, visualization, practice, hints, feedback, review, and engineering projects. Active practice is the default, not a video/PDF catalog.

## Visual identity
Premium developer-education aesthetic: graphite surfaces, restrained cyan/blue/violet accent gradient, elegant thin borders, minimal glow, whitespace, precise typography, coherent icons. Dense engineering information is balanced with breathing room.
Arabic RTL default; code and technical identifiers LTR-isolated. Complete light theme. Responsive desktop/tablet/mobile. Accessible focus, contrast and reduced motion. Semantic color tokens.

## Home
Headline: “ابنِ مهاراتك في هندسة الذكاء الاصطناعي”
Subheading: “تعلم تفاعلي • مختبرات عملية • مشاريع حقيقية”
Prompt: “شو حاب تتعلم أو تبني اليوم؟”
CTA: “ابدأ رحلتك”
Selector: curriculum/lab/project. Chips: Linux Lab, Python, Data Engineering, RAG Playground, AI Agents.
Below fold: Continue Learning, today's plan, reviews due, current project and three feature cards.

## Routes/sections
Home; Curriculum/course map; Course/lesson; Interactive labs; checkpoints/quizzes; project workspace; progress/review dashboard; profile/settings (theme, language, accessibility).

## Lesson
Schema-driven: outcome → short explanation → diagram → worked example → interaction → practice → checkpoint → reflection. Include hints and explanatory feedback. Build one complete AIB-100 Linux fundamentals lesson. If curriculum metadata hasn't been source-verified, visibly label as draft.

## MVP behavior
Navigation functional. Prompt/chips launch lesson/lab by selection. Course nodes open details. Lesson step navigation. Interactive quiz and rationale. Simulated terminal with allowlisted fake filesystem, never a real shell. Local progress. Theme toggle. RTL and LTR readiness. Mobile menu. Loading/error/empty states.

## Technical
Use builder's framework; if React/Next.js, TypeScript, reusable components and routes, content separated from UI. Avoid one giant component. README with run instructions and tests if supported.

## Design constraints
4px spacing scale; 16–24px radii; 1200px max content; 680px reading width; IBM Plex Sans Arabic/Noto Sans Arabic + Inter; JetBrains Mono. Consistent line icons. No emoji as primary navigation icons. Motion subtle and respects reduced-motion.

## Quality
Polished, coherent, usable—not decoration-first. First screen clearly directs action. No fake statistics or testimonials. Every visible button works. Real sample lesson content. Test mobile and keyboard.

## Deliverables
Functional prototype, screen inventory/route map, tokens/components, one complete AIB-100 lesson + terminal simulator, README, screenshots (home/map/lesson/lab/mobile), limitations and next-stage recommendation. Plan before implementation; implement only approved stage; validate and report evidence.

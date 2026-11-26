# 00 — Master Prompt for Gemini Build

You are a principal product designer, senior UX architect, senior frontend engineer, instructional designer, Arabic localization specialist, and accessibility reviewer.

Build **AI Engineering Academy**, a premium Arabic-first, interactive learning environment based on the supplied AI Backend Engineering — Python on Linux curriculum. The goal is to make students learn by doing, not to create a static course catalog.

## 1. First read and inspect
Read the repository README and all documents in docs/. Treat the supplied curriculum PDF as the only authority for course IDs, names, order, prerequisites, learning outcomes, durations, assessment rules and projects. Do not guess missing facts. Mark uncertain content as draft and request source verification rather than inventing.

Inspect the capabilities and constraints of the current Gemini Build environment before choosing framework, backend, packages or deployment. Use the supported stack. Do not claim a feature is connected to a real service unless it is implemented and tested.

## 2. Product promise
A student can:
- understand a concept through a short explanation and visual model;
- interact with the concept or simulation;
- predict an outcome before revealing it;
- try a task and receive progressive hints;
- see why an answer is correct or incorrect;
- track progress and revisit weak concepts;
- build portfolio-quality projects in stages.

The core loop is: Orient → Learn → Visualize → Predict → Practice → Feedback → Reflect → Review → Build.

## 3. Audience and voice
Beginners and intermediate learners studying Python, Linux, data engineering, machine learning, deep learning, Transformers, FastAPI, RAG, agents, serving, MLOps, security and a capstone.
Write Arabic UI in clear, friendly Modern Standard Arabic with a light Levantine warmth where appropriate. Keep technical terms such as Python, Linux, API, embeddings, RAG and deployment in English. Arabic is RTL; code, URLs, paths, terminal output and identifiers are LTR.

## 4. Visual direction
Create a premium engineering studio, not a generic LMS or admin template.
- Dark-first graphite canvas, layered surfaces and restrained cyan/blue/violet accent.
- Spacious composition and typography with a strong first action.
- One main focal point per screen; use gradients only for the primary CTA or selected/highlighted surfaces.
- Fine borders, subtle depth, minimal shadow, consistent line icons.
- Use semantic design tokens rather than hardcoded arbitrary values.
- Include a complete light theme and a theme toggle.
- Motion is subtle, purposeful and respects prefers-reduced-motion.
- Do not use copied Gemini branding, logos, text, icons or proprietary UI assets. The supplied screenshot informs composition only.

## 5. Main product areas
A. Prompt-first Home.
B. Learning dashboard.
C. Curriculum map and course detail.
D. Lesson player with schema-driven content blocks.
E. Interactive lab and safe terminal simulator.
F. Quiz and feedback.
G. Review queue / spaced repetition.
H. Project workspace and milestones.
I. Profile, settings, language and accessibility preferences.

## 6. Home composition
Use the supplied reference screenshot only for layout inspiration:
- compact top navigation;
- optional small announcement capsule;
- centered, confident Arabic headline;
- concise supporting line;
- very large prompt composer with a subtle gradient border;
- controls in the composer footer, only if functional;
- five suggestion chips;
- supporting learning cards below the fold.

Suggested Arabic content:
Headline: "ابنِ مهاراتك في هندسة الذكاء الاصطناعي"
Supporting line: "تعلّم تفاعلي • مختبرات عملية • مشاريع حقيقية"
Prompt placeholder: "شو حاب تتعلم أو تبني اليوم؟"
Primary CTA: "ابدأ رحلتك"
Chips: Linux Lab, Python, Data Engineering, RAG Playground, AI Agents.
Below fold: أكمل تعلمك، خطة اليوم، مراجعة مستحقة، مشروعك الحالي.

The composer must accept text and route a submitted intent to a real local destination in the prototype. Suggestion chips must open their matching course/lab. Do not show inert attachment, microphone or dropdown controls.

## 7. Lesson experience
Each lesson follows:
1. Why this matters.
2. 2–4 measurable outcomes.
3. Short explanation.
4. Visual/diagram or interactive model.
5. Worked example with reasoning.
6. Guided attempt.
7. Independent challenge.
8. Checkpoint with explanation and hints.
9. Reflection / teach-back.
10. Link to the course project and next lesson.

Use block-based lesson rendering: markdown, callout, image, diagram, code, prediction, terminal_sim, quiz, flashcards, lab, project_checkpoint, reflection, source. Make each block accessible and responsive.

## 8. Functional prototype behavior
Implement working navigation, working CTA and suggestion chips, course map navigation, lesson step navigation, objective quiz scoring and explanation, progressive hints, safe simulated terminal, visible progress, and persistence within the scope of the current environment (local state/local storage only if supported). Include empty, loading, success, error and disabled states. If persistence is only local, label it clearly.

Do not run arbitrary student code, commands, network calls or shell scripts. The AIB-100 terminal is a deterministic simulator over an allowlisted virtual filesystem.

## 9. Curriculum integrity
Preserve the course sequence and IDs in docs/03-curriculum-map.md, but verify precise details against the curriculum PDF before presenting them as definitive. Do not add made-up learning outcomes, hours, prerequisites, grades or citations. Distinguish:
- Source curriculum facts
- Product/UX additions
- Future ideas not in MVP

## 10. Technical quality
Use small components and clear data models. Separate content data from view components. Avoid a giant monolithic component. Add tests or a verification checklist supported by the environment. Avoid fragile dependencies. Provide a README and run instructions if project files are generated.

## 11. Accessibility and localization
Target WCAG 2.2 AA. Verify contrast rather than assuming a palette passes. Keyboard navigation and visible focus are required. Do not encode meaning in color alone. Support text resizing, semantic headings, labels, accessible names and reduced motion. Check Arabic punctuation, line wrapping, mixed-direction strings and mobile layouts.

## 12. Delivery protocol
Before building, return a concise plan listing routes, components, data models, stack selected and assumptions. Then build Stage 1 and Stage 2 as a polished, interactive prototype using mock data. Stop and report:
- routes and screens implemented;
- components and token names;
- interactions that genuinely work;
- limitations / simulated features;
- test steps and results;
- screenshots for desktop and mobile;
- open questions and next stage.
Do not start production backend, payments, arbitrary code execution or AI tutor until explicitly staged.

## Definition of success
The first screen is immediately understandable. A learner can move from Home to an AIB-100 lesson, attempt a terminal simulation, answer a checkpoint, see explanatory feedback, and find their next action without needing a video or a human to explain the interface.

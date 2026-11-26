# Repository Review — Prototype 0.1

**Reviewed:** 2026-11-26  
**Branch:** main  
**Reviewed head:** `3e9d35f756e4b245a97ab9ac5c82cc295c2df2eb`  
**Scope:** repository tree and source inspection. Build/tests were not run in this review environment; treat runtime claims as unverified until CI or local commands are run.

## Executive summary

The repository has progressed beyond Stage 0. It contains a runnable frontend prototype with a strong visual direction, route-based pages, bilingual RTL/LTR support, theme tokens, browser-local progress, a simulated terminal, checkpoint UI and a few interactive AI concepts. It is **not yet a complete learning platform or a production MVP**.

The best next move is not to add a backend or AI chatbot immediately. First stabilize and validate the prototype, make curriculum/content authoritative and data-driven, then complete a genuinely teachable AIB-100 experience. Only after that should persistence, authentication and AI tutor be introduced.

## Verified repository inventory

- React 19 + TypeScript + Vite + Tailwind CSS v4; Node/npm scripts: dev, build, preview, lint (lint is TypeScript no-emit).
- Routes: home, dashboard, curriculum, course detail, lesson, lab, review, projects, profile.
- Curriculum data has 16 course records across four semesters.
- Lesson data currently has 2 lesson entries: AIB-100 Linux files/terminal and AIB-302 RAG foundations.
- Question bank currently has 4 questions: 3 Linux AIB-100 questions and 1 RAG short-answer question.
- Labs: Linux terminal simulator, toy RAG chunking playground, agent-loop visualization/simulation.
- Projects: AIB-100 Linux scaffold project and draft RAG service project.
- Progress/settings are stored in browser localStorage.
- No backend, account/authentication, server database, cloud sync, real AI provider, or executable code runner.
- No automated test files/test framework or CI workflow appear in the repository tree.
- No lockfile is present in the reviewed tree.
- The root README still says Stage 0/no app code; this status is now stale and must be corrected.

## What is already strong

1. **Clear product thesis:** learn by doing, prediction, practice, hints, feedback, review, projects.
2. **Good design system foundation:** semantic CSS variables, dark/light theme, Arabic/English, reduced-motion toggle and focus-visible styling.
3. **Prototype breadth:** student journey screens exist and are navigable.
4. **Safe terminal approach:** commands operate on an in-memory virtual filesystem rather than the host shell.
5. **Explicit simulation labels:** toy RAG data and local-only persistence are represented in UI copy.
6. **Data separation:** course, lesson, quiz and project structures live in data files instead of being entirely embedded in page components.
7. **Source-verification flags:** curriculum/course/project content can be marked draft rather than presenting all metadata as verified.

## Findings — fix in this order

### P0 — Release-blocking before claiming a tested prototype

- **No test/build evidence:** there are no test scripts/framework or CI workflows in the tree. `npm run lint` and `npm run build` have not been executed during this review.
- **Short-answer checkpoint is self-scored, not evaluated:** the learner types an answer but correctness is determined by how many rubric checkboxes they tick. It is an honest self-assessment if labelled, but should not be represented as AI/automated answer grading.
- **Curriculum progression logic is hard-coded/incomplete:** `getCourseStatus` contains special cases for AIB-100, AIB-302, AIB-303 and an AIB-100-only prerequisite check. It does not evaluate arbitrary prerequisite chains, lesson mastery, or all courses. Course status can therefore be wrong as content grows.
- **Lesson route fallback hides invalid slugs:** `LessonPlayerPage` falls back to the AIB-100 lesson when the requested slug is not found. Invalid lesson links should show a real 404/empty state rather than silently teaching another lesson.
- **Review page has demo/fallback behavior:** its initial active question can fall back to the first question even when no review is due. Demo review data is deliberately available, but the UI must clearly separate “review due” from “try a sample checkpoint”.
- **Source alignment:** some data is flagged draft, but the complete course map, prerequisites, durations, lesson outcomes and assessment/project requirements need a systematic cross-check against the supplied curriculum. Do not mark content verified based only on plausible engineering knowledge.

### P1 — Stabilize the learning interactions

- Reset checkpoint currently resets visible question state; validate that hint count and attempt behavior are reset consistently and that repeated submits cannot double-count accidentally.
- Review queue should derive its active item when attempts change, handle zero due items, exclude or label demo attempts, and make “next review”/“review again” behavior explicit.
- Progress counts use completed block IDs; confirm the completion definition excludes merely visiting/answering and supports revisiting/reordering blocks.
- Course prerequisite graph needs a generic graph-based evaluator and cycle/invalid-reference validation.
- Lab completion must represent the intended learning goal, not merely a file-presence shortcut where inappropriate; test reset and goal conditions.
- RAG and agent labs are toy/simulation experiences; add explanatory feedback, learner tasks, expected outcomes and limitations rather than only controls/visualization.
- Add an explicit “not graded / self-check” state for rubric-based short answers.
- Add error boundaries, safe unknown-route handling, route/history/back behavior tests.

### P1 — Content completeness

- Only AIB-100 and AIB-302 have lesson content, while 16 courses appear in the catalog.
- AIB-100 is the first target, but make it a complete validated teaching unit: source-backed learning outcomes, lesson blocks, command task, checkpoint bank, misconception feedback, reflection, project link, accessibility, and instructor review.
- Add content validation for duplicate IDs, broken slugs, missing translations, missing explanations/hints, malformed question keys, prerequisite references and source metadata.
- Every lesson must include references back to the original curriculum source (page/section where possible).

### P2 — Architecture and product readiness

- The app currently uses a hand-rolled path router and browser history. Decide whether to retain it for this compact prototype or adopt a router; either way add centralized route definitions, not-found handling, route tests and proper scroll/history behavior.
- Add package lock and reproducible Node version/install instructions.
- Add CI for install, typecheck, build, unit tests and later browser E2E.
- Add browser E2E tests for Arabic RTL and English LTR, desktop and mobile, persistence and core lesson flow.
- localStorage has no versioned schema migration/validation. Add state schema version, migration, corruption recovery and export/delete controls.
- Avoid false “mastered” metrics. Define evidence and status rules in one place; distinguish completion, practice and mastery.
- Visual/accessibility claims need contrast measurements, keyboard test evidence, 360px reflow, 200% zoom, reduced motion and screen-reader checks.
- Development server is configured to bind all interfaces and allow all hosts. Fine for a hosted sandbox preview if platform controls it, but do not expose this development configuration as a production service. Production needs a separate deployment configuration.
- Dependency/security scanning and CSP/security headers belong before public deployment.

## Recommended immediate issue list

1. [ ] Correct README status to Prototype 0.1; document actual routes/features and limitations.
2. [ ] Run typecheck + production build; fix all failures; record output.
3. [ ] Add Vitest + React Testing Library; test learnerStore, prerequisite engine, quiz grading, terminal filesystem/goal checks.
4. [ ] Fix route invalid-slug fallback and add not-found screens.
5. [ ] Implement generic prerequisite/status calculation from graph + learner evidence.
6. [ ] Make review queue honest, dynamic, and separated from demo/sample questions.
7. [ ] Clarify short-answer self-rubric; never call it automatic grading.
8. [ ] Validate AIB-100 lesson against PDF; add content-source mapping.
9. [ ] Add mobile, RTL/LTR, theme, keyboard and accessibility audit checklist.
10. [ ] Add lockfile and CI.

## Product status definition

**Prototype 0.1 / Pre-alpha:** UI and local interactions exist. Data is partly draft. No server, identity, cloud persistence, AI, executable code, test evidence or production deployment. Safe to use for design feedback and controlled learner walkthroughs only after local build verification.

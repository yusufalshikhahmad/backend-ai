# Roadmap & Stage Gates

## Stage 0 — Discovery (current)
Product vision, pedagogy, source-aligned curriculum map, architecture, visual brief, backlog, prompts.
Gate: scope reviewed; curriculum details source-verified.

## Stage 1 — UX & wireframes
Flows: onboarding, course map, lesson, quiz, review, dashboard, project. Mobile/desktop wireframes; empty/error/loading states; test script with learners.
Gate: usability walkthrough.

## Stage 2 — Design system/prototype
Tokens, typography, components, visual hierarchy, RTL/LTR, contrast, keyboard focus, reduced motion; polished clickable prototype.
Gate: design reviewed on mobile + desktop.

## Stage 3 — Frontend foundation
Next.js/TypeScript, routing, shell, typed data, mock API, reusable blocks, localization, tests.
Gate: install, lint, typecheck, tests, production build.

## Stage 4 — Backend/data
FastAPI, migrations, auth, course/content APIs, progress/attempt endpoints, authorization tests, OpenAPI.
Gate: migration and test pass.

## Stage 5 — Content pipeline/AIB-100
Schema validation, preview, source-verified AIB-100 content, quizzes, lab, illustrations, citations.
Gate: instructor review and pilot student walkthrough.

## Stage 6 — Interactivity
Quizzes, hints, explanations, mastery evidence, review queue, safe terminal simulator.
Gate: deterministic grading, persistence, keyboard access.

## Stage 7 — AI Tutor (post-MVP optional)
Grounded retrieval, hint/explain/quiz/debug, citations, evaluation, privacy/cost/latency controls.
Gate: groundedness test and unsupported-answer behavior.

## Stage 8 — Coding playground (later)
Threat model, isolated execution, quotas, resource/network/filesystem restrictions, disposable sandbox, monitoring, abuse tests.
Gate: security sign-off required before public launch.

## Stage 9 — Pilot & deployment
Staging/production, CI/CD, backups/restore, monitoring, privacy, accessibility/security audit, feedback.
Gate: release and rollback checklist.

## Stage 10 — Community & scale
Cohorts, peer review, study rooms, instructor analytics, further courses, portfolio showcase.

## Definition of done
Scoped commit/PR, docs, tests/evidence, responsive/accessibility check, relevant security check, demo, risks, stage gate checklist.

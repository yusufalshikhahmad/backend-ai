# Prompts for implementation stages

## Shared instruction
Act as a senior product designer, full-stack engineer, learning designer and security reviewer. Inspect repository and read all docs first. Curriculum PDF is authoritative; don't invent its requirements. Separate source facts from product extensions. Work incrementally, keep scope controlled, use accessible semantic UI, Arabic RTL and English LTR, responsive layouts and tests. Do not expose secrets. Never execute student code in the web/API server. Report decisions, assumptions, files, setup commands, tests/evidence, demo, risks and gate checklist. Stop at this stage's gate.

## Stage 0 — Research
Audit curriculum and repository. Refine product requirements, personas, pedagogy, curriculum mapping with exact source page references, architecture/ADRs, MVP scope, backlog, risk register, visual brief. No application code.

## Stage 1 — UX
Design flows for onboarding, course map, lesson, checkpoint, review, dashboard and project milestone. Provide low-fidelity responsive wireframes, empty/loading/error states, RTL/LTR variants, accessibility and usability script for 5 learners. Prioritize first meaningful learning interaction.

## Stage 2 — Design system
Build a distinctive academy UI, not generic admin dashboard. Define tokens, type, spacing, elevation, motion, components and states. Prototype with mock data. Test mobile/desktop, RTL, keyboard, reduced motion and contrast.

## Stage 3 — Frontend
Implement approved Next.js + TypeScript structure, routes, shell, typed models, mock API, localization and tests. Schema-driven lesson blocks. Verify install/lint/typecheck/test/build and document run instructions.

## Stage 4 — Backend
FastAPI, migrations, auth/session, course/content endpoints, attempts/progress, validation, authorization, error contract, tests and OpenAPI. Local dev compose. Confirm API contracts.

## Stage 5 — Content
Create validated lesson schema and author preview. Verify AIB-100 outcomes, sequence, lab, references against source. Build complete first module with interactions, explanations, hints, accessibility descriptions, Arabic copy and English technical terms. Label enrichment.

## Stage 6 — Learning interactions
Implement objective quiz formats, hints, feedback, mastery evidence, spaced review and deterministic safe terminal simulation. Keyboard accessibility. Test grading and persistence.

## Stage 7 — Grounded tutor
Approved content only; modes Socratic hint, explanation, quiz, debugging. Cite sources, abstain when unsupported. Test prompt injection, privacy, cost/latency limits and evaluation dataset. Don't reveal complete solution prematurely.

## Stage 8 — Safe code runner
Separate isolated service; disposable sandbox; non-root; CPU/RAM/time/PID/output caps; blocked network and secrets; filesystem isolation; cleanup and quotas. Threat-model and adversarial tests. Do not launch if isolation incomplete.

## Stage 9 — Pilot/release
CI/CD, deploy, migrations, backups and restore test, logs/metrics, privacy notice, accessibility/security audit, rollback runbook, learner feedback and pilot metrics.

## Stage 10 — Community
Opt-in study groups, peer review, project showcase, moderation, instructor tools and cohort analytics. Validate need first.

## Required output
1. Summary and rationale
2. Decisions/assumptions
3. Files changed
4. Run instructions
5. Tests/evidence
6. Demo/screenshots
7. Risks/open questions
8. Gate checklist PASS/FAIL

# Roadmap After Prototype 0.1

This plan replaces the original linear Stage 0–10 roadmap with milestones based on the code now present. Work is staged so each increment is demoable, testable and useful to students.

## Stage 0 — Prototype inventory & reproducibility (NOW)
**Goal:** establish the exact state and make everyone able to run the same code.
- Update README and status labels.
- Node version, lockfile, clean-install instructions.
- Typecheck, production build and record results.
- Establish issues, test plan, demo data/reset steps.
- CI: install → lint/typecheck → build.
**Deliverable:** reproducible Prototype 0.1.
**Gate:** clean clone builds; no unreported errors; current feature/limitation list verified.

## Stage 1 — UX and correctness stabilization
**Goal:** make the existing journeys reliable before adding features.
- Central route table; unknown slug and route 404s; browser back/forward.
- Generic prerequisite graph evaluator and course state definitions.
- Review queue: actual due items only, sample/demo mode separate, active item updates.
- Checkpoint reset, repeated-submit, hint-count, feedback focus and keyboard fixes.
- Terminal simulator command/goal/reset test coverage and truthful help.
- localStorage schema version/migration/corruption handling.
- Error boundary and empty/loading states.
**Deliverable:** stable core flows.
**Gate:** automated unit tests for grading, progress, course state, review scheduler, terminal path resolution; manual route and mobile smoke test passes.

## Stage 2 — Content foundation & AIB-100 complete
**Goal:** prove the learning methodology with one high-quality course, not 16 thin courses.
- Crosswalk each AIB-100 objective to PDF page/section and lesson block.
- Review technical correctness, Arabic language, examples and command safety.
- Lesson: motivation → measurable objectives → concept → visual → worked example → prediction → practice → hints → checkpoint → reflection → project.
- Linux lab: task steps, allowlisted simulator, required commands/goal, hint ladder, expected state, reset.
- Quiz bank: misconceptions, objective grading, explanations, retry rules.
- Project brief, milestones, rubric and instructor review.
- Add content schema and validation CLI.
**Deliverable:** reviewed AIB-100 module ready for learner pilot.
**Gate:** source traceability; content QA checklist signed; learner can complete end-to-end without instructor intervention.

## Stage 3 — Learning engine MVP
**Goal:** turn lesson data into a reusable platform rather than page-specific experiences.
- Versioned lesson-block schema and renderer.
- Generic quiz engine (single, multiple, ordering; short answer self-review clearly labelled).
- Hint/attempt records; feedback and mastery evidence.
- Progress events and course/lesson status model.
- Review queue rules and explicit demo mode.
- Dashboard: continue, next action, review due, project; all computed from actual learner state.
- Content author preview and schema lint.
**Deliverable:** one complete course engine and authoring workflow.
**Gate:** add a new lesson/quiz through data only; no page code changes; test all block types and migrations.

## Stage 4 — Pilot UX, accessibility & reliability
**Goal:** validate that students actually learn with the interactions.
- 5–10 learner usability sessions (beginner mix); task script and observation log.
- Keyboard, screen reader, contrast, zoom, reduced motion.
- RTL Arabic and English mixed text, code/path isolation.
- Mobile 360/390, tablet, desktop and touch.
- Error states, browser refresh, back/forward, state reset/export/delete.
- Analytics events specification (privacy-minimal; no tracking until consent/policy).
**Deliverable:** pilot report, prioritized fixes, prototype release candidate.
**Gate:** critical usability/accessibility issues closed; core completion rate and confusion points documented.

## Stage 5 — Backend & accounts (after prototype/pilot)
**Goal:** make progress available across devices and support cohort/instructor workflows.
- Architecture decision record for API, auth provider, deployment, cost and privacy.
- FastAPI service, Pydantic contracts, PostgreSQL, Alembic migrations.
- Auth/session with reviewed provider; secure cookies, CSRF, rate limits.
- User/course/enrollment/progress/attempt/review/project schema.
- Authorization tests; student can only access own records.
- API contract, generated client, integration tests.
- Content versioning and import pipeline.
- Storage only when project artifact upload is needed; signed URLs.
**Deliverable:** authenticated pilot with cross-device progress.
**Gate:** migration/backup restore, authorization tests, API contract tests, privacy and deletion flow.

## Stage 6 — AI Tutor (bounded and evaluated)
**Goal:** provide tutoring that teaches rather than gives away answers.
- Tutor modes: explain, hint, Socratic, debug reasoning, quiz me, summarize.
- Retrieval only from approved course content and cited references.
- Source citation in responses; fallback “not covered in material” when evidence absent.
- Prompt-injection/content boundary, rate limits, privacy, token/cost controls.
- Golden evaluation set: factual accuracy, groundedness, pedagogical helpfulness, answer leakage, Arabic quality.
- Teacher/learner feedback and monitoring.
**Deliverable:** limited beta tutor for AIB-100 content.
**Gate:** evaluation thresholds agreed and passed; hallucination and unsafe behavior reviewed; budget/latency tracked.

## Stage 7 — Real coding labs (separate security project)
**Goal:** support actual Python execution without risking application or learner data.
- Threat model and sandbox decision.
- Disposable isolated runner (separate service, non-root, quotas, timeouts, memory/PID limits, no network by default, isolated FS, no secrets).
- Compiler/runtime image pinning, input/output limits, cleanup, rate limit.
- Abuse, escape, resource-exhaustion and multi-tenant isolation tests.
- Secure admin and audit.
**Deliverable:** private beta code runner.
**Gate:** independent security review; do not launch publicly before sign-off. Keep virtual terminal as safe fallback.

## Stage 8 — Curriculum expansion
**Goal:** expand one course at a time with the same quality bar.
Order recommended:
1. AIB-101 Python fundamentals
2. AIB-102 professional Python
3. AIB-110 math foundations (parallel/independent path where prerequisites allow)
4. AIB-111 statistics
5. AIB-120 data engineering
6. AIB-201 ML
7. AIB-202 PyTorch
8. AIB-203 Transformers
9. AIB-301 FastAPI
10. AIB-302 RAG
11. AIB-303 agents/MCP
12. AIB-304 serving
13. AIB-401 MLOps
14. AIB-402 security
15. AIB-490 capstone
Sequence and prerequisite relationships must be verified against the actual syllabus, not assumed from this suggested delivery order.
**Deliverable:** source-verified courses, projects, quizzes, labs and assessment.
**Gate per course:** content source map, expert review, pilot learner, accessibility and automated content validation.

## Stage 9 — Production launch
- CI/CD with staging and rollback.
- Secrets management; security headers; CSP; dependency scanning.
- Observability: redacted logs, metrics, errors and uptime.
- Backup/restore drills, data retention and deletion.
- Privacy notice, consent, user data export, incident response.
- Load test, cost budget, operational runbooks.
- Accessibility and security audit.
- Pilot support process.
**Deliverable:** production launch candidate.
**Gate:** release checklist fully signed off; rollback verified.

## Stage 10 — Cohorts, community and scale
Only after core learning quality and platform reliability:
- Cohort/classroom, instructor dashboard, assignment feedback.
- Peer review and project showcase with moderation/privacy.
- Study groups, collaborative labs and calendar.
- Adaptive recommendations based on validated mastery signals.
- More languages, content authors, analytics and monetization decisions.

## Stage gate template (every stage)
- Scope and owner
- Risks and decisions (ADRs)
- User-visible deliverable
- Tests run and evidence
- Source verification
- Accessibility/security checks
- Demo and screenshots
- Known limitations
- Explicit Go / No-Go

## Immediate next sprint (recommended, 1–2 weeks depending on hours)
1. Reproducible install + build + CI.
2. Fix routing fallback, course status and review behavior.
3. Tests for learner store, quiz logic, terminal simulator.
4. Content-source crosswalk and AIB-100 instructor review.
5. Pilot-ready AIB-100 completion flow.

# Stage Prompts — Expanded Sequence

Shared: inspect repo/docs and curriculum first. Do not invent course metadata. Keep Arabic RTL, responsive, accessible and security-conscious. Each stage reports summary, assumptions, files, tests, demo, risks and gate; stop at the gate.

## Stage 0 Research
Audit original curriculum. Produce source-traceable course metadata, learner personas, needs, measurable outcomes, learning-loop spec, MVP priority, risks and ADRs. Identify missing source details instead of guessing.

## Stage 1 UX
Screen inventory, user journeys, nav map, wireframes for Home, Dashboard, Course Map, Lesson, Lab, Quiz, Project, Profile. Define every state and RTL/LTR. Usability walkthrough with 5 learners; report friction. No production code.

## Stage 2 Design system
Semantic tokens, type, spacing, grid, radius, elevation, focus, motion, component states. Preview light/dark side by side. Build prompt-first Home inspired by screenshot. Validate contrast, keyboard, 200% zoom, mobile and reduced motion. Deliver prototype.

## Stage 3 App shell
Framework, routes, nav, responsive shell, localization, mock data, components, error boundaries, mobile navigation. Test all routes and production build.

## Stage 4 Course map
Verified curriculum, semesters/modules, prerequisite links, course detail, progress states. Locked nodes explain prerequisite. Keyboard/screen-reader accessible; graph has list fallback.

## Stage 5 Lesson engine
Content schema/renderers for text, callout, image, diagram, code, quiz, lab, reflection, source. Complete AIB-100 lesson with exact source refs. Autosave/step navigation. Validate schema.

## Stage 6 Practice
Quiz types, progressive hints, explanatory feedback, mastery evidence, review queue. Fake terminal with allowlisted commands only and virtual FS; tests for parser, path and reset. Never execute real shell.

## Stage 7 Progress/planner
Attempts/completion, transparent time estimates, next action based on prerequisites and reviews. Streak optional, no shame. Dashboard focuses on next step. Test persistence/edge cases.

## Stage 8 Tutor
Hint/explain/quiz/debug. Retrieval over approved course content, source citations, abstain when unsupported. Evaluation for hallucination, prompt injection, solution leakage, Arabic quality, latency/cost. Rate limit.

## Stage 9 Code runner security
Threat model. Separate disposable non-root runner, CPU/RAM/time/PID/output caps, blocked network, isolated FS, no secrets, cleanup, quotas, adversarial tests. If isolation unavailable, keep simulated lab. Security review required.

## Stage 10 Content ops
Author preview, validation, versioning, page references, translations, diagram alt, quiz-answer validation. Review required before publishing.

## Stage 11 Pilot/release
Staging, backups/restore, migrations, monitoring, privacy/deletion, rate limits, accessibility, browser matrix, security scanning, rollback. Pilot and structured learner feedback.

## Stage 12 Community
Only after pilot evidence: cohorts, peer review, moderated Q&A, instructor dashboard, anti-spam, reporting, privacy. Public leaderboard off by default.

## Stage 13 Capstone
Proposal, architecture, milestone plan, dataset/evaluation, implementation, optimization, threat model, deployment, demo and rubric. Verify rubric against original syllabus.

## Gate template
Scope met / Curriculum accuracy / Accessibility / Tests / Build / Security & privacy / UX walkthrough / Known gaps / Evidence / PASS or HOLD.

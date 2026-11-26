# MVP Backlog & Acceptance

## Epic A — Foundation
- App structure, scripts and CI.
- Design tokens, typography, RTL/LTR, themes and accessible primitives.
- Responsive shell and navigation.
- Error/loading/empty states.
Acceptance: clean clone and documented setup; checks pass.

## Epic B — Course map
- Course catalog/detail.
- Semester map and prerequisites.
- Lesson list, duration, status.
- Accessible progress.
Acceptance: course metadata validated from source.

## Epic C — Lesson player
- Blocks: text, callout, image, diagram, code, quiz, lab, reflection, source.
- Navigation, progress/autosave.
- Responsive and accessible.
Acceptance: new lesson rendered from content without custom page coding.

## Epic D — Practice
- MCQ, multiple select, matching, sequence, short answer (manual/rubric).
- Hints and explanations.
- Attempt persistence.
- Review queue.
- Safe simulated terminal.
Acceptance: keyboard support, deterministic objective grading, reload retains state.

## Epic E — Dashboard
- Continue learning.
- Today's plan and review due.
- Skill mastery evidence.
- Project milestone.
- Language/accessibility settings.
Acceptance: next useful learning action prioritized over vanity stats.

## Epic F — Content
- Verified course metadata and AIB-100 source notes.
- Lessons, practice, lab and visuals.
- Content review.
Acceptance: source traceability, schema validation, answer/hint completeness.

## Later: AI tutor
Grounded retrieval, tutor modes, citations, evaluation, cost/latency, safety.

## Later: Code execution
Threat model, isolated runner, resource limits, blocked network, cleanup, quotas, adversarial tests, security approval.

## Release checklist
Curriculum accuracy, smoke tests, keyboard/screen reader/contrast/reduced motion, RTL+English, mobile/tablet/desktop, security/dependency scan, backup/restore, monitoring, privacy/data deletion, pilot feedback.

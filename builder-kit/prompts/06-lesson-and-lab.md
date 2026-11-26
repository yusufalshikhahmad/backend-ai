# 06 — Lesson Player and Interactive Lab Prompt

Use assets/mockups/lesson-lab.svg. Build one complete AIB-100 introductory lesson as a prototype. Verify exact source content in the curriculum PDF. Do not produce unverified course facts.

## Lesson layout
- Breadcrumb/course code and lesson title.
- Compact progress indicator and step count.
- Main reading area: why it matters, outcomes, explanation, visual, worked example.
- Interactive panel: prediction/task, terminal simulation or code trace.
- Contextual hint area.
- Checkpoint and reflection.
- Next lesson/project connection.

## Terminal simulation
Simulate a virtual filesystem with a small deterministic allowlist: pwd, ls, cd, mkdir, touch, cat, clear, help. Validate paths and state changes against virtual data only. No shell, process execution, host filesystem, network or environment variables. Show expected behavior after an attempt; provide progressive hints.

## Learning interactions
Predict output before reveal. Let learners submit an answer. After incorrect attempt, show a misconception-aware hint first, not the answer. Provide explanation and retry. Support keyboard navigation and readable output.

## Lesson blocks
text, callout, diagram, code, prediction, terminal_sim, quiz, flashcards, lab, reflection, source.

## Acceptance
Learner can open lesson, complete an interaction, run safe terminal simulation, submit checkpoint, receive rationale, see saved local progress and proceed. Clearly label any mock persistence.

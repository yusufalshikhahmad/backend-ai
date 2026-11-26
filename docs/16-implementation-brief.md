# Implementation Brief — Builder Handoff

## Working name
AI Engineering Academy (not final branding).

## MVP
Prompt-first home; verified curriculum course map; schema lesson player; one complete AIB-100 lesson; simulated Linux terminal; checkpoint with hints and feedback; local progress; dashboard next action; dark/light theme; Arabic RTL and English LTR-ready; design tokens.

## Out of scope
Production auth, payment, public community, arbitrary code execution, unverified AI tutor, auto-generated full curriculum, native app.

## Prototype models
Course: id, code, title, semester, prerequisites, modules.
Lesson: id, courseId, title, outcomes, estimatedMinutes, blocks, sourceRefs, status.
Block: id, type, content, interactionConfig.
Question: id, type, prompt, options, correctAnswer, explanation, hints, skillTags.
Attempt: questionId, answer, correctness, hintCount, timestamp.
Progress: lessonId, completedBlockIds, attempts, lastVisited, status.
Milestone: id, title, description, deliverables, rubric, status.

## Routes
/ home
/learn course map
/course/[slug]
/lesson/[slug]
/lab/[slug]
/projects
/projects/[slug]
/review
/profile

## Acceptance
Every route reachable; prompt/chips functional; one lesson complete; fake terminal safe and resettable; quiz feedback explanatory; progress persists locally; RTL code blocks display correctly; 360px no overflow; keyboard completion possible; no fake AI/backend/execution claims.

# Learning Experience & Instructional Design

## Lesson loop
1. Why it matters: سيناريو هندسي.
2. Outcomes: 2–4 measurable outcomes.
3. Hook: visual/animation/diagram.
4. Micro lesson: 5–10 minutes.
5. Interaction: simulation، code trace، click reveal.
6. Worked example مع rationale.
7. Try it: guided ثم independent.
8. Checkpoint: 3–6 أسئلة متنوعة.
9. Feedback: explanation، misconception، hint.
10. Reflection: teach-back.
11. Spaced review.
12. Link to next lesson/project.

## Interaction catalog
- Predict output قبل الكشف.
- ترتيب أوامر/خطوات.
- Spot-the-bug.
- Terminal simulation بأوامر محددة آمنة.
- Concept mapping.
- Flashcards.
- Mini-labs/checklist.
- Quiz adaptive.
- Project checkpoints.

## Difficulty progression
Recognition → Explain → Guided application → Independent implementation → Transfer to unfamiliar case.

## Feedback
Correct: لماذا صحيح. Incorrect: اشرح misconception؛ hint أول لا يكشف، hint ثاني scaffold، solution بعد محاولة. Coding challenges: اختبارات تكشف behavior لا solution مباشرة.

## Tutor modes
hint / explain / quiz_me / debug. Answers مرتبطة بمصادر الدرس، لا يختلق تفاصيل المنهج.

## Motivation
XP للأنشطة التعليمية، streak اختياري ومرن، milestone يحتفل بartifact، leaderboard off افتراضيًا، لا رسائل shame.

## Content schema proposal
Course → Module → Lesson → Blocks. Block types: markdown, callout, image, diagram, code, terminal_sim, quiz, flashcards, lab, project_checkpoint, reflection, source.
Question fields: id, type, prompt, choices, answer, explanation, hints, skill_tags, difficulty, source_ref.
Versioned content in repository; validation and preview before publish.

## Mastery
not_started → in_progress → practiced → mastered. Mastery requires multiple evidence types, not one quiz. Record attempts, hints, result and review due; minimize personal data.

## Example AIB-100
Mission: inspect unfamiliar repo. Learn shell, paths, command/argument. Simulated filesystem. Predict pwd/ls/cd/mkdir/touch. Debug wrong path/permissions. Checkpoint: create project tree. Explain absolute vs relative paths.

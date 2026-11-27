import { AttemptRecord, QuizQuestion } from '../types/academy';

export interface GradeSubmissionInput {
  selectedSingle: number | null;
  selectedMulti: number[];
  orderIndices: number[];
  rubricChecked: number[];
}

export function gradeQuestionAttempt(
  question: QuizQuestion,
  input: GradeSubmissionInput
): { correctness: 'correct' | 'partial' | 'incorrect'; assessmentMode: 'objective' | 'self_rubric' } {
  if (question.type === 'single_choice') {
    const ok = Boolean(
      input.selectedSingle !== null && question.correctIndices?.includes(input.selectedSingle)
    );
    return { correctness: ok ? 'correct' : 'incorrect', assessmentMode: 'objective' };
  }

  if (question.type === 'multiple_select') {
    const target = new Set(question.correctIndices ?? []);
    const chosen = new Set(input.selectedMulti);
    const exactMatch = target.size === chosen.size && [...target].every((x) => chosen.has(x));
    const someOverlap = [...chosen].some((x) => target.has(x));
    let correctness: 'correct' | 'partial' | 'incorrect' = 'incorrect';
    if (exactMatch) correctness = 'correct';
    else if (someOverlap && chosen.size <= target.size + 1) correctness = 'partial';
    return { correctness, assessmentMode: 'objective' };
  }

  if (question.type === 'ordering') {
    const target = question.correctIndices ?? [];
    const matches = input.orderIndices.filter((val, idx) => val === target[idx]).length;
    let correctness: 'correct' | 'partial' | 'incorrect' = 'incorrect';
    if (target.length > 0 && matches === target.length) correctness = 'correct';
    else if (matches >= 2) correctness = 'partial';
    return { correctness, assessmentMode: 'objective' };
  }

  // short_answer uses self-assessment rubric ONLY (never automated grading)
  const totalRubric = question.rubricChecklist?.length ?? 1;
  let correctness: 'correct' | 'partial' | 'incorrect' = 'incorrect';
  if (input.rubricChecked.length >= totalRubric) correctness = 'correct';
  else if (input.rubricChecked.length >= 1) correctness = 'partial';

  return { correctness, assessmentMode: 'self_rubric' };
}

/**
 * Starter heuristic spaced-review scheduler (transparently labeled in UI, not claimed as scientific).
 */
export function computeNextAttempt(
  questionId: string,
  correctness: 'correct' | 'partial' | 'incorrect',
  hintCount: number,
  prev?: AttemptRecord,
  assessmentMode: 'objective' | 'self_rubric' = 'objective',
  now: number = Date.now()
): AttemptRecord {
  let intervalDays = 1;
  if (correctness === 'correct' && hintCount === 0) {
    intervalDays = prev ? Math.min(14, Math.max(2, prev.intervalDays * 2)) : 3;
  } else if (correctness === 'correct') {
    intervalDays = 1;
  } else {
    intervalDays = 0; // Due immediately for review
  }
  return {
    questionId,
    correctness,
    assessmentMode,
    hintCount,
    timestamp: now,
    intervalDays,
    nextReviewAt: now + intervalDays * 24 * 60 * 60 * 1000,
    isDemo: false,
  };
}

export function getDueReviewAttempts(attempts: Record<string, AttemptRecord>, now: number = Date.now()): AttemptRecord[] {
  return Object.values(attempts)
    .filter((a) => a.nextReviewAt <= now)
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt);
}

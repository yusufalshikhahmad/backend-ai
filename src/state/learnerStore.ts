import { LearnerState, AttemptRecord, Course, CourseStatus } from '../types/academy';

const STORAGE_KEY = 'ai_eng_academy_state_v1';

export const DEFAULT_LEARNER_STATE: LearnerState = {
  completedBlockIds: {},
  lastVisitedLessonSlug: 'aib-100-linux-files-terminal',
  lastVisitedBlockIndex: {},
  reflections: {},
  attempts: {},
  completedLabs: [],
  projects: {},
  demoReviewLoaded: false,
};

export function loadLearnerState(): LearnerState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LEARNER_STATE;
    const parsed = JSON.parse(raw) as Partial<LearnerState>;
    return {
      ...DEFAULT_LEARNER_STATE,
      ...parsed,
      completedBlockIds: parsed.completedBlockIds ?? {},
      lastVisitedBlockIndex: parsed.lastVisitedBlockIndex ?? {},
      reflections: parsed.reflections ?? {},
      attempts: parsed.attempts ?? {},
      completedLabs: parsed.completedLabs ?? [],
      projects: parsed.projects ?? {},
    };
  } catch {
    return DEFAULT_LEARNER_STATE;
  }
}

export function saveLearnerState(state: LearnerState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function clearLearnerState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Starter heuristic spaced-review scheduler (transparently labeled in UI, not claimed as scientific).
 */
export function computeNextAttempt(
  questionId: string,
  correctness: 'correct' | 'partial' | 'incorrect',
  hintCount: number,
  prev?: AttemptRecord
): AttemptRecord {
  const now = Date.now();
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
    hintCount,
    timestamp: now,
    intervalDays,
    nextReviewAt: now + intervalDays * 24 * 60 * 60 * 1000,
    isDemo: false,
  };
}

export function getCourseStatus(course: Course, state: LearnerState): CourseStatus {
  if (course.code === 'AIB-100') {
    const completedBlocks = state.completedBlockIds['aib-100-linux-files-terminal'] ?? [];
    const labDone = state.completedLabs.includes('linux-aib100');
    const quizDone = state.attempts['q-aib100-pwd-vs-ls']?.correctness === 'correct';
    if (completedBlocks.length >= 8 && labDone && quizDone) return 'mastered';
    if (labDone || quizDone) return 'practiced';
    if (completedBlocks.length > 0) return 'in_progress';
    return 'available';
  }
  if (course.code === 'AIB-302') {
    const completedBlocks = state.completedBlockIds['aib-302-rag-foundations'] ?? [];
    const labDone = state.completedLabs.includes('rag-playground');
    if (labDone && completedBlocks.length >= 2) return 'practiced';
    if (completedBlocks.length > 0 || labDone) return 'in_progress';
    return 'available';
  }
  if (course.code === 'AIB-303' && state.completedLabs.includes('agent-loop')) {
    return 'practiced';
  }
  // Courses with unmet required prerequisites show prerequisite lock info cleanly,
  // while AIB-110 has no required prerequisites.
  if (course.prerequisitesRequired.length === 0) {
    return 'not_started';
  }
  const aib100Mastered =
    (state.completedBlockIds['aib-100-linux-files-terminal']?.length ?? 0) >= 5 ||
    state.completedLabs.includes('linux-aib100');
  if (course.prerequisitesRequired.includes('AIB-100') && aib100Mastered) {
    return 'available';
  }
  return 'locked';
}

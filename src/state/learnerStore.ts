import { LearnerState, Course, CourseEvaluation } from '../types/academy';
import { COURSES } from '../data/curriculum';
import { LESSONS, QUIZ_QUESTIONS } from '../data/lessonsAndProjects';
import { evaluateCurriculumGraph } from '../engine/prerequisites';
import { computeNextAttempt } from '../engine/quizGrader';

export { computeNextAttempt };

export const STORAGE_KEY = 'ai_eng_academy_state_v1';
export const CURRENT_SCHEMA_VERSION = 2;

export const DEFAULT_LEARNER_STATE: LearnerState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  completedBlockIds: {},
  lastVisitedLessonSlug: 'aib-100-linux-files-terminal',
  lastVisitedBlockIndex: {},
  reflections: {},
  attempts: {},
  completedLabs: [],
  projects: {},
  demoReviewLoaded: false,
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Pure schema validator & migrator (v1 unversioned -> v2 versioned).
 * Recovering gracefully from corrupted/partial JSON without crashing.
 */
export function parseAndMigrateLearnerState(raw: string | null): LearnerState {
  if (!raw) return { ...DEFAULT_LEARNER_STATE };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isPlainObject(parsed)) {
      return { ...DEFAULT_LEARNER_STATE };
    }

    const completedBlockIds: Record<string, string[]> = {};
    if (isPlainObject(parsed.completedBlockIds)) {
      for (const [slug, ids] of Object.entries(parsed.completedBlockIds)) {
        if (Array.isArray(ids)) {
          completedBlockIds[slug] = ids.filter((x): x is string => typeof x === 'string');
        }
      }
    }

    const lastVisitedBlockIndex: Record<string, number> = {};
    if (isPlainObject(parsed.lastVisitedBlockIndex)) {
      for (const [slug, idx] of Object.entries(parsed.lastVisitedBlockIndex)) {
        if (typeof idx === 'number' && Number.isFinite(idx) && idx >= 0) {
          lastVisitedBlockIndex[slug] = Math.floor(idx);
        }
      }
    }

    const reflections: Record<string, string> = {};
    if (isPlainObject(parsed.reflections)) {
      for (const [slug, text] of Object.entries(parsed.reflections)) {
        if (typeof text === 'string') reflections[slug] = text;
      }
    }

    const attempts: LearnerState['attempts'] = {};
    if (isPlainObject(parsed.attempts)) {
      for (const [qid, rec] of Object.entries(parsed.attempts)) {
        if (
          isPlainObject(rec) &&
          typeof rec.questionId === 'string' &&
          (rec.correctness === 'correct' || rec.correctness === 'partial' || rec.correctness === 'incorrect') &&
          typeof rec.timestamp === 'number' &&
          typeof rec.nextReviewAt === 'number'
        ) {
          attempts[qid] = {
            questionId: rec.questionId,
            correctness: rec.correctness,
            assessmentMode:
              rec.assessmentMode === 'self_rubric' || rec.assessmentMode === 'objective'
                ? rec.assessmentMode
                : 'objective',
            hintCount: typeof rec.hintCount === 'number' ? rec.hintCount : 0,
            timestamp: rec.timestamp,
            nextReviewAt: rec.nextReviewAt,
            intervalDays: typeof rec.intervalDays === 'number' ? rec.intervalDays : 1,
            isDemo: Boolean(rec.isDemo),
          };
        }
      }
    }

    const completedLabs = Array.isArray(parsed.completedLabs)
      ? parsed.completedLabs.filter((x): x is string => typeof x === 'string')
      : [];

    const projects: LearnerState['projects'] = {};
    if (isPlainObject(parsed.projects)) {
      for (const [slug, p] of Object.entries(parsed.projects)) {
        if (isPlainObject(p)) {
          projects[slug] = {
            completedMilestones: Array.isArray(p.completedMilestones)
              ? p.completedMilestones.filter((x): x is string => typeof x === 'string')
              : [],
            completedDeliverables: Array.isArray(p.completedDeliverables)
              ? p.completedDeliverables.filter((x): x is string => typeof x === 'string')
              : [],
            artifactUrl: typeof p.artifactUrl === 'string' ? p.artifactUrl : '',
            reflectionNote: typeof p.reflectionNote === 'string' ? p.reflectionNote : '',
            submittedAt: typeof p.submittedAt === 'number' ? p.submittedAt : undefined,
          };
        }
      }
    }

    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      completedBlockIds,
      lastVisitedLessonSlug:
        typeof parsed.lastVisitedLessonSlug === 'string'
          ? parsed.lastVisitedLessonSlug
          : DEFAULT_LEARNER_STATE.lastVisitedLessonSlug,
      lastVisitedBlockIndex,
      reflections,
      attempts,
      completedLabs,
      projects,
      demoReviewLoaded: Boolean(parsed.demoReviewLoaded),
    };
  } catch {
    return { ...DEFAULT_LEARNER_STATE };
  }
}

export function loadLearnerState(): LearnerState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const migrated = parseAndMigrateLearnerState(raw);
    if (raw && !raw.includes(`"schemaVersion":${CURRENT_SCHEMA_VERSION}`)) {
      saveLearnerState(migrated);
    }
    return migrated;
  } catch {
    return { ...DEFAULT_LEARNER_STATE };
  }
}

export function saveLearnerState(state: LearnerState): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, schemaVersion: CURRENT_SCHEMA_VERSION })
    );
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

export function evaluateAllCourses(state: LearnerState): Record<string, CourseEvaluation> {
  return evaluateCurriculumGraph(COURSES, state, LESSONS, QUIZ_QUESTIONS);
}

export function getCourseStatus(course: Course, state: LearnerState) {
  return evaluateAllCourses(state)[course.code]?.status ?? 'not_started';
}

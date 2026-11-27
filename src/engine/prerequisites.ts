import { Course, CourseEvaluation, CourseStatus, LearnerState, Lesson, QuizQuestion } from '../types/academy';

/**
 * Computes an individual course's mastery/progress solely from learner evidence
 * (lesson block completion, associated lab completion, and objective quiz attempts).
 */
export function evaluateCourseEvidenceStatus(
  course: Course,
  state: LearnerState,
  lessonsBySlug: Record<string, Lesson>,
  questionsById: Record<string, QuizQuestion>
): 'none' | 'in_progress' | 'practiced' | 'mastered' {
  const lessonSlugs = new Set<string>();
  const labSlugs = new Set<string>();

  if (course.primaryLessonSlug) lessonSlugs.add(course.primaryLessonSlug);
  if (course.primaryLabSlug) labSlugs.add(course.primaryLabSlug);
  for (const mod of course.modules) {
    if (mod.lessonSlug) lessonSlugs.add(mod.lessonSlug);
    if (mod.labSlug) labSlugs.add(mod.labSlug);
  }

  let totalBlocks = 0;
  let completedBlocks = 0;
  for (const slug of lessonSlugs) {
    const lesson = lessonsBySlug[slug];
    if (!lesson) continue;
    totalBlocks += lesson.blocks.length;
    const doneIds = new Set(state.completedBlockIds[slug] ?? []);
    completedBlocks += lesson.blocks.filter((b) => doneIds.has(b.id)).length;
  }

  const labsDone = [...labSlugs].filter((s) => state.completedLabs.includes(s)).length;

  const courseQuestions = Object.values(questionsById).filter(
    (q) => q.courseCode === course.code && q.type !== 'short_answer'
  );
  const objectiveCorrectCount = courseQuestions.filter((q) => {
    const attempt = state.attempts[q.id];
    return attempt && !attempt.isDemo && attempt.correctness === 'correct';
  }).length;

  const allLessonsComplete = totalBlocks > 0 && completedBlocks === totalBlocks;
  const allLabsComplete = labSlugs.size === 0 || labsDone === labSlugs.size;
  const allObjectiveQuizzesPassed =
    courseQuestions.length === 0 || objectiveCorrectCount === courseQuestions.length;

  if ((totalBlocks > 0 || labSlugs.size > 0) && allLessonsComplete && allLabsComplete && allObjectiveQuizzesPassed) {
    return 'mastered';
  }
  if (labsDone > 0 || objectiveCorrectCount > 0 || (totalBlocks > 0 && completedBlocks >= Math.ceil(totalBlocks / 2))) {
    return 'practiced';
  }
  if (completedBlocks > 0) {
    return 'in_progress';
  }
  return 'none';
}

export function isCourseSatisfiedForPrereq(status: CourseStatus): boolean {
  return status === 'practiced' || status === 'mastered';
}

/**
 * Evaluates all courses in a curriculum using a generic prerequisite graph.
 * Detects cycles safely and propagates lock states across arbitrary chains.
 */
export function evaluateCurriculumGraph(
  courses: Course[],
  state: LearnerState,
  lessonsBySlug: Record<string, Lesson>,
  questionsById: Record<string, QuizQuestion>
): Record<string, CourseEvaluation> {
  const byCode = new Map<string, Course>(courses.map((c) => [c.code, c]));
  const memo = new Map<string, CourseEvaluation>();
  const visiting = new Set<string>();

  const evalCourse = (code: string): CourseEvaluation => {
    const cached = memo.get(code);
    if (cached) return cached;

    const course = byCode.get(code);
    if (!course) {
      return {
        status: 'locked',
        missingRequiredPrereqs: [code],
        missingRecommendedPrereqs: [],
        hasPublishedContent: false,
      };
    }

    if (visiting.has(code)) {
      return {
        status: 'locked',
        missingRequiredPrereqs: ['CYCLE_DETECTED'],
        missingRecommendedPrereqs: [],
        hasPublishedContent: false,
      };
    }

    visiting.add(code);

    const missingRequiredPrereqs: string[] = [];
    for (const reqCode of course.prerequisitesRequired) {
      const reqEval = evalCourse(reqCode);
      if (!isCourseSatisfiedForPrereq(reqEval.status)) {
        missingRequiredPrereqs.push(reqCode);
      }
    }

    const missingRecommendedPrereqs: string[] = [];
    for (const recCode of course.prerequisitesRecommended) {
      const recEval = evalCourse(recCode);
      if (!isCourseSatisfiedForPrereq(recEval.status)) {
        missingRecommendedPrereqs.push(recCode);
      }
    }

    visiting.delete(code);

    const hasPublishedContent = Boolean(
      (course.primaryLessonSlug && lessonsBySlug[course.primaryLessonSlug]) ||
        course.modules.some((m) => (m.lessonSlug && lessonsBySlug[m.lessonSlug]) || m.labSlug)
    );

    const evidence = evaluateCourseEvidenceStatus(course, state, lessonsBySlug, questionsById);

    let status: CourseStatus;
    if (evidence === 'mastered') {
      status = 'mastered';
    } else if (evidence === 'practiced') {
      status = 'practiced';
    } else if (evidence === 'in_progress') {
      status = 'in_progress';
    } else if (missingRequiredPrereqs.length > 0) {
      status = 'locked';
    } else if (hasPublishedContent) {
      status = 'available';
    } else {
      status = 'not_started';
    }

    const result: CourseEvaluation = {
      status,
      missingRequiredPrereqs,
      missingRecommendedPrereqs,
      hasPublishedContent,
    };
    memo.set(code, result);
    return result;
  };

  const out: Record<string, CourseEvaluation> = {};
  for (const c of courses) {
    out[c.code] = evalCourse(c.code);
  }
  return out;
}

export interface CurriculumIntegrityIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
}

/**
 * Validates curriculum catalog, lessons, and question bank for broken links,
 * missing translations, cycles, and missing source refs.
 */
export function validateCurriculumIntegrity(
  courses: Course[],
  lessonsBySlug: Record<string, Lesson>,
  questionsById: Record<string, QuizQuestion>
): CurriculumIntegrityIssue[] {
  const issues: CurriculumIntegrityIssue[] = [];
  const codes = new Set<string>();
  const slugs = new Set<string>();

  for (const c of courses) {
    if (codes.has(c.code)) {
      issues.push({ severity: 'error', code: c.code, message: `Duplicate course code ${c.code}` });
    }
    codes.add(c.code);

    if (slugs.has(c.slug)) {
      issues.push({ severity: 'error', code: c.code, message: `Duplicate course slug ${c.slug}` });
    }
    slugs.add(c.slug);

    if (c.primaryLessonSlug && !lessonsBySlug[c.primaryLessonSlug]) {
      issues.push({
        severity: 'error',
        code: c.code,
        message: `Missing primaryLessonSlug: ${c.primaryLessonSlug}`,
      });
    }
  }

  for (const c of courses) {
    for (const req of [...c.prerequisitesRequired, ...c.prerequisitesRecommended]) {
      if (!codes.has(req)) {
        issues.push({
          severity: 'error',
          code: c.code,
          message: `Unknown prerequisite code ${req} referenced by ${c.code}`,
        });
      }
    }
  }

  // Cycle detection via 3-color DFS
  const byCode = new Map(courses.map((c) => [c.code, c]));
  const color = new Map<string, 'white' | 'gray' | 'black'>();
  const dfs = (code: string) => {
    color.set(code, 'gray');
    const c = byCode.get(code);
    if (c) {
      for (const req of c.prerequisitesRequired) {
        const state = color.get(req) ?? 'white';
        if (state === 'gray') {
          issues.push({ severity: 'error', code, message: `Prerequisite cycle involving ${code} -> ${req}` });
        } else if (state === 'white') {
          dfs(req);
        }
      }
    }
    color.set(code, 'black');
  };
  for (const c of courses) {
    if ((color.get(c.code) ?? 'white') === 'white') dfs(c.code);
  }

  for (const lesson of Object.values(lessonsBySlug)) {
    if (!lesson.title.ar.trim() || !lesson.title.en.trim()) {
      issues.push({ severity: 'error', code: lesson.slug, message: `Lesson ${lesson.slug} missing bilingual title` });
    }
    if (!lesson.sourceRef.ar.trim() || !lesson.sourceRef.en.trim()) {
      issues.push({ severity: 'warning', code: lesson.slug, message: `Lesson ${lesson.slug} missing sourceRef` });
    }
    for (const blk of lesson.blocks) {
      if (blk.type === 'quiz' && (!blk.quizQuestionId || !questionsById[blk.quizQuestionId])) {
        issues.push({
          severity: 'error',
          code: lesson.slug,
          message: `Block ${blk.id} references missing question ${blk.quizQuestionId}`,
        });
      }
    }
  }

  for (const q of Object.values(questionsById)) {
    if (!q.explanation.ar.trim() || !q.explanation.en.trim()) {
      issues.push({ severity: 'error', code: q.id, message: `Question ${q.id} missing explanation` });
    }
    if (!q.hints[0].ar.trim() || !q.hints[1].ar.trim()) {
      issues.push({ severity: 'error', code: q.id, message: `Question ${q.id} missing progressive hints` });
    }
  }

  return issues;
}

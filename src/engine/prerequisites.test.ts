import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateCurriculumGraph,
  validateCurriculumIntegrity,
} from './prerequisites';
import { COURSES } from '../data/curriculum';
import { LESSONS, QUIZ_QUESTIONS } from '../data/lessonsAndProjects';
import { DEFAULT_LEARNER_STATE } from '../state/learnerStore';

test('curriculum catalog and lessons pass integrity validation with zero errors', () => {
  const issues = validateCurriculumIntegrity(COURSES, LESSONS, QUIZ_QUESTIONS);
  const errors = issues.filter((i) => i.severity === 'error');
  assert.deepEqual(errors, []);
});

test('AIB-100 starts available while dependent AIB-101 and AIB-102 start locked', () => {
  const evals = evaluateCurriculumGraph(COURSES, DEFAULT_LEARNER_STATE, LESSONS, QUIZ_QUESTIONS);
  assert.equal(evals['AIB-100'].status, 'available');
  assert.equal(evals['AIB-101'].status, 'locked');
  assert.deepEqual(evals['AIB-101'].missingRequiredPrereqs, ['AIB-100']);
  assert.equal(evals['AIB-102'].status, 'locked');
  assert.deepEqual(evals['AIB-102'].missingRequiredPrereqs, ['AIB-101']);
});

test('completing AIB-100 lab and quiz unlocks AIB-101 via generic prerequisite graph', () => {
  const progressed = {
    ...DEFAULT_LEARNER_STATE,
    completedLabs: ['linux-aib100'],
    attempts: {
      'q-aib100-pwd-vs-ls': {
        questionId: 'q-aib100-pwd-vs-ls',
        correctness: 'correct' as const,
        assessmentMode: 'objective' as const,
        hintCount: 0,
        timestamp: 1000,
        nextReviewAt: 9999999999999,
        intervalDays: 3,
      },
    },
  };
  const evals = evaluateCurriculumGraph(COURSES, progressed, LESSONS, QUIZ_QUESTIONS);
  assert.equal(evals['AIB-100'].status, 'practiced');
  assert.equal(evals['AIB-101'].status, 'not_started'); // Unlocked (no content yet), no missing prereqs
  assert.deepEqual(evals['AIB-101'].missingRequiredPrereqs, []);
  assert.equal(evals['AIB-102'].status, 'locked'); // Still requires AIB-101
});

test('cycle detection flags cyclic prerequisites safely without infinite recursion', () => {
  const cyclicCourses = [
    { ...COURSES[0], code: 'C-1', slug: 'c-1', prerequisitesRequired: ['C-2'] },
    { ...COURSES[1], code: 'C-2', slug: 'c-2', prerequisitesRequired: ['C-1'] },
  ];
  const issues = validateCurriculumIntegrity(cyclicCourses, {}, {});
  assert.ok(issues.some((i) => i.message.includes('Prerequisite cycle')));
  const evals = evaluateCurriculumGraph(cyclicCourses, DEFAULT_LEARNER_STATE, {}, {});
  assert.equal(evals['C-1'].status, 'locked');
});

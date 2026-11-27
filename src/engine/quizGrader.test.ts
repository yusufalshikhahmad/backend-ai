import test from 'node:test';
import assert from 'node:assert/strict';
import { QUIZ_QUESTIONS } from '../data/lessonsAndProjects';
import { gradeQuestionAttempt, computeNextAttempt, getDueReviewAttempts } from './quizGrader';

test('single_choice grades objectively', () => {
  const q = QUIZ_QUESTIONS['q-aib100-pwd-vs-ls'];
  const ok = gradeQuestionAttempt(q, {
    selectedSingle: 1,
    selectedMulti: [],
    orderIndices: [],
    rubricChecked: [],
  });
  assert.equal(ok.correctness, 'correct');
  assert.equal(ok.assessmentMode, 'objective');

  const wrong = gradeQuestionAttempt(q, {
    selectedSingle: 0,
    selectedMulti: [],
    orderIndices: [],
    rubricChecked: [],
  });
  assert.equal(wrong.correctness, 'incorrect');
});

test('multiple_select distinguishes exact, partial, and incorrect', () => {
  const q = QUIZ_QUESTIONS['q-aib100-relative-absolute'];
  assert.equal(
    gradeQuestionAttempt(q, {
      selectedSingle: null,
      selectedMulti: [0, 1, 2],
      orderIndices: [],
      rubricChecked: [],
    }).correctness,
    'correct'
  );
  assert.equal(
    gradeQuestionAttempt(q, {
      selectedSingle: null,
      selectedMulti: [0, 1],
      orderIndices: [],
      rubricChecked: [],
    }).correctness,
    'partial'
  );
  assert.equal(
    gradeQuestionAttempt(q, {
      selectedSingle: null,
      selectedMulti: [3],
      orderIndices: [],
      rubricChecked: [],
    }).correctness,
    'incorrect'
  );
});

test('short_answer explicitly returns self_rubric assessmentMode', () => {
  const q = QUIZ_QUESTIONS['q-aib302-rag-grounding'];
  const res = gradeQuestionAttempt(q, {
    selectedSingle: null,
    selectedMulti: [],
    orderIndices: [],
    rubricChecked: [0, 1],
  });
  assert.equal(res.assessmentMode, 'self_rubric');
  assert.equal(res.correctness, 'partial');
});

test('review scheduler marks wrong answers immediately due and expands clean recall intervals', () => {
  const now = 1_700_000_000_000;
  const wrong = computeNextAttempt('q1', 'incorrect', 0, undefined, 'objective', now);
  assert.equal(wrong.intervalDays, 0);
  assert.equal(wrong.nextReviewAt, now);

  const clean = computeNextAttempt('q2', 'correct', 0, undefined, 'objective', now);
  assert.equal(clean.intervalDays, 3);
  assert.ok(clean.nextReviewAt > now);

  const due = getDueReviewAttempts({ q1: wrong, q2: clean }, now + 1000);
  assert.deepEqual(due.map((d) => d.questionId), ['q1']);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CURRENT_SCHEMA_VERSION,
  DEFAULT_LEARNER_STATE,
  parseAndMigrateLearnerState,
} from './learnerStore';

test('returns default state for null or corrupted JSON', () => {
  assert.deepEqual(parseAndMigrateLearnerState(null), DEFAULT_LEARNER_STATE);
  assert.deepEqual(parseAndMigrateLearnerState('{corrupted-json'), DEFAULT_LEARNER_STATE);
  assert.deepEqual(parseAndMigrateLearnerState('"just-a-string"'), DEFAULT_LEARNER_STATE);
});

test('migrates unversioned v1 state cleanly to schemaVersion 2 and sanitizes invalid entries', () => {
  const v1Raw = JSON.stringify({
    completedBlockIds: {
      'aib-100-linux-files-terminal': ['b1-outcome', 123, null],
    },
    lastVisitedBlockIndex: {
      'aib-100-linux-files-terminal': 2,
      bad: -5,
    },
    completedLabs: ['linux-aib100', 42],
    attempts: {
      'q-aib100-pwd-vs-ls': {
        questionId: 'q-aib100-pwd-vs-ls',
        correctness: 'correct',
        timestamp: 1000,
        nextReviewAt: 2000,
      },
      broken: {
        questionId: 'broken',
        correctness: 'unknown_status',
      },
    },
  });

  const migrated = parseAndMigrateLearnerState(v1Raw);
  assert.equal(migrated.schemaVersion, CURRENT_SCHEMA_VERSION);
  assert.deepEqual(migrated.completedBlockIds['aib-100-linux-files-terminal'], ['b1-outcome']);
  assert.equal(migrated.lastVisitedBlockIndex['aib-100-linux-files-terminal'], 2);
  assert.equal(migrated.lastVisitedBlockIndex['bad'], undefined);
  assert.deepEqual(migrated.completedLabs, ['linux-aib100']);
  assert.equal(migrated.attempts['q-aib100-pwd-vs-ls']?.assessmentMode, 'objective');
  assert.equal(migrated.attempts['broken'], undefined);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_CWD,
  createInitialFs,
  resolvePath,
  executeTerminalCommand,
  areRequiredFilesPresent,
} from './terminalFs';

test('resolvePath handles relative, parent .., and home ~ accurately', () => {
  assert.equal(resolvePath('/home/engineer/ai-backend', 'services/rag-api'), '/home/engineer/ai-backend/services/rag-api');
  assert.equal(resolvePath('/home/engineer/ai-backend/services/rag-api', '..'), '/home/engineer/ai-backend/services');
  assert.equal(resolvePath('/home/engineer/ai-backend', '~'), '/home/engineer');
  assert.equal(resolvePath('/home/engineer/ai-backend', '/etc'), '/etc');
});

test('ls -la reveals hidden dotfiles while ls hides them', () => {
  const fs = createInitialFs();
  const plain = executeTerminalCommand(fs, INITIAL_CWD, 'ls');
  assert.equal(plain.isError, false);
  assert.equal(plain.output.includes('.env.example'), false);

  const detailed = executeTerminalCommand(fs, INITIAL_CWD, 'ls -la');
  assert.equal(detailed.isError, false);
  assert.equal(detailed.output.includes('.env.example'), true);
});

test('mkdir -p and touch satisfy AIB-100 lab goal deterministically', () => {
  let fs = createInitialFs();
  let cwd = INITIAL_CWD;

  const target = ['/home/engineer/ai-backend/services/agent-worker/README.md'];
  assert.equal(areRequiredFilesPresent(fs, target), false);

  const mk = executeTerminalCommand(fs, cwd, 'mkdir -p services/agent-worker');
  assert.equal(mk.isError, false);
  fs = mk.nextFs;
  cwd = mk.nextCwd;

  const tch = executeTerminalCommand(fs, cwd, 'touch services/agent-worker/README.md');
  assert.equal(tch.isError, false);
  fs = tch.nextFs;

  assert.equal(areRequiredFilesPresent(fs, target), true);
});

test('disallowed commands outside sandbox allowlist are rejected safely', () => {
  const fs = createInitialFs();
  const res = executeTerminalCommand(fs, INITIAL_CWD, 'rm -rf /');
  assert.equal(res.isError, true);
  assert.ok(res.output.includes('not in the safe simulator allowlist'));
});

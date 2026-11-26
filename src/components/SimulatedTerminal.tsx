import React, { useState, useRef } from 'react';
import { Terminal, RotateCcw, Lightbulb, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Language, LocalizedText } from '../types/academy';

type VNode =
  | { type: 'dir'; children: Record<string, VNode> }
  | { type: 'file'; content: string };

function createInitialFs(): VNode {
  return {
    type: 'dir',
    children: {
      home: {
        type: 'dir',
        children: {
          engineer: {
            type: 'dir',
            children: {
              'ai-backend': {
                type: 'dir',
                children: {
                  '.env.example': {
                    type: 'file',
                    content: 'APP_ENV=development\nMODEL_PORT=8000\nLOG_LEVEL=info',
                  },
                  'README.md': {
                    type: 'file',
                    content: '# AI Backend Workspace\nRun fastAPI services from src/main.py',
                  },
                  src: {
                    type: 'dir',
                    children: {
                      'main.py': {
                        type: 'file',
                        content: 'from fastapi import FastAPI\napp = FastAPI(title="AIB-100 Service")',
                      },
                    },
                  },
                  services: {
                    type: 'dir',
                    children: {},
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

function cloneFs(node: VNode): VNode {
  if (node.type === 'file') return { type: 'file', content: node.content };
  const children: Record<string, VNode> = {};
  for (const [k, v] of Object.entries(node.children)) {
    children[k] = cloneFs(v);
  }
  return { type: 'dir', children };
}

function resolvePath(cwd: string, rawPath: string): string {
  const expanded = rawPath === '~' || rawPath.startsWith('~/')
    ? rawPath.replace('~', '/home/engineer')
    : rawPath;
  const combined = expanded.startsWith('/') ? expanded : `${cwd}/${expanded}`;
  const parts = combined.split('/').filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return '/' + stack.join('/');
}

function getNode(root: VNode, absPath: string): VNode | null {
  if (absPath === '/') return root;
  const parts = absPath.split('/').filter(Boolean);
  let cur: VNode = root;
  for (const p of parts) {
    if (cur.type !== 'dir' || !(p in cur.children)) return null;
    cur = cur.children[p];
  }
  return cur;
}

interface HistoryEntry {
  id: number;
  cwd: string;
  cmd: string;
  output: string;
  isError?: boolean;
}

interface SimulatedTerminalProps {
  lang: Language;
  goal?: LocalizedText;
  requiredFiles?: string[];
  hints?: LocalizedText[];
  onGoalComplete?: () => void;
  compact?: boolean;
}

export const SimulatedTerminal: React.FC<SimulatedTerminalProps> = ({
  lang,
  goal,
  requiredFiles = ['/home/engineer/ai-backend/services/agent-worker/README.md'],
  hints = [],
  onGoalComplete,
  compact = false,
}) => {
  const [fs, setFs] = useState<VNode>(() => createInitialFs());
  const [cwd, setCwd] = useState('/home/engineer/ai-backend');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 0,
      cwd: '/home/engineer/ai-backend',
      cmd: 'help',
      output:
        'Safe simulated terminal (allowlisted commands only): pwd, ls [-la], cd <dir>, mkdir [-p] <dir>, touch <file>, cat <file>, whoami, clear, help',
    },
  ]);
  const [cmdLog, setCmdLog] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState<number>(-1);
  const [revealedHints, setRevealedHints] = useState(0);
  const [completed, setCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const checkGoals = (nextFs: VNode) => {
    if (requiredFiles.length === 0) return;
    const allPresent = requiredFiles.every((f) => getNode(nextFs, f)?.type === 'file');
    if (allPresent && !completed) {
      setCompleted(true);
      onGoalComplete?.();
    }
  };

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setCmdLog((prev) => [trimmed, ...prev]);
    setCmdIndex(-1);

    const tokens = trimmed.split(/\s+/);
    const cmd = tokens[0];
    const args = tokens.slice(1);

    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    let output = '';
    let isError = false;
    let nextCwd = cwd;
    const nextFs = cloneFs(fs);

    switch (cmd) {
      case 'help': {
        output =
          'Allowlisted commands: pwd | ls [-la] [path] | cd <path> | mkdir [-p] <path> | touch <file> | cat <file> | echo <text> | whoami | clear';
        break;
      }
      case 'whoami': {
        output = 'engineer (simulated sandbox user)';
        break;
      }
      case 'pwd': {
        output = cwd;
        break;
      }
      case 'echo': {
        output = args.join(' ').replace(/^["']|["']$/g, '');
        break;
      }
      case 'ls': {
        const showHidden = args.some((a) => a.startsWith('-') && a.includes('a'));
        const longFmt = args.some((a) => a.startsWith('-') && a.includes('l'));
        const pathArg = args.find((a) => !a.startsWith('-'));
        const targetPath = pathArg ? resolvePath(cwd, pathArg) : cwd;
        const node = getNode(nextFs, targetPath);
        if (!node) {
          output = `ls: cannot access '${pathArg}': No such file or directory`;
          isError = true;
        } else if (node.type === 'file') {
          output = pathArg ?? targetPath;
        } else {
          const entries = Object.keys(node.children)
            .filter((name) => showHidden || !name.startsWith('.'))
            .sort();
          if (longFmt) {
            const lines = showHidden ? ['drwxr-xr-x  .', 'drwxr-xr-x  ..'] : [];
            for (const name of entries) {
              const child = node.children[name];
              lines.push(`${child.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'}  ${name}`);
            }
            output = lines.join('\n') || '(empty directory)';
          } else {
            output = entries.join('  ') || '(empty)';
          }
        }
        break;
      }
      case 'cd': {
        const targetArg = args[0] ?? '~';
        const targetPath = resolvePath(cwd, targetArg);
        const node = getNode(nextFs, targetPath);
        if (!node) {
          output = `cd: ${targetArg}: No such file or directory`;
          isError = true;
        } else if (node.type !== 'dir') {
          output = `cd: ${targetArg}: Not a directory`;
          isError = true;
        } else {
          nextCwd = targetPath;
          output = `→ ${nextCwd}`;
        }
        break;
      }
      case 'mkdir': {
        const recursive = args.includes('-p');
        const dirArgs = args.filter((a) => !a.startsWith('-'));
        if (dirArgs.length === 0) {
          output = 'mkdir: missing operand';
          isError = true;
          break;
        }
        const results: string[] = [];
        for (const d of dirArgs) {
          const abs = resolvePath(cwd, d);
          const parts = abs.split('/').filter(Boolean);
          let cur: VNode = nextFs;
          let failed = false;
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (cur.type !== 'dir') {
              results.push(`mkdir: cannot create directory '${d}': Not a directory`);
              isError = true;
              failed = true;
              break;
            }
            if (!(part in cur.children)) {
              if (!recursive && i < parts.length - 1) {
                results.push(`mkdir: cannot create directory '${d}': No such file or directory (try -p)`);
                isError = true;
                failed = true;
                break;
              }
              cur.children[part] = { type: 'dir', children: {} };
            }
            cur = cur.children[part];
          }
          if (!failed) results.push(`created ${abs}`);
        }
        output = results.join('\n');
        break;
      }
      case 'touch': {
        const fileArgs = args.filter((a) => !a.startsWith('-'));
        if (fileArgs.length === 0) {
          output = 'touch: missing file operand';
          isError = true;
          break;
        }
        const msgs: string[] = [];
        for (const f of fileArgs) {
          const abs = resolvePath(cwd, f);
          const parts = abs.split('/').filter(Boolean);
          const fileName = parts.pop();
          const parentPath = '/' + parts.join('/');
          const parent = getNode(nextFs, parentPath);
          if (!parent || parent.type !== 'dir' || !fileName) {
            msgs.push(`touch: cannot touch '${f}': No such parent directory`);
            isError = true;
          } else {
            if (!(fileName in parent.children)) {
              parent.children[fileName] = { type: 'file', content: '' };
            }
            msgs.push(`touched ${abs}`);
          }
        }
        output = msgs.join('\n');
        break;
      }
      case 'cat': {
        const target = args[0];
        if (!target) {
          output = 'cat: missing file operand';
          isError = true;
          break;
        }
        const abs = resolvePath(cwd, target);
        const node = getNode(nextFs, abs);
        if (!node) {
          output = `cat: ${target}: No such file or directory`;
          isError = true;
        } else if (node.type === 'dir') {
          output = `cat: ${target}: Is a directory`;
          isError = true;
        } else {
          output = node.content || '(empty file)';
        }
        break;
      }
      default: {
        output = `Command '${cmd}' is not in the safe simulator allowlist. Type 'help' to view supported commands.`;
        isError = true;
      }
    }

    setFs(nextFs);
    setCwd(nextCwd);
    setHistory((prev) => [...prev, { id: Date.now() + Math.random(), cwd, cmd: trimmed, output, isError }]);
    setInput('');
    checkGoals(nextFs);
  };

  const handleReset = () => {
    setFs(createInitialFs());
    setCwd('/home/engineer/ai-backend');
    setHistory([
      {
        id: Date.now(),
        cwd: '/home/engineer/ai-backend',
        cmd: 'reset',
        output: 'Virtual filesystem restored to initial state.',
      },
    ]);
    setCompleted(false);
    setRevealedHints(0);
    setInput('');
  };

  const quickCommands = ['pwd', 'ls -la', 'mkdir -p services/agent-worker', 'touch services/agent-worker/README.md'];

  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
    >
      {/* Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3"
        style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" style={{ color: 'var(--color-cyan)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {lang === 'ar' ? 'محاكي الطرفية الآمن (Virtual Linux)' : 'Safe Virtual Linux Terminal'}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-text-secondary)' }}
          >
            <ShieldCheck className="h-3 w-3" style={{ color: 'var(--color-success)' }} />
            {lang === 'ar' ? 'معزول بدون تنفيذ حقيقي' : 'Allowlisted sandbox'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hints.length > 0 && revealedHints < hints.length && (
            <button
              type="button"
              onClick={() => setRevealedHints((h) => Math.min(hints.length, h + 1))}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-colors"
              style={{
                backgroundColor: 'var(--color-surface-1)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-warning)',
              }}
            >
              <Lightbulb className="h-3.5 w-3.5" />
              <span>
                {lang === 'ar' ? `تلميح (${revealedHints}/${hints.length})` : `Hint (${revealedHints}/${hints.length})`}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{lang === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Goal Banner */}
      {goal && (
        <div
          className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 text-xs sm:text-sm"
          style={{
            backgroundColor: completed ? 'var(--color-success-bg)' : 'var(--color-surface-1)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center gap-2">
            {completed && <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: 'var(--color-success)' }} />}
            <span style={{ color: completed ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
              <strong className="font-semibold">{lang === 'ar' ? 'الهدف: ' : 'Goal: '}</strong>
              {goal[lang]}
            </span>
          </div>
          {completed && (
            <span className="font-semibold" style={{ color: 'var(--color-success)' }}>
              {lang === 'ar' ? 'تم التحقق بنجاح' : 'Verified'}
            </span>
          )}
        </div>
      )}

      {/* Progressive Hints */}
      {revealedHints > 0 && (
        <div
          className="border-b px-4 py-2.5 text-xs"
          style={{ backgroundColor: 'var(--color-warning-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        >
          {hints.slice(0, revealedHints).map((h, idx) => (
            <div key={idx} className="py-0.5">
              • {h[lang]}
            </div>
          ))}
        </div>
      )}

      {/* Output Screen (always LTR for shell accuracy) */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`ltr-isolate cursor-text overflow-y-auto p-4 font-mono text-xs sm:text-sm ${
          compact ? 'max-h-60 min-h-[180px]' : 'max-h-80 min-h-[240px]'
        }`}
        style={{ backgroundColor: '#090B10', color: '#E2E8F0' }}
      >
        {history.map((item) => (
          <div key={item.id} className="mb-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[#42C98A]">engineer@aib-sandbox</span>
              <span className="text-[#8593A7]">:</span>
              <span className="text-[#36D6F4]">{item.cwd}</span>
              <span className="text-[#B2BECE]">$</span>
              <span className="text-[#F4F7FC]">{item.cmd}</span>
            </div>
            {item.output && (
              <pre
                className="mt-1 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed"
                style={{ color: item.isError ? '#FF6B78' : '#CBD5E1' }}
              >
                {item.output}
              </pre>
            )}
          </div>
        ))}

        {/* Prompt Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runCommand(input);
          }}
          className="flex items-center gap-1.5"
        >
          <span className="shrink-0 text-[#42C98A]">engineer@aib-sandbox</span>
          <span className="shrink-0 text-[#8593A7]">:</span>
          <span className="shrink-0 text-[#36D6F4]">{cwd}</span>
          <span className="shrink-0 text-[#B2BECE]">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp' && cmdLog.length > 0) {
                e.preventDefault();
                const nextIdx = Math.min(cmdLog.length - 1, cmdIndex + 1);
                setCmdIndex(nextIdx);
                setInput(cmdLog[nextIdx]);
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (cmdIndex <= 0) {
                  setCmdIndex(-1);
                  setInput('');
                } else {
                  const nextIdx = cmdIndex - 1;
                  setCmdIndex(nextIdx);
                  setInput(cmdLog[nextIdx]);
                }
              }
            }}
            aria-label={lang === 'ar' ? 'أدخل أمر Linux في المحاكي' : 'Enter simulated Linux command'}
            placeholder="type a command (e.g. ls -la)..."
            className="w-full bg-transparent font-mono text-xs text-[#F4F7FC] outline-none placeholder:text-[#64748B] sm:text-sm"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>

      {/* Quick-insert Chips */}
      <div
        className="ltr-isolate flex flex-wrap items-center gap-2 border-t px-4 py-2.5"
        style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
      >
        <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
          Quick run:
        </span>
        {quickCommands.map((qc) => (
          <button
            key={qc}
            type="button"
            onClick={() => runCommand(qc)}
            className="rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {qc}
          </button>
        ))}
      </div>
    </div>
  );
};

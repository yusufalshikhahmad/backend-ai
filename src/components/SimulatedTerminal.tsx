import React, { useState, useRef } from 'react';
import { Terminal, RotateCcw, Lightbulb, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Language, LocalizedText } from '../types/academy';
import {
  VNode,
  INITIAL_CWD,
  ALLOWLISTED_HELP_TEXT,
  createInitialFs,
  executeTerminalCommand,
  areRequiredFilesPresent,
} from '../engine/terminalFs';

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
  const [cwd, setCwd] = useState(INITIAL_CWD);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 0,
      cwd: INITIAL_CWD,
      cmd: 'help',
      output: ALLOWLISTED_HELP_TEXT,
    },
  ]);
  const [cmdLog, setCmdLog] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState<number>(-1);
  const [revealedHints, setRevealedHints] = useState(0);
  const [completed, setCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setCmdLog((prev) => [trimmed, ...prev]);
    setCmdIndex(-1);

    const res = executeTerminalCommand(fs, cwd, trimmed);
    if (res.clearScreen) {
      setHistory([]);
      setInput('');
      return;
    }

    setFs(res.nextFs);
    setCwd(res.nextCwd);
    setHistory((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), cwd, cmd: trimmed, output: res.output, isError: res.isError },
    ]);
    setInput('');

    if (areRequiredFilesPresent(res.nextFs, requiredFiles) && !completed) {
      setCompleted(true);
      onGoalComplete?.();
    }
  };

  const handleReset = () => {
    setFs(createInitialFs());
    setCwd(INITIAL_CWD);
    setHistory([
      {
        id: Date.now(),
        cwd: INITIAL_CWD,
        cmd: 'reset',
        output: 'Virtual filesystem restored to initial state.',
      },
    ]);
    setCompleted(false);
    setRevealedHints(0);
    setCmdIndex(-1);
    setInput('');
  };

  const quickCommands = [
    'pwd',
    'ls -la',
    'mkdir -p services/agent-worker',
    'touch services/agent-worker/README.md',
  ];

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

import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  HelpCircle,
  ClipboardCheck,
} from 'lucide-react';
import { QuizQuestion, Language } from '../types/academy';
import { useAcademy } from '../context/AcademyContext';
import { gradeQuestionAttempt } from '../engine/quizGrader';

interface QuizCheckpointProps {
  question: QuizQuestion;
  lang: Language;
  onAnswered?: (correctness: 'correct' | 'partial' | 'incorrect') => void;
}

export const QuizCheckpoint: React.FC<QuizCheckpointProps> = ({ question, lang, onAnswered }) => {
  const { recordAttempt } = useAcademy();
  const [selectedSingle, setSelectedSingle] = useState<number | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<number[]>([]);
  const [orderIndices, setOrderIndices] = useState<number[]>(() =>
    question.options ? question.options.map((_, i) => i).reverse() : []
  );
  const [shortAnswer, setShortAnswer] = useState('');
  const [rubricChecked, setRubricChecked] = useState<number[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [submittedState, setSubmittedState] = useState<'idle' | 'correct' | 'partial' | 'incorrect'>('idle');
  const [attemptCount, setAttemptCount] = useState(0);
  const [dirtySinceSubmit, setDirtySinceSubmit] = useState(true);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const toggleMulti = (idx: number) => {
    setSelectedMulti((prev) => (prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx]));
    setDirtySinceSubmit(true);
    if (submittedState !== 'idle') setSubmittedState('idle');
  };

  const moveOrder = (pos: number, delta: -1 | 1) => {
    const target = pos + delta;
    if (target < 0 || target >= orderIndices.length) return;
    const copy = [...orderIndices];
    const tmp = copy[pos];
    copy[pos] = copy[target];
    copy[target] = tmp;
    setOrderIndices(copy);
    setDirtySinceSubmit(true);
    if (submittedState !== 'idle') setSubmittedState('idle');
  };

  const canSubmit = () => {
    if (!dirtySinceSubmit && submittedState !== 'idle') return false;
    if (question.type === 'single_choice') return selectedSingle !== null;
    if (question.type === 'multiple_select') return selectedMulti.length > 0;
    if (question.type === 'ordering') return orderIndices.length > 0;
    if (question.type === 'short_answer') return shortAnswer.trim().length >= 8;
    return false;
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;

    const { correctness, assessmentMode } = gradeQuestionAttempt(question, {
      selectedSingle,
      selectedMulti,
      orderIndices,
      rubricChecked,
    });

    setAttemptCount((c) => c + 1);
    setSubmittedState(correctness);
    setDirtySinceSubmit(false);
    recordAttempt(question.id, correctness, hintsUsed, assessmentMode);
    onAnswered?.(correctness);

    setTimeout(() => {
      feedbackRef.current?.focus();
    }, 30);
  };

  const handleReset = () => {
    setSubmittedState('idle');
    setSelectedSingle(null);
    setSelectedMulti([]);
    setRubricChecked([]);
    setShortAnswer('');
    setHintsUsed(0);
    setAttemptCount(0);
    setDirtySinceSubmit(true);
    if (question.options) {
      setOrderIndices(question.options.map((_, i) => i).reverse());
    }
  };

  const revealHint = () => {
    setHintsUsed((h) => Math.min(question.hints.length, h + 1));
  };

  const isSelfRubric = question.type === 'short_answer';

  return (
    <div
      className="rounded-2xl border p-5 sm:p-6"
      style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
    >
      {/* Metadata row */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="ltr-isolate rounded-lg px-2 py-0.5 font-mono text-xs font-semibold"
            style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-accent-text)' }}
          >
            {question.courseCode}
          </span>
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
            {question.difficulty}
          </span>
          {isSelfRubric && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)' }}
            >
              <ClipboardCheck className="h-3 w-3" />
              {lang === 'ar' ? 'تقييم ذاتي (ليس تصحيحاً آلياً)' : 'Self-assessment (not auto-graded)'}
            </span>
          )}
        </div>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {question.sourceRef}
        </span>
      </div>

      <h3 className="mb-4 text-base font-semibold leading-relaxed sm:text-lg" style={{ color: 'var(--color-text-primary)' }}>
        {question.prompt[lang]}
      </h3>

      {/* Single Choice */}
      {question.type === 'single_choice' && question.options && (
        <div className="space-y-2.5" role="radiogroup" aria-label={question.prompt[lang]}>
          {question.options.map((opt, idx) => {
            const selected = selectedSingle === idx;
            return (
              <button
                key={idx}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setSelectedSingle(idx);
                  setDirtySinceSubmit(true);
                  if (submittedState !== 'idle') setSubmittedState('idle');
                }}
                className="flex min-h-[48px] w-full items-center gap-3 rounded-xl border px-4 py-3 text-start text-sm transition-colors"
                style={{
                  backgroundColor: selected ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
                  borderColor: selected ? 'var(--color-cyan)' : 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                  style={{
                    borderColor: selected ? 'var(--color-cyan)' : 'var(--color-border-strong)',
                    backgroundColor: selected ? 'var(--color-cyan)' : 'transparent',
                    color: selected ? '#07111D' : 'transparent',
                  }}
                >
                  •
                </span>
                <span className="flex-1">{opt[lang]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Multiple Select */}
      {question.type === 'multiple_select' && question.options && (
        <div className="space-y-2.5" role="group" aria-label={question.prompt[lang]}>
          {question.options.map((opt, idx) => {
            const selected = selectedMulti.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                role="checkbox"
                aria-checked={selected}
                onClick={() => toggleMulti(idx)}
                className="flex min-h-[48px] w-full items-center gap-3 rounded-xl border px-4 py-3 text-start text-sm transition-colors"
                style={{
                  backgroundColor: selected ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
                  borderColor: selected ? 'var(--color-cyan)' : 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold"
                  style={{
                    borderColor: selected ? 'var(--color-cyan)' : 'var(--color-border-strong)',
                    backgroundColor: selected ? 'var(--color-cyan)' : 'transparent',
                    color: selected ? '#07111D' : 'transparent',
                  }}
                >
                  ✓
                </span>
                <span className="flex-1">{opt[lang]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Accessible Ordering */}
      {question.type === 'ordering' && question.options && (
        <div className="space-y-2">
          {orderIndices.map((optIdx, pos) => (
            <div
              key={optIdx}
              className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
              style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold"
                  style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-accent-text)' }}
                >
                  {pos + 1}
                </span>
                <span className="ltr-isolate font-mono text-xs sm:text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {question.options![optIdx][lang]}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={pos === 0}
                  onClick={() => moveOrder(pos, -1)}
                  aria-label={lang === 'ar' ? `تحريك الخطوة ${pos + 1} للأعلى` : `Move step ${pos + 1} up`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-40"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-1)' }}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={pos === orderIndices.length - 1}
                  onClick={() => moveOrder(pos, 1)}
                  aria-label={lang === 'ar' ? `تحريك الخطوة ${pos + 1} للأسفل` : `Move step ${pos + 1} down`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-40"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-1)' }}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Short Answer + Honest Self-Assessment Rubric */}
      {question.type === 'short_answer' && (
        <div className="space-y-4">
          <div
            className="rounded-xl border px-3.5 py-2.5 text-xs"
            style={{ backgroundColor: 'var(--color-info-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            {lang === 'ar'
              ? 'ملاحظة شفافية: هذا السؤال يعتمد على تقييمك الذاتي أمام المعيار، ولا يقوم النظام بتصحيح النص تلقائياً بالذكاء الاصطناعي في هذه النسخة.'
              : 'Transparency note: This question uses self-assessment against a rubric—your written text is not automatically graded by AI in this prototype.'}
          </div>
          <textarea
            rows={3}
            value={shortAnswer}
            onChange={(e) => {
              setShortAnswer(e.target.value);
              setDirtySinceSubmit(true);
            }}
            placeholder={lang === 'ar' ? 'اكتب إجابتك الهندسية باختصار (8 أحرف على الأقل)...' : 'Write your engineering explanation (at least 8 characters)...'}
            className="w-full rounded-xl border p-3.5 text-sm outline-none"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          />
          {question.rubricChecklist && (
            <div className="rounded-xl border p-3.5" style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <p className="mb-2 text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                {lang === 'ar' ? 'معيار التحقق الذاتي (Self-check rubric — غير مُقيّم آلياً):' : 'Self-check rubric (not auto-graded):'}
              </p>
              <div className="space-y-2">
                {question.rubricChecklist.map((item, idx) => {
                  const checked = rubricChecked.includes(idx);
                  return (
                    <label key={idx} className="flex cursor-pointer items-start gap-2.5 text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setRubricChecked((prev) =>
                            prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx]
                          );
                          setDirtySinceSubmit(true);
                        }}
                        className="mt-1 h-4 w-4"
                      />
                      <span style={{ color: 'var(--color-text-primary)' }}>{item[lang]}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progressive Hints */}
      {hintsUsed > 0 && (
        <div
          className="mt-4 space-y-1.5 rounded-xl border p-3.5 text-xs sm:text-sm"
          style={{ backgroundColor: 'var(--color-warning-bg)', borderColor: 'var(--color-border)' }}
        >
          {question.hints.slice(0, hintsUsed).map((h, i) => (
            <div key={i} className="flex items-start gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--color-warning)' }} />
              <span style={{ color: 'var(--color-text-primary)' }}>
                <strong>{lang === 'ar' ? `تلميح ${i + 1}: ` : `Hint ${i + 1}: `}</strong>
                {h[lang]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!canSubmit()}
            onClick={handleSubmit}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full px-6 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
            style={{
              backgroundColor: 'var(--color-action-primary)',
              color: 'var(--color-action-primary-fg)',
            }}
          >
            {isSelfRubric
              ? lang === 'ar'
                ? 'تسجيل التقييم الذاتي'
                : 'Save Self-Check'
              : lang === 'ar'
                ? 'تحقق من الإجابة'
                : 'Submit Answer'}
          </button>

          {hintsUsed < question.hints.length && submittedState !== 'correct' && (
            <button
              type="button"
              onClick={revealHint}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 text-xs font-semibold"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-warning)',
              }}
            >
              <HelpCircle className="h-4 w-4" />
              <span>{lang === 'ar' ? `تلميح (${hintsUsed}/${question.hints.length})` : `Hint (${hintsUsed}/${question.hints.length})`}</span>
            </button>
          )}
        </div>

        {(submittedState !== 'idle' || hintsUsed > 0) && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 text-xs font-medium"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{lang === 'ar' ? 'إعادة ضبط السؤال' : 'Reset Question'}</span>
          </button>
        )}
      </div>

      {/* Feedback Panel (Focus Managed) */}
      {submittedState !== 'idle' && (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="mt-4 rounded-xl border p-4 outline-none"
          style={{
            backgroundColor:
              submittedState === 'correct'
                ? 'var(--color-success-bg)'
                : submittedState === 'partial'
                  ? 'var(--color-warning-bg)'
                  : 'var(--color-error-bg)',
            borderColor: 'var(--color-border-strong)',
          }}
        >
          <div className="flex items-start gap-2.5">
            {submittedState === 'correct' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--color-success)' }} />
            ) : (
              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: submittedState === 'partial' ? 'var(--color-warning)' : 'var(--color-error)' }}
              />
            )}
            <div className="space-y-1.5 text-sm">
              <p
                className="font-bold"
                style={{
                  color:
                    submittedState === 'correct'
                      ? 'var(--color-success)'
                      : submittedState === 'partial'
                        ? 'var(--color-warning)'
                        : 'var(--color-error)',
                }}
              >
                {isSelfRubric
                  ? lang === 'ar'
                    ? 'تم حفظ تقييمك الذاتي — قارن إجابتك بالشرح المرجعي أدناه'
                    : 'Self-assessment logged — compare your response with the reference explanation'
                  : submittedState === 'correct'
                    ? lang === 'ar'
                      ? 'إجابة دقيقة وموفّقة!'
                      : 'Accurate engineering answer!'
                    : submittedState === 'partial'
                      ? lang === 'ar'
                        ? 'صحيح جزئياً — راجع التفاصيل التالية'
                        : 'Partially correct — review the details below'
                      : lang === 'ar'
                        ? 'ليست دقيقة بعد — اقرأ التنبيه المفاهيمي وحاول مجدداً'
                        : 'Not quite right yet — review the misconception note and try again'}
              </p>

              {/* Show misconception first on first wrong attempt without spoiling full explanation */}
              {!isSelfRubric && submittedState !== 'correct' && attemptCount === 1 && (
                <p style={{ color: 'var(--color-text-primary)' }}>{question.misconceptionNote[lang]}</p>
              )}

              {(isSelfRubric || submittedState === 'correct' || attemptCount >= 2) && (
                <p style={{ color: 'var(--color-text-primary)' }}>{question.explanation[lang]}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

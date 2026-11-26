import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Info,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Terminal,
  BookOpen,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { LESSONS, QUIZ_QUESTIONS } from '../data/lessonsAndProjects';
import { ConceptDiagram } from '../components/ConceptDiagrams';
import { SimulatedTerminal } from '../components/SimulatedTerminal';
import { QuizCheckpoint } from '../components/QuizCheckpoint';
import { LessonBlock } from '../types/academy';

export const LessonPlayerPage: React.FC<{ slug: string }> = ({ slug }) => {
  const {
    lang,
    navigate,
    learner,
    markBlockCompleted,
    setLastLessonBlock,
    saveReflection,
    markLabCompleted,
  } = useAcademy();

  const lesson = LESSONS[slug] ?? LESSONS['aib-100-linux-files-terminal'];
  const completedIds = learner.completedBlockIds[lesson.slug] ?? [];
  const initialIndex = Math.min(
    lesson.blocks.length - 1,
    learner.lastVisitedBlockIndex[lesson.slug] ?? 0
  );
  const [stepIndex, setStepIndex] = useState(initialIndex);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [predictionChoice, setPredictionChoice] = useState<number | null>(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);
  const [reflectionText, setReflectionText] = useState(learner.reflections[lesson.slug] ?? '');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const currentBlock: LessonBlock = lesson.blocks[stepIndex];
  const progressPct = Math.round((completedIds.length / lesson.blocks.length) * 100);

  const goToStep = (idx: number) => {
    markBlockCompleted(lesson.slug, currentBlock.id);
    setStepIndex(idx);
    setLastLessonBlock(lesson.slug, idx);
    setPredictionChoice(null);
    setPredictionSubmitted(false);
  };

  const handleCopyCode = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Clipboard fallback ignored cleanly
    }
  };

  const PrevIcon = lang === 'ar' ? ChevronRight : ChevronLeft;
  const NextIcon = lang === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <main className="mx-auto max-w-[1160px] space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      {/* Top Breadcrumb & Progress Bar */}
      <div
        className="rounded-2xl border p-4 sm:p-5"
        style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => navigate('/learn')}
              className="font-semibold underline"
              style={{ color: 'var(--color-accent-text)' }}
            >
              {lang === 'ar' ? 'المسار' : 'Curriculum'}
            </button>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <button
              type="button"
              onClick={() => navigate(`/course/${lesson.courseSlug}`)}
              className="ltr-isolate font-mono font-bold underline"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {lesson.courseCode}
            </button>
            {!lesson.verifiedSource && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs"
                style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}
              >
                <AlertTriangle className="h-3 w-3" />
                {lang === 'ar' ? 'مسودة' : 'Draft'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <span>
              {lang === 'ar' ? `الخطوة ${stepIndex + 1} من ${lesson.blocks.length}` : `Step ${stepIndex + 1} of ${lesson.blocks.length}`}
            </span>
            <span className="ltr-isolate font-mono font-semibold" style={{ color: 'var(--color-accent-text)' }}>
              {progressPct}%
            </span>
          </div>
        </div>

        <h1 className="mt-3 text-xl font-bold sm:text-2xl" style={{ color: 'var(--color-text-primary)' }}>
          {lesson.title[lang]}
        </h1>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--color-surface-3)' }}>
          <div className="brand-gradient-bg h-full rounded-full" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Desktop Two-Column Split: Steps Sidebar + Active Lesson Block */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Step Outline */}
        <aside className="lg:col-span-4">
          <div
            className="rounded-2xl border p-4"
            style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
          >
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              {lang === 'ar' ? 'خطوات الدرس' : 'Lesson Outline'}
            </h2>
            <nav aria-label={lang === 'ar' ? 'خطوات الدرس' : 'Lesson steps'} className="space-y-1.5">
              {lesson.blocks.map((blk, idx) => {
                const active = idx === stepIndex;
                const done = completedIds.includes(blk.id);
                return (
                  <button
                    key={blk.id}
                    type="button"
                    onClick={() => goToStep(idx)}
                    aria-current={active ? 'step' : undefined}
                    className="flex min-h-[44px] w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-start text-xs font-medium transition-colors sm:text-sm"
                    style={{
                      backgroundColor: active ? 'var(--color-surface-3)' : 'transparent',
                      borderColor: active ? 'var(--color-cyan)' : 'transparent',
                      color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    }}
                  >
                    <CheckCircle2
                      className="h-4 w-4 shrink-0"
                      style={{ color: done ? 'var(--color-success)' : 'var(--color-text-muted)' }}
                    />
                    <span className="flex-1 truncate">
                      {idx + 1}. {blk.title[lang]}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Active Block Workspace */}
        <section className="space-y-5 lg:col-span-8">
          <article
            className="rounded-2xl border p-5 sm:p-7"
            style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border-strong)' }}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span
                className="ltr-isolate rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold uppercase"
                style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-accent-text)' }}
              >
                {currentBlock.type}
              </span>
              {completedIds.includes(currentBlock.id) && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--color-success)' }}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {lang === 'ar' ? 'مكتمل' : 'Completed'}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold sm:text-2xl" style={{ color: 'var(--color-text-primary)' }}>
              {currentBlock.title[lang]}
            </h2>

            {currentBlock.body && (
              <p className="mt-3 max-w-[680px] text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {currentBlock.body[lang]}
              </p>
            )}

            {/* Outcome list */}
            {currentBlock.type === 'outcome' && currentBlock.items && (
              <ul className="mt-4 space-y-2.5">
                {currentBlock.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-xl border p-3.5 text-sm"
                    style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--color-cyan)' }} />
                    <span style={{ color: 'var(--color-text-primary)' }}>{item[lang]}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Diagram */}
            {currentBlock.type === 'diagram' && currentBlock.diagramId && (
              <div className="mt-5">
                <ConceptDiagram id={currentBlock.diagramId} lang={lang} />
              </div>
            )}

            {/* Code Block (LTR-isolated) */}
            {currentBlock.type === 'code' && currentBlock.code && (
              <div
                className="ltr-isolate mt-5 overflow-hidden rounded-2xl border"
                style={{ backgroundColor: '#090B10', borderColor: 'var(--color-border)' }}
              >
                <div
                  className="flex items-center justify-between border-b px-4 py-2 text-xs"
                  style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                >
                  <span className="font-mono font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                    {currentBlock.language ?? 'bash'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(currentBlock.id, currentBlock.code!)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {copiedId === currentBlock.id ? <Check className="h-3.5 w-3.5 text-[#42C98A]" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedId === currentBlock.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#E2E8F0] sm:text-sm">
                  <code>{currentBlock.code}</code>
                </pre>
              </div>
            )}

            {/* Callout */}
            {currentBlock.type === 'callout' && (
              <div
                className="mt-4 flex items-start gap-3 rounded-xl border p-4"
                style={{
                  backgroundColor: currentBlock.calloutTone === 'warning' ? 'var(--color-warning-bg)' : 'var(--color-info-bg)',
                  borderColor: 'var(--color-border-strong)',
                }}
              >
                {currentBlock.calloutTone === 'warning' ? (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--color-warning)' }} />
                ) : (
                  <Info className="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--color-info)' }} />
                )}
                <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {lang === 'ar'
                    ? 'تحقق دائماً من .gitignore قبل رفع التعديلات إلى GitHub.'
                    : 'Always verify .gitignore before pushing repository changes.'}
                </span>
              </div>
            )}

            {/* Prediction before reveal */}
            {currentBlock.type === 'prediction' && currentBlock.predictionConfig && (
              <div className="mt-5 space-y-4">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {currentBlock.predictionConfig.prompt[lang]}
                </p>
                <pre
                  className="ltr-isolate overflow-x-auto rounded-xl border p-4 font-mono text-xs text-[#E2E8F0] sm:text-sm"
                  style={{ backgroundColor: '#090B10', borderColor: 'var(--color-border)' }}
                >
                  {currentBlock.predictionConfig.snippet}
                </pre>

                <div className="space-y-2">
                  {currentBlock.predictionConfig.options.map((opt, idx) => {
                    const selected = predictionChoice === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPredictionChoice(idx);
                          setPredictionSubmitted(false);
                        }}
                        className="ltr-isolate flex min-h-[44px] w-full items-center rounded-xl border px-4 py-2.5 text-left font-mono text-xs sm:text-sm"
                        style={{
                          backgroundColor: selected ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
                          borderColor: selected ? 'var(--color-cyan)' : 'var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {opt[lang]}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={predictionChoice === null}
                  onClick={() => {
                    setPredictionSubmitted(true);
                    if (predictionChoice === currentBlock.predictionConfig!.correctIndex) {
                      markBlockCompleted(lesson.slug, currentBlock.id);
                    }
                  }}
                  className="inline-flex min-h-[44px] items-center rounded-full px-6 text-sm font-bold disabled:opacity-45"
                  style={{ backgroundColor: 'var(--color-action-primary)', color: 'var(--color-action-primary-fg)' }}
                >
                  {lang === 'ar' ? 'تأكيد التوقّع' : 'Check Prediction'}
                </button>

                {predictionSubmitted && (
                  <div
                    role="status"
                    className="rounded-xl border p-4 text-sm"
                    style={{
                      backgroundColor:
                        predictionChoice === currentBlock.predictionConfig.correctIndex
                          ? 'var(--color-success-bg)'
                          : 'var(--color-warning-bg)',
                      borderColor: 'var(--color-border-strong)',
                    }}
                  >
                    {predictionChoice === currentBlock.predictionConfig.correctIndex ? (
                      <p style={{ color: 'var(--color-text-primary)' }}>
                        <strong style={{ color: 'var(--color-success)' }}>
                          {lang === 'ar' ? 'توقّع دقيق! ' : 'Spot on! '}
                        </strong>
                        {currentBlock.predictionConfig.explanation[lang]}
                      </p>
                    ) : (
                      <div className="flex items-start gap-2">
                        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--color-warning)' }} />
                        <p style={{ color: 'var(--color-text-primary)' }}>
                          <strong>{lang === 'ar' ? 'تلميح تصحيحي: ' : 'Misconception hint: '}</strong>
                          {currentBlock.predictionConfig.hint[lang]}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Embedded Terminal Simulator */}
            {currentBlock.type === 'terminal_sim' && currentBlock.terminalConfig && (
              <div className="mt-5">
                <SimulatedTerminal
                  lang={lang}
                  goal={currentBlock.terminalConfig.goal}
                  requiredFiles={currentBlock.terminalConfig.requiredFiles}
                  hints={currentBlock.terminalConfig.hints}
                  compact
                  onGoalComplete={() => {
                    markBlockCompleted(lesson.slug, currentBlock.id);
                    markLabCompleted('linux-aib100');
                  }}
                />
              </div>
            )}

            {/* Quiz Checkpoint */}
            {currentBlock.type === 'quiz' && currentBlock.quizQuestionId && QUIZ_QUESTIONS[currentBlock.quizQuestionId] && (
              <div className="mt-5">
                <QuizCheckpoint
                  question={QUIZ_QUESTIONS[currentBlock.quizQuestionId]}
                  lang={lang}
                  onAnswered={(c) => {
                    if (c === 'correct') markBlockCompleted(lesson.slug, currentBlock.id);
                  }}
                />
              </div>
            )}

            {/* Reflection */}
            {currentBlock.type === 'reflection' && (
              <div className="mt-5 space-y-3">
                <textarea
                  rows={3}
                  value={reflectionText}
                  onChange={(e) => {
                    setReflectionText(e.target.value);
                    setReflectionSaved(false);
                  }}
                  placeholder={lang === 'ar' ? 'اكتب خلاصتك الهندسية هنا...' : 'Write your engineering reflection here...'}
                  className="w-full rounded-xl border p-3.5 text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={reflectionText.trim().length < 4}
                    onClick={() => {
                      saveReflection(lesson.slug, reflectionText);
                      markBlockCompleted(lesson.slug, currentBlock.id);
                      setReflectionSaved(true);
                    }}
                    className="inline-flex min-h-[44px] items-center rounded-full px-6 text-sm font-bold disabled:opacity-45"
                    style={{ backgroundColor: 'var(--color-action-primary)', color: 'var(--color-action-primary-fg)' }}
                  >
                    {lang === 'ar' ? 'حفظ التأمل محلياً' : 'Save Reflection Locally'}
                  </button>
                  {reflectionSaved && (
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-success)' }}>
                      {lang === 'ar' ? 'تم الحفظ في المتصفح' : 'Saved locally'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Source */}
            {currentBlock.type === 'source' && (
              <div
                className="mt-4 rounded-xl border p-4 text-xs sm:text-sm"
                style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
              >
                <p style={{ color: 'var(--color-text-secondary)' }}>{lesson.sourceRef[lang]}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {lesson.nextLabSlug && (
                    <button
                      type="button"
                      onClick={() => {
                        markBlockCompleted(lesson.slug, currentBlock.id);
                        navigate(`/lab/${lesson.nextLabSlug}`);
                      }}
                      className="brand-gradient-bg inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-xs font-bold text-[#07111D] sm:text-sm"
                    >
                      <Terminal className="h-4 w-4" />
                      <span>{lang === 'ar' ? 'الانتقال إلى المختبر الكامل' : 'Open Full Lab'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate('/projects/linux-ai-service-scaffold')}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-xs font-semibold sm:text-sm"
                    style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>{lang === 'ar' ? 'تطبيق في المشروع' : 'Apply in Project'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step Footer Navigation */}
            <div
              className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <button
                type="button"
                disabled={stepIndex === 0}
                onClick={() => goToStep(stepIndex - 1)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-5 text-sm font-semibold disabled:opacity-40"
                style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
              >
                <PrevIcon className="h-4 w-4" />
                <span>{lang === 'ar' ? 'السابق' : 'Previous'}</span>
              </button>

              {stepIndex < lesson.blocks.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(stepIndex + 1)}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-6 text-sm font-bold"
                  style={{ backgroundColor: 'var(--color-action-primary)', color: 'var(--color-action-primary-fg)' }}
                >
                  <span>{lang === 'ar' ? 'التالي' : 'Next Step'}</span>
                  <NextIcon className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    markBlockCompleted(lesson.slug, currentBlock.id);
                    navigate('/dashboard');
                  }}
                  className="brand-gradient-bg inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-6 text-sm font-bold text-[#07111D]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{lang === 'ar' ? 'إنهاء الدرس والعودة للوحة' : 'Finish Lesson & Return'}</span>
                </button>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
};

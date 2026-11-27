import React, { useState, useEffect } from 'react';
import { RotateCcw, Info, Sparkles, CheckCircle2, BookOpen, Trash2 } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { QUIZ_QUESTIONS } from '../data/lessonsAndProjects';
import { QuizCheckpoint } from '../components/QuizCheckpoint';
import { getDueReviewAttempts } from '../engine/quizGrader';

export const ReviewPage: React.FC = () => {
  const { lang, navigate, learner, loadDemoReviewItems, clearDemoReviewItems } = useAcademy();
  const [mode, setMode] = useState<'queue' | 'bank'>('queue');

  const allQuestionIds = Object.keys(QUIZ_QUESTIONS);
  const attempts = learner.attempts;
  const dueAttempts = getDueReviewAttempts(attempts);
  const dueIds = dueAttempts.map((a) => a.questionId).filter((id) => id in QUIZ_QUESTIONS);
  const hasDemoItems = Object.values(attempts).some((a) => a.isDemo);

  const [activeQueueId, setActiveQueueId] = useState<string | null>(() => dueIds[0] ?? null);
  const [activeBankId, setActiveBankId] = useState<string>(allQuestionIds[0]);

  useEffect(() => {
    if (dueIds.length === 0) {
      setActiveQueueId(null);
    } else if (!activeQueueId || !dueIds.includes(activeQueueId)) {
      setActiveQueueId(dueIds[0]);
    }
  }, [dueIds.join(','), activeQueueId]);

  return (
    <main className="mx-auto max-w-[1000px] space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--color-text-primary)' }}>
            {lang === 'ar' ? 'نقاط التحقق والمراجعة المتباعدة' : 'Checkpoints & Spaced Review'}
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {lang === 'ar'
              ? 'فصل واضح بين قائمة المراجعة المستحقة من محاولاتك، وبين بنك الأسئلة التدريبي.'
              : 'Clear separation between your actual due review queue and the sample checkpoint practice bank.'}
          </p>
        </div>

        {/* Mode Tabs: Due Queue vs Sample Question Bank */}
        <div
          className="inline-flex rounded-xl border p-1"
          role="tablist"
          aria-label={lang === 'ar' ? 'أقسام المراجعة' : 'Review sections'}
          style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'queue'}
            onClick={() => setMode('queue')}
            className="min-h-[40px] rounded-lg px-4 text-xs font-semibold sm:text-sm"
            style={{
              backgroundColor: mode === 'queue' ? 'var(--color-surface-3)' : 'transparent',
              color: mode === 'queue' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            }}
          >
            {lang === 'ar' ? `المستحقة للمراجعة (${dueIds.length})` : `Due Queue (${dueIds.length})`}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'bank'}
            onClick={() => setMode('bank')}
            className="min-h-[40px] rounded-lg px-4 text-xs font-semibold sm:text-sm"
            style={{
              backgroundColor: mode === 'bank' ? 'var(--color-surface-3)' : 'transparent',
              color: mode === 'bank' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            }}
          >
            {lang === 'ar' ? `بنك الأسئلة (${allQuestionIds.length})` : `Sample Bank (${allQuestionIds.length})`}
          </button>
        </div>
      </div>

      {/* Transparent Heuristic Note */}
      <div
        className="flex items-start gap-3 rounded-2xl border p-4 text-xs sm:text-sm"
        style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--color-info)' }} />
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {lang === 'ar'
            ? 'ملاحظة: خوارزمية التباعد هنا نموذج أولي بسيط (إجابة خاطئة = مراجعة فورية، صحيحة بتلميح = يوم واحد، صحيحة بدون تلميح = 3–14 يوماً) وليست نموذجاً بحثياً معاَيراً بعد.'
            : 'Note: This uses a transparent starter heuristic (wrong = immediate due, correct with hint = 1 day, clean recall = 3–14 days) rather than a calibrated cognitive model.'}
        </p>
      </div>

      {mode === 'queue' ? (
        dueIds.length === 0 ? (
          /* Honest Empty Due Queue State */
          <section
            className="rounded-2xl border p-7 text-center"
            style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border-strong)' }}
          >
            <CheckCircle2 className="mx-auto h-10 w-10" style={{ color: 'var(--color-success)' }} />
            <h2 className="mt-3 text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {Object.keys(attempts).length === 0
                ? lang === 'ar'
                  ? 'لا توجد مراجعات مستحقة بعد'
                  : 'No review items due yet'
                : lang === 'ar'
                  ? 'أحسنت! أنهيت كل المراجعات المستحقة الآن'
                  : 'All caught up — no reviews due right now!'}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {lang === 'ar'
                ? 'تُضاف المفاهيم هنا تلقائياً عند وجود محاولات سابقة تحتاج تثبيتاً. يمكنك التدرّب من بنك الأسئلة أو تحميل أمثلة تجريبية (Demo).'
                : 'Items appear here when prior checkpoint attempts fall due. You can practice from the Sample Bank or load clearly-labeled demo items.'}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setMode('bank')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-xs font-bold sm:text-sm"
                style={{ backgroundColor: 'var(--color-action-primary)', color: 'var(--color-action-primary-fg)' }}
              >
                <BookOpen className="h-4 w-4" />
                <span>{lang === 'ar' ? 'جرّب بنك الأسئلة' : 'Practice Sample Bank'}</span>
              </button>
              <button
                type="button"
                onClick={loadDemoReviewItems}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-xs font-semibold sm:text-sm"
                style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-accent-text)' }}
              >
                <Sparkles className="h-4 w-4" />
                <span>{lang === 'ar' ? 'تحميل بيانات مراجعة تجريبية (Demo)' : 'Load Demo Review Items'}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/lesson/aib-100-linux-files-terminal')}
                className="inline-flex min-h-[44px] items-center rounded-full border px-5 text-xs font-semibold sm:text-sm"
                style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
              >
                {lang === 'ar' ? 'الذهاب إلى درس AIB-100' : 'Go to AIB-100 Lesson'}
              </button>
            </div>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                {dueIds.map((qid) => {
                  const q = QUIZ_QUESTIONS[qid];
                  const attempt = attempts[qid];
                  const active = qid === activeQueueId;
                  return (
                    <button
                      key={qid}
                      type="button"
                      onClick={() => setActiveQueueId(qid)}
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold"
                      style={{
                        backgroundColor: active ? 'var(--color-surface-3)' : 'var(--color-surface-1)',
                        borderColor: active ? 'var(--color-cyan)' : 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      <RotateCcw className="h-3.5 w-3.5" style={{ color: 'var(--color-warning)' }} />
                      <span className="ltr-isolate font-mono">{q.courseCode}</span>
                      {attempt?.isDemo && (
                        <span className="rounded px-1.5 py-0.5 text-[10px]" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                          Demo
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {hasDemoItems && (
                <button
                  type="button"
                  onClick={clearDemoReviewItems}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 text-xs font-medium"
                  style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{lang === 'ar' ? 'إزالة بيانات Demo' : 'Clear Demo Items'}</span>
                </button>
              )}
            </div>

            {activeQueueId && QUIZ_QUESTIONS[activeQueueId] && (
              <QuizCheckpoint key={`q-${activeQueueId}`} question={QUIZ_QUESTIONS[activeQueueId]} lang={lang} />
            )}
          </section>
        )
      ) : (
        /* Sample Question Bank (Separate from Due Queue) */
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {allQuestionIds.map((qid, idx) => {
              const q = QUIZ_QUESTIONS[qid];
              const attempt = attempts[qid];
              const active = qid === activeBankId;
              return (
                <button
                  key={qid}
                  type="button"
                  onClick={() => setActiveBankId(qid)}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold"
                  style={{
                    backgroundColor: active ? 'var(--color-surface-3)' : 'var(--color-surface-1)',
                    borderColor: active ? 'var(--color-cyan)' : 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <span className="ltr-isolate font-mono">{q.courseCode}</span>
                  <span>#{idx + 1}</span>
                  {attempt && !attempt.isDemo && (
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px]"
                      style={{
                        backgroundColor: 'var(--color-surface-2)',
                        color: attempt.correctness === 'correct' ? 'var(--color-success)' : 'var(--color-warning)',
                      }}
                    >
                      {attempt.correctness}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <QuizCheckpoint key={`b-${activeBankId}`} question={QUIZ_QUESTIONS[activeBankId]} lang={lang} />
        </section>
      )}
    </main>
  );
};

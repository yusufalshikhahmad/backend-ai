import React, { useState } from 'react';
import { RotateCcw, Info, Sparkles } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { QUIZ_QUESTIONS } from '../data/lessonsAndProjects';
import { QuizCheckpoint } from '../components/QuizCheckpoint';

export const ReviewPage: React.FC = () => {
  const { lang, learner, loadDemoReviewItems } = useAcademy();
  const allQuestionIds = Object.keys(QUIZ_QUESTIONS);
  const attempts = learner.attempts;
  const dueIds = Object.values(attempts)
    .filter((a) => a.nextReviewAt <= Date.now())
    .map((a) => a.questionId);

  const [activeId, setActiveId] = useState<string>(dueIds[0] ?? allQuestionIds[0]);

  return (
    <main className="mx-auto max-w-[1000px] space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--color-text-primary)' }}>
            {lang === 'ar' ? 'نقاط التحقق والمراجعة المتباعدة' : 'Checkpoints & Spaced Review'}
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {lang === 'ar'
              ? 'جدولة مراجعة مبدئية مبنية على أخطائك الفعلية وعدد التلميحات المستخدمة.'
              : 'Starter review scheduling heuristic driven by your actual attempts and hint usage.'}
          </p>
        </div>

        {Object.keys(attempts).length === 0 && (
          <button
            type="button"
            onClick={loadDemoReviewItems}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-xs font-semibold sm:text-sm"
            style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border-strong)', color: 'var(--color-accent-text)' }}
          >
            <Sparkles className="h-4 w-4" />
            <span>{lang === 'ar' ? 'تحميل بيانات مراجعة تجريبية' : 'Load Demo Review Items'}</span>
          </button>
        )}
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

      {/* Question Selector */}
      <div className="flex flex-wrap gap-2">
        {allQuestionIds.map((qid, idx) => {
          const q = QUIZ_QUESTIONS[qid];
          const attempt = attempts[qid];
          const active = qid === activeId;
          return (
            <button
              key={qid}
              type="button"
              onClick={() => setActiveId(qid)}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold"
              style={{
                backgroundColor: active ? 'var(--color-surface-3)' : 'var(--color-surface-1)',
                borderColor: active ? 'var(--color-cyan)' : 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" style={{ color: attempt?.correctness === 'correct' ? 'var(--color-success)' : 'var(--color-warning)' }} />
              <span className="ltr-isolate font-mono">{q.courseCode}</span>
              <span>#{idx + 1}</span>
              {attempt?.isDemo && (
                <span className="rounded px-1.5 py-0.5 text-[10px]" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                  Demo
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Checkpoint */}
      <QuizCheckpoint key={activeId} question={QUIZ_QUESTIONS[activeId]} lang={lang} />
    </main>
  );
};

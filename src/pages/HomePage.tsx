import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Terminal,
  BookOpen,
  FolderKanban,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  Cpu,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { LESSONS, PROJECTS } from '../data/lessonsAndProjects';

type PromptMode = 'curriculum' | 'lab' | 'project';

export const HomePage: React.FC = () => {
  const { lang, navigate, learner } = useAcademy();
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<PromptMode>('curriculum');
  const [suggestionBanner, setSuggestionBanner] = useState<string | null>(null);

  const ArrowPrimary = lang === 'ar' ? ArrowLeft : ArrowRight;
  const ChipChevron = lang === 'ar' ? ChevronLeft : ChevronRight;

  const chips = [
    { id: 'linux', label: 'Linux Lab', path: '/lab/linux-aib100' },
    { id: 'python', label: 'Python', path: '/course/python-fundamentals' },
    { id: 'data', label: 'Data Engineering', path: '/course/data-engineering' },
    { id: 'rag', label: 'RAG Playground', path: '/lab/rag-playground' },
    { id: 'agents', label: 'AI Agents', path: '/lab/agent-loop' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = prompt.trim().toLowerCase();

    if (!q) {
      if (mode === 'lab') navigate('/lab/linux-aib100');
      else if (mode === 'project') navigate('/projects/linux-ai-service-scaffold');
      else navigate('/lesson/aib-100-linux-files-terminal');
      return;
    }

    if (q.includes('linux') || q.includes('terminal') || q.includes('لينكس') || q.includes('طرفية') || q.includes('ملفات') || q.includes('aib-100')) {
      navigate(mode === 'lab' ? '/lab/linux-aib100' : '/lesson/aib-100-linux-files-terminal');
      return;
    }
    if (q.includes('rag') || q.includes('استرجاع') || q.includes('تقطيع') || q.includes('aib-302')) {
      navigate(mode === 'lab' ? '/lab/rag-playground' : '/lesson/aib-302-rag-foundations');
      return;
    }
    if (q.includes('agent') || q.includes('mcp') || q.includes('وكيل') || q.includes('أدوات') || q.includes('aib-303')) {
      navigate('/lab/agent-loop');
      return;
    }
    if (q.includes('python') || q.includes('بايثون') || q.includes('aib-101') || q.includes('aib-102')) {
      navigate('/course/python-fundamentals');
      return;
    }
    if (q.includes('fastapi') || q.includes('api') || q.includes('خادم')) {
      navigate('/course/fastapi-backend');
      return;
    }
    if (q.includes('project') || q.includes('مشروع') || mode === 'project') {
      navigate('/projects');
      return;
    }
    if (q.includes('review') || q.includes('quiz') || q.includes('مراجعة') || q.includes('اختبار')) {
      navigate('/review');
      return;
    }

    setSuggestionBanner(
      lang === 'ar'
        ? 'لم نطابق هدفك بدقة مع مسار محدد بعد — اختر أحد المسارات الجاهزة بالأسفل أو استعرض خريطة المنهج الكاملة.'
        : 'No exact local match found for that query yet — pick one of the starter tracks below or open the full curriculum map.'
    );
  };

  const aib100Lesson = LESSONS['aib-100-linux-files-terminal'];
  const aib100Completed = learner.completedBlockIds['aib-100-linux-files-terminal']?.length ?? 0;
  const aib100Total = aib100Lesson.blocks.length;
  const dueReviews = Object.values(learner.attempts).filter((a) => a.nextReviewAt <= Date.now()).length;
  const primaryProject = PROJECTS[0];

  return (
    <div className="academy-grid-bg">
      {/* Hero & Dominant Prompt Composer */}
      <section className="mx-auto max-w-[1000px] px-4 pb-12 pt-10 text-center sm:px-6 sm:pt-16">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium sm:text-sm"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderColor: 'var(--color-border-strong)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-cyan)' }} />
          <span>
            {lang === 'ar'
              ? 'رحلة تعلم هندسية • منهج AI Backend (Python on Linux)'
              : 'Interactive Engineering Path • AI Backend (Python on Linux)'}
          </span>
        </div>

        <h1
          className="mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {lang === 'ar' ? 'ابنِ مهاراتك في هندسة الذكاء الاصطناعي' : 'Build Real AI Backend Engineering Skills'}
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-xl" style={{ color: 'var(--color-text-secondary)' }}>
          {lang === 'ar'
            ? 'تعلم تفاعلي • مختبرات عملية • مشاريع حقيقية'
            : 'Interactive learning • Hands-on labs • Production engineering projects'}
        </p>

        {/* Prompt Composer */}
        <form onSubmit={handleSubmit} className="gradient-border-composer mx-auto mt-9 max-w-[820px] p-4 text-start sm:p-6">
          <label htmlFor="home-prompt-input" className="sr-only">
            {lang === 'ar' ? 'شو حاب تتعلم أو تبني اليوم؟' : 'What would you like to learn or build today?'}
          </label>
          <textarea
            id="home-prompt-input"
            rows={2}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (suggestionBanner) setSuggestionBanner(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={lang === 'ar' ? 'شو حاب تتعلم أو تبني اليوم؟' : 'What do you want to learn or build today? (e.g. Linux paths, RAG chunking, Python...)'}
            className="w-full resize-none bg-transparent text-base outline-none sm:text-lg"
            style={{ color: 'var(--color-text-primary)' }}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Mode Selector */}
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={lang === 'ar' ? 'نوع الوجهة' : 'Learning mode'}>
              {(
                [
                  { id: 'curriculum', ar: 'مسار المنهج', en: 'Curriculum Path' },
                  { id: 'lab', ar: 'مختبر عملي', en: 'Interactive Lab' },
                  { id: 'project', ar: 'مشروع', en: 'Project' },
                ] as const
              ).map((item) => {
                const selected = mode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    aria-pressed={selected}
                    className="min-h-[44px] rounded-full border px-4 text-xs font-semibold transition-colors sm:text-sm"
                    style={{
                      backgroundColor: selected ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
                      borderColor: selected ? 'var(--color-cyan)' : 'var(--color-border-strong)',
                      color: selected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    }}
                  >
                    {item[lang]}
                  </button>
                );
              })}
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              className="brand-gradient-bg inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 text-sm font-bold text-[#07111D] transition-opacity hover:opacity-95"
            >
              <span>{lang === 'ar' ? 'ابدأ رحلتك' : 'Start Journey'}</span>
              <ArrowPrimary className="h-4 w-4" />
            </button>
          </div>
        </form>

        {suggestionBanner && (
          <div
            role="status"
            className="mx-auto mt-4 flex max-w-[820px] flex-wrap items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-start text-xs sm:text-sm"
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderColor: 'var(--color-border-strong)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span>{suggestionBanner}</span>
            <button
              type="button"
              onClick={() => navigate('/learn')}
              className="font-semibold underline"
              style={{ color: 'var(--color-accent-text)' }}
            >
              {lang === 'ar' ? 'افتح خريطة المنهج' : 'Open Curriculum Map'}
            </button>
          </div>
        )}

        {/* Suggestion Chips */}
        <div
          className="mt-6 flex items-center gap-2.5 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible"
          aria-label={lang === 'ar' ? 'اقتراحات سريعة' : 'Quick topic chips'}
        >
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => navigate(chip.path)}
              className="ltr-isolate inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border px-4 text-xs font-medium transition-colors hover:opacity-90 sm:text-sm"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              <span>{chip.label}</span>
              <ChipChevron className="h-3.5 w-3.5 opacity-70" />
            </button>
          ))}
        </div>
      </section>

      {/* Below the Fold: Learning Cockpit Summary + 3 Feature Cards */}
      <section className="mx-auto max-w-[1200px] space-y-6 px-4 pb-16 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Continue Learning */}
          <div
            className="rounded-2xl border p-5 md:col-span-2"
            style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="ltr-isolate font-mono text-xs font-semibold" style={{ color: 'var(--color-accent-text)' }}>
                AIB-100 • {lang === 'ar' ? 'متابعة التعلم' : 'Continue Learning'}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {aib100Completed}/{aib100Total} {lang === 'ar' ? 'خطوات' : 'steps'}
              </span>
            </div>
            <h2 className="mt-2 text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {aib100Lesson.title[lang]}
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {aib100Lesson.subtitle[lang]}
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--color-surface-3)' }}>
              <div
                className="brand-gradient-bg h-full rounded-full"
                style={{ width: `${Math.round((aib100Completed / aib100Total) * 100)}%` }}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate(`/lesson/${aib100Lesson.slug}`)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-xs font-bold sm:text-sm"
                style={{ backgroundColor: 'var(--color-action-primary)', color: 'var(--color-action-primary-fg)' }}
              >
                <BookOpen className="h-4 w-4" />
                <span>{aib100Completed > 0 ? (lang === 'ar' ? 'متابعة الدرس' : 'Resume Lesson') : (lang === 'ar' ? 'ابدأ الدرس' : 'Start Lesson')}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/lab/linux-aib100')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-xs font-semibold sm:text-sm"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <Terminal className="h-4 w-4" />
                <span>{lang === 'ar' ? 'افتح المختبر' : 'Open Lab'}</span>
              </button>
            </div>
          </div>

          {/* Review Due */}
          <div
            className="flex flex-col justify-between rounded-2xl border p-5"
            style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--color-warning)' }}>
                <RotateCcw className="h-4 w-4" />
                <span>{lang === 'ar' ? 'قائمة المراجعة' : 'Review Queue'}</span>
              </div>
              <p className="mt-2 text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {dueReviews}{' '}
                <span className="text-sm font-normal" style={{ color: 'var(--color-text-secondary)' }}>
                  {lang === 'ar' ? 'مفاهيم مستحقة' : 'items due'}
                </span>
              </p>
              <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {lang === 'ar'
                  ? 'مبنية على محاولاتك المحلية في نقاط التحقق.'
                  : 'Derived from your actual local checkpoint attempts.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/review')}
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl border px-4 text-xs font-semibold"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              {lang === 'ar' ? 'بدء المراجعة' : 'Open Review'}
            </button>
          </div>

          {/* Current Project */}
          <div
            className="flex flex-col justify-between rounded-2xl border p-5"
            style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--color-violet)' }}>
                <FolderKanban className="h-4 w-4" />
                <span>{lang === 'ar' ? 'المشروع النشط' : 'Active Project'}</span>
              </div>
              <h3 className="mt-2 text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {primaryProject.title[lang]}
              </h3>
              <p className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {primaryProject.courseCode} • {primaryProject.milestones.length}{' '}
                {lang === 'ar' ? 'محطات تسليم' : 'milestones'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/projects/${primaryProject.slug}`)}
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl border px-4 text-xs font-semibold"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              {lang === 'ar' ? 'مساحة المشروع' : 'Open Workspace'}
            </button>
          </div>
        </div>

        {/* 3 Feature Cards (matching home-prompt-first.svg) */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              titleAr: 'تعلم تفاعلي',
              titleEn: 'Interactive Learning',
              descAr: 'دروس قصيرة، رسوم توضيحية، وتوقّع المخرجات قبل كشف الإجابة.',
              descEn: 'Short concept explanations, diagrams, and output prediction before reveal.',
              path: '/lesson/aib-100-linux-files-terminal',
            },
            {
              icon: Terminal,
              titleAr: 'مختبرات عملية آمنة',
              titleEn: 'Safe Hands-on Labs',
              descAr: 'جرّب أوامر Linux وتدفق RAG وحلقة الوكيل في محاكٍ معزول وآمن.',
              descEn: 'Practice Linux commands, RAG chunking, and agent loops in deterministic sandboxes.',
              path: '/lab/linux-aib100',
            },
            {
              icon: Cpu,
              titleAr: 'مسار هندسي متكامل',
              titleEn: 'Structured 4-Semester Path',
              descAr: '١٦ مقرراً من Linux و Python حتى FastAPI و RAG و MLOps ومشروع التخرج.',
              descEn: '16 courses from Linux & Python to FastAPI, RAG, MLOps, and Capstone.',
              path: '/learn',
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => navigate(card.path)}
                className="flex items-start gap-4 rounded-2xl border p-5 text-start transition-colors hover:opacity-95"
                style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
              >
                <span
                  className="brand-gradient-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#07111D]"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {lang === 'ar' ? card.titleAr : card.titleEn}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {lang === 'ar' ? card.descAr : card.descEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Today's Plan note */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4"
          style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <Layers className="h-5 w-5 shrink-0" style={{ color: 'var(--color-cyan)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {lang === 'ar'
                ? 'خطة اليوم المقترحة: أكمل درس AIB-100 ← جرّب تحدي الطرفية ← وثّق خطوة في مشروعك الأول.'
                : "Today's plan: Finish AIB-100 Lesson 1 → Pass the Linux Terminal Lab → Log milestone 1 in your project."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-sm font-semibold underline"
            style={{ color: 'var(--color-accent-text)' }}
          >
            {lang === 'ar' ? 'عرض لوحة التعلم' : 'View Dashboard'}
          </button>
        </div>
      </section>
    </div>
  );
};

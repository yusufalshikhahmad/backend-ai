import React from 'react';
import { BookOpen, Terminal, RotateCcw, FolderKanban, Compass, CheckCircle2 } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { COURSES, SEMESTER_META } from '../data/curriculum';
import { LESSONS, PROJECTS } from '../data/lessonsAndProjects';
import { getCourseStatus } from '../state/learnerStore';
import { StatusBadge } from '../components/StatusBadge';

export const DashboardPage: React.FC = () => {
  const { lang, navigate, learner } = useAcademy();
  const lesson = LESSONS['aib-100-linux-files-terminal'];
  const completedCount = learner.completedBlockIds[lesson.slug]?.length ?? 0;
  const totalBlocks = lesson.blocks.length;
  const pct = Math.round((completedCount / totalBlocks) * 100);

  const attemptList = Object.values(learner.attempts);
  const dueList = attemptList.filter((a) => a.nextReviewAt <= Date.now());
  const project = PROJECTS[0];
  const projectProgress = learner.projects[project.slug];
  const completedDeliverables = projectProgress?.completedDeliverables.length ?? 0;

  return (
    <main className="mx-auto max-w-[1200px] space-y-6 px-4 py-8 sm:px-6">
      {/* Greeting & Today's Goal (no invented user name or fake KPIs) */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-accent-text)' }}>
            {lang === 'ar' ? 'لوحة التعلم الشخصية' : 'Learner Cockpit'}
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl" style={{ color: 'var(--color-text-primary)' }}>
            {lang === 'ar' ? 'مرحباً بك في رحلتك الهندسية' : 'Welcome to Your Engineering Journey'}
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {lang === 'ar'
              ? 'كل التقدّم المحفوظ هنا مبني على تفاعلك الفعلي داخل المتصفح (localStorage).'
              : 'All progress displayed here reflects your actual local browser activity.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-sm font-semibold"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderColor: 'var(--color-border-strong)',
            color: 'var(--color-text-primary)',
          }}
        >
          <Compass className="h-4 w-4" />
          <span>{lang === 'ar' ? 'خريطة المنهج الكاملة' : 'Full Curriculum Map'}</span>
        </button>
      </div>

      {/* Dominant Continue Learning + Secondary Queue */}
      <div className="grid gap-5 lg:grid-cols-3">
        <section
          aria-label={lang === 'ar' ? 'متابعة المقرر الحالي' : 'Continue active course'}
          className="rounded-2xl border p-6 lg:col-span-2"
          style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border-strong)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="ltr-isolate rounded-lg px-2.5 py-1 font-mono text-xs font-bold" style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-cyan)' }}>
              AIB-100 • {lang === 'ar' ? 'الفصل الأول' : 'Semester 1'}
            </span>
            <StatusBadge status={getCourseStatus(COURSES[0], learner)} lang={lang} />
          </div>

          <h2 className="mt-4 text-xl font-bold sm:text-2xl" style={{ color: 'var(--color-text-primary)' }}>
            {lesson.title[lang]}
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {lesson.subtitle[lang]}
          </p>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <span>{lang === 'ar' ? 'تقدم خطوات الدرس' : 'Lesson block completion'}</span>
              <span className="ltr-isolate font-mono">
                {completedCount} / {totalBlocks} ({pct}%)
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--color-surface-3)' }}>
              <div className="brand-gradient-bg h-full rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(`/lesson/${lesson.slug}`)}
              className="brand-gradient-bg inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 text-sm font-bold text-[#07111D]"
            >
              <BookOpen className="h-4 w-4" />
              <span>{completedCount > 0 ? (lang === 'ar' ? 'أكمل الدرس الآن' : 'Continue Lesson') : (lang === 'ar' ? 'ابدأ الدرس الأول' : 'Start First Lesson')}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/lab/linux-aib100')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-sm font-semibold"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              <Terminal className="h-4 w-4" />
              <span>{lang === 'ar' ? 'تشغيل مختبر Linux' : 'Launch Linux Lab'}</span>
            </button>
          </div>
        </section>

        {/* Right column: Today's sequence + Review + Project */}
        <div className="space-y-4">
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {lang === 'ar' ? 'خطة اليوم الموصى بها' : "Today's Learning Plan"}
            </h3>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: completedCount >= 5 ? 'var(--color-success)' : 'var(--color-text-muted)' }} />
                <span>{lang === 'ar' ? '1. قراءة وتطبيق درس AIB-100 (18 د)' : '1. Complete AIB-100 lesson (18m)'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: learner.completedLabs.includes('linux-aib100') ? 'var(--color-success)' : 'var(--color-text-muted)' }} />
                <span>{lang === 'ar' ? '2. اجتياز تحدي محاكي الطرفية' : '2. Pass Linux simulator challenge'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: attemptList.length > 0 ? 'var(--color-success)' : 'var(--color-text-muted)' }} />
                <span>{lang === 'ar' ? '3. حل نقطة التحقق والمراجعة' : '3. Complete checkpoint & review'}</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                <RotateCcw className="h-4 w-4" style={{ color: 'var(--color-warning)' }} />
                <span>{lang === 'ar' ? 'قائمة المراجعة' : 'Review Queue'}</span>
              </div>
              <span className="ltr-isolate font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {dueList.length} due / {attemptList.length} logged
              </span>
            </div>
            <p className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {attemptList.length === 0
                ? lang === 'ar'
                  ? 'لا توجد أخطاء مسجلة بعد. أجب عن الأسئلة أو حمّل أمثلة تجريبية في صفحة المراجعة.'
                  : 'No recorded attempts yet. Complete checkpoints or load starter demo items in Review.'
                : lang === 'ar'
                  ? `لديك ${dueList.length} مفاهيم مستحقة للمراجعة التقديرية.`
                  : `You have ${dueList.length} concept(s) due under the starter review schedule.`}
            </p>
            <button
              type="button"
              onClick={() => navigate('/review')}
              className="mt-3 inline-flex min-h-[40px] w-full items-center justify-center rounded-xl border text-xs font-semibold"
              style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
            >
              {lang === 'ar' ? 'فتح جلسة المراجعة' : 'Start Review Session'}
            </button>
          </div>

          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                <FolderKanban className="h-4 w-4" style={{ color: 'var(--color-violet)' }} />
                <span>{lang === 'ar' ? 'المشروع الحالي' : 'Current Project'}</span>
              </div>
              <span className="ltr-isolate font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {completedDeliverables} {lang === 'ar' ? 'تسليمات' : 'done'}
              </span>
            </div>
            <p className="mt-2 text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {project.title[lang]}
            </p>
            <button
              type="button"
              onClick={() => navigate(`/projects/${project.slug}`)}
              className="mt-3 inline-flex min-h-[40px] w-full items-center justify-center rounded-xl border text-xs font-semibold"
              style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
            >
              {lang === 'ar' ? 'فتح مساحة المشروع' : 'Open Project Workspace'}
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Journey Preview */}
      <section className="rounded-2xl border p-5 sm:p-6" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {lang === 'ar' ? 'نظرة على الفصول الأربعة' : '4-Semester Curriculum Overview'}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {([1, 2, 3, 4] as const).map((sem) => {
            const semCourses = COURSES.filter((c) => c.semester === sem);
            return (
              <button
                key={sem}
                type="button"
                onClick={() => navigate('/learn')}
                className="rounded-xl border p-4 text-start transition-colors hover:opacity-95"
                style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
              >
                <span className="text-xs font-semibold" style={{ color: 'var(--color-accent-text)' }}>
                  {SEMESTER_META[sem].title[lang]}
                </span>
                <p className="mt-1.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {semCourses.map((c) => c.code).join(' • ')}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};

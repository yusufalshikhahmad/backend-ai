import React, { useState, useMemo } from 'react';
import { List, LayoutGrid, ArrowLeft, ArrowRight, AlertTriangle, BookOpen, Terminal, Lock } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { COURSES, SEMESTER_META } from '../data/curriculum';
import { evaluateAllCourses } from '../state/learnerStore';
import { StatusBadge } from '../components/StatusBadge';
import { NotFoundState } from '../components/NotFoundState';
import { Course } from '../types/academy';

export const CurriculumMapPage: React.FC<{ selectedSlug?: string }> = ({ selectedSlug }) => {
  const { lang, navigate, learner } = useAcademy();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [openSemesters, setOpenSemesters] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: true });

  const evaluations = useMemo(() => evaluateAllCourses(learner), [learner]);

  const selectedCourse: Course | undefined = selectedSlug
    ? COURSES.find((c) => c.slug === selectedSlug)
    : undefined;

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  if (selectedSlug && !selectedCourse) {
    return (
      <NotFoundState
        lang={lang}
        titleAr="المقرر المطلوب غير موجود"
        titleEn="Course Not Found"
        descriptionAr={`لم يتم العثور على مقرر بالمعرّف "${selectedSlug}" في خريطة المنهج الحالية.`}
        descriptionEn={`No course matching "${selectedSlug}" was found in the current curriculum catalog.`}
      />
    );
  }

  if (selectedCourse) {
    const evalInfo = evaluations[selectedCourse.code];
    const status = evalInfo?.status ?? 'not_started';
    const missingReq = evalInfo?.missingRequiredPrereqs ?? [];
    const missingRec = evalInfo?.missingRecommendedPrereqs ?? [];

    return (
      <main className="mx-auto max-w-[960px] space-y-6 px-4 py-8 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="inline-flex min-h-[40px] items-center gap-2 text-sm font-semibold"
          style={{ color: 'var(--color-accent-text)' }}
        >
          <span>{lang === 'ar' ? '← العودة إلى خريطة المنهج' : '← Back to Curriculum Map'}</span>
        </button>

        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border-strong)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="ltr-isolate rounded-lg px-2.5 py-1 font-mono text-xs font-bold"
                style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-cyan)' }}
              >
                {selectedCourse.code}
              </span>
              <StatusBadge status={status} lang={lang} />
              {!selectedCourse.verifiedSource && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {lang === 'ar' ? 'بحاجة إلى مراجعة المصدر' : 'Pending PDF verification'}
                </span>
              )}
            </div>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {SEMESTER_META[selectedCourse.semester].title[lang]}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold sm:text-3xl" style={{ color: 'var(--color-text-primary)' }}>
            {selectedCourse.title[lang]}
          </h1>
          <p className="mt-2 text-base" style={{ color: 'var(--color-text-secondary)' }}>
            {selectedCourse.purpose[lang]}
          </p>

          {/* Locked prerequisite alert */}
          {status === 'locked' && missingReq.length > 0 && (
            <div
              className="mt-4 flex items-start gap-2.5 rounded-xl border p-3.5 text-xs sm:text-sm"
              style={{ backgroundColor: 'var(--color-warning-bg)', borderColor: 'var(--color-border-strong)' }}
            >
              <Lock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--color-warning)' }} />
              <div style={{ color: 'var(--color-text-primary)' }}>
                <strong>{lang === 'ar' ? 'المتطلبات الإلزامية غير المكتملة: ' : 'Unmet required prerequisites: '}</strong>
                <span className="ltr-isolate font-mono font-semibold">{missingReq.join(', ')}</span>
                <p className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {lang === 'ar'
                    ? 'يُفتح هذا المقرر تلقائياً بعد التمرّن أو إتقان المقررات المذكورة أعلاه.'
                    : 'Unlocks automatically once you practice or master the required prerequisite course(s) above.'}
                </p>
              </div>
            </div>
          )}

          {!evalInfo?.hasPublishedContent && (
            <div
              className="mt-4 rounded-xl border p-3.5 text-xs sm:text-sm"
              style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
            >
              {lang === 'ar'
                ? 'محتوى الدروس التفصيلي لهذا المقرر قيد الإعداد (النسخة الحالية تركّز على إثبات AIB-100 ومعاينة AIB-302/AIB-303).'
                : 'Detailed lesson blocks for this course are not published yet (current prototype focuses on AIB-100 plus AIB-302/AIB-303 previews).'}
            </div>
          )}

          {/* Prerequisites */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border p-3.5" style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <p className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                {lang === 'ar' ? 'المتطلبات الإلزامية (Required)' : 'Required Prerequisites'}
              </p>
              <p className="ltr-isolate mt-1 font-mono text-sm" style={{ color: 'var(--color-text-primary)' }}>
                {selectedCourse.prerequisitesRequired.length > 0
                  ? selectedCourse.prerequisitesRequired.join(', ')
                  : lang === 'ar'
                    ? 'لا يوجد — نقطة بداية مباشرة'
                    : 'None — direct entry'}
              </p>
            </div>
            <div className="rounded-xl border p-3.5" style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <p className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                {lang === 'ar' ? 'المتطلبات الموصى بها (Recommended)' : 'Recommended Prerequisites'}
              </p>
              <p className="ltr-isolate mt-1 font-mono text-sm" style={{ color: 'var(--color-text-primary)' }}>
                {selectedCourse.prerequisitesRecommended.length > 0
                  ? `${selectedCourse.prerequisitesRecommended.join(', ')}${
                      missingRec.length > 0 ? (lang === 'ar' ? ' (غير مكتمل بعد)' : ' (not yet completed)') : ''
                    }`
                  : '—'}
              </p>
            </div>
          </div>

          {/* Modules */}
          <div className="mt-6">
            <h2 className="mb-3 text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {lang === 'ar' ? 'الوحدات والدروس المتاحة' : 'Modules & Activities'}
            </h2>
            <div className="space-y-3">
              {selectedCourse.modules.map((mod) => (
                <div
                  key={mod.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
                  style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                >
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {mod.title[lang]}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      ~{mod.estimatedMinutes} {lang === 'ar' ? 'دقيقة' : 'min'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mod.lessonSlug && (
                      <button
                        type="button"
                        onClick={() => navigate(`/lesson/${mod.lessonSlug}`)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 text-xs font-bold"
                        style={{ backgroundColor: 'var(--color-action-primary)', color: 'var(--color-action-primary-fg)' }}
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{lang === 'ar' ? 'افتح الدرس' : 'Open Lesson'}</span>
                      </button>
                    )}
                    {mod.labSlug && (
                      <button
                        type="button"
                        onClick={() => navigate(`/lab/${mod.labSlug}`)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-4 text-xs font-semibold"
                        style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      >
                        <Terminal className="h-3.5 w-3.5" />
                        <span>{lang === 'ar' ? 'افتح المختبر' : 'Open Lab'}</span>
                      </button>
                    )}
                    {!mod.lessonSlug && !mod.labSlug && (
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {lang === 'ar' ? 'مخطط قادم (قيد الإعداد والتحقق)' : 'Planned (content pending)'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1200px] space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--color-text-primary)' }}>
            {lang === 'ar' ? 'خريطة منهج هندسة الذكاء الاصطناعي الخلفية' : 'AI Backend Engineering Curriculum Map'}
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {lang === 'ar'
              ? '١٦ مقرراً موزعة على ٤ فصول. المحتوى الفعلي الجاهز حالياً هو AIB-100 ومعاينة AIB-302 و AIB-303.'
              : '16 catalog courses across 4 semesters. Active interactive lessons currently cover AIB-100 plus AIB-302/AIB-303 previews.'}
          </p>
        </div>

        {/* Accessible Map / List Toggle */}
        <div
          className="inline-flex rounded-xl border p-1"
          role="group"
          aria-label={lang === 'ar' ? 'طريقة العرض' : 'View format'}
          style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
        >
          <button
            type="button"
            onClick={() => setViewMode('map')}
            aria-pressed={viewMode === 'map'}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold"
            style={{
              backgroundColor: viewMode === 'map' ? 'var(--color-surface-3)' : 'transparent',
              color: viewMode === 'map' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            }}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>{lang === 'ar' ? 'خريطة الفصول' : 'Semester Map'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold"
            style={{
              backgroundColor: viewMode === 'list' ? 'var(--color-surface-3)' : 'transparent',
              color: viewMode === 'list' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            }}
          >
            <List className="h-4 w-4" />
            <span>{lang === 'ar' ? 'قائمة نصية ميسّرة' : 'Accessible List'}</span>
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="space-y-6">
          {([1, 2, 3, 4] as const).map((sem) => {
            const semCourses = COURSES.filter((c) => c.semester === sem);
            const isOpen = openSemesters[sem];
            return (
              <section
                key={sem}
                className="rounded-2xl border p-4 sm:p-6"
                style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
              >
                <button
                  type="button"
                  onClick={() => setOpenSemesters((s) => ({ ...s, [sem]: !s[sem] }))}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 text-start"
                >
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      {SEMESTER_META[sem].title[lang]}
                    </h2>
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {SEMESTER_META[sem].subtitle[lang]}
                    </p>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-accent-text)' }}>
                    {isOpen ? (lang === 'ar' ? 'إخفاء' : 'Collapse') : (lang === 'ar' ? 'عرض' : 'Expand')}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {semCourses.map((course) => {
                      const evalInfo = evaluations[course.code];
                      const status = evalInfo?.status ?? 'not_started';
                      const isActiveFocus = course.code === 'AIB-100';
                      return (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => navigate(`/course/${course.slug}`)}
                          className="flex flex-col justify-between rounded-2xl border p-4 text-start transition-colors hover:opacity-95"
                          style={{
                            backgroundColor: 'var(--color-surface-2)',
                            borderColor: isActiveFocus ? 'var(--color-cyan)' : 'var(--color-border)',
                          }}
                        >
                          <div>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span
                                className="ltr-isolate rounded-md px-2 py-0.5 font-mono text-xs font-bold"
                                style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-accent-text)' }}
                              >
                                {course.code}
                              </span>
                              <StatusBadge status={status} lang={lang} />
                            </div>
                            <h3 className="mt-3 text-sm font-bold leading-snug" style={{ color: 'var(--color-text-primary)' }}>
                              {course.title[lang]}
                            </h3>
                            <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                              {course.purpose[lang]}
                            </p>
                          </div>

                          <div className="mt-4 space-y-1.5 pt-2">
                            {evalInfo && evalInfo.missingRequiredPrereqs.length > 0 && (
                              <p className="text-[11px]" style={{ color: 'var(--color-warning)' }}>
                                {lang === 'ar' ? 'يتطلب: ' : 'Requires: '}
                                <span className="ltr-isolate font-mono">{evalInfo.missingRequiredPrereqs.join(', ')}</span>
                              </p>
                            )}
                            {!evalInfo?.hasPublishedContent && (
                              <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                                {lang === 'ar' ? '• الدروس قيد الإعداد' : '• Lesson content pending'}
                              </p>
                            )}
                            {!course.verifiedSource && (
                              <p className="text-[11px]" style={{ color: 'var(--color-warning)' }}>
                                {lang === 'ar' ? '• بحاجة إلى مراجعة المصدر' : '• Pending source verification'}
                              </p>
                            )}
                            <div className="flex items-center gap-1 pt-1 text-xs font-semibold" style={{ color: 'var(--color-accent-text)' }}>
                              <span>{lang === 'ar' ? 'عرض التفاصيل' : 'Course details'}</span>
                              <ArrowIcon className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        /* Accessible Structured Table/List Alternative */
        <div
          className="overflow-x-auto rounded-2xl border"
          style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
        >
          <table className="w-full border-collapse text-start text-sm">
            <thead>
              <tr className="border-b" style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                <th className="p-3.5 font-semibold">{lang === 'ar' ? 'الرمز' : 'Code'}</th>
                <th className="p-3.5 font-semibold">{lang === 'ar' ? 'المقرر' : 'Course'}</th>
                <th className="p-3.5 font-semibold">{lang === 'ar' ? 'الفصل' : 'Semester'}</th>
                <th className="p-3.5 font-semibold">{lang === 'ar' ? 'المتطلبات' : 'Prerequisites'}</th>
                <th className="p-3.5 font-semibold">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {COURSES.map((course) => (
                <tr key={course.id} className="border-b last:border-b-0" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="ltr-isolate p-3.5 font-mono text-xs font-bold" style={{ color: 'var(--color-accent-text)' }}>
                    {course.code}
                  </td>
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => navigate(`/course/${course.slug}`)}
                      className="font-semibold underline"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {course.title[lang]}
                    </button>
                  </td>
                  <td className="p-3.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {course.semester}
                  </td>
                  <td className="ltr-isolate p-3.5 font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {course.prerequisitesRequired.join(', ') || '—'}
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={evaluations[course.code]?.status ?? 'not_started'} lang={lang} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

import React, { useState } from 'react';
import { FolderKanban, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { PROJECTS } from '../data/lessonsAndProjects';

export const ProjectsPage: React.FC<{ selectedSlug?: string }> = ({ selectedSlug }) => {
  const { lang, navigate, learner, updateProjectProgress } = useAcademy();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const project = selectedSlug ? PROJECTS.find((p) => p.slug === selectedSlug) : undefined;
  const [savedBanner, setSavedBanner] = useState(false);

  if (project) {
    const progress = learner.projects[project.slug] ?? {
      completedMilestones: [],
      completedDeliverables: [],
      artifactUrl: '',
      reflectionNote: '',
    };

    const toggleDeliverable = (key: string) => {
      updateProjectProgress(project.slug, (prev) => {
        const exists = prev.completedDeliverables.includes(key);
        return {
          ...prev,
          completedDeliverables: exists
            ? prev.completedDeliverables.filter((x) => x !== key)
            : [...prev.completedDeliverables, key],
        };
      });
    };

    return (
      <main className="mx-auto max-w-[960px] space-y-6 px-4 py-8 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="text-sm font-semibold underline"
          style={{ color: 'var(--color-accent-text)' }}
        >
          {lang === 'ar' ? '← العودة إلى المشاريع' : '← Back to Projects'}
        </button>

        <section
          className="rounded-2xl border p-6"
          style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border-strong)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="ltr-isolate rounded-lg px-2.5 py-1 font-mono text-xs font-bold" style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-cyan)' }}>
              {project.courseCode}
            </span>
            {!project.verifiedSource && (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs" style={{ backgroundColor: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
                <AlertTriangle className="h-3.5 w-3.5" />
                {lang === 'ar' ? 'متطلبات مبدئية (قيد التحقق)' : 'Draft project brief'}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {project.title[lang]}
          </h1>
          <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--color-text-secondary)' }}>
            {project.summary[lang]}
          </p>

          {/* Milestones & Deliverables */}
          <div className="mt-6 space-y-4">
            <h2 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {lang === 'ar' ? 'محطات التسليم وقائمة التحقق' : 'Milestones & Deliverables'}
            </h2>
            {project.milestones.map((ms) => (
              <div key={ms.id} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {ms.title[lang]}
                </h3>
                <p className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {ms.description[lang]}
                </p>
                <div className="mt-3 space-y-2">
                  {ms.deliverables.map((deliv, i) => {
                    const key = `${ms.id}-${i}`;
                    const checked = progress.completedDeliverables.includes(key);
                    return (
                      <label key={key} className="flex cursor-pointer items-start gap-2.5 text-xs sm:text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDeliverable(key)}
                          className="mt-1 h-4 w-4"
                        />
                        <span style={{ color: checked ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
                          {deliv[lang]}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Rubric */}
          <div className="mt-6 rounded-xl border p-4" style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
            <h2 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {lang === 'ar' ? 'معايير التقييم (Rubric)' : 'Evaluation Rubric'}
            </h2>
            <ul className="mt-2 space-y-1.5 text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {project.rubric.map((r, idx) => (
                <li key={idx}>• {r[lang]}</li>
              ))}
            </ul>
          </div>

          {/* Local Prototype Submission */}
          <div className="mt-6 space-y-3 border-t pt-5" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {lang === 'ar' ? 'توثيق التسليم (حفظ محلي تجريبي فقط)' : 'Local Prototype Submission (Browser Storage Only)'}
            </h2>
            <input
              type="url"
              value={progress.artifactUrl}
              onChange={(e) => {
                setSavedBanner(false);
                updateProjectProgress(project.slug, (prev) => ({ ...prev, artifactUrl: e.target.value }));
              }}
              placeholder="https://github.com/username/aib-100-service"
              className="ltr-isolate w-full rounded-xl border px-3.5 py-2.5 font-mono text-xs sm:text-sm"
              style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
            />
            <textarea
              rows={3}
              value={progress.reflectionNote}
              onChange={(e) => {
                setSavedBanner(false);
                updateProjectProgress(project.slug, (prev) => ({ ...prev, reflectionNote: e.target.value }));
              }}
              placeholder={lang === 'ar' ? 'ملاحظات التنفيذ أو التحديات التي واجهتها...' : 'Implementation notes or lessons learned...'}
              className="w-full rounded-xl border p-3.5 text-sm"
              style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  updateProjectProgress(project.slug, (prev) => ({ ...prev, submittedAt: Date.now() }));
                  setSavedBanner(true);
                }}
                className="brand-gradient-bg inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 text-sm font-bold text-[#07111D]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{lang === 'ar' ? 'حفظ المسودة محلياً' : 'Save Draft Locally'}</span>
              </button>
              {savedBanner && (
                <span className="text-xs font-semibold" style={{ color: 'var(--color-success)' }}>
                  {lang === 'ar' ? 'تم الحفظ في متصفحك (بدون خادم سحابي).' : 'Saved locally in browser storage (no cloud upload).'}
                </span>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1100px] space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--color-text-primary)' }}>
          {lang === 'ar' ? 'مساحات المشاريع الهندسية' : 'Engineering Project Workspaces'}
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {lang === 'ar'
            ? 'حوّل المفاهيم إلى أنظمة منظّمة مع محطات تسليم ومعايير تقييم واضحة.'
            : 'Turn concepts into structured services with milestone deliverables and rubrics.'}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {PROJECTS.map((p) => {
          const done = learner.projects[p.slug]?.completedDeliverables.length ?? 0;
          const total = p.milestones.reduce((acc, m) => acc + m.deliverables.length, 0);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => navigate(`/projects/${p.slug}`)}
              className="flex flex-col justify-between rounded-2xl border p-6 text-start transition-colors hover:opacity-95"
              style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="ltr-isolate rounded-lg px-2.5 py-1 font-mono text-xs font-bold" style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-cyan)' }}>
                    {p.courseCode}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {done}/{total} {lang === 'ar' ? 'مهام' : 'tasks'}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 shrink-0" style={{ color: 'var(--color-violet)' }} />
                  <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {p.title[lang]}
                  </h2>
                </div>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {p.summary[lang]}
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--color-accent-text)' }}>
                <span>{lang === 'ar' ? 'فتح مساحة المشروع' : 'Open Workspace'}</span>
                <ArrowIcon className="h-4 w-4" />
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
};

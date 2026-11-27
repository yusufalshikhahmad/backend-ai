import React, { useState } from 'react';
import { Sun, Moon, Languages, Eye, Trash2, ShieldAlert, Download } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const ProfilePage: React.FC = () => {
  const {
    lang,
    setLang,
    theme,
    setTheme,
    reducedMotion,
    setReducedMotion,
    resetAllProgress,
    learner,
  } = useAcademy();
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const completedBlocksTotal = Object.values(learner.completedBlockIds).reduce((a, b) => a + b.length, 0);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(learner, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-engineering-academy-progress-v${learner.schemaVersion}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-[820px] space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--color-text-primary)' }}>
          {lang === 'ar' ? 'الإعدادات وسهولة الوصول' : 'Settings & Accessibility'}
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {lang === 'ar'
            ? 'خصّص المظهر، اللغة واتجاه الواجهة، وتفضيلات الحركة. تُحفظ جميع البيانات محلياً في متصفحك فقط.'
            : 'Customize theme, language/direction, and motion preferences. All state is stored locally in your browser.'}
        </p>
      </div>

      {/* Theme */}
      <section className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="h-5 w-5" style={{ color: 'var(--color-cyan)' }} /> : <Sun className="h-5 w-5" style={{ color: 'var(--color-warning)' }} />}
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {lang === 'ar' ? 'المظهر (Theme)' : 'Appearance Theme'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {lang === 'ar' ? 'اختر بين المظهر الداكن الهندسي والمظهر الفاتح عالي التباين.' : 'Switch between Graphite Dark and high-contrast Light themes.'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
                className="min-h-[44px] rounded-xl border px-4 text-xs font-semibold sm:text-sm"
                style={{
                  backgroundColor: theme === t ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
                  borderColor: theme === t ? 'var(--color-cyan)' : 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {t === 'dark' ? (lang === 'ar' ? 'داكن' : 'Dark') : (lang === 'ar' ? 'فاتح' : 'Light')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Language & Direction */}
      <section className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Languages className="h-5 w-5" style={{ color: 'var(--color-blue)' }} />
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {lang === 'ar' ? 'اللغة واتجاه الواجهة' : 'Language & Text Direction'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {lang === 'ar' ? 'تبقى الشيفرات والأوامر معزولة بـ LTR في جميع الأوضاع.' : 'Code snippets and shell paths always stay LTR-isolated.'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLang('ar')}
              aria-pressed={lang === 'ar'}
              className="min-h-[44px] rounded-xl border px-4 text-xs font-semibold sm:text-sm"
              style={{
                backgroundColor: lang === 'ar' ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
                borderColor: lang === 'ar' ? 'var(--color-cyan)' : 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              العربية (RTL)
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              className="min-h-[44px] rounded-xl border px-4 text-xs font-semibold sm:text-sm"
              style={{
                backgroundColor: lang === 'en' ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
                borderColor: lang === 'en' ? 'var(--color-cyan)' : 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            >
              English (LTR)
            </button>
          </div>
        </div>
      </section>

      {/* Reduced Motion */}
      <section className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5" style={{ color: 'var(--color-violet)' }} />
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {lang === 'ar' ? 'تقليل الحركة (Reduced Motion)' : 'Reduced Motion'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {lang === 'ar' ? 'يعطّل الانتقالات والحركات غير الضرورية.' : 'Disables non-essential animations and smooth scroll.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={reducedMotion}
            onClick={() => setReducedMotion(!reducedMotion)}
            className="min-h-[44px] rounded-xl border px-4 text-xs font-semibold sm:text-sm"
            style={{
              backgroundColor: reducedMotion ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
              borderColor: reducedMotion ? 'var(--color-cyan)' : 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            {reducedMotion ? (lang === 'ar' ? 'مفعّل' : 'Enabled') : (lang === 'ar' ? 'تلقائي' : 'System default')}
          </button>
        </div>
      </section>

      {/* Local Storage, Export & Reset */}
      <section className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--color-warning)' }} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {lang === 'ar' ? 'بيانات التعلّم المحلية' : 'Local Prototype Storage'}
              </h2>
              <span className="ltr-isolate font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                schema v{learner.schemaVersion}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {lang === 'ar'
                ? `خطوات مكتملة: ${completedBlocksTotal} • مختبرات: ${learner.completedLabs.length} • محاولات تحقق: ${Object.keys(learner.attempts).length}. لا يوجد خادم أو مزامنة سحابية في هذه النسخة.`
                : `Completed blocks: ${completedBlocksTotal} • Labs: ${learner.completedLabs.length} • Attempts: ${Object.keys(learner.attempts).length}. Stored strictly in localStorage.`}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 text-xs font-semibold sm:text-sm"
                style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
              >
                <Download className="h-4 w-4" />
                <span>{lang === 'ar' ? 'تصدير التقدم (JSON)' : 'Export Progress (JSON)'}</span>
              </button>

              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmReset(true);
                    setResetDone(false);
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 text-xs font-semibold sm:text-sm"
                  style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-error)' }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{lang === 'ar' ? 'إعادة ضبط التقدم المحلي' : 'Reset Local Progress'}</span>
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetAllProgress();
                      setConfirmReset(false);
                      setResetDone(true);
                    }}
                    className="min-h-[44px] rounded-xl px-4 text-xs font-bold text-white"
                    style={{ backgroundColor: 'var(--color-error)' }}
                  >
                    {lang === 'ar' ? 'تأكيد المسح' : 'Confirm Reset'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="min-h-[44px] rounded-xl border px-4 text-xs font-semibold"
                    style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              )}

              {resetDone && (
                <span className="text-xs font-semibold" style={{ color: 'var(--color-success)' }}>
                  {lang === 'ar' ? 'تم مسح التقدم المحلي بنجاح.' : 'Local progress cleared.'}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

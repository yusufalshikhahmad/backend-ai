import React from 'react';
import { FileQuestion, ArrowLeft, ArrowRight } from 'lucide-react';
import { Language } from '../types/academy';
import { useAcademy } from '../context/AcademyContext';

interface NotFoundStateProps {
  lang: Language;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  primaryCtaPath?: string;
  primaryCtaAr?: string;
  primaryCtaEn?: string;
}

export const NotFoundState: React.FC<NotFoundStateProps> = ({
  lang,
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  primaryCtaPath = '/learn',
  primaryCtaAr = 'العودة إلى خريطة المنهج',
  primaryCtaEn = 'Back to Curriculum Map',
}) => {
  const { navigate } = useAcademy();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <main className="mx-auto max-w-[680px] px-4 py-14 text-center sm:px-6">
      <div
        className="rounded-2xl border p-7 sm:p-9"
        style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border-strong)' }}
      >
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-warning)' }}
        >
          <FileQuestion className="h-6 w-6" />
        </div>
        <p
          className="ltr-isolate mt-4 font-mono text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--color-warning)' }}
        >
          404 • Not Found
        </p>
        <h1 className="mt-2 text-xl font-bold sm:text-2xl" style={{ color: 'var(--color-text-primary)' }}>
          {lang === 'ar' ? titleAr : titleEn}
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {lang === 'ar' ? descriptionAr : descriptionEn}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(primaryCtaPath)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 text-sm font-bold"
            style={{ backgroundColor: 'var(--color-action-primary)', color: 'var(--color-action-primary-fg)' }}
          >
            <span>{lang === 'ar' ? primaryCtaAr : primaryCtaEn}</span>
            <ArrowIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex min-h-[44px] items-center rounded-full border px-5 text-sm font-semibold"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </button>
        </div>
      </div>
    </main>
  );
};

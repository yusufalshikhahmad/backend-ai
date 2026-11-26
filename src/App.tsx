import React from 'react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { CurriculumMapPage } from './pages/CurriculumMapPage';
import { LessonPlayerPage } from './pages/LessonPlayerPage';
import { LabPage } from './pages/LabPage';
import { ReviewPage } from './pages/ReviewPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProfilePage } from './pages/ProfilePage';

const AppRouter: React.FC = () => {
  const { route, lang, navigate } = useAcademy();

  const renderPage = () => {
    if (route === '/' || route === '') {
      return <HomePage />;
    }
    if (route === '/dashboard') {
      return <DashboardPage />;
    }
    if (route === '/learn') {
      return <CurriculumMapPage />;
    }
    if (route.startsWith('/course/')) {
      const slug = route.replace('/course/', '').split('/')[0];
      return <CurriculumMapPage selectedSlug={slug} />;
    }
    if (route.startsWith('/lesson/')) {
      const slug = route.replace('/lesson/', '').split('/')[0];
      return <LessonPlayerPage slug={slug} />;
    }
    if (route.startsWith('/lab/')) {
      const slug = route.replace('/lab/', '').split('/')[0];
      return <LabPage slug={slug} />;
    }
    if (route === '/review') {
      return <ReviewPage />;
    }
    if (route === '/projects') {
      return <ProjectsPage />;
    }
    if (route.startsWith('/projects/')) {
      const slug = route.replace('/projects/', '').split('/')[0];
      return <ProjectsPage selectedSlug={slug} />;
    }
    if (route === '/profile') {
      return <ProfilePage />;
    }

    return (
      <main className="mx-auto max-w-[680px] px-4 py-16 text-center">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {lang === 'ar' ? 'الصفحة غير موجودة' : 'Route Not Found'}
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {lang === 'ar' ? 'المسار المطلوب غير متاح في هذه النسخة الأولية.' : 'The requested route is not available in this prototype.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-6 inline-flex min-h-[44px] items-center rounded-full px-6 text-sm font-bold"
          style={{ backgroundColor: 'var(--color-action-primary)', color: 'var(--color-action-primary-fg)' }}
        >
          {lang === 'ar' ? 'العودة إلى الرئيسية' : 'Return Home'}
        </button>
      </main>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{renderPage()}</div>
      <footer
        className="border-t px-4 py-5 text-center text-xs"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
      >
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 px-2">
          <span className="ltr-isolate font-mono">AI Engineering Academy • Interactive Prototype</span>
          <span>
            {lang === 'ar'
              ? 'الطرفية والتقدّم يعملان محلياً في المتصفح (Safe Sandbox & localStorage)'
              : 'Terminal sandbox & progress run locally in-browser (no arbitrary shell)'}
          </span>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AcademyProvider>
      <AppRouter />
    </AcademyProvider>
  );
};

export default App;

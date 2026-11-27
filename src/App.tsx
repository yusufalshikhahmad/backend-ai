import React from 'react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { Navbar } from './components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotFoundState } from './components/NotFoundState';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { CurriculumMapPage } from './pages/CurriculumMapPage';
import { LessonPlayerPage } from './pages/LessonPlayerPage';
import { LabPage } from './pages/LabPage';
import { ReviewPage } from './pages/ReviewPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProfilePage } from './pages/ProfilePage';

const AppRouter: React.FC = () => {
  const { route, lang } = useAcademy();

  const renderPage = () => {
    const cleanRoute = route.length > 1 && route.endsWith('/') ? route.slice(0, -1) : route;

    if (cleanRoute === '/' || cleanRoute === '') {
      return <HomePage />;
    }
    if (cleanRoute === '/dashboard') {
      return <DashboardPage />;
    }
    if (cleanRoute === '/learn') {
      return <CurriculumMapPage />;
    }
    if (cleanRoute.startsWith('/course/')) {
      const slug = cleanRoute.slice('/course/'.length);
      if (slug && !slug.includes('/')) {
        return <CurriculumMapPage selectedSlug={slug} />;
      }
    }
    if (cleanRoute.startsWith('/lesson/')) {
      const slug = cleanRoute.slice('/lesson/'.length);
      if (slug && !slug.includes('/')) {
        return <LessonPlayerPage slug={slug} />;
      }
    }
    if (cleanRoute.startsWith('/lab/')) {
      const slug = cleanRoute.slice('/lab/'.length);
      if (slug && !slug.includes('/')) {
        return <LabPage slug={slug} />;
      }
    }
    if (cleanRoute === '/review') {
      return <ReviewPage />;
    }
    if (cleanRoute === '/projects') {
      return <ProjectsPage />;
    }
    if (cleanRoute.startsWith('/projects/')) {
      const slug = cleanRoute.slice('/projects/'.length);
      if (slug && !slug.includes('/')) {
        return <ProjectsPage selectedSlug={slug} />;
      }
    }
    if (cleanRoute === '/profile') {
      return <ProfilePage />;
    }

    return (
      <NotFoundState
        lang={lang}
        titleAr="الصفحة المطلوبة غير موجودة"
        titleEn="Page Not Found"
        descriptionAr={`المسار "${route}" غير متاح في هذه النسخة الأولية (Prototype 0.1).`}
        descriptionEn={`The route "${route}" does not exist in this prototype.`}
        primaryCtaPath="/"
        primaryCtaAr="العودة إلى الرئيسية"
        primaryCtaEn="Return Home"
      />
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ErrorBoundary>
        <div className="flex-1">{renderPage()}</div>
      </ErrorBoundary>
      <footer
        className="border-t px-4 py-5 text-center text-xs"
        style={{
          backgroundColor: 'var(--color-surface-1)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
      >
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 px-2">
          <span className="ltr-isolate font-mono">AI Engineering Academy • Prototype 0.1 (Stage 1 Stabilized)</span>
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

import React, { useState } from 'react';
import {
  Compass,
  Terminal,
  FolderKanban,
  RotateCcw,
  LayoutDashboard,
  Settings,
  Sun,
  Moon,
  Languages,
  Menu,
  X,
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const Navbar: React.FC = () => {
  const { lang, toggleLang, theme, toggleTheme, route, navigate } = useAcademy();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      path: '/learn',
      label: lang === 'ar' ? 'المسار' : 'Curriculum',
      icon: Compass,
      match: (r: string) => r.startsWith('/learn') || r.startsWith('/course') || r.startsWith('/lesson'),
    },
    {
      path: '/lab/linux-aib100',
      label: lang === 'ar' ? 'المختبرات' : 'Labs',
      icon: Terminal,
      match: (r: string) => r.startsWith('/lab'),
    },
    {
      path: '/projects',
      label: lang === 'ar' ? 'المشاريع' : 'Projects',
      icon: FolderKanban,
      match: (r: string) => r.startsWith('/projects'),
    },
    {
      path: '/review',
      label: lang === 'ar' ? 'المراجعة' : 'Review',
      icon: RotateCcw,
      match: (r: string) => r.startsWith('/review'),
    },
    {
      path: '/dashboard',
      label: lang === 'ar' ? 'لوحة التعلم' : 'Dashboard',
      icon: LayoutDashboard,
      match: (r: string) => r.startsWith('/dashboard'),
    },
  ];

  const handleNav = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(11, 13, 18, 0.86)' : 'rgba(245, 247, 251, 0.9)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <button
          type="button"
          onClick={() => handleNav('/')}
          className="flex min-h-[44px] items-center gap-3 rounded-xl px-2 text-start transition-opacity hover:opacity-90"
        >
          <span
            aria-hidden="true"
            className="brand-gradient-bg flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-[#07111D]"
          >
            AE
          </span>
          <span className="flex flex-col">
            <span className="ltr-isolate whitespace-nowrap text-xs font-bold tracking-tight sm:text-base" style={{ color: 'var(--color-text-primary)' }}>
              AI Engineering Academy
            </span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Primary navigation'} className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.match(route);
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item.path)}
                aria-current={active ? 'page' : undefined}
                className="flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: active ? 'var(--color-surface-2)' : 'transparent',
                  color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  border: active ? '1px solid var(--color-border)' : '1px solid transparent',
                }}
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: active ? 'var(--color-accent-text)' : 'currentColor' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={lang === 'ar' ? 'Switch to English (LTR)' : 'التبديل إلى العربية (RTL)'}
            title={lang === 'ar' ? 'English' : 'العربية'}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl border px-2.5 text-xs font-semibold transition-colors"
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark'
                ? lang === 'ar'
                  ? 'التبديل إلى المظهر الفاتح'
                  : 'Switch to light theme'
                : lang === 'ar'
                  ? 'التبديل إلى المظهر الداكن'
                  : 'Switch to dark theme'
            }
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border transition-colors"
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleNav('/profile')}
            aria-label={lang === 'ar' ? 'الإعدادات والتفضيلات' : 'Settings & accessibility'}
            aria-current={route === '/profile' ? 'page' : undefined}
            className="hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border transition-colors sm:flex"
            style={{
              backgroundColor: route === '/profile' ? 'var(--color-surface-2)' : 'var(--color-surface-1)',
              borderColor: route === '/profile' ? 'var(--color-border-strong)' : 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <Settings className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={lang === 'ar' ? 'قائمة التنقل' : 'Navigation menu'}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border md:hidden"
            style={{
              backgroundColor: 'var(--color-surface-1)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="border-t px-4 py-3 md:hidden"
          style={{
            backgroundColor: 'var(--color-surface-1)',
            borderColor: 'var(--color-border)',
          }}
        >
          <nav aria-label={lang === 'ar' ? 'التنقل على الجوال' : 'Mobile navigation'} className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.match(route);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNav(item.path)}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-medium"
                  style={{
                    backgroundColor: active ? 'var(--color-surface-2)' : 'transparent',
                    color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleNav('/profile')}
              className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-sm font-medium"
              style={{
                backgroundColor: route === '/profile' ? 'var(--color-surface-2)' : 'transparent',
                color: 'var(--color-text-secondary)',
              }}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span>{lang === 'ar' ? 'الإعدادات وسهولة الوصول' : 'Settings & Accessibility'}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

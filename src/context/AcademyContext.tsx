import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Language, ThemeMode, LearnerState, AttemptRecord, ProjectProgress } from '../types/academy';
import {
  DEFAULT_LEARNER_STATE,
  loadLearnerState,
  saveLearnerState,
  clearLearnerState,
  computeNextAttempt,
} from '../state/learnerStore';

interface AcademyContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  route: string;
  navigate: (to: string) => void;
  learner: LearnerState;
  markBlockCompleted: (lessonSlug: string, blockId: string) => void;
  setLastLessonBlock: (lessonSlug: string, index: number) => void;
  recordAttempt: (
    questionId: string,
    correctness: 'correct' | 'partial' | 'incorrect',
    hintCount: number,
    assessmentMode?: 'objective' | 'self_rubric'
  ) => AttemptRecord;
  markLabCompleted: (labSlug: string) => void;
  saveReflection: (lessonSlug: string, text: string) => void;
  updateProjectProgress: (projectSlug: string, updater: (prev: ProjectProgress) => ProjectProgress) => void;
  loadDemoReviewItems: () => void;
  clearDemoReviewItems: () => void;
  resetAllProgress: () => void;
}

const AcademyContext = createContext<AcademyContextValue | null>(null);

export const AcademyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = window.localStorage.getItem('ai_eng_lang');
      return saved === 'en' ? 'en' : 'ar';
    } catch {
      return 'ar';
    }
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = window.localStorage.getItem('ai_eng_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem('ai_eng_reduced_motion') === 'true';
    } catch {
      return false;
    }
  });

  const [route, setRoute] = useState<string>(() => window.location.pathname || '/');
  const [learner, setLearner] = useState<LearnerState>(() => loadLearnerState());

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      window.localStorage.setItem('ai_eng_lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('dark', 'light');
    html.classList.add(theme);
    try {
      window.localStorage.setItem('ai_eng_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    const html = document.documentElement;
    if (reducedMotion) {
      html.classList.add('reduced-motion');
    } else {
      html.classList.remove('reduced-motion');
    }
    try {
      window.localStorage.setItem('ai_eng_reduced_motion', String(reducedMotion));
    } catch {
      // ignore
    }
  }, [reducedMotion]);

  useEffect(() => {
    const onPopState = () => {
      setRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const base = 'AI Engineering Academy';
    if (route === '/' || route === '') {
      document.title = lang === 'ar' ? `${base} — منصة تعليم هندسة الذكاء الاصطناعي` : base;
    } else if (route.startsWith('/learn') || route.startsWith('/course/')) {
      document.title = lang === 'ar' ? `خريطة المنهج | ${base}` : `Curriculum Map | ${base}`;
    } else if (route.startsWith('/lesson/')) {
      document.title = lang === 'ar' ? `الدرس التفاعلي | ${base}` : `Lesson Player | ${base}`;
    } else if (route.startsWith('/lab/')) {
      document.title = lang === 'ar' ? `المختبر التفاعلي | ${base}` : `Interactive Lab | ${base}`;
    } else if (route.startsWith('/review')) {
      document.title = lang === 'ar' ? `المراجعة ونقاط التحقق | ${base}` : `Checkpoints & Review | ${base}`;
    } else if (route.startsWith('/projects')) {
      document.title = lang === 'ar' ? `المشاريع الهندسية | ${base}` : `Projects | ${base}`;
    } else if (route.startsWith('/dashboard')) {
      document.title = lang === 'ar' ? `لوحة التعلم | ${base}` : `Dashboard | ${base}`;
    } else if (route.startsWith('/profile')) {
      document.title = lang === 'ar' ? `الإعدادات | ${base}` : `Settings | ${base}`;
    }
  }, [route, lang]);

  const navigate = useCallback((to: string) => {
    if (to === route) {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
      return;
    }
    window.history.pushState({}, '', to);
    setRoute(to);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route, reducedMotion]);

  const updateLearner = useCallback((updater: (prev: LearnerState) => LearnerState) => {
    setLearner((prev) => {
      const next = updater(prev);
      saveLearnerState(next);
      return next;
    });
  }, []);

  const markBlockCompleted = useCallback((lessonSlug: string, blockId: string) => {
    updateLearner((prev) => {
      const existing = prev.completedBlockIds[lessonSlug] ?? [];
      if (existing.includes(blockId)) {
        return { ...prev, lastVisitedLessonSlug: lessonSlug };
      }
      return {
        ...prev,
        lastVisitedLessonSlug: lessonSlug,
        completedBlockIds: {
          ...prev.completedBlockIds,
          [lessonSlug]: [...existing, blockId],
        },
      };
    });
  }, [updateLearner]);

  const setLastLessonBlock = useCallback((lessonSlug: string, index: number) => {
    updateLearner((prev) => ({
      ...prev,
      lastVisitedLessonSlug: lessonSlug,
      lastVisitedBlockIndex: {
        ...prev.lastVisitedBlockIndex,
        [lessonSlug]: index,
      },
    }));
  }, [updateLearner]);

  const recordAttempt = useCallback((
    questionId: string,
    correctness: 'correct' | 'partial' | 'incorrect',
    hintCount: number,
    assessmentMode: 'objective' | 'self_rubric' = 'objective'
  ): AttemptRecord => {
    let created!: AttemptRecord;
    updateLearner((prev) => {
      created = computeNextAttempt(
        questionId,
        correctness,
        hintCount,
        prev.attempts[questionId],
        assessmentMode
      );
      return {
        ...prev,
        attempts: {
          ...prev.attempts,
          [questionId]: created,
        },
      };
    });
    return created;
  }, [updateLearner]);

  const markLabCompleted = useCallback((labSlug: string) => {
    updateLearner((prev) => {
      if (prev.completedLabs.includes(labSlug)) return prev;
      return {
        ...prev,
        completedLabs: [...prev.completedLabs, labSlug],
      };
    });
  }, [updateLearner]);

  const saveReflection = useCallback((lessonSlug: string, text: string) => {
    updateLearner((prev) => ({
      ...prev,
      reflections: {
        ...prev.reflections,
        [lessonSlug]: text,
      },
    }));
  }, [updateLearner]);

  const updateProjectProgress = useCallback((
    projectSlug: string,
    updater: (prev: ProjectProgress) => ProjectProgress
  ) => {
    updateLearner((prev) => {
      const current: ProjectProgress = prev.projects[projectSlug] ?? {
        completedMilestones: [],
        completedDeliverables: [],
        artifactUrl: '',
        reflectionNote: '',
      };
      return {
        ...prev,
        projects: {
          ...prev.projects,
          [projectSlug]: updater(current),
        },
      };
    });
  }, [updateLearner]);

  const loadDemoReviewItems = useCallback(() => {
    const now = Date.now();
    updateLearner((prev) => ({
      ...prev,
      demoReviewLoaded: true,
      attempts: {
        ...prev.attempts,
        'q-aib100-relative-absolute': prev.attempts['q-aib100-relative-absolute'] ?? {
          questionId: 'q-aib100-relative-absolute',
          correctness: 'incorrect',
          assessmentMode: 'objective',
          hintCount: 1,
          timestamp: now - 3600 * 1000,
          nextReviewAt: now - 1000,
          intervalDays: 0,
          isDemo: true,
        },
        'q-aib100-project-scaffold-order': prev.attempts['q-aib100-project-scaffold-order'] ?? {
          questionId: 'q-aib100-project-scaffold-order',
          correctness: 'partial',
          assessmentMode: 'objective',
          hintCount: 1,
          timestamp: now - 7200 * 1000,
          nextReviewAt: now - 500,
          intervalDays: 0,
          isDemo: true,
        },
      },
    }));
  }, [updateLearner]);

  const clearDemoReviewItems = useCallback(() => {
    updateLearner((prev) => {
      const nextAttempts: LearnerState['attempts'] = {};
      for (const [k, v] of Object.entries(prev.attempts)) {
        if (!v.isDemo) nextAttempts[k] = v;
      }
      return {
        ...prev,
        demoReviewLoaded: false,
        attempts: nextAttempts,
      };
    });
  }, [updateLearner]);

  const resetAllProgress = useCallback(() => {
    clearLearnerState();
    setLearner({ ...DEFAULT_LEARNER_STATE });
  }, []);

  return (
    <AcademyContext.Provider
      value={{
        lang,
        setLang: setLangState,
        toggleLang: () => setLangState((l) => (l === 'ar' ? 'en' : 'ar')),
        theme,
        setTheme: setThemeState,
        toggleTheme: () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
        reducedMotion,
        setReducedMotion: setReducedMotionState,
        route,
        navigate,
        learner,
        markBlockCompleted,
        setLastLessonBlock,
        recordAttempt,
        markLabCompleted,
        saveReflection,
        updateProjectProgress,
        loadDemoReviewItems,
        clearDemoReviewItems,
        resetAllProgress,
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export function useAcademy(): AcademyContextValue {
  const ctx = useContext(AcademyContext);
  if (!ctx) throw new Error('useAcademy must be used within AcademyProvider');
  return ctx;
}

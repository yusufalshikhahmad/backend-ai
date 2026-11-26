export type Language = 'ar' | 'en';
export type ThemeMode = 'dark' | 'light';

export type CourseStatus =
  | 'not_started'
  | 'available'
  | 'in_progress'
  | 'practiced'
  | 'mastered'
  | 'locked';

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface CourseModule {
  id: string;
  title: LocalizedText;
  lessonSlug?: string;
  labSlug?: string;
  estimatedMinutes: number;
}

export interface Course {
  id: string;
  code: string;
  slug: string;
  semester: 1 | 2 | 3 | 4;
  title: LocalizedText;
  purpose: LocalizedText;
  prerequisitesRequired: string[];
  prerequisitesRecommended: string[];
  verifiedSource: boolean;
  modules: CourseModule[];
  primaryLessonSlug?: string;
  primaryLabSlug?: string;
}

export type BlockType =
  | 'outcome'
  | 'text'
  | 'callout'
  | 'diagram'
  | 'code'
  | 'prediction'
  | 'terminal_sim'
  | 'quiz'
  | 'reflection'
  | 'source';

export interface LessonBlock {
  id: string;
  type: BlockType;
  title: LocalizedText;
  body?: LocalizedText;
  items?: LocalizedText[];
  calloutTone?: 'info' | 'warning' | 'tip';
  code?: string;
  language?: string;
  diagramId?: 'linux-tree' | 'rag-flow' | 'agent-loop';
  predictionConfig?: {
    prompt: LocalizedText;
    snippet: string;
    options: LocalizedText[];
    correctIndex: number;
    hint: LocalizedText;
    explanation: LocalizedText;
  };
  terminalConfig?: {
    goal: LocalizedText;
    expectedPath?: string;
    requiredFiles?: string[];
    requiredCommands?: string[];
    hints: LocalizedText[];
  };
  quizQuestionId?: string;
}

export interface Lesson {
  id: string;
  slug: string;
  courseCode: string;
  courseSlug: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  estimatedMinutes: number;
  verifiedSource: boolean;
  sourceRef: LocalizedText;
  blocks: LessonBlock[];
  nextLessonSlug?: string;
  nextLabSlug?: string;
}

export type QuestionType = 'single_choice' | 'multiple_select' | 'ordering' | 'short_answer';

export interface QuizQuestion {
  id: string;
  lessonId: string;
  courseCode: string;
  type: QuestionType;
  difficulty: 'foundational' | 'applied' | 'architectural';
  skillTags: string[];
  sourceRef: string;
  prompt: LocalizedText;
  options?: LocalizedText[];
  correctIndices?: number[]; // For single_choice ([idx]) or multiple_select ([i1, i2]) or ordering (target index order)
  rubricChecklist?: LocalizedText[]; // For short_answer self-rubric
  hints: [LocalizedText, LocalizedText];
  explanation: LocalizedText;
  misconceptionNote: LocalizedText;
}

export interface AttemptRecord {
  questionId: string;
  correctness: 'correct' | 'partial' | 'incorrect';
  hintCount: number;
  timestamp: number;
  nextReviewAt: number;
  intervalDays: number;
  isDemo?: boolean;
}

export interface ProjectMilestone {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  deliverables: LocalizedText[];
}

export interface ProjectBrief {
  id: string;
  slug: string;
  courseCode: string;
  title: LocalizedText;
  summary: LocalizedText;
  verifiedSource: boolean;
  prerequisites: string[];
  milestones: ProjectMilestone[];
  rubric: LocalizedText[];
}

export interface ProjectProgress {
  completedMilestones: string[];
  completedDeliverables: string[];
  artifactUrl: string;
  reflectionNote: string;
  submittedAt?: number;
}

export interface LearnerState {
  completedBlockIds: Record<string, string[]>; // lessonSlug -> blockIds
  lastVisitedLessonSlug: string;
  lastVisitedBlockIndex: Record<string, number>;
  reflections: Record<string, string>;
  attempts: Record<string, AttemptRecord>;
  completedLabs: string[];
  projects: Record<string, ProjectProgress>;
  demoReviewLoaded: boolean;
}

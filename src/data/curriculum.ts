import { Course, LocalizedText } from '../types/academy';

export const SEMESTER_META: Record<1 | 2 | 3 | 4, { title: LocalizedText; subtitle: LocalizedText }> = {
  1: {
    title: { ar: 'الفصل الأول — الأساسيات', en: 'Semester 1 — Foundations' },
    subtitle: {
      ar: 'بيئة Linux، أساسيات Python والبرمجة الاحترافية، والرياضيات الهندسية',
      en: 'Linux environment, Python fundamentals & clean engineering, and math foundations',
    },
  },
  2: {
    title: { ar: 'الفصل الثاني — البيانات وتعلم الآلة', en: 'Semester 2 — Data & Machine Learning' },
    subtitle: {
      ar: 'الاحتمالات والإحصاء، هندسة البيانات، تعلم الآلة، والتعلم العميق بـ PyTorch',
      en: 'Probability & statistics, data pipelines, classical ML, and Deep Learning with PyTorch',
    },
  },
  3: {
    title: { ar: 'الفصل الثالث — الأنظمة الخلفية والنماذج اللغوية', en: 'Semester 3 — Modern AI & Backend' },
    subtitle: {
      ar: 'بنية Transformers، واجهات FastAPI الخلفية، وتطبيقات LLM و RAG',
      en: 'Transformers architecture, FastAPI backend services, and LLM / RAG applications',
    },
  },
  4: {
    title: { ar: 'الفصل الرابع — هندسة الإنتاج والتخرج', en: 'Semester 4 — Production Engineering' },
    subtitle: {
      ar: 'الوكلاء و MCP، تقديم النماذج، MLOps، أمن الذكاء الاصطناعي، ومشروع التخرج',
      en: 'AI Agents & MCP, inference serving, MLOps, AI security, and Capstone',
    },
  },
};

export const COURSES: Course[] = [
  {
    id: 'aib-100',
    code: 'AIB-100',
    slug: 'linux-environment',
    semester: 1,
    title: {
      ar: 'بيئة Linux لهندسة الذكاء الاصطناعي',
      en: 'Linux Environment for AI Engineering',
    },
    purpose: {
      ar: 'إتقان الطرفية، نظام الملفات، الصلاحيات، المتغيرات البيئية، وإدارة العمليات لبناء خدمات AI موثوقة.',
      en: 'Master the shell, filesystem hierarchy, permissions, environment variables, and process management for AI services.',
    },
    prerequisitesRequired: [],
    prerequisitesRecommended: [],
    verifiedSource: true,
    primaryLessonSlug: 'aib-100-linux-files-terminal',
    primaryLabSlug: 'linux-aib100',
    modules: [
      {
        id: 'aib-100-m1',
        title: { ar: 'الطرفية ونظام الملفات في Linux', en: 'Shell & Filesystem Navigation' },
        lessonSlug: 'aib-100-linux-files-terminal',
        labSlug: 'linux-aib100',
        estimatedMinutes: 18,
      },
      {
        id: 'aib-100-m2',
        title: { ar: 'الصلاحيات، المتغيرات البيئية، والـ Pipes', en: 'Permissions, Env Vars & Pipes (بحاجة إلى مراجعة المصدر)' },
        estimatedMinutes: 25,
      },
    ],
  },
  {
    id: 'aib-101',
    code: 'AIB-101',
    slug: 'python-fundamentals',
    semester: 1,
    title: { ar: 'أساسيات Python', en: 'Python Fundamentals' },
    purpose: {
      ar: 'هياكل البيانات، الدوال، التعامل مع الملفات و JSON، وكتابة سكربتات نظيفة في بيئة Linux.',
      en: 'Core data structures, functions, file/JSON handling, and clean scripting on Linux.',
    },
    prerequisitesRequired: ['AIB-100'],
    prerequisitesRecommended: [],
    verifiedSource: false,
    modules: [
      { id: 'aib-101-m1', title: { ar: 'أنواع البيانات والتحكم بالتدفق', en: 'Types & Control Flow' }, estimatedMinutes: 20 },
      { id: 'aib-101-m2', title: { ar: 'الدوال، الوحدات، و JSON', en: 'Functions, Modules & JSON' }, estimatedMinutes: 25 },
    ],
  },
  {
    id: 'aib-102',
    code: 'AIB-102',
    slug: 'professional-python',
    semester: 1,
    title: { ar: 'بايثون الاحترافية لهندسة البرمجيات', en: 'Professional Python' },
    purpose: {
      ar: 'Type hints، البيئات الافتراضية، الاختبارات بـ pytest، التسجيل (logging)، وهيكلة الحزم.',
      en: 'Type hints, virtualenvs, pytest testing, structured logging, and package structure.',
    },
    prerequisitesRequired: ['AIB-101'],
    prerequisitesRecommended: [],
    verifiedSource: false,
    modules: [
      { id: 'aib-102-m1', title: { ar: 'Type Hints و Pydantic', en: 'Type Hints & Data Validation' }, estimatedMinutes: 25 },
      { id: 'aib-102-m2', title: { ar: 'الاختبارات والبيئات المعزولة', en: 'Testing & Virtual Environments' }, estimatedMinutes: 30 },
    ],
  },
  {
    id: 'aib-110',
    code: 'AIB-110',
    slug: 'linear-algebra-calculus',
    semester: 1,
    title: { ar: 'الجبر الخطي والتفاضل للذكاء الاصطناعي', en: 'Linear Algebra & Calculus for AI' },
    purpose: {
      ar: 'المتجهات، المصفوفات، الضرب النقطي لتشابه Embeddings، والتدرّج (Gradients) للتدريب.',
      en: 'Vectors, matrices, dot-product similarity for embeddings, and gradients for optimization.',
    },
    prerequisitesRequired: [],
    prerequisitesRecommended: ['AIB-101'],
    verifiedSource: false,
    modules: [
      { id: 'aib-110-m1', title: { ar: 'المتجهات وتشابه جيب التمام', en: 'Vectors & Cosine Similarity' }, estimatedMinutes: 22 },
    ],
  },
  {
    id: 'aib-111',
    code: 'AIB-111',
    slug: 'probability-statistics',
    semester: 2,
    title: { ar: 'الاحتمالات والإحصاء', en: 'Probability & Statistics' },
    purpose: {
      ar: 'التوزيعات الاحتمالية، تقييم النماذج، وقياس عدم اليقين في الأنظمة الإحصائية.',
      en: 'Probability distributions, model evaluation metrics, and uncertainty quantification.',
    },
    prerequisitesRequired: ['AIB-110'],
    prerequisitesRecommended: ['AIB-101'],
    verifiedSource: false,
    modules: [
      { id: 'aib-111-m1', title: { ar: 'التوزيعات واختبارات الثقة', en: 'Distributions & Confidence' }, estimatedMinutes: 25 },
    ],
  },
  {
    id: 'aib-120',
    code: 'AIB-120',
    slug: 'data-engineering',
    semester: 2,
    title: { ar: 'هندسة البيانات', en: 'Data Engineering' },
    purpose: {
      ar: 'خطوط معالجة البيانات (ETL)، جودة البيانات، التنسيقات العمودية، وقواعد البيانات.',
      en: 'ETL pipelines, data quality checks, columnar formats, and relational/vector storage.',
    },
    prerequisitesRequired: ['AIB-102'],
    prerequisitesRecommended: [],
    verifiedSource: false,
    modules: [
      { id: 'aib-120-m1', title: { ar: 'تصميم خطوط معالجة البيانات', en: 'Pipeline Architecture & Quality' }, estimatedMinutes: 28 },
    ],
  },
  {
    id: 'aib-201',
    code: 'AIB-201',
    slug: 'machine-learning',
    semester: 2,
    title: { ar: 'تعلم الآلة', en: 'Machine Learning' },
    purpose: {
      ar: 'التعلم الخاضع للإشراف، موازنة التحيز والتباين، ومقاييس الأداء العملية.',
      en: 'Supervised learning, bias-variance tradeoffs, and production evaluation metrics.',
    },
    prerequisitesRequired: ['AIB-111', 'AIB-120'],
    prerequisitesRecommended: [],
    verifiedSource: false,
    modules: [
      { id: 'aib-201-m1', title: { ar: 'حدود القرار ومقاييس التقييم', en: 'Decision Boundaries & Metrics' }, estimatedMinutes: 30 },
    ],
  },
  {
    id: 'aib-202',
    code: 'AIB-202',
    slug: 'deep-learning-pytorch',
    semester: 2,
    title: { ar: 'التعلم العميق باستخدام PyTorch', en: 'Deep Learning with PyTorch' },
    purpose: {
      ar: 'الموترات (Tensors)، الانتشار العكسي، وبناء وتدريب الشبكات العصبية.',
      en: 'Tensors, autograd backpropagation, and building neural architectures in PyTorch.',
    },
    prerequisitesRequired: ['AIB-201'],
    prerequisitesRecommended: ['AIB-110'],
    verifiedSource: false,
    modules: [
      { id: 'aib-202-m1', title: { ar: 'أبعاد الموترات والانتشار العكسي', en: 'Tensor Shapes & Backprop' }, estimatedMinutes: 30 },
    ],
  },
  {
    id: 'aib-203',
    code: 'AIB-203',
    slug: 'transformers-llm-foundations',
    semester: 3,
    title: { ar: 'أسس المحولات والنماذج اللغوية', en: 'Transformers & LLM Foundations' },
    purpose: {
      ar: 'آلية الانتباه (Attention)، التقطيع (Tokenization)، ونافذة السياق وحدود التوليد.',
      en: 'Self-attention, tokenization, context windows, and decoding dynamics.',
    },
    prerequisitesRequired: ['AIB-202'],
    prerequisitesRecommended: [],
    verifiedSource: false,
    modules: [
      { id: 'aib-203-m1', title: { ar: 'التقطيع والانتباه الذاتي', en: 'Tokenization & Self-Attention' }, estimatedMinutes: 25 },
    ],
  },
  {
    id: 'aib-301',
    code: 'AIB-301',
    slug: 'fastapi-backend',
    semester: 3,
    title: { ar: 'هندسة الأنظمة الخلفية بـ FastAPI', en: 'FastAPI Backend Engineering' },
    purpose: {
      ar: 'بناء واجهات REST و Streaming غير متزامنة، التحقق الصارم، وإدارة الأخطاء والمراقبة.',
      en: 'Async REST & streaming APIs, strict schema validation, error handling, and observability.',
    },
    prerequisitesRequired: ['AIB-102'],
    prerequisitesRecommended: ['AIB-100'],
    verifiedSource: false,
    modules: [
      { id: 'aib-301-m1', title: { ar: 'دورة حياة الطلب في FastAPI', en: 'Request Lifecycle & Async' }, estimatedMinutes: 28 },
    ],
  },
  {
    id: 'aib-302',
    code: 'AIB-302',
    slug: 'llm-applications-rag',
    semester: 3,
    title: { ar: 'تطبيقات النماذج اللغوية و RAG', en: 'LLM Applications & RAG' },
    purpose: {
      ar: 'تقطيع المستندات، التضمين، الاسترجاع الدلالي، الإسناد المرجعي، وتقييم الاسترجاع.',
      en: 'Chunking strategies, embeddings, vector retrieval, citation grounding, and RAG evals.',
    },
    prerequisitesRequired: ['AIB-301'],
    prerequisitesRecommended: ['AIB-203'],
    verifiedSource: false,
    primaryLessonSlug: 'aib-302-rag-foundations',
    primaryLabSlug: 'rag-playground',
    modules: [
      {
        id: 'aib-302-m1',
        title: { ar: 'معمارية RAG واستراتيجيات التقطيع', en: 'RAG Architecture & Chunking' },
        lessonSlug: 'aib-302-rag-foundations',
        labSlug: 'rag-playground',
        estimatedMinutes: 20,
      },
    ],
  },
  {
    id: 'aib-303',
    code: 'AIB-303',
    slug: 'ai-agents-mcp',
    semester: 4,
    title: { ar: 'وكلاء الذكاء الاصطناعي وبروتوكول MCP', en: 'AI Agents & MCP' },
    purpose: {
      ar: 'حلقة التفكير واستدعاء الأدوات، بروتوكول MCP، قيود الأمان، وتتبع الأخطاء.',
      en: 'Tool-calling loops, Model Context Protocol (MCP), guardrails, and execution traces.',
    },
    prerequisitesRequired: ['AIB-302'],
    prerequisitesRecommended: [],
    verifiedSource: false,
    primaryLabSlug: 'agent-loop',
    modules: [
      {
        id: 'aib-303-m1',
        title: { ar: 'حلقة الوكيل واستدعاء الأدوات', en: 'Agent Tool Loop & Trace' },
        labSlug: 'agent-loop',
        estimatedMinutes: 24,
      },
    ],
  },
  {
    id: 'aib-304',
    code: 'AIB-304',
    slug: 'model-serving-inference',
    semester: 4,
    title: { ar: 'تقديم النماذج وهندسة الاستدلال', en: 'Model Serving & Inference Engineering' },
    purpose: {
      ar: 'زمن الاستجابة، التكميم (Quantization)، التجميع المستمر، وحساب استهلاك الذاكرة VRAM.',
      en: 'Latency/throughput optimization, quantization, continuous batching, and VRAM sizing.',
    },
    prerequisitesRequired: ['AIB-301', 'AIB-202'],
    prerequisitesRecommended: [],
    verifiedSource: false,
    modules: [
      { id: 'aib-304-m1', title: { ar: 'موازنة زمن الاستجابة و VRAM', en: 'Latency & VRAM Budgets' }, estimatedMinutes: 25 },
    ],
  },
  {
    id: 'aib-401',
    code: 'AIB-401',
    slug: 'mlops',
    semester: 4,
    title: { ar: 'عمليات تعلم الآلة MLOps', en: 'MLOps' },
    purpose: {
      ar: 'الحاويات، خطوط النشر الآلي، تتبع التجارب، ومراقبة انحراف النماذج.',
      en: 'Containerization, CI/CD for models, experiment tracking, and drift monitoring.',
    },
    prerequisitesRequired: ['AIB-301'],
    prerequisitesRecommended: ['AIB-100'],
    verifiedSource: false,
    modules: [
      { id: 'aib-401-m1', title: { ar: 'خطوط النشر والمراقبة', en: 'Deployment Pipelines & Monitoring' }, estimatedMinutes: 30 },
    ],
  },
  {
    id: 'aib-402',
    code: 'AIB-402',
    slug: 'ai-security-ethics',
    semester: 4,
    title: { ar: 'أمن الذكاء الاصطناعي وأخلاقياته', en: 'AI Security & Ethics' },
    purpose: {
      ar: 'الحماية من حقن الأوامر، عزل تنفيذ الأدوات، حماية البيانات، ومبادئ الحوكمة.',
      en: 'Prompt injection defenses, sandboxed tool execution, PII protection, and governance.',
    },
    prerequisitesRequired: ['AIB-302'],
    prerequisitesRecommended: ['AIB-303'],
    verifiedSource: false,
    modules: [
      { id: 'aib-402-m1', title: { ar: 'نمذجة التهديدات وعزل التنفيذ', en: 'Threat Modeling & Sandboxing' }, estimatedMinutes: 25 },
    ],
  },
  {
    id: 'aib-490',
    code: 'AIB-490',
    slug: 'capstone',
    semester: 4,
    title: { ar: 'مشروع التخرج الهندسي', en: 'AI Backend Capstone' },
    purpose: {
      ar: 'بناء نظام AI خلفي متكامل من التصميم والمعمارية حتى الاختبارات والتقييم والتوثيق.',
      en: 'Design, implement, evaluate, and ship an end-to-end production-grade AI backend system.',
    },
    prerequisitesRequired: ['AIB-302', 'AIB-401'],
    prerequisitesRecommended: ['AIB-303', 'AIB-402'],
    verifiedSource: false,
    modules: [
      { id: 'aib-490-m1', title: { ar: 'المقترح والمعمارية والتسليم', en: 'Proposal, Architecture & Delivery' }, estimatedMinutes: 60 },
    ],
  },
];

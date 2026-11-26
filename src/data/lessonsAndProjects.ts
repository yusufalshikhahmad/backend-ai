import { Lesson, QuizQuestion, ProjectBrief } from '../types/academy';

export const QUIZ_QUESTIONS: Record<string, QuizQuestion> = {
  'q-aib100-pwd-vs-ls': {
    id: 'q-aib100-pwd-vs-ls',
    lessonId: 'aib-100-linux-files-terminal',
    courseCode: 'AIB-100',
    type: 'single_choice',
    difficulty: 'foundational',
    skillTags: ['linux-navigation', 'working-directory'],
    sourceRef: 'AIB-100 • Module 1 (Draft aligned with curriculum)',
    prompt: {
      ar: 'تعمل على خادم Linux لنشر خدمة FastAPI، وتريد التأكد من المسار الكامل للمجلد الذي تقف بداخله حالياً قبل تشغيل أي أمر حذف أو تعديل. ما الأمر الصحيح؟',
      en: 'You are working on a Linux server deploying a FastAPI service and want to confirm your exact current working directory path before modifying files. Which command should you run?',
    },
    options: [
      { ar: 'ls -la (يعرض قائمة الملفات في المجلد الحالي)', en: 'ls -la (lists files inside the current directory)' },
      { ar: 'pwd (يطبع مسار مجلد العمل الحالي بالكامل)', en: 'pwd (prints the full current working directory path)' },
      { ar: 'cd ~ (ينقلك إلى مجلد المنزل)', en: 'cd ~ (navigates back to the home directory)' },
      { ar: 'cat .env (يطبع محتوى ملف البيئة)', en: 'cat .env (prints the .env file content)' },
    ],
    correctIndices: [1],
    hints: [
      {
        ar: 'فكّر في الفرق بين عرض "محتويات" المجلد، وبين معرفة "أين أنا الآن" في شجرة الملفات.',
        en: 'Distinguish between listing the contents of a folder versus knowing your current location in the tree.',
      },
      {
        ar: 'اسم الأمر هو اختصار لـ Print Working Directory.',
        en: 'The command name stands for Print Working Directory.',
      },
    ],
    explanation: {
      ar: 'الأمر pwd يطبع المسار المطلق لمجلد العمل الحالي (مثلاً /home/engineer/ai-backend)، مما يمنع تنفيذ أوامر التعديل أو النشر في مجلد خاطئ.',
      en: 'pwd prints the absolute path of your current working directory (e.g. /home/engineer/ai-backend), preventing destructive or deployment mistakes in the wrong folder.',
    },
    misconceptionNote: {
      ar: 'الخلط الشائع هو استخدام ls لمعرفة الموقع؛ ls يعرض محتويات المجلد لكنه لا يعرض المسار الجذري الكامل للمجلد الحالي.',
      en: 'A common misconception is using ls to check location; ls shows directory contents, not the full parent path.',
    },
  },
  'q-aib100-relative-absolute': {
    id: 'q-aib100-relative-absolute',
    lessonId: 'aib-100-linux-files-terminal',
    courseCode: 'AIB-100',
    type: 'multiple_select',
    difficulty: 'applied',
    skillTags: ['paths', 'linux-filesystem'],
    sourceRef: 'AIB-100 • Module 1 (Draft aligned with curriculum)',
    prompt: {
      ar: 'اختر كل العبارات الصحيحة حول المسارات المطلقة (Absolute) والمسارات النسبية (Relative) في Linux:',
      en: 'Select ALL accurate statements about Absolute vs. Relative paths in Linux:',
    },
    options: [
      { ar: 'المسار المطلق يبدأ دائماً بشرطة مائلة أمامية / (الجذر)', en: 'An absolute path always starts with a leading forward slash / (root)' },
      { ar: 'الرمز .. يشير دائماً إلى المجلد الأب المباشر', en: 'The symbol .. always points to the immediate parent directory' },
      { ar: 'المسار configs/model.yaml يعتمد على مجلد العمل الحالي', en: 'The path configs/model.yaml depends on your current working directory' },
      { ar: 'استخدام مسار نسبي داخل خدمة systemd يعمل دائماً بغض النظر عن مجلد التشغيل', en: 'A relative path in a systemd service always resolves identically regardless of WorkingDirectory' },
    ],
    correctIndices: [0, 1, 2],
    hints: [
      {
        ar: 'تذكّر: أي مسار لا يبدأ بـ / يتم تفسيره نسبةً إلى ناتج pwd.',
        en: 'Remember: any path not starting with / is resolved relative to pwd.',
      },
      {
        ar: 'في خدمات الإنتاج مثل systemd أو Docker، لماذا تنكسر المسارات النسبية أحياناً؟',
        en: 'In production services like systemd or Docker, why do relative paths sometimes break?',
      },
    ],
    explanation: {
      ar: 'المسارات المطلقة تبدأ من الجذر / وتعمل من أي مكان، بينما المسارات النسبية (مثل configs/model.yaml أو ../) تتغير دلالتها بتغير مجلد العمل الحالي.',
      en: 'Absolute paths start at / and resolve identically anywhere, whereas relative paths (like configs/model.yaml or ../) depend on the current working directory.',
    },
    misconceptionNote: {
      ar: 'الاعتماد على مسارات نسبية غير مضبوطة في سكربتات التشغيل هو سبب شائع لفشل تحميل نماذج AI أو ملفات .env في الخوادم.',
      en: 'Relying on unanchored relative paths in launch scripts is a frequent cause of missing .env or model weight errors on servers.',
    },
  },
  'q-aib100-project-scaffold-order': {
    id: 'q-aib100-project-scaffold-order',
    lessonId: 'aib-100-linux-files-terminal',
    courseCode: 'AIB-100',
    type: 'ordering',
    difficulty: 'applied',
    skillTags: ['cli-workflow', 'project-setup'],
    sourceRef: 'AIB-100 • Module 1 Lab',
    prompt: {
      ar: 'رتّب الخطوات المنطقية لإنشاء بنية مشروع خدمة AI جديدة من الصفر داخل الطرفية:',
      en: 'Order the logical terminal workflow to scaffold a new AI backend service folder from scratch:',
    },
    options: [
      { ar: 'mkdir -p services/rag-api/configs', en: 'mkdir -p services/rag-api/configs' },
      { ar: 'cd services/rag-api', en: 'cd services/rag-api' },
      { ar: 'touch .env.example configs/settings.yaml', en: 'touch .env.example configs/settings.yaml' },
      { ar: 'ls -la (التحقق من إنشاء الملفات والمجلدات)', en: 'ls -la (verify created files & hidden .env.example)' },
    ],
    correctIndices: [0, 1, 2, 3],
    hints: [
      {
        ar: 'لا يمكنك الدخول إلى مجلد أو إنشاء ملف داخله قبل إنشاء المجلد أولاً.',
        en: 'You cannot enter or create files inside a directory before creating the directory itself.',
      },
      {
        ar: 'استخدم ls -la في النهاية للتحقق بما في ذلك الملفات المخفية التي تبدأ بنقطة.',
        en: 'Use ls -la at the end to verify hidden dotfiles like .env.example.',
      },
    ],
    explanation: {
      ar: 'إنشاء الهيكل بـ mkdir -p أولاً ثم الانتقال إليه بـ cd ثم إنشاء الملفات بـ touch وأخيراً التحقق بـ ls -la يضمن عدم ظهور أخطاء "No such file or directory".',
      en: 'Creating directories first with mkdir -p, entering with cd, creating files with touch, and verifying with ls -la avoids "No such file or directory" errors.',
    },
    misconceptionNote: {
      ar: 'تشغيل ls بدون الخيار -a يخفي ملفات الإعداد المهمة مثل .env و .gitignore لأنها تبدأ بنقطة.',
      en: 'Running ls without -a hides crucial dotfiles such as .env and .gitignore.',
    },
  },
  'q-aib302-rag-grounding': {
    id: 'q-aib302-rag-grounding',
    lessonId: 'aib-302-rag-foundations',
    courseCode: 'AIB-302',
    type: 'short_answer',
    difficulty: 'architectural',
    skillTags: ['rag-architecture', 'chunking', 'grounding'],
    sourceRef: 'AIB-302 • Module 1 (Draft)',
    prompt: {
      ar: 'لماذا نستخدم التقطيع المتداخل (Chunk Overlap) في أنظمة RAG بدلاً من تقطيع المستندات عند حد صارم بدون تداخل؟ اكتب إجابة مختصرة ثم قارنها بمعيار التقييم.',
      en: 'Why do RAG pipelines use Chunk Overlap instead of hard, non-overlapping splits? Write a short explanation and evaluate against the rubric.',
    },
    rubricChecklist: [
      { ar: 'ذكرت أن التقطيع الصارم قد يقطع جملة أو فكرة مترابطة في المنتصف.', en: 'Mentioned that hard boundaries can split a sentence or coherent concept in half.' },
      { ar: 'أوضحت أن التداخل يحفظ السياق عبر حدود المقاطع لتحسين دقة الاسترجاع.', en: 'Explained that overlap preserves context across boundaries to improve retrieval relevance.' },
      { ar: 'أشرت إلى الموازنة: زيادة التداخل ترفع حجم التخزين والتكلفة.', en: 'Noted the tradeoff: excessive overlap increases index size and token/storage cost.' },
    ],
    hints: [
      {
        ar: 'تخيّل سؤالاً يعتمد جوابه على نهاية الفقرة الأولى وبداية الفقرة الثانية.',
        en: 'Imagine a query whose answer spans the end of chunk 1 and the start of chunk 2.',
      },
      {
        ar: 'فكّر أيضاً في الأثر الجانبي على عدد المقاطع المخزّنة إذا جعلت التداخل 50%.',
        en: 'Also consider the storage and duplicate-token tradeoff if overlap is set too high (e.g. 50%).',
      },
    ],
    explanation: {
      ar: 'التداخل (عادة 10%–20% من حجم المقطع) يمنع فقدان السياق عند حدود المقاطع، لكن المبالغة فيه تضاعف حجم المتجهات المخزنة وتكرر السياق داخل نافذة LLM.',
      en: 'Overlap (typically 10%–20% of chunk size) prevents boundary context loss, while excessive overlap bloats vector storage and duplicates prompt tokens.',
    },
    misconceptionNote: {
      ar: 'الظن بأن التداخل الأكبر أفضل دائماً غير صحيح؛ التكرار الزائد يستهلك نافذة السياق وقد يضعف تنوع النتائج المسترجعة (Top-K).',
      en: 'Assuming more overlap is always better is wrong; heavy duplication wastes context budget and reduces Top-K retrieval diversity.',
    },
  },
};

export const LESSONS: Record<string, Lesson> = {
  'aib-100-linux-files-terminal': {
    id: 'aib-100-l1',
    slug: 'aib-100-linux-files-terminal',
    courseCode: 'AIB-100',
    courseSlug: 'linux-environment',
    title: {
      ar: 'البيئة الطرفية ونظام الملفات في Linux لمهندس الذكاء الاصطناعي',
      en: 'Terminal & Linux Filesystem for AI Backend Engineers',
    },
    subtitle: {
      ar: 'كيف تتنقل بثقة في الخوادم، تنظّم مشاريع النماذج، وتتجنب أخطاء المسارات الشائعة في الإنتاج',
      en: 'Navigate production servers confidently, organize AI service directories, and eliminate path bugs',
    },
    estimatedMinutes: 18,
    verifiedSource: true,
    sourceRef: {
      ar: 'AIB-100 — الوحدة الأولى: أساسيات نظام الملفات والطرفية (نسخة أولية متوافقة مع المنهج)',
      en: 'AIB-100 — Module 1: Filesystem & Shell Fundamentals (Curriculum-aligned draft)',
    },
    nextLabSlug: 'linux-aib100',
    nextLessonSlug: 'aib-302-rag-foundations',
    blocks: [
      {
        id: 'b1-outcome',
        type: 'outcome',
        title: { ar: 'مخرجات التعلم المستهدفة', en: 'Learning Outcomes' },
        items: [
          { ar: 'التمييز بين المسار المطلق (Absolute) والمسار النسبي (Relative) في خوادم Linux.', en: 'Distinguish absolute vs. relative paths on Linux servers.' },
          { ar: 'استخدام أوامر التنقل والإنشاء الأساسية: pwd, ls -la, cd, mkdir -p, touch, cat.', en: 'Use core navigation and inspection commands: pwd, ls -la, cd, mkdir -p, touch, cat.' },
          { ar: 'فهم سبب إخفاء الملفات التي تبدأ بنقطة مثل .env وأهميتها لأمن المفاتيح.', en: 'Understand hidden dotfiles like .env and how to inspect them safely.' },
        ],
      },
      {
        id: 'b2-why',
        type: 'text',
        title: { ar: 'لماذا يبدأ مهندس الذكاء الاصطناعي من Linux؟', en: 'Why AI Backend Engineering Starts on Linux' },
        body: {
          ar: 'معظم واجهات برمجة الذكاء الاصطناعي (FastAPI)، حاويات Docker، وخوادم الاستدلال (GPU Inference) تعمل على Linux بدون واجهة رسومية. عندما يفشل تحميل ملف إعدادات .env أو نموذج لغوي داخل الحاوية، فإن أسرع طريق لتشخيص السبب هو قراءة المسار الفعلي ومحتويات المجلد عبر الطرفية بدقة.',
          en: 'Almost all FastAPI AI services, Docker containers, and GPU inference nodes run on headless Linux. When a container fails to locate .env or model weights, your fastest diagnostic tool is inspecting exact paths and directory contents in the shell.',
        },
      },
      {
        id: 'b3-diagram',
        type: 'diagram',
        diagramId: 'linux-tree',
        title: { ar: 'تشريح شجرة الملفات لمشروع AI خلفي', en: 'Anatomy of an AI Backend Project Tree' },
        body: {
          ar: 'تبدأ كل المسارات في Linux من الجذر / (Root). داخل مجلد المنزل /home/engineer ننظّم مشاريعنا بفصل الشيفرة (src/) عن الإعدادات (.env.example) والبيانات.',
          en: 'Every path in Linux originates from root /. Under /home/engineer, production projects separate application code (src/) from environment templates (.env.example) and data.',
        },
      },
      {
        id: 'b4-example',
        type: 'code',
        language: 'bash',
        title: { ar: 'مثال عملي: التحقق من الموقع وإنشاء هيكل خدمة', en: 'Worked Example: Inspecting & Scaffolding' },
        body: {
          ar: 'لاحظ كيف نتحقق أولاً من موقعنا عبر pwd، ثم ننشئ عدة مجلدات متداخلة بأمر واحد باستخدام الراية -p، وأخيراً نستخدم ls -la لإظهار الملفات المخفية.',
          en: 'Notice how we confirm location first with pwd, create nested directories in one step with -p, and pass -la to ls so dotfiles appear.',
        },
        code: `$ pwd
/home/engineer/ai-backend

$ mkdir -p services/rag-api/configs
$ touch services/rag-api/.env.example
$ ls -la services/rag-api
drwxr-xr-x  .
drwxr-xr-x  ..
-rw-r--r--  .env.example
drwxr-xr-x  configs`,
      },
      {
        id: 'b5-callout',
        type: 'callout',
        calloutTone: 'warning',
        title: { ar: 'قاعدة أمان مهمة: .env مقابل .env.example', en: 'Security Rule: .env vs .env.example' },
        body: {
          ar: 'لا تحفظ مفاتيح API الحقيقية داخل المستودع البرمجي. نضع أسماء المتغيرات فقط في .env.example ونبقي القيم السرية في .env خارج Git.',
          en: 'Never commit real API keys into source control. Keep only variable names in .env.example and store actual secrets in an ignored .env file.',
        },
      },
      {
        id: 'b6-prediction',
        type: 'prediction',
        title: { ar: 'توقّع المخرجات قبل التشغيل', en: 'Predict the Output Before Reveal' },
        predictionConfig: {
          prompt: {
            ar: 'إذا كنت تقف الآن في المسار /home/engineer/ai-backend ونفّذت الأوامر التالية بالتسلسل، فما الناتج الذي سيطبعه pwd في النهاية؟',
            en: 'If your starting location is /home/engineer/ai-backend and you run these commands in sequence, what will pwd print at the end?',
          },
          snippet: `cd services/rag-api
cd ..
pwd`,
          options: [
            { ar: '/home/engineer/ai-backend/services/rag-api', en: '/home/engineer/ai-backend/services/rag-api' },
            { ar: '/home/engineer/ai-backend/services', en: '/home/engineer/ai-backend/services' },
            { ar: '/home/engineer/ai-backend', en: '/home/engineer/ai-backend' },
            { ar: '/home/engineer', en: '/home/engineer' },
          ],
          correctIndex: 1,
          hint: {
            ar: 'الأمر cd services/rag-api ينقلك خطوتين للأسفل (داخل services ثم rag-api)، بينما cd .. يرجعك خطوة واحدة فقط للأعلى.',
            en: 'cd services/rag-api descends two levels (services → rag-api), whereas cd .. goes up only one level.',
          },
          explanation: {
            ar: 'الصحيح هو /home/engineer/ai-backend/services. لأنك دخلت مجلدين متداخلين ثم صعدت مستوى واحداً فقط باستخدام ..',
            en: 'Correct: /home/engineer/ai-backend/services. You descended two nested folders and stepped up only one level with ..',
          },
        },
      },
      {
        id: 'b7-terminal',
        type: 'terminal_sim',
        title: { ar: 'تجربة عملية فورية (محاكي آمن)', en: 'Hands-on Mini Challenge (Safe Simulator)' },
        body: {
          ar: 'جرّب تنفيذ المهمة داخل المحاكي الآمن أدناه (لا يتصل بأي نظام تشغيل حقيقي): انتقل إلى مجلد services، أنشئ مجلد agent-worker، وأنشئ بداخله ملف README.md.',
          en: 'Complete this task in the deterministic virtual filesystem (no host shell access): navigate into services, create agent-worker, and create README.md inside it.',
        },
        terminalConfig: {
          goal: {
            ar: 'إنشاء /home/engineer/ai-backend/services/agent-worker/README.md',
            en: 'Create /home/engineer/ai-backend/services/agent-worker/README.md',
          },
          requiredFiles: ['/home/engineer/ai-backend/services/agent-worker/README.md'],
          hints: [
            { ar: 'ابدأ بإنشاء المجلد باستخدام: mkdir -p services/agent-worker', en: 'Start by creating the directory: mkdir -p services/agent-worker' },
            { ar: 'ثم أنشئ الملف بالأمر: touch services/agent-worker/README.md', en: 'Then create the file: touch services/agent-worker/README.md' },
          ],
        },
      },
      {
        id: 'b8-quiz',
        type: 'quiz',
        title: { ar: 'نقطة التحقق (Checkpoint)', en: 'Lesson Checkpoint' },
        quizQuestionId: 'q-aib100-pwd-vs-ls',
      },
      {
        id: 'b9-reflection',
        type: 'reflection',
        title: { ar: 'تأمل هندسي قصير', en: 'Engineering Reflection' },
        body: {
          ar: 'اكتب في سطر واحد: لماذا يُفضّل استخدام مسارات مطلقة أو متغيرات بيئة مثل APP_ROOT عند تشغيل خدمات الذكاء الاصطناعي في الإنتاج؟ (يُحفظ محلياً في متصفحك)',
          en: 'In one sentence: why should production AI services rely on explicit root variables or absolute paths instead of fragile relative paths? (Saved locally in your browser)',
        },
      },
      {
        id: 'b10-source',
        type: 'source',
        title: { ar: 'مرجعية المحتوى وحالة التحقق', en: 'Content Source & Verification Status' },
        body: {
          ar: 'هذا الدرس نموذج تفاعلي مبني على هيكل مقرر AIB-100 في docs/03-curriculum-map.md. التوثيق المحلي للرحلة التعليمية محفوظ في localStorage فقط دون مزامنة سحابية في هذه النسخة.',
          en: 'This prototype lesson is structured around AIB-100 in docs/03-curriculum-map.md. Progress is persisted strictly in local browser storage with no cloud backend.',
        },
      },
    ],
  },
  'aib-302-rag-foundations': {
    id: 'aib-302-l1',
    slug: 'aib-302-rag-foundations',
    courseCode: 'AIB-302',
    courseSlug: 'llm-applications-rag',
    title: {
      ar: 'معمارية RAG: التقطيع، الاسترجاع، والإسناد المرجعي',
      en: 'RAG Architecture: Chunking, Retrieval & Grounded Citations',
    },
    subtitle: {
      ar: 'كيف تربط النماذج اللغوية بوثائقك الخاصة وتقلل الهلوسة عبر الاسترجاع الدلالي واللفظي',
      en: 'Ground LLM responses in your private corpus and reduce hallucinations with measurable retrieval',
    },
    estimatedMinutes: 20,
    verifiedSource: false,
    sourceRef: {
      ar: 'AIB-302 — مسودة تصميمية (بحاجة إلى مراجعة المصدر الرسمي عند توفر ملف PDF المنهج)',
      en: 'AIB-302 — Design draft (pending official source PDF verification)',
    },
    nextLabSlug: 'rag-playground',
    blocks: [
      {
        id: 'r1-outcome',
        type: 'outcome',
        title: { ar: 'مخرجات التعلم المستهدفة', en: 'Learning Outcomes' },
        items: [
          { ar: 'فهم المراحل الثلاث لخط أنابيب RAG: الفهرسة، الاسترجاع، والتوليد المسند.', en: 'Understand the 3 RAG stages: indexing, retrieval, and grounded generation.' },
          { ar: 'تقدير أثر حجم المقطع (Chunk Size) والتداخل (Overlap) على جودة الإجابة.', en: 'Evaluate how chunk size and overlap affect retrieval quality and token cost.' },
        ],
      },
      {
        id: 'r2-diagram',
        type: 'diagram',
        diagramId: 'rag-flow',
        title: { ar: 'مخطط خط أنابيب RAG التوضيحي', en: 'Illustrative RAG Pipeline Diagram' },
        body: {
          ar: 'تتحول الوثائق إلى مقاطع ثم متجهات في الفهرس. عند سؤال المستخدم، نسترجع أعلى K مقاطع صلة ونمررها للنموذج مع إجباره على الإسناد.',
          en: 'Documents are chunked and indexed. On query, top-K relevant passages are retrieved and passed as grounded context with citations.',
        },
      },
      {
        id: 'r3-quiz',
        type: 'quiz',
        title: { ar: 'نقطة التحقق (تقييم ذاتي بالمعيار)', en: 'Checkpoint (Rubric Self-Check)' },
        quizQuestionId: 'q-aib302-rag-grounding',
      },
    ],
  },
};

export const PROJECTS: ProjectBrief[] = [
  {
    id: 'proj-aib100-env-audit',
    slug: 'linux-ai-service-scaffold',
    courseCode: 'AIB-100',
    title: {
      ar: 'مشروع تأسيس بيئة خدمة AI خلفية على Linux',
      en: 'Linux AI Backend Service Environment Scaffold',
    },
    summary: {
      ar: 'تنظيم هيكل مجلدات احترافي لخدمة استدلال AI مع عزل ملفات البيئة، توثيق أوامر التشغيل، والتحقق من الصلاحيات.',
      en: 'Structure a production-ready AI service directory on Linux with safe .env separation, setup documentation, and permission checks.',
    },
    verifiedSource: true,
    prerequisites: ['AIB-100'],
    milestones: [
      {
        id: 'ms-1',
        title: { ar: '١. تصميم شجرة المجلدات القياسية', en: '1. Standard Directory Layout' },
        description: {
          ar: 'فصل الشيفرة المصدرية (src/) عن الإعدادات (configs/) والاختبارات (tests/) وتجهيز .env.example.',
          en: 'Separate source code (src/), configuration (configs/), and tests (tests/), with a clean .env.example.',
        },
        deliverables: [
          { ar: 'إنشاء المجلدات في المحاكي أو بيئتك المحلية بدون ملفات مكررة.', en: 'Create nested folders cleanly without redundant files.' },
          { ar: 'إضافة .env.example يحتوي أسماء المتغيرات دون أي أسرار.', en: 'Add .env.example listing variable keys with zero secrets.' },
        ],
      },
      {
        id: 'ms-2',
        title: { ar: '٢. توثيق التشغيل والتحقق من المسارات', en: '2. Runbook & Path Verification' },
        description: {
          ar: 'كتابة دليل تشغيل واضح يتضمن التحقق من مجلد العمل وصلاحيات القراءة/الكتابة.',
          en: 'Document reproducible startup commands including working-directory verification.',
        },
        deliverables: [
          { ar: 'اجتياز مهمة مختبر Linux AIB-100 في المحاكي الآمن.', en: 'Pass the AIB-100 Linux Simulator lab task.' },
          { ar: 'كتابة ملاحظة التأمل الهندسي حول مخاطر المسارات النسبية.', en: 'Complete the reflection note on relative path hazards.' },
        ],
      },
    ],
    rubric: [
      { ar: 'فصل الإعدادات والأسرار عن الشيفرة المصدرية بوضوح.', en: 'Clear separation of secrets/configs from source code.' },
      { ar: 'تسمية المجلدات باللغة الإنجليزية وبصيغة kebab-case أو snake_case متسقة.', en: 'Consistent lowercase directory naming (kebab-case or snake_case).' },
      { ar: 'توثيق المسارات المطلوبة لبدء الخدمة بشكل قابل للتكرار.', en: 'Reproducible startup instructions with verified paths.' },
    ],
  },
  {
    id: 'proj-aib302-rag-eval',
    slug: 'grounded-rag-service',
    courseCode: 'AIB-302',
    title: {
      ar: 'خدمة RAG موثّقة المصادر مع تقييم الاسترجاع',
      en: 'Citation-Grounded RAG Service with Retrieval Eval',
    },
    summary: {
      ar: 'بناء واجهة FastAPI تجيب عن أسئلة الوثائق التقنية مع إرجاع أرقام المقاطع المصدرية وقياس دقة الاسترجاع.',
      en: 'Build a FastAPI service answering technical docs queries with explicit chunk citations and retrieval evaluation.',
    },
    verifiedSource: false,
    prerequisites: ['AIB-301', 'AIB-302'],
    milestones: [
      {
        id: 'ms-rag-1',
        title: { ar: '١. خط التقطيع والفهرسة', en: '1. Chunking & Indexing Pipeline' },
        description: {
          ar: 'تحديد حجم المقطع والتداخل وتخزين البيانات الوصفية لكل مصدر.',
          en: 'Configure chunk size, overlap, and metadata preservation per source.',
        },
        deliverables: [
          { ar: 'تجربة إعدادات مختلفة في مختبر RAG Playground.', en: 'Test chunking tradeoffs in the RAG Playground lab.' },
        ],
      },
    ],
    rubric: [
      { ar: 'عدم توليد إجابة عند غياب أدلة كافية في المقاطع المسترجعة.', en: 'Refusal / fallback when retrieved context lacks evidence.' },
      { ar: 'إرفاق معرف المصدر ورقم المقطع مع كل ادعاء.', en: 'Source ID and chunk index attached to every claim.' },
    ],
  },
];

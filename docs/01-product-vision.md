# Product Vision & Requirements

## المشكلة
التعلم عبر PDF أو الفيديو وحده يفتقد التفاعل، feedback الفوري، التدرج، قياس الفهم، ربط المفاهيم بمشاريع، وتوجيه الطالب إلى الخطوة التالية.

## الرؤية
Engineering learning studio: شرح مختصر، تصور بصري، تمرين عملي، feedback مفسّر، مراجعة، ومشروع حقيقي.

## الجمهور
- مبتدئون يحتاجون Python/Linux fundamentals.
- طلاب ينتقلون من ML إلى backend/LLM engineering.
- متعلمون ذاتيون يحتاجون accountability.
- مجموعات دراسة ومدرسون.

## Product principles
1. Active recall لا passive consumption.
2. Feedback يشرح السبب ويكشف misconception.
3. Tiny lessons مرتبطة بالصورة الكبيرة.
4. لا نخلط فتح الدرس مع mastery.
5. Arabic-first، والمصطلحات التقنية English.
6. Accessible، responsive، reduced motion.
7. خصوصية افتراضية؛ مشاركة الإنجاز اختيارية.
8. AI tutor grounded في محتوى المنهج، ويقول لا أعلم عند غياب المصدر.
9. Gamification لطيف، لا shame أو streak pressure.
10. المحتوى الأصلي محفوظ، والإضافات معلّمة.

## Core features
- Onboarding وتحديد هدف/وقت متاح (اختياري).
- Course map مع prerequisites.
- Lesson player وmicro-lessons.
- Interactive practice: quiz، debug، predict output، sequence، flashcards.
- Hints قبل الحل.
- Progress/mastery by skill مع أدلة.
- Review queue للمراجعة المتباعدة.
- Project milestones وrubrics.
- Dashboard يوضح next best action.
- AI Tutor modes: hint, explain, quiz me, debug (بعد MVP).
- Study rooms / peer learning لاحقًا.

## MVP scope
In: course structure، lesson blocks، quizzes objective، progress، review، content versioning، responsive UI، AIB-100 seed content.
Later: AI tutor، arbitrary code execution، social rooms، advanced analytics، certificates.

## Success metrics
Time to first successful exercise، mastery checks، العودة خلال 7 أيام، milestones pass، feedback quality. لا نعتبر streak وحده نجاحًا.

## Risks
محتوى غير دقيق → source review. AI hallucination → retrieval/citations/evaluation. Code execution abuse → isolation. Scope creep → stage gates.

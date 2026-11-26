# Gemini Build Kit — AI Engineering Academy

هذا المجلد هو حزمة التنفيذ المباشرة لـ Gemini Build / AI app builder. ابدأ من هنا ولا تبدأ بتوليد التطبيق من دون قراءة الملفات.

## ما الذي ترفعه إلى Gemini؟
1. ارفع صورة المرجع التي قدمها صاحب المشروع (لقطة واجهة Gemini) كـ visual reference.
2. أرفق الرسومات الموجودة في assets/mockups و assets/concepts عند توفر رفع الملفات.
3. افتح prompt 00-master-prompt.md وانسخه كاملًا في مساحة Build.
4. لا تطلب تنفيذ المنصة كاملة دفعة واحدة. بعد توليد الخطة، نفّذ المراحل بالترتيب.

## Prompts
- prompts/00-master-prompt.md — توجيه المشروع الكامل.
- prompts/01-product-and-ux.md — البحث والـ UX وخريطة الصفحات.
- prompts/02-design-system.md — الهوية والألوان والخطوط والمكونات.
- prompts/03-home-prompt-first.md — الصفحة الرئيسية المستوحاة من المرجع.
- prompts/04-dashboard.md — لوحة الطالب.
- prompts/05-curriculum-map.md — خريطة المنهج.
- prompts/06-lesson-and-lab.md — مشغل الدروس والمختبر.
- prompts/07-quiz-review-projects.md — الاختبارات والمراجعة والمشاريع.
- prompts/08-integration-and-qa.md — الدمج والاختبارات والتسليم.

## Visual references
- ../assets/mockups/home-prompt-first.svg
- ../assets/mockups/dashboard.svg
- ../assets/mockups/lesson-lab.svg
- ../assets/mockups/course-map.svg
- ../assets/mockups/quiz-review.svg
- ../assets/mockups/project-workspace.svg
- ../assets/mockups/design-system-board.svg
- ../assets/concepts/learning-path.svg
- ../assets/concepts/rag-playground.svg
- ../assets/concepts/agent-tool-loop.svg

## قواعد التنفيذ
- استخدم صورة المرجع كمصدر إلهام في تكوين Home فقط. لا تنسخ اسم Gemini أو شعاره أو نصوصه أو عناصره المحمية.
- المرجع الأكاديمي هو المنهج المرفق؛ لا تخترع عناوين مقررات أو متطلبات أو تقييمات.
- ابدأ بـ prototype تفاعلي ببيانات محلية، ولا تدّع أن Backend أو AI أو حفظ سحابي يعمل إذا لم يتم تنفيذه.
- لا تنفذ كود الطالب في بيئة التطبيق أو خادم API. استخدم Terminal simulator بأوامر allowlist فقط في MVP.
- لا تنتقل من مرحلة إلى أخرى قبل عرض النتيجة ونجاح معايير القبول.
- راجع العربية RTL، والإنجليزية LTR، والموبايل، ولوحة المفاتيح، والتباين.

## Important
The SVGs are editable conceptual wireframes, not final production screenshots. Keep them as a design contract and improve them without copying any external brand.

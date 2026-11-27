import React, { useState, useMemo } from 'react';
import { Terminal, Search, Cpu, CheckCircle2, Play, Target, AlertTriangle } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { SimulatedTerminal } from '../components/SimulatedTerminal';
import { ConceptDiagram } from '../components/ConceptDiagrams';
import { NotFoundState } from '../components/NotFoundState';
import { TOY_RAG_CORPUS, chunkAndRetrieve } from '../engine/ragSim';

export const LabPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { lang, navigate, learner, markLabCompleted } = useAcademy();

  // RAG Playground state
  const [chunkSize, setChunkSize] = useState(90);
  const [overlap, setOverlap] = useState(0);
  const [ragQuery, setRagQuery] = useState('boundaries top-k retrieval');
  const [ragFeedback, setRagFeedback] = useState<'idle' | 'pass' | 'needs_overlap'>('idle');

  // Agent Loop state
  const [agentStep, setAgentStep] = useState(0);
  const [selectedTool, setSelectedTool] = useState<'search_docs' | 'run_shell' | 'read_metric'>('search_docs');
  const [agentChallengeChoice, setAgentChallengeChoice] = useState<string | null>(null);

  const tabs = [
    { slug: 'linux-aib100', labelAr: 'مختبر Linux (AIB-100)', labelEn: 'Linux Terminal Lab', icon: Terminal },
    { slug: 'rag-playground', labelAr: 'ملعب RAG التفاعلي', labelEn: 'RAG Playground', icon: Search },
    { slug: 'agent-loop', labelAr: 'محاكاة حلقة الوكيل', labelEn: 'Agent Tool Loop', icon: Cpu },
  ];

  const validLab = tabs.some((t) => t.slug === slug);

  const ragChunks = useMemo(
    () => chunkAndRetrieve(TOY_RAG_CORPUS, chunkSize, overlap, ragQuery),
    [chunkSize, overlap, ragQuery]
  );

  if (!validLab) {
    return (
      <NotFoundState
        lang={lang}
        titleAr="المختبر المطلوب غير موجود"
        titleEn="Lab Not Found"
        descriptionAr={`لا يوجد مختبر تفاعلي بالمعرّف "${slug}". يمكنك تشغيل مختبر Linux الآمن أو ملعب RAG.`}
        descriptionEn={`No interactive lab matching "${slug}" was found.`}
        primaryCtaPath="/lab/linux-aib100"
        primaryCtaAr="افتح مختبر Linux (AIB-100)"
        primaryCtaEn="Open Linux Terminal Lab"
      />
    );
  }

  const verifyRagTask = () => {
    const topTwoText = ragChunks
      .slice(0, 2)
      .map((c) => c.text.toLowerCase())
      .join(' ');
    const hasOverlapBridge = overlap >= 15 && topTwoText.includes('boundaries') && topTwoText.includes('top-k');
    if (hasOverlapBridge) {
      setRagFeedback('pass');
      markLabCompleted('rag-playground');
    } else {
      setRagFeedback('needs_overlap');
    }
  };

  const agentTrace = [
    {
      titleAr: '١. تحليل الطلب واختيار الأداة',
      titleEn: '1. Plan & Tool Selection',
      detailAr: `الوكيل يحلل سؤال المستخدم ويختار الأداة: ${selectedTool}`,
      detailEn: `Agent evaluates intent and selects tool: ${selectedTool}`,
    },
    {
      titleAr: '٢. التحقق من الصلاحيات وحدود الأمان',
      titleEn: '2. Policy & Sandbox Guardrail',
      detailAr:
        selectedTool === 'run_shell'
          ? 'تم حظر الأمر المباشر! الأدوات التنفيذية تتطلب قائمة سماح (Allowlist) وعزل Sandbox.'
          : 'الأداة للقراءة فقط ومسموح بها ضمن سياسة MCP.',
      detailEn:
        selectedTool === 'run_shell'
          ? 'Blocked direct shell! Execution tools require strict allowlist + container isolation.'
          : 'Read-only MCP tool authorized within policy limits.',
    },
    {
      titleAr: '٣. إرجاع النتيجة المسندة',
      titleEn: '3. Grounded Observation & Response',
      detailAr:
        selectedTool === 'run_shell'
          ? 'فشل التنفيذ غير المصرح به — يعود الوكيل إلى بديل آمن أو يطلب صلاحية محدودة.'
          : 'يتلقى الوكيل المخرج المهيكل ويصوغ إجابة مرتبطة بدليل الأداة.',
      detailEn:
        selectedTool === 'run_shell'
          ? 'Execution denied — agent falls back to read-only inspection or safe refusal.'
          : 'Agent ingests structured tool output and emits a cited final answer.',
    },
  ];

  return (
    <main className="mx-auto max-w-[1160px] space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--color-text-primary)' }}>
            {lang === 'ar' ? 'المختبرات التفاعلية الآمنة' : 'Interactive Engineering Labs'}
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {lang === 'ar'
              ? 'بيئات محاكاة حتمية داخل المتصفح — لا تنفيذ عشوائي ولا أوامر على الخادم الحقيقي.'
              : 'Deterministic in-browser sandboxes — zero arbitrary OS shell or external execution.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = slug === tab.slug;
            const done = learner.completedLabs.includes(tab.slug);
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => navigate(`/lab/${tab.slug}`)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-xs font-semibold sm:text-sm"
                style={{
                  backgroundColor: active ? 'var(--color-surface-3)' : 'var(--color-surface-1)',
                  borderColor: active ? 'var(--color-cyan)' : 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <Icon className="h-4 w-4" style={{ color: active ? 'var(--color-cyan)' : 'var(--color-text-secondary)' }} />
                <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
                {done && <CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'var(--color-success)' }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lab 1: Linux Simulator */}
      {slug === 'linux-aib100' && (
        <section className="space-y-4">
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {lang === 'ar' ? 'مهمة AIB-100: تجهيز بنية خدمة جديدة' : 'AIB-100 Task: Scaffold a New Service Directory'}
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {lang === 'ar'
                ? 'استخدم pwd و ls -la لاستكشاف المجلد الحالي، ثم أنشئ المجلد services/agent-worker وداخله الملف README.md للتحقق من إتمام المختبر.'
                : 'Use pwd and ls -la to inspect the workspace, then create services/agent-worker and README.md inside it.'}
            </p>
          </div>

          <SimulatedTerminal
            lang={lang}
            goal={{
              ar: 'إنشاء /home/engineer/ai-backend/services/agent-worker/README.md',
              en: 'Create /home/engineer/ai-backend/services/agent-worker/README.md',
            }}
            requiredFiles={['/home/engineer/ai-backend/services/agent-worker/README.md']}
            hints={[
              { ar: 'تحقق من موقعك أولاً بالأمر pwd ثم أنشئ المجلد: mkdir -p services/agent-worker', en: 'Check location with pwd then run: mkdir -p services/agent-worker' },
              { ar: 'أنشئ الملف المطلوب: touch services/agent-worker/README.md', en: 'Create the target file: touch services/agent-worker/README.md' },
            ]}
            onGoalComplete={() => markLabCompleted('linux-aib100')}
          />
        </section>
      )}

      {/* Lab 2: RAG Playground with Guided Task & Feedback */}
      {slug === 'rag-playground' && (
        <section className="space-y-5">
          <ConceptDiagram id="rag-flow" lang={lang} />

          {/* Guided Task Banner */}
          <div className="rounded-2xl border p-4 sm:p-5" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border-strong)' }}>
            <div className="flex items-start gap-2.5">
              <Target className="mt-0.5 h-5 w-5 shrink-0" style={{ color: 'var(--color-cyan)' }} />
              <div className="space-y-1">
                <h2 className="text-sm font-bold sm:text-base" style={{ color: 'var(--color-text-primary)' }}>
                  {lang === 'ar'
                    ? 'مهمة المختبر: منع انقطاع السياق بين المقاطع (Boundary Loss)'
                    : 'Lab Goal: Prevent Boundary Context Loss'}
                </h2>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {lang === 'ar'
                    ? 'حالياً التداخل (Overlap) مضبوط على 0 حرف. اضبط التداخل إلى 15 حرفاً على الأقل واضغط "تحقق من جودة الاسترجاع" لتلاحظ كيف تبقى كلمتا boundaries و top-k مترابطتين في أعلى النتائج.'
                    : 'Overlap starts at 0 chars. Increase overlap to at least 15 chars and click Verify Retrieval so both "boundaries" and "top-k" stay linked in the top 2 results.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 rounded-2xl border p-5 lg:grid-cols-12" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}>
            <div className="space-y-4 lg:col-span-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {lang === 'ar' ? 'ضبط معاملات التقطيع والاسترجاع' : 'Chunking & Query Controls'}
                </h3>
                <span className="text-[11px]" style={{ color: 'var(--color-warning)' }}>
                  {lang === 'ar' ? 'محاكاة حتمية (Keyword-based toy corpus)' : 'Keyword toy corpus (not vector embeddings)'}
                </span>
              </div>

              <div>
                <label className="mb-1 flex justify-between text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  <span>{lang === 'ar' ? 'حجم المقطع (حرف)' : 'Chunk size (chars)'}</span>
                  <span className="ltr-isolate font-mono">{chunkSize}</span>
                </label>
                <input
                  type="range"
                  min={60}
                  max={180}
                  step={10}
                  value={chunkSize}
                  onChange={(e) => {
                    setChunkSize(Number(e.target.value));
                    setRagFeedback('idle');
                  }}
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-1 flex justify-between text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  <span>{lang === 'ar' ? 'التداخل (Overlap)' : 'Chunk overlap (chars)'}</span>
                  <span className="ltr-isolate font-mono">{overlap}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={overlap}
                  onChange={(e) => {
                    setOverlap(Number(e.target.value));
                    setRagFeedback('idle');
                  }}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="rag-query" className="mb-1 block text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {lang === 'ar' ? 'استعلام الاختبار:' : 'Test retrieval query:'}
                </label>
                <input
                  id="rag-query"
                  type="text"
                  value={ragQuery}
                  onChange={(e) => {
                    setRagQuery(e.target.value);
                    setRagFeedback('idle');
                  }}
                  className="ltr-isolate w-full rounded-xl border px-3 py-2 font-mono text-xs sm:text-sm"
                  style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                />
              </div>

              <button
                type="button"
                onClick={verifyRagTask}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-xs font-bold sm:text-sm"
                style={{ backgroundColor: 'var(--color-action-primary)', color: 'var(--color-action-primary-fg)' }}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{lang === 'ar' ? 'تحقق من جودة الاسترجاع' : 'Verify Retrieval Task'}</span>
              </button>

              {ragFeedback === 'pass' && (
                <div role="status" className="rounded-xl border p-3 text-xs" style={{ backgroundColor: 'var(--color-success-bg)', borderColor: 'var(--color-border-strong)', color: 'var(--color-text-primary)' }}>
                  <strong style={{ color: 'var(--color-success)' }}>
                    {lang === 'ar' ? 'نجحت التجربة! ' : 'Task Passed! '}
                  </strong>
                  {lang === 'ar'
                    ? 'حافظ التداخل على استمرارية السياق عبر حدود المقاطع وتم تسجيل إتمام مختبر RAG.'
                    : 'Overlap preserved boundary continuity across chunks, and RAG Lab completion was logged.'}
                </div>
              )}
              {ragFeedback === 'needs_overlap' && (
                <div role="status" className="rounded-xl border p-3 text-xs" style={{ backgroundColor: 'var(--color-warning-bg)', borderColor: 'var(--color-border-strong)', color: 'var(--color-text-primary)' }}>
                  <strong style={{ color: 'var(--color-warning)' }}>
                    {lang === 'ar' ? 'لم يتحقق الشرط بعد: ' : 'Not verified yet: '}
                  </strong>
                  {lang === 'ar'
                    ? 'ارفع التداخل (Overlap) إلى 15 حرفاً على الأقل وتأكد أن الاستعلام يبحث عن boundaries top-k retrieval.'
                    : 'Increase Overlap to at least 15 chars and query for "boundaries top-k retrieval".'}
                </div>
              )}
            </div>

            <div className="space-y-3 lg:col-span-7">
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <span>{lang === 'ar' ? 'أعلى المقاطع المسترجعة مع المصدر:' : 'Top retrieved chunks with source markers:'}</span>
                <span className="ltr-isolate font-mono">{ragChunks.length} chunks indexed</span>
              </div>
              {ragChunks.slice(0, 4).map((chunk, i) => (
                <div
                  key={chunk.id}
                  className="ltr-isolate rounded-xl border p-3.5 text-xs"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    borderColor: i === 0 && chunk.score > 0 ? 'var(--color-cyan)' : 'var(--color-border)',
                  }}
                >
                  <div className="mb-1.5 flex items-center justify-between font-mono">
                    <span style={{ color: 'var(--color-accent-text)' }}>[{chunk.id}]</span>
                    <span style={{ color: chunk.score > 0 ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                      keyword_hits={chunk.score}
                    </span>
                  </div>
                  <p className="leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                    {chunk.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lab 3: Agent Tool Loop with Policy Decision Check */}
      {slug === 'agent-loop' && (
        <section className="space-y-5">
          <ConceptDiagram id="agent-loop" lang={lang} />

          <div className="rounded-2xl border p-5 sm:p-6" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {lang === 'ar' ? 'تتبع تنفيذ أداة عبر MCP (محاكاة حتمية)' : 'Deterministic MCP Tool-Routing Trace'}
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {lang === 'ar'
                ? 'اختر الأداة التي سيطلبها الوكيل، شغّل خطوات التتبع، ثم حدّد القرار الأمني الصحيح لأداة run_shell().'
                : 'Select a tool call candidate, step through the trace, then answer the guardrail check for run_shell().'}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(['search_docs', 'read_metric', 'run_shell'] as const).map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => {
                    setSelectedTool(tool);
                    setAgentStep(0);
                  }}
                  className="ltr-isolate min-h-[40px] rounded-xl border px-3.5 font-mono text-xs font-semibold"
                  style={{
                    backgroundColor: selectedTool === tool ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
                    borderColor: selectedTool === tool ? 'var(--color-cyan)' : 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {tool}()
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {agentTrace.map((st, idx) => {
                const active = idx <= agentStep;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border p-4 transition-opacity"
                    style={{
                      backgroundColor: 'var(--color-surface-2)',
                      borderColor: active ? 'var(--color-cyan)' : 'var(--color-border)',
                      opacity: active ? 1 : 0.45,
                    }}
                  >
                    <h3 className="text-xs font-bold" style={{ color: 'var(--color-accent-text)' }}>
                      {lang === 'ar' ? st.titleAr : st.titleEn}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                      {lang === 'ar' ? st.detailAr : st.detailEn}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setAgentStep((s) => Math.min(2, s + 1))}
                className="brand-gradient-bg inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 text-xs font-bold text-[#07111D] sm:text-sm"
              >
                <Play className="h-4 w-4" />
                <span>
                  {agentStep < 2
                    ? lang === 'ar'
                      ? 'تنفيذ الخطوة التالية'
                      : 'Advance Trace Step'
                    : lang === 'ar'
                      ? 'اكتملت المعاينة'
                      : 'Trace Complete'}
                </span>
              </button>
            </div>

            {/* Policy verification question */}
            <div className="mt-6 border-t pt-5" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                {lang === 'ar'
                  ? 'سؤال التحقق لإتمام المختبر: ماذا يجب أن تفعل طبقة الحماية عندما يطلب الوكيل run_shell("rm -rf /")؟'
                  : 'Verification check: What should the policy guardrail do if an agent requests run_shell("rm -rf /")?'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  {
                    id: 'allow',
                    ar: 'السماح بالتنفيذ المباشر على الخادم',
                    en: 'Allow direct execution on host server',
                  },
                  {
                    id: 'block',
                    ar: 'رفض الأمر لعدم وجوده في Allowlist أو عزله في Sandbox',
                    en: 'Reject outside allowlist or enforce isolated sandbox',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setAgentChallengeChoice(opt.id);
                      if (opt.id === 'block') markLabCompleted('agent-loop');
                    }}
                    className="min-h-[42px] rounded-xl border px-4 text-xs font-semibold sm:text-sm"
                    style={{
                      backgroundColor: agentChallengeChoice === opt.id ? 'var(--color-surface-3)' : 'var(--color-surface-2)',
                      borderColor: agentChallengeChoice === opt.id ? 'var(--color-cyan)' : 'var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {lang === 'ar' ? opt.ar : opt.en}
                  </button>
                ))}
              </div>
              {agentChallengeChoice === 'block' && (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--color-success)' }}>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {lang === 'ar'
                      ? 'صحيح! لا ننفذ أوامر وكيل عشوائية على الخادم الرئيسي أبداً.'
                      : 'Correct! Never execute arbitrary agent shell commands on the main API/host.'}
                  </span>
                </p>
              )}
              {agentChallengeChoice === 'allow' && (
                <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--color-error)' }}>
                  <AlertTriangle className="h-4 w-4" />
                  <span>
                    {lang === 'ar'
                      ? 'خطر أمني! قد يؤدي Prompt Injection إلى تدمير الخادم أو تسريب الأسرار.'
                      : 'Security risk! Prompt injection could compromise the host or exfiltrate secrets.'}
                  </span>
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

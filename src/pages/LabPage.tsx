import React, { useState, useMemo } from 'react';
import { Terminal, Search, Cpu, CheckCircle2, Play } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { SimulatedTerminal } from '../components/SimulatedTerminal';
import { ConceptDiagram } from '../components/ConceptDiagrams';

const TOY_CORPUS = [
  {
    id: 'doc-fastapi-async',
    source: 'fastapi_guide.md',
    text: 'FastAPI uses async def endpoints on Uvicorn to handle concurrent I/O requests cleanly without blocking the event loop. Always set request timeouts when calling external LLM providers.',
  },
  {
    id: 'doc-rag-overlap',
    source: 'rag_chunking.md',
    text: 'Chunk overlap (typically 10% to 20%) preserves semantic continuity across split boundaries. Without overlap, definitions split across two chunks may fail top-k retrieval.',
  },
  {
    id: 'doc-linux-env',
    source: 'linux_ops.md',
    text: 'Store API credentials in .env outside Git and commit only .env.example. Verify working directory with pwd before launching systemd or Docker entrypoints.',
  },
];

export const LabPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { lang, navigate, learner, markLabCompleted } = useAcademy();

  // RAG Playground state
  const [chunkSize, setChunkSize] = useState(110);
  const [overlap, setOverlap] = useState(20);
  const [ragQuery, setRagQuery] = useState('chunk overlap retrieval');

  // Agent Loop state
  const [agentStep, setAgentStep] = useState(0);
  const [selectedTool, setSelectedTool] = useState<'search_docs' | 'run_shell' | 'read_metric'>('search_docs');

  const tabs = [
    { slug: 'linux-aib100', labelAr: 'مختبر Linux (AIB-100)', labelEn: 'Linux Terminal Lab', icon: Terminal },
    { slug: 'rag-playground', labelAr: 'ملعب RAG التفاعلي', labelEn: 'RAG Playground', icon: Search },
    { slug: 'agent-loop', labelAr: 'محاكاة حلقة الوكيل', labelEn: 'Agent Tool Loop', icon: Cpu },
  ];

  const activeSlug = tabs.some((t) => t.slug === slug) ? slug : 'linux-aib100';

  const ragChunks = useMemo(() => {
    const step = Math.max(30, chunkSize - overlap);
    const out: { id: string; source: string; text: string; score: number }[] = [];
    const terms = ragQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 2);

    for (const doc of TOY_CORPUS) {
      for (let start = 0, idx = 1; start < doc.text.length; start += step, idx++) {
        const slice = doc.text.slice(start, start + chunkSize);
        const lower = slice.toLowerCase();
        const hits = terms.filter((t) => lower.includes(t)).length;
        out.push({
          id: `${doc.source}#c${idx}`,
          source: doc.source,
          text: slice,
          score: hits,
        });
      }
    }
    return out.sort((a, b) => b.score - a.score);
  }, [chunkSize, overlap, ragQuery]);

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
      detailAr: 'يتلقى الوكيل المخرج المهيكل ويصوغ إجابة مرتبطة بدليل الأداة.',
      detailEn: 'Agent ingests structured tool output and emits a cited final answer.',
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
            const active = activeSlug === tab.slug;
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
      {activeSlug === 'linux-aib100' && (
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

      {/* Lab 2: RAG Playground */}
      {activeSlug === 'rag-playground' && (
        <section className="space-y-5">
          <ConceptDiagram id="rag-flow" lang={lang} />

          <div className="grid gap-5 rounded-2xl border p-5 lg:grid-cols-12" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}>
            <div className="space-y-4 lg:col-span-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {lang === 'ar' ? 'ضبط معاملات التقطيع والاسترجاع' : 'Chunking & Query Controls'}
                </h2>
                <span className="text-[11px]" style={{ color: 'var(--color-warning)' }}>
                  {lang === 'ar' ? 'محاكاة تعليمية (Toy Corpus)' : 'Toy corpus simulation'}
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
                  onChange={(e) => setChunkSize(Number(e.target.value))}
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
                  onChange={(e) => setOverlap(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="rag-query" className="mb-1 block text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  {lang === 'ar' ? 'استعلام الاختبار (بالإنجليزية لتطابق الوثائق التجريبية):' : 'Test retrieval query:'}
                </label>
                <input
                  id="rag-query"
                  type="text"
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  className="ltr-isolate w-full rounded-xl border px-3 py-2 font-mono text-xs sm:text-sm"
                  style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                />
              </div>

              <button
                type="button"
                onClick={() => markLabCompleted('rag-playground')}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-xs font-bold sm:text-sm"
                style={{ backgroundColor: 'var(--color-action-primary)', color: 'var(--color-action-primary-fg)' }}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{lang === 'ar' ? 'تسجيل إتمام تجربة RAG' : 'Mark RAG Lab Practiced'}</span>
              </button>
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

      {/* Lab 3: Agent Tool Loop */}
      {activeSlug === 'agent-loop' && (
        <section className="space-y-5">
          <ConceptDiagram id="agent-loop" lang={lang} />

          <div className="rounded-2xl border p-5 sm:p-6" style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border)' }}>
            <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {lang === 'ar' ? 'تتبع تنفيذ أداة عبر MCP (محاكاة حتمية)' : 'Deterministic MCP Tool-Routing Trace'}
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {lang === 'ar'
                ? 'اختر الأداة التي سيطلبها الوكيل، ثم تتبع كيف تفحص طبقة الحماية الطلب قبل التنفيذ.'
                : 'Select a tool call candidate and step through the policy guardrail trace.'}
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

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  const next = Math.min(2, agentStep + 1);
                  setAgentStep(next);
                  if (next === 2) markLabCompleted('agent-loop');
                }}
                className="brand-gradient-bg inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 text-xs font-bold text-[#07111D] sm:text-sm"
              >
                <Play className="h-4 w-4" />
                <span>
                  {agentStep < 2
                    ? lang === 'ar'
                      ? 'تنفيذ الخطوة التالية'
                      : 'Advance Trace Step'
                    : lang === 'ar'
                      ? 'اكتمل التتبع'
                      : 'Trace Complete'}
                </span>
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

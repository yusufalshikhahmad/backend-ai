import React from 'react';
import { Language } from '../types/academy';

interface ConceptDiagramProps {
  id: 'linux-tree' | 'rag-flow' | 'agent-loop';
  lang: Language;
}

export const ConceptDiagram: React.FC<ConceptDiagramProps> = ({ id, lang }) => {
  if (id === 'linux-tree') {
    return (
      <figure
        className="rounded-2xl border p-4 sm:p-5"
        style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
      >
        <div className="ltr-isolate overflow-x-auto">
          <svg
            viewBox="0 0 640 240"
            className="mx-auto w-full max-w-[620px]"
            role="img"
            aria-label={
              lang === 'ar'
                ? 'مخطط شجرة الملفات في Linux من الجذر إلى مجلد مشروع ai-backend'
                : 'Linux filesystem tree diagram from root slash to ai-backend project'
            }
          >
            <rect x="260" y="12" width="120" height="36" rx="10" fill="var(--color-surface-1)" stroke="var(--color-cyan)" strokeWidth="1.5" />
            <text x="320" y="35" textAnchor="middle" fill="var(--color-text-primary)" fontSize="14" fontFamily="JetBrains Mono, monospace">
              / (root)
            </text>

            <path d="M320 48 V78 M160 78 H480 M160 78 V96 M480 78 V96" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="none" />

            <rect x="85" y="96" width="150" height="36" rx="10" fill="var(--color-surface-1)" stroke="var(--color-border-strong)" />
            <text x="160" y="119" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="13" fontFamily="JetBrains Mono, monospace">
              /etc  /var  /usr
            </text>

            <rect x="395" y="96" width="170" height="36" rx="10" fill="var(--color-surface-1)" stroke="var(--color-blue)" strokeWidth="1.5" />
            <text x="480" y="119" textAnchor="middle" fill="var(--color-text-primary)" fontSize="13" fontFamily="JetBrains Mono, monospace">
              /home/engineer
            </text>

            <path d="M480 132 V156 M360 156 H570 M360 156 V176 M480 156 V176 M570 156 V176" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="none" />

            <rect x="285" y="176" width="145" height="40" rx="10" fill="var(--color-surface-1)" stroke="var(--color-cyan)" />
            <text x="357" y="201" textAnchor="middle" fill="var(--color-text-primary)" fontSize="12" fontFamily="JetBrains Mono, monospace">
              ai-backend/src/
            </text>

            <rect x="442" y="176" width="90" height="40" rx="10" fill="var(--color-surface-1)" stroke="var(--color-violet)" />
            <text x="487" y="201" textAnchor="middle" fill="var(--color-text-primary)" fontSize="12" fontFamily="JetBrains Mono, monospace">
              configs/
            </text>

            <rect x="542" y="176" width="84" height="40" rx="10" fill="var(--color-surface-1)" stroke="var(--color-warning)" />
            <text x="584" y="201" textAnchor="middle" fill="var(--color-warning)" fontSize="12" fontFamily="JetBrains Mono, monospace">
              .env
            </text>
          </svg>
        </div>
        <figcaption className="mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {lang === 'ar'
            ? 'توضيح: تبدأ كل المسارات المطلقة من الجذر / بينما يعيش مشروعك عادةً داخل /home/engineer/ai-backend.'
            : 'Illustration: Absolute paths anchor at /, while your engineering workspace lives under /home/engineer/ai-backend.'}
        </figcaption>
      </figure>
    );
  }

  if (id === 'rag-flow') {
    return (
      <figure
        className="rounded-2xl border p-4 sm:p-5"
        style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
      >
        <div className="ltr-isolate overflow-x-auto">
          <svg
            viewBox="0 0 680 170"
            className="mx-auto w-full max-w-[660px]"
            role="img"
            aria-label={lang === 'ar' ? 'مخطط خط أنابيب RAG' : 'Illustrative RAG pipeline diagram'}
          >
            <rect x="16" y="45" width="120" height="62" rx="12" fill="var(--color-surface-1)" stroke="var(--color-border-strong)" />
            <text x="76" y="72" textAnchor="middle" fill="var(--color-text-primary)" fontSize="13" fontWeight="600">1. Docs</text>
            <text x="76" y="92" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11">Chunk + Overlap</text>

            <path d="M136 76 H178" stroke="var(--color-cyan)" strokeWidth="2" />

            <rect x="178" y="45" width="136" height="62" rx="12" fill="var(--color-surface-1)" stroke="var(--color-blue)" />
            <text x="246" y="72" textAnchor="middle" fill="var(--color-text-primary)" fontSize="13" fontWeight="600">2. Index</text>
            <text x="246" y="92" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11">Vectors + Metadata</text>

            <path d="M314 76 H356" stroke="var(--color-blue)" strokeWidth="2" />

            <rect x="356" y="45" width="136" height="62" rx="12" fill="var(--color-surface-1)" stroke="var(--color-violet)" />
            <text x="424" y="72" textAnchor="middle" fill="var(--color-text-primary)" fontSize="13" fontWeight="600">3. Retrieve Top-K</text>
            <text x="424" y="92" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11">Ranked Passages</text>

            <path d="M492 76 H534" stroke="var(--color-violet)" strokeWidth="2" />

            <rect x="534" y="45" width="130" height="62" rx="12" fill="var(--color-surface-1)" stroke="var(--color-success)" />
            <text x="599" y="72" textAnchor="middle" fill="var(--color-text-primary)" fontSize="13" fontWeight="600">4. Grounded LLM</text>
            <text x="599" y="92" textAnchor="middle" fill="var(--color-success)" fontSize="11">Answer + [Citations]</text>
          </svg>
        </div>
        <figcaption className="mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {lang === 'ar'
            ? 'رسم توضيحي لمراحل RAG الأربع مع إسناد المصادر.'
            : 'Illustrative diagram of the 4-stage RAG retrieval and citation pipeline.'}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure
      className="rounded-2xl border p-4 sm:p-5"
      style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
    >
      <div className="ltr-isolate overflow-x-auto">
        <svg
          viewBox="0 0 640 160"
          className="mx-auto w-full max-w-[620px]"
          role="img"
          aria-label={lang === 'ar' ? 'مخطط حلقة الوكيل والأدوات' : 'Agent tool loop diagram'}
        >
          <rect x="20" y="50" width="120" height="54" rx="12" fill="var(--color-surface-1)" stroke="var(--color-cyan)" />
          <text x="80" y="82" textAnchor="middle" fill="var(--color-text-primary)" fontSize="13" fontWeight="600">Plan / Reason</text>

          <path d="M140 77 H195" stroke="var(--color-cyan)" strokeWidth="2" />
          <rect x="195" y="50" width="125" height="54" rx="12" fill="var(--color-surface-1)" stroke="var(--color-blue)" />
          <text x="257" y="82" textAnchor="middle" fill="var(--color-text-primary)" fontSize="13" fontWeight="600">Select MCP Tool</text>

          <path d="M320 77 H375" stroke="var(--color-blue)" strokeWidth="2" />
          <rect x="375" y="50" width="120" height="54" rx="12" fill="var(--color-surface-1)" stroke="var(--color-warning)" />
          <text x="435" y="82" textAnchor="middle" fill="var(--color-text-primary)" fontSize="13" fontWeight="600">Sandbox Run</text>

          <path d="M495 77 H535" stroke="var(--color-violet)" strokeWidth="2" />
          <rect x="535" y="50" width="90" height="54" rx="12" fill="var(--color-surface-1)" stroke="var(--color-success)" />
          <text x="580" y="82" textAnchor="middle" fill="var(--color-success)" fontSize="13" fontWeight="600">Verify</text>
        </svg>
      </div>
    </figure>
  );
};

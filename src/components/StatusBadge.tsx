import React from 'react';
import { CheckCircle2, CircleDot, Lock, Sparkles, BookOpen, Circle } from 'lucide-react';
import { CourseStatus, Language } from '../types/academy';

interface StatusBadgeProps {
  status: CourseStatus;
  lang: Language;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, lang }) => {
  const map: Record<
    CourseStatus,
    { labelAr: string; labelEn: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
  > = {
    mastered: {
      labelAr: 'مُتقن',
      labelEn: 'Mastered',
      icon: CheckCircle2,
      color: 'var(--color-success)',
      bg: 'var(--color-success-bg)',
    },
    practiced: {
      labelAr: 'تم التمرّن',
      labelEn: 'Practiced',
      icon: Sparkles,
      color: 'var(--color-accent-text)',
      bg: 'var(--color-info-bg)',
    },
    in_progress: {
      labelAr: 'قيد التعلّم',
      labelEn: 'In progress',
      icon: CircleDot,
      color: 'var(--color-info)',
      bg: 'var(--color-info-bg)',
    },
    available: {
      labelAr: 'متاح الآن',
      labelEn: 'Available',
      icon: BookOpen,
      color: 'var(--color-accent-text)',
      bg: 'var(--color-surface-3)',
    },
    not_started: {
      labelAr: 'لم يبدأ',
      labelEn: 'Not started',
      icon: Circle,
      color: 'var(--color-text-secondary)',
      bg: 'var(--color-surface-2)',
    },
    locked: {
      labelAr: 'يتطلب متطلباً سابقاً',
      labelEn: 'Prerequisite required',
      icon: Lock,
      color: 'var(--color-warning)',
      bg: 'var(--color-warning-bg)',
    },
  };

  const cfg = map[status];
  const Icon = cfg.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.color, border: '1px solid var(--color-border)' }}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{lang === 'ar' ? cfg.labelAr : cfg.labelEn}</span>
    </span>
  );
};

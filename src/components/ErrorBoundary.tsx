import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message ?? 'Unexpected error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto max-w-[680px] px-4 py-16 text-center">
          <div
            className="rounded-2xl border p-8"
            style={{ backgroundColor: 'var(--color-surface-1)', borderColor: 'var(--color-border-strong)' }}
          >
            <AlertTriangle className="mx-auto h-10 w-10" style={{ color: 'var(--color-error)' }} />
            <h1 className="mt-4 text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              حدث خطأ غير متوقع في عرض الصفحة
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              An unexpected UI error occurred. Your local learning progress remains safe in browser storage.
            </p>
            <p
              className="ltr-isolate mt-3 rounded-lg p-2 font-mono text-xs"
              style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
            >
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, errorMessage: '' });
                window.location.href = '/';
              }}
              className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 text-sm font-bold"
              style={{ backgroundColor: 'var(--color-action-primary)', color: 'var(--color-action-primary-fg)' }}
            >
              <RotateCcw className="h-4 w-4" />
              <span>العودة إلى الرئيسية / Reload Home</span>
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

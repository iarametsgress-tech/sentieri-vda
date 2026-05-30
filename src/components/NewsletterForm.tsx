'use client';

import { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

export default function NewsletterForm({
  placeholder,
  cta,
  successMessage,
  errorMessage,
  variant = 'default',
}: {
  placeholder: string;
  cta: string;
  successMessage: string;
  errorMessage: string;
  /** 'default' = rettangolare (blog) · 'compact' = pill (footer) */
  variant?: 'default' | 'compact';
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email')?.toString().trim();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex items-center gap-3 text-sm text-snow/70">
        <Check size={16} className="text-alpenglow shrink-0" />
        {successMessage}
      </div>
    );
  }

  const compact = variant === 'compact';
  const radius = compact ? 'rounded-full' : 'rounded-xl';

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? 'flex gap-2 max-w-sm'
          : 'flex flex-col sm:flex-row gap-3'
      }
    >
      <input
        type="email"
        name="email"
        required
        placeholder={placeholder}
        aria-label={placeholder}
        className={`flex-1 bg-white/5 border border-white/10 ${radius} ${compact ? 'px-4 py-2.5' : 'px-4 py-3'} text-sm text-snow placeholder:text-snow/50 focus:outline-none focus:border-alpenglow/50 transition-colors`}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`inline-flex items-center justify-center gap-2 ${compact ? 'px-4 py-2.5' : 'px-6 py-3'} bg-alpenglow text-ink text-sm font-semibold ${radius} hover:bg-alpenglow/90 transition-colors disabled:opacity-60`}
      >
        {status === 'loading' ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <>
            {cta}
            {!compact && <ArrowRight size={14} />}
          </>
        )}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-300/80 sm:basis-full">{errorMessage}</p>
      )}
    </form>
  );
}

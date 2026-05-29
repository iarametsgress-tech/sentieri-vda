'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function NewsletterForm({
  placeholder,
  cta,
}: {
  placeholder: string;
  cta: string;
}) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire to Resend / newsletter API
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex items-center gap-3 text-sm text-snow/60">
        <Check size={16} className="text-alpenglow" />
        {cta === 'Subscribe' ? "You're subscribed. See you on the trail." : 'Iscrizione confermata. A presto sul sentiero.'}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        placeholder={placeholder}
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-snow placeholder:text-snow/30 focus:outline-none focus:border-alpenglow/50 transition-colors"
      />
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-6 py-3 bg-alpenglow text-ink text-sm font-semibold rounded-xl hover:bg-alpenglow/90 transition-colors"
      >
        {cta}
        <ArrowRight size={14} />
      </button>
    </form>
  );
}

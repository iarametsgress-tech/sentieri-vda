'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, X, Loader2, KeyRound, RefreshCw } from 'lucide-react';

type PendingPhoto = { url: string; pathname: string; uploadedAt: string };

const SECRET_KEY = 'svda-moderation-secret';

function targetOf(pathname: string): string {
  // community/pending/<entity>/<slug>/<file>
  const parts = pathname.split('/');
  return parts.length >= 4 ? `${parts[2]} · ${parts[3]}` : pathname;
}

export default function ModerationPanel() {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (s: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/community-photo?status=pending&secret=${encodeURIComponent(s)}`
      );
      if (res.status === 403) {
        setAuthed(false);
        setError('Secret non valido.');
        return;
      }
      const data = await res.json();
      setPhotos(Array.isArray(data.photos) ? data.photos : []);
      setAuthed(true);
      try {
        localStorage.setItem(SECRET_KEY, s);
      } catch {}
    } catch {
      setError('Errore di rete.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let saved = '';
    try {
      saved = localStorage.getItem(SECRET_KEY) ?? '';
    } catch {}
    if (saved) {
      setSecret(saved);
      void load(saved);
    }
  }, [load]);

  async function moderate(photo: PendingPhoto, action: 'approve' | 'reject') {
    setBusy(photo.pathname);
    setError(null);
    try {
      const res = await fetch(`/api/community-photo?secret=${encodeURIComponent(secret)}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, pathname: photo.pathname, url: photo.url }),
      });
      if (!res.ok) throw new Error('moderation');
      setPhotos((prev) => prev.filter((p) => p.pathname !== photo.pathname));
    } catch {
      setError('Operazione fallita, riprova.');
    } finally {
      setBusy(null);
    }
  }

  if (!authed) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (secret.trim()) void load(secret.trim());
        }}
        className="max-w-md space-y-4"
      >
        <label
          htmlFor="moderation-secret"
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-snow/55"
        >
          <KeyRound size={14} />
          Secret di moderazione
        </label>
        <input
          id="moderation-secret"
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-ink/60 px-4 py-3 text-snow outline-none focus:border-alpenglow/60"
          placeholder="COMMUNITY_MODERATION_SECRET"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading || !secret.trim()}
          className="inline-flex items-center gap-2 rounded-full border border-alpenglow/40 bg-alpenglow/10 px-5 py-2.5 text-sm font-medium text-alpenglow transition-colors hover:bg-alpenglow/20 disabled:opacity-50"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : null}
          Accedi
        </button>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      </form>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-snow/55">
          {photos.length === 0
            ? 'Nessuna foto in attesa di moderazione.'
            : `${photos.length} foto in attesa.`}
        </p>
        <button
          type="button"
          onClick={() => void load(secret)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-snow/70 transition-colors hover:border-white/30 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <RefreshCw size={13} />
          )}
          Aggiorna
        </button>
      </div>
      {error ? <p className="mb-4 text-sm text-rose-300">{error}</p> : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <figure
            key={p.pathname}
            className="overflow-hidden rounded-2xl border border-white/10 bg-ink/40"
          >
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="block aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" loading="lazy" className="h-full w-full object-cover" />
            </a>
            <figcaption className="flex items-center justify-between gap-2 p-3">
              <span className="truncate font-mono text-[11px] text-snow/55">
                {targetOf(p.pathname)}
              </span>
              <span className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => void moderate(p, 'approve')}
                  disabled={busy === p.pathname}
                  aria-label="Approva foto"
                  className="rounded-full border border-emerald-400/40 bg-emerald-500/10 p-2 text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:opacity-50"
                >
                  {busy === p.pathname ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => void moderate(p, 'reject')}
                  disabled={busy === p.pathname}
                  aria-label="Rifiuta foto"
                  className="rounded-full border border-rose-400/40 bg-rose-500/10 p-2 text-rose-300 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
                >
                  <X size={14} />
                </button>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

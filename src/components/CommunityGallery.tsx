'use client';

import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, Camera, CheckCircle2 } from 'lucide-react';

type Labels = {
  title: string;
  subtitle: string;
  cta: string;
  uploading: string;
  submitted: string;
  moderationNote: string;
  empty: string;
  errorType: string;
  errorLarge: string;
  errorGeneric: string;
  disabled: string;
};

type Photo = { url: string };

export default function CommunityGallery({
  entity,
  slug,
  labels,
}: {
  entity: 'refuge' | 'trail';
  slug: string;
  labels: Labels;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [storage, setStorage] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/community-photo?entity=${entity}&slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setPhotos(Array.isArray(d.photos) ? d.photos : []);
        setStorage(d.storage !== false);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [entity, slug]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = '';
    if (!file) return;
    setError(null);
    setSubmitted(false);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError(labels.errorType);
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setError(labels.errorLarge);
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('slug', slug);
      fd.append('entity', entity);
      const res = await fetch('/api/community-photo', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('upload');
      setSubmitted(true);
    } catch {
      setError(labels.errorGeneric);
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="mt-12">
      <h2 className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-snow/55">
        <Camera size={14} />
        {labels.title}
      </h2>
      <p className="mb-5 max-w-2xl text-sm text-snow/55">{labels.subtitle}</p>

      {photos.length > 0 ? (
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-ink/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </a>
          ))}
        </div>
      ) : (
        <p className="mb-5 text-sm text-snow/40">{labels.empty}</p>
      )}

      {storage ? (
        submitted ? (
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-5 py-2.5 text-sm text-emerald-200">
            <CheckCircle2 size={15} />
            {labels.submitted}
          </p>
        ) : (
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onPick}
              className="hidden"
              id={`upload-${entity}-${slug}`}
              disabled={uploading}
            />
            <label
              htmlFor={`upload-${entity}-${slug}`}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-alpenglow/40 bg-alpenglow/10 px-5 py-2.5 text-sm font-medium text-alpenglow transition-colors hover:bg-alpenglow/20 ${
                uploading ? 'pointer-events-none opacity-60' : ''
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {labels.uploading}
                </>
              ) : (
                <>
                  <ImagePlus size={15} />
                  {labels.cta}
                </>
              )}
            </label>
            <p className="mt-2 text-xs text-snow/40">{labels.moderationNote}</p>
            {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
          </div>
        )
      ) : (
        <p className="text-xs text-snow/40">{labels.disabled}</p>
      )}
    </section>
  );
}

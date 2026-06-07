import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

export const runtime = 'nodejs';

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const SLUG_RE = /^[a-z0-9-]{1,80}$/;

function prefixFor(slug: string): string {
  return `community/refuge/${slug}/`;
}

/** GET /api/refuge-photo?slug=xxx → elenco foto caricate dai visitatori. */
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('slug') ?? '';
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ photos: [] });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    // Storage non configurato: nessuna foto, ma niente errore lato UI.
    return NextResponse.json({ photos: [], storage: false });
  }
  try {
    const { blobs } = await list({ prefix: prefixFor(slug) });
    const photos = blobs
      .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
      .map((b) => ({ url: b.url, uploadedAt: b.uploadedAt }));
    return NextResponse.json({ photos, storage: true });
  } catch {
    return NextResponse.json({ photos: [], storage: false });
  }
}

/** POST /api/refuge-photo (multipart: file, slug) → carica una foto del visitatore. */
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'storage_not_configured' },
      { status: 503 },
    );
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  const slug = String(form.get('slug') ?? '');
  const file = form.get('file');
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: 'invalid_slug' }, { status: 400 });
  }
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'no_file' }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: 'invalid_type' }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 });
  }
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  try {
    const blob = await put(`${prefixFor(slug)}${id}.${ext}`, file, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json({ error: 'upload_failed' }, { status: 500 });
  }
}

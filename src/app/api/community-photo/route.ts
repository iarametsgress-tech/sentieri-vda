import { NextResponse } from 'next/server';
import { put, list, copy, del } from '@vercel/blob';

export const runtime = 'nodejs';

const MAX_BYTES = 6 * 1024 * 1024; // 6 MB
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const SLUG_RE = /^[a-z0-9-]{1,90}$/;
const ENTITIES = new Set(['refuge', 'trail']);

function approvedPrefix(entity: string, slug: string): string {
  return `community/approved/${entity}/${slug}/`;
}
function pendingPrefix(entity: string, slug: string): string {
  return `community/pending/${entity}/${slug}/`;
}
function hasStore(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}
function isAdmin(req: Request): boolean {
  const secret = process.env.COMMUNITY_MODERATION_SECRET;
  if (!secret) return false;
  const url = new URL(req.url);
  const provided =
    url.searchParams.get('secret') ?? req.headers.get('x-moderation-secret');
  return provided === secret;
}

/**
 * GET ?entity=&slug=            → foto APPROVATE (pubbliche)
 * GET ?entity=&slug=&status=pending&secret=…  → foto in attesa (solo admin)
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const entity = url.searchParams.get('entity') ?? '';
  const slug = url.searchParams.get('slug') ?? '';
  const status = url.searchParams.get('status') ?? 'approved';

  if (status === 'pending') {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    if (!hasStore()) return NextResponse.json({ photos: [], storage: false });
    // Senza entity/slug elenca TUTTE le foto in attesa (vista moderatore).
    const prefix =
      ENTITIES.has(entity) && SLUG_RE.test(slug)
        ? pendingPrefix(entity, slug)
        : 'community/pending/';
    try {
      const { blobs } = await list({ prefix });
      return NextResponse.json({
        photos: blobs
          .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
          .map((b) => ({ url: b.url, pathname: b.pathname, uploadedAt: b.uploadedAt })),
        storage: true,
      });
    } catch {
      return NextResponse.json({ photos: [], storage: false });
    }
  }

  if (!ENTITIES.has(entity) || !SLUG_RE.test(slug)) {
    return NextResponse.json({ photos: [] });
  }
  if (!hasStore()) return NextResponse.json({ photos: [], storage: false });

  try {
    const { blobs } = await list({ prefix: approvedPrefix(entity, slug) });
    const photos = blobs
      .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
      .map((b) => ({ url: b.url, uploadedAt: b.uploadedAt }));
    return NextResponse.json({ photos, storage: true });
  } catch {
    return NextResponse.json({ photos: [], storage: false });
  }
}

/**
 * POST (multipart: file, entity, slug) → pubblica subito la foto (moderazione
 * disattivata per ora: gli endpoint admin restano per rimuovere abusi a posteriori).
 */
export async function POST(request: Request) {
  if (!hasStore()) {
    return NextResponse.json({ error: 'storage_not_configured' }, { status: 503 });
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  const entity = String(form.get('entity') ?? '');
  const slug = String(form.get('slug') ?? '');
  const file = form.get('file');
  if (!ENTITIES.has(entity) || !SLUG_RE.test(slug)) {
    return NextResponse.json({ error: 'invalid_target' }, { status: 400 });
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
    const blob = await put(`${approvedPrefix(entity, slug)}${id}.${ext}`, file, {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false,
    });
    return NextResponse.json({ published: true, url: blob.url });
  } catch {
    return NextResponse.json({ error: 'upload_failed' }, { status: 500 });
  }
}

/**
 * PUT (json: { action: 'approve'|'reject', pathname }) — solo moderatore.
 * approve: sposta da pending/ ad approved/ ; reject: elimina.
 */
export async function PUT(request: Request) {
  if (!hasStore()) {
    return NextResponse.json({ error: 'storage_not_configured' }, { status: 503 });
  }
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }
  let body: { action?: string; pathname?: string; url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  const { action, pathname, url } = body;
  // reject può rimuovere anche foto già pubblicate (pulizia abusi)
  const validPrefix = action === 'reject' ? 'community/' : 'community/pending/';
  if (!pathname || !pathname.startsWith(validPrefix)) {
    return NextResponse.json({ error: 'invalid_pathname' }, { status: 400 });
  }
  try {
    if (action === 'approve') {
      const target = pathname.replace('community/pending/', 'community/approved/');
      await copy(url ?? pathname, target, { access: 'public' });
      await del(url ?? pathname);
      return NextResponse.json({ ok: true });
    }
    if (action === 'reject') {
      await del(url ?? pathname);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'moderation_failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { z } from 'zod';

const BodySchema = z.object({
  email: z.string().email(),
});

/**
 * Iscrizione newsletter.
 * - Se RESEND_API_KEY + RESEND_AUDIENCE_ID sono configurati, crea il contatto su Resend.
 * - Altrimenti risponde 503 'not_configured' (il client mostra un messaggio onesto,
 *   senza fingere un'iscrizione avvenuta).
 */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  const { email } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    return NextResponse.json(
      { ok: false, error: 'not_configured' },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error('Resend newsletter error', res.status, detail);
      return NextResponse.json({ ok: false, error: 'provider_error' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Newsletter route exception', e);
    return NextResponse.json({ ok: false, error: 'network' }, { status: 502 });
  }
}

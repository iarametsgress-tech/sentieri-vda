/**
 * Central site configuration.
 * To switch to a custom domain, set NEXT_PUBLIC_SITE_URL in Vercel env vars.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sentierivda.it';

/**
 * Autore / curatore del sito — usato per i segnali E-E-A-T (Google premia
 * i contenuti con un autore identificabile, soprattutto su temi di sicurezza).
 * ▶︎ CAMBIA `name` con il tuo nome reale. Compare nelle schede sentiero e nel JSON-LD.
 */
export const SITE_AUTHOR = {
  name: 'Andrea', // ← metti qui il tuo nome/cognome
  url: `${SITE_URL}/about`,
  /** Foto in /public — sostituire con ritratto reale del curatore */
  photo: '/about/author.svg',
  email: 'info@sentierivda.it',
};

/** Banner homepage «In produzione / versione alpha» — impostare false per rimuoverlo. */
export const SHOW_ALPHA_BANNER = true;

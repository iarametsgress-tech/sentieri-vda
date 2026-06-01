import fs from 'node:fs/promises';

/** Carica variabili da .env.local (tsx non le legge automaticamente come Next.js). */
export async function loadEnvLocal(): Promise<void> {
  try {
    const envContent = await fs.readFile('.env.local', 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // .env.local assente: ok in CI se le variabili sono già nell'ambiente
  }
}

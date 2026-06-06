import type { Trail } from './types';

/**
 * Valutazione INDICATIVA dell'idoneità di un sentiero per bambini e cani.
 * Derivata SOLO da dati reali (difficoltà CAI, dislivello, distanza) e da
 * regolamenti ufficiali (nel Parco Nazionale del Gran Paradiso i cani non
 * sono ammessi). Non è un dato inventato per-sentiero: è una stima trasparente
 * basata su criteri oggettivi, sempre da verificare sul posto.
 */

export type Suitability = 'yes' | 'caution' | 'no';

/** Valli/comuni il cui territorio ricade in gran parte nel Parco del Gran Paradiso. */
const GRAN_PARADISO_HINTS = [
  'cogne',
  'valsavarenche',
  'rhêmes',
  'rhemes',
];

export function inGranParadisoPark(trail: Trail): boolean {
  const hay = `${trail.valley ?? ''} ${(trail.municipalities ?? []).join(' ')}`.toLowerCase();
  return GRAN_PARADISO_HINTS.some((h) => hay.includes(h));
}

/** Idoneità per bambini: basata su difficoltà CAI + dislivello + distanza. */
export function childrenSuitability(trail: Trail): Suitability {
  const d = trail.difficulty;
  if (d === 'EE' || d === 'EEA' || d === 'A') return 'no';
  if (d === 'T') return 'yes';
  // Escursionistico (E): dipende dall'impegno
  if ((trail.elevation_gain_m ?? 0) <= 450 && (trail.distance_km ?? 0) <= 7) return 'caution';
  return 'no';
}

/** Idoneità per cani: regole del Parco + tratti attrezzati (EEA/A). */
export function dogSuitability(trail: Trail): { status: Suitability; park: boolean } {
  if (inGranParadisoPark(trail)) return { status: 'no', park: true };
  const d = trail.difficulty;
  if (d === 'EEA' || d === 'A') return { status: 'no', park: false };
  return { status: 'yes', park: false };
}

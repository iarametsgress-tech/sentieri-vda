/** Arrotonda km a 1 decimale (es. 9.233… → 9.2). */
export function roundDistanceKm(km: number): number {
  return Math.round(km * 10) / 10;
}

/** Formato display: 9.2 km, 10 km (niente cifre spuri). */
export function formatDistanceKm(km: number): string {
  const rounded = roundDistanceKm(km);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** Etichetta completa per UI. */
export function formatDistanceLabel(km: number): string {
  return `${formatDistanceKm(km)} km`;
}

import type { Difficulty } from '../../src/lib/types';
import { parseSenPeriod } from './sct-utils';

type EnrichInput = {
  name_it: string;
  sct_code: string;
  slug: string;
  difficulty: Difficulty;
  distance_km: number;
  elevation_gain_m: number;
  elevation_loss_m?: number;
  start?: { name: string; elevation_m: number } | null;
  end?: { name: string; elevation_m: number } | null;
  valley_it: string;
  valley_en: string;
  valley_fr: string;
  valley_de: string;
  municipalities: string[];
  sen_period?: string | null;
  signposts?: number | null;
};

function minMaxElev(start?: number | null, end?: number | null): { min: number; max: number } | null {
  if (start == null || end == null) return null;
  return { min: Math.min(start, end), max: Math.max(start, end) };
}

export function buildEditorialDescriptions(input: EnrichInput) {
  const km = input.distance_km.toFixed(1);
  const gain = Math.round(input.elevation_gain_m);
  const loss = Math.round(input.elevation_loss_m ?? 0);
  const a = input.start?.name?.trim() || '—';
  const b = input.end?.name?.trim() || '—';
  const ea = input.start?.elevation_m;
  const eb = input.end?.elevation_m;
  const elev = minMaxElev(ea, eb);
  const diff = input.difficulty;
  const comune = input.municipalities[0] ?? '';
  const { best_months, season } = parseSenPeriod(input.sen_period ?? null);
  const monthsLabel = best_months.join(', ');
  const signs =
    input.signposts != null && input.signposts > 0
      ? `${input.signposts} segnavia`
      : null;

  const short_it = `${km} km · +${gain} m · ${diff} — da ${a} a ${b}${input.valley_it ? ` (${input.valley_it})` : ''}.`;
  const short_en = `${km} km · +${gain} m · ${diff} — from ${a} to ${b}${input.valley_en ? ` (${input.valley_en})` : ''}.`;

  const long_it = [
    `${input.name_it} è un sentiero ufficiale del Catasto Sentieri della Valle d'Aosta (codice ${input.sct_code}).`,
    comune
      ? `Il tracciato ricade nel comune di ${comune}${input.valley_it ? `, in ${input.valley_it}` : ''}.`
      : input.valley_it
        ? `Il tracciato si sviluppa in ${input.valley_it}.`
        : null,
    `Partenza da ${a}${ea != null ? ` (${ea} m)` : ''}, arrivo a ${b}${eb != null ? ` (${eb} m)` : ''}: ${km} km con +${gain} m${loss > 0 ? ` e −${loss} m` : ''} di dislivello, difficoltà ${diff} (scala CAI).`,
    elev ? `Quota minima ${elev.min} m, massima ${elev.max} m.` : null,
    input.sen_period ? `Periodo consigliato dal Catasto: ${input.sen_period} (mesi ${monthsLabel}).` : null,
    signs ? `Rete segnaletica: ${signs} censiti dal Catasto.` : null,
    'Tracciato GPX e dati altimetrici dalla Regione Autonoma Valle d\'Aosta (open data DGR 899/2014).',
  ]
    .filter(Boolean)
    .join(' ');

  const long_en = [
    `${input.name_it} is an official trail from the Aosta Valley trail registry (code ${input.sct_code}).`,
    comune
      ? `The route lies in the municipality of ${comune}${input.valley_en ? `, in the ${input.valley_en}` : ''}.`
      : input.valley_en
        ? `The route runs through the ${input.valley_en}.`
        : null,
    `From ${a}${ea != null ? ` (${ea} m)` : ''} to ${b}${eb != null ? ` (${eb} m)` : ''}: ${km} km with +${gain} m${loss > 0 ? ` and −${loss} m` : ''} of elevation change, difficulty ${diff} (CAI scale).`,
    elev ? `Minimum elevation ${elev.min} m, maximum ${elev.max} m.` : null,
    input.sen_period ? `Recommended season per registry: ${input.sen_period} (months ${monthsLabel}).` : null,
    signs ? `Waymarking: ${signs} recorded in the registry.` : null,
    'GPX track and elevation data from Regione Autonoma Valle d\'Aosta (open data DGR 899/2014).',
  ]
    .filter(Boolean)
    .join(' ');

  const long_fr = [
    `${input.name_it} : sentier officiel du cadastre des sentiers de la Vallée d'Aoste (code ${input.sct_code}).`,
    comune
      ? `Le tracé se situe dans la commune de ${comune}${input.valley_fr ? `, en ${input.valley_fr}` : ''}.`
      : input.valley_fr
        ? `Le tracé se développe en ${input.valley_fr}.`
        : null,
    `De ${a}${ea != null ? ` (${ea} m)` : ''} à ${b}${eb != null ? ` (${eb} m)` : ''} : ${km} km avec +${gain} m${loss > 0 ? ` et −${loss} m` : ''} de dénivelé, difficulté ${diff} (échelle CAI).`,
    elev ? `Altitude minimale ${elev.min} m, maximale ${elev.max} m.` : null,
    input.sen_period ? `Période recommandée au cadastre : ${input.sen_period} (mois ${monthsLabel}).` : null,
    signs ? `Signalétique : ${signs} recensés au cadastre.` : null,
    'Tracé GPX et données altimétriques de la Région Autonome Vallée d\'Aoste (open data DGR 899/2014).',
  ]
    .filter(Boolean)
    .join(' ');

  const long_de = [
    `${input.name_it}: offizieller Weg aus dem Wegekataster des Aostatals (Code ${input.sct_code}).`,
    comune
      ? `Die Strecke liegt in der Gemeinde ${comune}${input.valley_de ? ` im ${input.valley_de}` : ''}.`
      : input.valley_de
        ? `Die Strecke verläuft im ${input.valley_de}.`
        : null,
    `Von ${a}${ea != null ? ` (${ea} m)` : ''} nach ${b}${eb != null ? ` (${eb} m)` : ''}: ${km} km mit +${gain} m${loss > 0 ? ` und −${loss} m` : ''} Höhenunterschied, Schwierigkeit ${diff} (CAI-Skala).`,
    elev ? `Minimale Höhe ${elev.min} m, maximale ${elev.max} m.` : null,
    input.sen_period ? `Empfohlene Saison laut Kataster: ${input.sen_period} (Monate ${monthsLabel}).` : null,
    signs ? `Markierung: ${signs} im Kataster erfasst.` : null,
    'GPX-Strecke und Höhendaten der Autonomen Region Aostatal (Open Data DGR 899/2014).',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    shortDescription_it: short_it.slice(0, 280),
    shortDescription_en: short_en.slice(0, 280),
    shortDescription_fr: `${km} km · +${gain} m · ${diff} — de ${a} à ${b}${input.valley_fr ? ` (${input.valley_fr})` : ''}.`.slice(
      0,
      280
    ),
    shortDescription_de: `${km} km · +${gain} m · ${diff} — von ${a} nach ${b}${input.valley_de ? ` (${input.valley_de})` : ''}.`.slice(
      0,
      280
    ),
    description_it: long_it,
    description_en: long_en,
    description_fr: long_fr,
    description_de: long_de,
    best_months,
    season,
  };
}

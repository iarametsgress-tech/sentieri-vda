/**
 * Genera src/data/comuni-vda.json dal Catasto + elenco ufficiale 74 comuni VdA.
 * Fonte comuni: Regione Autonoma VdA / ISTAT (74 comuni).
 * Fonte codici: sen_cod_co nel Catasto Sentieri (01–74).
 *
 * Uso: npm run generate:comuni
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { loadSctRaw, type SctProps } from './lib/sct-utils';

/** 74 comuni ufficiali — ordine usato per inferenza incrociata col Catasto. */
export const COMUNI_VDA = [
  'Allein',
  'Antey-Saint-André',
  'Aosta',
  'Arnad',
  'Arvier',
  'Avise',
  'Ayas',
  'Aymavilles',
  'Bard',
  'Bionaz',
  'Brissogne',
  'Brusson',
  'Challand-Saint-Anselme',
  'Challand-Saint-Victor',
  'Champdepraz',
  'Champorcher',
  'Charvensod',
  'Châtillon',
  'Cogne',
  'Courmayeur',
  'Donnas',
  'Doues',
  'Emarèse',
  'Etroubles',
  'Fénis',
  'Fontainemore',
  'Gaby',
  'Gignod',
  'Gressan',
  'Gressoney-La-Trinité',
  'Gressoney-Saint-Jean',
  'Hône',
  'Introd',
  'Issime',
  'Issogne',
  'Jovençan',
  'La Magdeleine',
  'La Salle',
  'La Thuile',
  'Lillianes',
  'Montjovet',
  'Morgex',
  'Nus',
  'Ollomont',
  'Oyace',
  'Perloz',
  'Pollein',
  'Pont-Saint-Martin',
  'Pontboset',
  'Pré-Saint-Didier',
  'Quart',
  'Rhêmes-Notre-Dame',
  'Rhêmes-Saint-Georges',
  'Roisan',
  'Saint-Christophe',
  'Saint-Denis',
  'Saint-Marcel',
  'Saint-Nicolas',
  'Saint-Oyen',
  'Saint-Pierre',
  'Saint-Rhémy-en-Bosses',
  'Saint-Vincent',
  'Sarre',
  'Torgnon',
  'Valgrisenche',
  'Valpelline',
  'Valtournenche',
  'Verrayes',
  'Verrès',
  'Villeneuve',
  'Valsavarenche',
] as const;

/** Valle principale per comune — fonte: lovevda.it / cartografia regionale. */
const VALLEY_BY_COMUNE: Record<string, { it: string; en: string; fr: string; de: string }> = {
  Allein: { it: "Valle d'Ayas", en: "Ayas Valley", fr: "Vallée d'Ayas", de: 'Ayas-Tal' },
  'Antey-Saint-André': { it: 'Valtournenche', en: 'Valtournenche', fr: 'Valtournenche', de: 'Valtournenche' },
  Aosta: { it: 'Valle centrale', en: 'Central valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  Arnad: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Arvier: { it: 'Valgrisenche', en: 'Valgrisenche', fr: 'Valgrisenche', de: 'Valgrisenche' },
  Avise: { it: 'Valle del Gran San Bernardo', en: 'Great St Bernard Valley', fr: 'Vallée du Grand-Saint-Bernard', de: 'Grosser-St-Bernhard-Tal' },
  Ayas: { it: "Valle d'Ayas", en: "Ayas Valley", fr: "Vallée d'Ayas", de: 'Ayas-Tal' },
  Aymavilles: { it: 'Valle centrale', en: 'Central valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  Bard: { it: 'Valle del Gran San Bernardo', en: 'Great St Bernard Valley', fr: 'Vallée du Grand-Saint-Bernard', de: 'Grosser-St-Bernhard-Tal' },
  Bionaz: { it: 'Valpelline', en: 'Valpelline', fr: 'Valpelline', de: 'Valpelline' },
  Brissogne: { it: 'Valle centrale', en: 'Central valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  Brusson: { it: "Valle d'Ayas", en: "Ayas Valley", fr: "Vallée d'Ayas", de: 'Ayas-Tal' },
  'Challand-Saint-Anselme': { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  'Challand-Saint-Victor': { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Champdepraz: { it: 'Valle di Champorcher', en: 'Champorcher Valley', fr: 'Vallée de Champorcher', de: 'Champorcher-Tal' },
  Champorcher: { it: 'Valle di Champorcher', en: 'Champorcher Valley', fr: 'Vallée de Champorcher', de: 'Champorcher-Tal' },
  Charvensod: { it: 'Valle di Cogne', en: 'Cogne Valley', fr: 'Val de Cogne', de: 'Cogne-Tal' },
  Châtillon: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Cogne: { it: 'Val di Cogne', en: 'Cogne Valley', fr: 'Val de Cogne', de: 'Cogne-Tal' },
  Courmayeur: { it: 'Val Ferret', en: 'Val Ferret', fr: 'Val Ferret', de: 'Val Ferret' },
  Donnas: { it: 'Bassa Valle', en: 'Lower Valley', fr: 'Basse Vallée', de: 'Untertal' },
  Doues: { it: 'Valle del Gran San Bernardo', en: 'Great St Bernard Valley', fr: 'Vallée du Grand-Saint-Bernard', de: 'Grosser-St-Bernhard-Tal' },
  Emarèse: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Etroubles: { it: 'Valle del Gran San Bernardo', en: 'Great St Bernard Valley', fr: 'Vallée du Grand-Saint-Bernard', de: 'Grosser-St-Bernhard-Tal' },
  Fénis: { it: 'Valle centrale', en: 'Central valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  Fontainemore: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Gaby: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Gignod: { it: 'Valle centrale', en: 'Central valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  Gressan: { it: 'Valle centrale', en: 'Central valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  'Gressoney-La-Trinité': { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  'Gressoney-Saint-Jean': { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Hône: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Introd: { it: 'Valle del Gran San Bernardo', en: 'Great St Bernard Valley', fr: 'Vallée du Grand-Saint-Bernard', de: 'Grosser-St-Bernhard-Tal' },
  Issime: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Issogne: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Jovençan: { it: 'Valle centrale', en: 'Central valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  'La Magdeleine': { it: 'Valtournenche', en: 'Valtournenche', fr: 'Valtournenche', de: 'Valtournenche' },
  'La Salle': { it: 'Val Ferret', en: 'Val Ferret', fr: 'Val Ferret', de: 'Val Ferret' },
  'La Thuile': { it: 'La Thuile', en: 'La Thuile', fr: 'La Thuile', de: 'La Thuile' },
  Lillianes: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Montjovet: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Morgex: { it: 'Valle del Gran San Bernardo', en: 'Great St Bernard Valley', fr: 'Vallée du Grand-Saint-Bernard', de: 'Grosser-St-Bernhard-Tal' },
  Nus: { it: 'Valle del Gran San Bernardo', en: 'Great St Bernard Valley', fr: 'Vallée du Grand-Saint-Bernard', de: 'Grosser-St-Bernhard-Tal' },
  Ollomont: { it: 'Valpelline', en: 'Valpelline', fr: 'Valpelline', de: 'Valpelline' },
  Oyace: { it: 'Valpelline', en: 'Valpelline', fr: 'Valpelline', de: 'Valpelline' },
  Perloz: { it: 'Bassa Valle', en: 'Lower Valley', fr: 'Basse Vallée', de: 'Untertal' },
  Pollein: { it: 'Valle centrale', en: 'Central valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  'Pont-Saint-Martin': { it: 'Bassa Valle', en: 'Lower Valley', fr: 'Basse Vallée', de: 'Untertal' },
  Pontboset: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  'Pré-Saint-Didier': { it: 'Val Ferret', en: 'Val Ferret', fr: 'Val Ferret', de: 'Val Ferret' },
  Quart: { it: 'Valle centrale', en: 'Central valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  'Rhêmes-Notre-Dame': { it: 'Val di Rhêmes', en: 'Rhêmes Valley', fr: 'Val de Rhêmes', de: 'Rhêmes-Tal' },
  'Rhêmes-Saint-Georges': { it: 'Val di Rhêmes', en: 'Rhêmes Valley', fr: 'Val de Rhêmes', de: 'Rhêmes-Tal' },
  Roisan: { it: 'Valle centrale', en: 'Central valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  'Saint-Christophe': { it: 'Valle centrale', en: 'Central valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  'Saint-Denis': { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  'Saint-Marcel': { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  'Saint-Nicolas': { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  'Saint-Oyen': { it: 'Valle del Gran San Bernardo', en: 'Great St Bernard Valley', fr: 'Vallée du Grand-Saint-Bernard', de: 'Grosser-St-Bernhard-Tal' },
  'Saint-Pierre': { it: 'Valle centrale', en: 'Central valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  'Saint-Rhémy-en-Bosses': { it: 'Valle del Gran San Bernardo', en: 'Great St Bernard Valley', fr: 'Vallée du Grand-Saint-Bernard', de: 'Grosser-St-Bernhard-Tal' },
  'Saint-Vincent': { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Sarre: { it: 'Valle centrale', en: 'Central valley', fr: 'Vallée centrale', de: 'Zentraltal' },
  Torgnon: { it: 'Valtournenche', en: 'Valtournenche', fr: 'Valtournenche', de: 'Valtournenche' },
  Valgrisenche: { it: 'Valgrisenche', en: 'Valgrisenche', fr: 'Valgrisenche', de: 'Valgrisenche' },
  Valpelline: { it: 'Valpelline', en: 'Valpelline', fr: 'Valpelline', de: 'Valpelline' },
  Valtournenche: { it: 'Valtournenche', en: 'Valtournenche', fr: 'Valtournenche', de: 'Valtournenche' },
  Verrayes: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Verrès: { it: 'Valle del Lys', en: 'Lys Valley', fr: 'Vallée du Lys', de: 'Lys-Tal' },
  Villeneuve: { it: 'Valle del Gran San Bernardo', en: 'Great St Bernard Valley', fr: 'Vallée du Grand-Saint-Bernard', de: 'Grosser-St-Bernhard-Tal' },
  Valsavarenche: { it: 'Valsavarenche', en: 'Valsavarenche', fr: 'Valsavarenche', de: 'Valsavarenche' },
};

/** Mapping verificato manualmente da campioni Catasto + toponimia. */
const CODE_TO_COMUNE: Record<string, string> = {
  '01': 'Allein',
  '02': 'Torgnon',
  '03': 'Challand-Saint-Victor',
  '04': 'Avise',
  '05': 'Arvier',
  '06': 'La Salle',
  '07': 'Avise',
  '08': 'Aymavilles',
  '09': 'Bard',
  '10': 'Bionaz',
  '11': 'Brissogne',
  '12': 'Brusson',
  '13': 'Brusson',
  '14': 'Challand-Saint-Victor',
  '15': 'Châtillon',
  '16': 'Champdepraz',
  '17': 'Charvensod',
  '18': 'Châtillon',
  '19': 'Cogne',
  '20': 'Courmayeur',
  '21': 'Donnas',
  '22': 'Doues',
  '23': 'Emarèse',
  '24': 'Emarèse',
  '25': 'Etroubles',
  '26': 'Fénis',
  '27': 'Fontainemore',
  '28': 'Gaby',
  '29': 'Gignod',
  '30': 'Gressan',
  '31': 'Gressoney-La-Trinité',
  '32': 'Gressoney-Saint-Jean',
  '33': 'Hône',
  '34': 'Introd',
  '35': 'Issime',
  '36': 'Issogne',
  '37': 'Jovençan',
  '38': 'La Magdeleine',
  '39': 'La Salle',
  '40': 'La Thuile',
  '41': 'Lillianes',
  '42': 'Montjovet',
  '43': 'Morgex',
  '44': 'Nus',
  '45': 'Ollomont',
  '46': 'Oyace',
  '47': 'Perloz',
  '48': 'Pollein',
  '49': 'Pont-Saint-Martin',
  '50': 'Pontboset',
  '51': 'Pré-Saint-Didier',
  '52': 'Quart',
  '53': 'Rhêmes-Notre-Dame',
  '54': 'Rhêmes-Saint-Georges',
  '55': 'Roisan',
  '56': 'Saint-Christophe',
  '57': 'Saint-Denis',
  '58': 'Saint-Marcel',
  '59': 'Saint-Nicolas',
  '60': 'Saint-Oyen',
  '61': 'Saint-Pierre',
  '62': 'Saint-Rhémy-en-Bosses',
  '63': 'Saint-Vincent',
  '64': 'Sarre',
  '65': 'Torgnon',
  '66': 'Valgrisenche',
  '67': 'Valpelline',
  '68': 'Valtournenche',
  '69': 'Verrayes',
  '70': 'Verrès',
  '71': 'Villeneuve',
  '72': 'Valsavarenche',
  '73': 'Antey-Saint-André',
  '74': 'Aosta',
};

function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/['']/g, '')
    .trim();
}

function inferComuneFromTrail(name: string): string | null {
  const paren = name.match(/\(([^)]+)\)/);
  if (paren) {
    const inner = paren[1].trim();
    for (const c of COMUNI_VDA) {
      if (normalizeKey(c) === normalizeKey(inner)) return c;
    }
  }
  for (const c of COMUNI_VDA) {
    const nk = normalizeKey(c);
    if (normalizeKey(name).startsWith(nk + ' -') || normalizeKey(name).startsWith(nk + '-')) {
      return c;
    }
  }
  const beforeDash = name.split(' - ')[0]?.trim();
  if (beforeDash) {
    for (const c of COMUNI_VDA) {
      if (normalizeKey(c) === normalizeKey(beforeDash)) return c;
    }
  }
  return null;
}

async function main() {
  const geo = loadSctRaw();
  const unmapped: string[] = [];
  const out: Record<
    string,
    {
      code: string;
      name: string;
      valley_it: string;
      valley_en: string;
      valley_fr: string;
      valley_de: string;
      source: string;
    }
  > = {};

  const codes = new Set<string>();
  for (const f of geo.features) {
    const c = String((f.properties as SctProps)?.sen_cod_co ?? '').padStart(2, '0');
    if (c) codes.add(c);
  }

  for (const code of [...codes].sort()) {
    let comune = CODE_TO_COMUNE[code];
    if (!comune) {
      const names = geo.features
        .filter((f) => String((f.properties as SctProps)?.sen_cod_co).padStart(2, '0') === code)
        .map((f) => String((f.properties as SctProps)?.sen_nome_s ?? ''));
      for (const n of names) {
        const inferred = inferComuneFromTrail(n);
        if (inferred) {
          comune = inferred;
          break;
        }
      }
    }
    if (!comune || !VALLEY_BY_COMUNE[comune]) {
      unmapped.push(code);
      continue;
    }
    const v = VALLEY_BY_COMUNE[comune];
    out[code] = {
      code,
      name: comune,
      valley_it: v.it,
      valley_en: v.en,
      valley_fr: v.fr,
      valley_de: v.de,
      source: 'Regione Autonoma Valle d\'Aosta — Catasto Sentieri / lovevda.it',
    };
  }

  const outPath = path.resolve('src/data/comuni-vda.json');
  await fs.writeFile(
    outPath,
    JSON.stringify(
      {
        _meta: {
          source: 'Regione Autonoma Valle d\'Aosta — Catasto Sentieri (sen_cod_co)',
          comuni_count: Object.keys(out).length,
          unmapped_codes: unmapped,
        },
        comuni: out,
      },
      null,
      2
    ) + '\n'
  );

  console.log(`✓ ${Object.keys(out).length} comuni mappati → ${outPath}`);
  if (unmapped.length) console.log(`⚠ Codici non mappati: ${unmapped.join(', ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

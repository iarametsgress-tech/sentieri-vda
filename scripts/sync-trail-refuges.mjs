/**
 * Popola refuges[] in trails.json e trails-routes.json dai nomi start/end/waypoints.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const REFUGE_NAME_TO_SLUG = {
  'Rifugio Walter Bonatti': 'rifugio-bonatti',
  'Rifugio Bonatti': 'rifugio-bonatti',
  'Rifugio Bertone': 'rifugio-bertone',
  'Rifugio Coda': 'rifugio-coda',
  'Rifugio Barma': 'rifugio-barma',
  'Rifugio Vieux Crest': 'rifugio-vieux-crest',
  'Rifugio Grand Tournalin': 'rifugio-grand-tournalin',
  'Rifugio Jean Barmasse': 'rifugio-jean-barmasse',
  'Rifugio Oratorio di Cuney': 'rifugio-oratorio-di-cuney',
  'Rifugio Oratorio di Cunéy': 'rifugio-oratorio-di-cuney',
  'Rifugio Champillon': 'rifugio-champillon',
  'Rifugio Pier Giorgio Frassati': 'rifugio-frassati',
  'Rifugio Elisabetta Soldini': 'rifugio-elisabetta-soldini',
  'Rifugio Elisabetta': 'rifugio-elisabetta-soldini',
  'Rifugio Maison Vieille': 'rifugio-maison-vieille',
  Promoud: 'bivacco-promoud',
  'Bivacco Promoud': 'bivacco-promoud',
  "Rifugio Chalet de l'Épée": 'rifugio-chalet-de-lepee',
  'Rifugio Chalet de l Epée': 'rifugio-chalet-de-lepee',
  'Rifugio Vittorio Sella': 'rifugio-vittorio-sella',
  'Rifugio Sogno di Berdzé': 'rifugio-sogno-di-berdze',
  'Rifugio Sogno di Berdze': 'rifugio-sogno-di-berdze',
  'Rifugio Dondena': 'rifugio-dondena',
  'Rifugio Deffeyes': 'rifugio-deffeyes',
  'Rifugio Albert Deffeyes': 'rifugio-deffeyes',
  'Rifugio Elena': 'rifugio-elena',
  'Rifugio Gabiet': 'rifugio-gabiet',
  'Rifugio Duca degli Abruzzi': 'rifugio-duca-degli-abruzzi',
  'Rifugio Oriondé': 'rifugio-orionde',
  'Rifugio Orionde': 'rifugio-orionde',
  'Rifugio Verney': 'rifugio-verney',
  'Rifugio Prarayer': 'rifugio-prarayer',
};

function extractSlugs(trail) {
  const slugs = new Set(trail.refuges ?? []);
  for (const name of [trail.start?.name, trail.end?.name]) {
    if (name && REFUGE_NAME_TO_SLUG[name]) slugs.add(REFUGE_NAME_TO_SLUG[name]);
  }
  for (const wp of trail.waypoints ?? []) {
    if (['rifugio', 'bivacco', 'capanna'].includes(wp.type)) {
      const s = REFUGE_NAME_TO_SLUG[wp.name];
      if (s) slugs.add(s);
    }
  }
  return [...slugs].sort();
}

async function main() {
  for (const file of ['src/data/trails.json', 'src/data/trails-routes.json']) {
    const p = path.resolve(file);
    const trails = JSON.parse(await fs.readFile(p, 'utf8'));
    let updated = 0;
    for (const trail of trails) {
      const next = extractSlugs(trail);
      const prev = JSON.stringify(trail.refuges ?? []);
      trail.refuges = next;
      if (JSON.stringify(next) !== prev) updated++;
    }
    await fs.writeFile(p, JSON.stringify(trails, null, 2) + '\n');
    console.log(`✓ ${file}: ${updated} tappe aggiornate`);
  }
}

main();

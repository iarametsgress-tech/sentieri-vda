/** Verifica post-deploy su sentierivda.it */
const BASE = 'https://sentierivda.it';

// 1. pagina tour TMB
let r = await fetch(`${BASE}/it/tour/tmb`);
let html = await r.text();
console.log('tour/tmb:', r.status, '| Tappa 13:', html.includes('Tappa 13'), '| La Fouly:', html.includes('La Fouly'), '| 13 tappe:', html.includes('13 tappe'));

// 2. GPX nuova tappa estera
r = await fetch(`${BASE}/gpx/tour-mont-blanc-tappa-12-les-chapieux-rifugio-elisabetta.gpx`);
const gpx = await r.text();
console.log('gpx tappa 12:', r.status, '| trkpt:', (gpx.match(/<trkpt/g) || []).length);

// 3. redirect vecchio slug
r = await fetch(`${BASE}/it/sentieri/tour-cervino-tappa-1-breuil-rifugio-duca-abruzzi`, { redirect: 'manual' });
console.log('redirect vecchio slug:', r.status, '→', r.headers.get('location'));

// 4. pagina nuova tappa cervino + transfer stage
r = await fetch(`${BASE}/it/sentieri/tour-cervino-tappa-1-breuil-cervinia-rifugio-prarayer`);
console.log('pagina tappa cervino 1:', r.status);
r = await fetch(`${BASE}/it/sentieri/tour-monte-rosa-tappa-8-zermatt-breuil-cervinia`);
console.log('pagina transfer teodulo:', r.status);

// 5. moderazione
r = await fetch(`${BASE}/it/moderazione`);
console.log('moderazione:', r.status);

// 6. upload foto test (pending) e cleanup
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);
const fd = new FormData();
fd.append('file', new Blob([png], { type: 'image/png' }), 't.png');
fd.append('entity', 'refuge');
fd.append('slug', 'rifugio-bonatti');
r = await fetch(`${BASE}/api/community-photo`, { method: 'POST', body: fd });
console.log('upload foto:', r.status, await r.text());

// 7. lista pending da admin (con secret da env locale) + cleanup
import fs from 'node:fs';
const env = {};
for (const line of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_0-9]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}
const secret = env.COMMUNITY_MODERATION_SECRET;
r = await fetch(`${BASE}/api/community-photo?status=pending&secret=${encodeURIComponent(secret)}`);
const pending = await r.json();
console.log('pending list:', r.status, 'foto:', pending.photos?.length);
const mine = (pending.photos ?? []).filter((p) => p.pathname.includes('rifugio-bonatti'));
for (const p of mine) {
  const d = await fetch(`${BASE}/api/community-photo?secret=${encodeURIComponent(secret)}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'reject', pathname: p.pathname, url: p.url }),
  });
  console.log('cleanup foto test:', d.status, await d.text());
}

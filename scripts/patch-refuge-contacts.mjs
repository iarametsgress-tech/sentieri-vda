/**
 * Aggiorna contatti ufficiali (sito, telefono, social) in refuges.json.
 * Fonti: siti ufficiali dei rifugi, lovevda.it (Regione VdA).
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const DATA = path.resolve('src/data/refuges.json');

/** @type {Record<string, Partial<{ website: string, booking_url: string, phone: string, email: string, instagram: string, facebook: string }>>} */
const CONTACTS = {
  'rifugio-bonatti': {
    website: 'https://www.rifugiobonatti.it',
    booking_url: 'https://www.rifugiobonatti.it/prenota-ora/',
    phone: '+39 335 6848578',
    email: 'rifugiobonatti@gmail.com',
  },
  'rifugio-bertone': {
    website: 'https://www.rifugiobertone.com',
    booking_url: 'https://www.rifugiobertone.com',
    phone: '+39 0165 869090',
    email: 'info@rifugiobertone.it',
  },
  'rifugio-coda': {
    website: 'https://www.rifugiocoda.it',
    phone: '+39 015 2562405',
  },
  'rifugio-barma': {
    website: 'https://www.rifugiobarma.it',
    phone: '+39 0125 307143',
    instagram: 'https://www.instagram.com/rifugio_barma/',
    facebook: 'https://www.facebook.com/rifugiobarma/',
  },
  'rifugio-vieux-crest': {
    website: 'https://www.refugevieuxcrest.com',
    booking_url: 'https://www.refugevieuxcrest.com',
    phone: '+39 0125 307983',
    email: 'info@refugevieuxcrest.com',
  },
  'rifugio-grand-tournalin': {
    website:
      'https://www.lovevda.it/it/banca-dati/16/rifugi/champoluc-ayas-antagnod/rifugio-grand-tournamentin/2548',
    phone: '+39 0125 307003',
    email: 'info@rifugiograndtournamentin.com',
  },
  'rifugio-jean-barmasse': {
    website: 'https://www.rifugiobarmasse.it',
    phone: '+39 375 6875114',
    email: 'prenotazioni@rifugiocuney.it',
    facebook: 'https://www.facebook.com/rifugiocuney.it/',
  },
  'rifugio-oratorio-di-cuney': {
    website: 'https://www.rifugiocuney.it',
    phone: '+39 375 6875114',
    email: 'prenotazioni@rifugiocuney.it',
    facebook: 'https://www.facebook.com/rifugiocuney.it/',
  },
  'rifugio-champillon': {
    website: 'https://rifugio-champillon.it',
    booking_url: 'https://rifugio-champillon.it',
    phone: '+39 0165 730132',
    email: 'rifugiochampillon@gmail.com',
    facebook: 'https://www.facebook.com/Rifugio-Champillon-A-LETEY-264889517197333/',
  },
  'rifugio-frassati': {
    website: 'https://rifugiofrassati.it',
    phone: '+39 0165 780014',
    email: 'info@rifugiofrassati.it',
    instagram: 'https://www.instagram.com/rifugio_frassati/',
  },
  'rifugio-alpenzu-grande': {
    website: 'http://www.rifugioalpenzu.it',
    phone: '+39 379 2854953',
    email: 'info@rifugioalpenzu.it',
  },
  'rifugio-elisabetta-soldini': {
    website: 'https://www.rifugioelisabetta.com',
    booking_url: 'https://www.rifugioelisabetta.com/contatti.html',
    phone: '+39 0165 844080',
    email: 'info@rifugioelisabetta.com',
  },
  'rifugio-maison-vieille': {
    website: 'https://www.maisonvieille.com',
    phone: '+39 0165 848209',
    email: 'info@maisonvieille.com',
  },
  'bivacco-promoud': {
    website:
      'https://www.lovevda.it/it/banca-dati/7/bivacchi/la-salle/bivacco-cosimo-zappelli/3138',
  },
  'rifugio-chalet-de-lepee': {
    website: 'https://www.rifugioepee.com',
    phone: '+39 0165 944112',
  },
  'rifugio-vittorio-sella': {
    website: 'https://www.rifugiovittoriosella.it',
    booking_url: 'https://www.rifugiovittoriosella.it',
    phone: '+39 0165 905055',
  },
  'rifugio-sogno-di-berdze': {
    website: 'https://www.rifugioberdze.it',
    booking_url: 'https://www.rifugioberdze.it',
    phone: '+39 0165 74961',
  },
  'rifugio-dondena': {
    website: 'https://www.visitmonterosa.com/accommodation/rifugio-dondena/',
    phone: '+39 0125 96126',
  },
  'rifugio-deffeyes': {
    website: 'https://www.rifugiodeffeyes.it',
    phone: '+39 0165 884239',
    email: 'info@rifugiodeffeyes.it',
  },
  'rifugio-elena': {
    website: 'https://www.rifugioelena.it',
    phone: '+39 0165 844688',
    email: 'info@rifugioelena.it',
  },
  'rifugio-gabiet': {
    website: 'https://www.rifugiogabiet.it',
    phone: '+39 0125 366399',
  },
  'rifugio-duca-degli-abruzzi': {
    website: 'http://www.rifugiorionde.it',
    phone: '+39 0166 949136',
    instagram: 'https://www.instagram.com/orionde_ducadegliabruzzi/',
  },
  'rifugio-orionde': {
    website: 'http://www.rifugiorionde.it',
    phone: '+39 0166 949136',
    instagram: 'https://www.instagram.com/orionde_ducadegliabruzzi/',
  },
  'rifugio-verney': {
    website: 'https://www.rifugiodeffeyes.it',
    phone: '+39 0165 884239',
    email: 'info@rifugiodeffeyes.it',
  },
  'rifugio-prarayer': {
    website: 'https://rifugio-prarayer.it',
    booking_url: 'https://rifugio-prarayer.it',
    phone: '+39 0165 730040',
    facebook: 'https://www.facebook.com/Rifugio-Prarayer-378401439009510/',
  },
};

const refuges = JSON.parse(await fs.readFile(DATA, 'utf8'));
let updated = 0;

for (const refuge of refuges) {
  const patch = CONTACTS[refuge.slug];
  if (!patch) {
    console.warn(`⚠ nessun contatto per ${refuge.slug}`);
    continue;
  }
  Object.assign(refuge, patch);
  if (!refuge.website) {
    console.warn(`⚠ ${refuge.slug} senza website dopo patch`);
  }
  updated++;
}

await fs.writeFile(DATA, JSON.stringify(refuges, null, 2) + '\n');
console.log(`✓ ${updated}/${refuges.length} rifugi aggiornati`);

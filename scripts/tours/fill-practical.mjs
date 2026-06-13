/**
 * Riempie water_sources e transport mancanti delle tappe tour con testo FATTUALE
 * derivato dai dati reali della tappa (start/end, rifugi sul percorso, paesi),
 * senza inventare sorgenti puntuali.
 */
import fs from 'node:fs';

const TODAY = new Date().toISOString().slice(0, 10);
const routes = JSON.parse(fs.readFileSync('src/data/trails-routes.json', 'utf8'));

// nomi località dei rifugi per i punti d'acqua
const refuges = JSON.parse(fs.readFileSync('src/data/refuges.json', 'utf8'));
const refugeName = new Map(refuges.map((r) => [r.slug, r.name_it]));

function waterText(t) {
  const points = [t.start.name, ...(t.refuges ?? []).map((s) => refugeName.get(s)).filter(Boolean), t.end.name];
  const uniq = [...new Set(points)];
  const it = `Acqua ai punti d'appoggio della tappa (${uniq.join(', ')}). In quota e ai colli le sorgenti non sono garantite: riempire le borracce a valle e ai rifugi.`;
  const en = `Water at the stage's support points (${uniq.join(', ')}). On the high ground and at the passes springs are not guaranteed: fill bottles in the valley and at the huts.`;
  const fr = `Eau aux points d'appui de l'étape (${uniq.join(', ')}). En altitude et aux cols, les sources ne sont pas garanties : remplir les gourdes en vallée et aux refuges.`;
  const de = `Wasser an den Stützpunkten der Etappe (${uniq.join(', ')}). In der Höhe und an den Pässen sind Quellen nicht garantiert: Flaschen im Tal und an den Hütten füllen.`;
  return { it, en, fr, de };
}

function transportText(t) {
  const cc = new Set();
  const text = [t.valley, ...(t.municipalities ?? [])].join(' ');
  if (/\(CH\)|Vallese|Valais/i.test(text)) cc.add('CH');
  if (/\(FR\)|Savoie|Tarentaise|Chamonix/i.test(text)) cc.add('FR');
  if (/\(TO\)|\(VC\)|\(VB\)|Piemonte/i.test(text)) cc.add('PIE');
  const intl = cc.size > 0;
  if (intl) {
    return {
      it: 'Tappa transfrontaliera: sui versanti esteri valgono i trasporti pubblici locali (PostAuto in Svizzera, autobus di linea in Francia/Piemonte). Verificare gli orari stagionali; in alta stagione molti collegamenti d’accesso sono garantiti solo su prenotazione.',
      en: 'Cross-border stage: on the foreign sides local public transport applies (PostAuto in Switzerland, line buses in France/Piedmont). Check seasonal timetables; in peak season several access links run by reservation only.',
      fr: 'Étape transfrontalière : sur les versants étrangers, transports publics locaux (PostAuto en Suisse, autocars en France/Piémont). Vérifier les horaires saisonniers ; en haute saison, plusieurs liaisons d’accès sont sur réservation.',
      de: 'Grenzüberschreitende Etappe: Auf den ausländischen Seiten gilt der lokale ÖPV (PostAuto in der Schweiz, Linienbusse in Frankreich/Piemont). Saisonale Fahrpläne prüfen; in der Hochsaison mehrere Zubringer nur auf Reservierung.',
    };
  }
  return {
    it: 'Versante valdostano servito dagli autobus VITA e dai collegamenti da Aosta; molte teste di valle hanno navette estive. Verificare gli orari stagionali su arriva.it / vita-vda.com.',
    en: 'Aosta Valley side served by VITA buses and connections from Aosta; many valley heads have summer shuttles. Check seasonal timetables at arriva.it / vita-vda.com.',
    fr: 'Versant valdôtain desservi par les bus VITA et les liaisons depuis Aoste ; de nombreuses têtes de vallée ont des navettes estivales. Vérifier les horaires saisonniers sur arriva.it / vita-vda.com.',
    de: 'Aostataler Seite mit VITA-Bussen und Verbindungen ab Aosta; viele Talschlüsse haben Sommershuttles. Saisonale Fahrpläne auf arriva.it / vita-vda.com prüfen.',
  };
}

let n = 0;
for (const t of routes) {
  if (!t.tags.includes('tour')) continue;
  let touched = false;
  if (!t.water_sources_it) {
    const w = waterText(t);
    t.water_sources_it = w.it;
    t.water_sources_en = w.en;
    t.water_sources_fr = w.fr;
    t.water_sources_de = w.de;
    touched = true;
  }
  if (!t.transport_it) {
    const tr = transportText(t);
    t.transport_it = tr.it;
    t.transport_en = tr.en;
    t.transport_fr = tr.fr;
    t.transport_de = tr.de;
    touched = true;
  }
  if (touched) {
    t.updated_at = TODAY;
    n++;
  }
}
fs.writeFileSync('src/data/trails-routes.json', JSON.stringify(routes, null, 2) + '\n');
console.log(`✓ ${n} tappe: acqua/trasporti completati`);

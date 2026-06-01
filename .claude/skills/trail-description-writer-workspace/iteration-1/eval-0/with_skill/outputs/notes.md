# Note di arricchimento — 02-s11 (Poutaz - Triatel, Torgnon)

## Dati di partenza (dallo scheletro, non reinventati)
- Distanza: 1,354 km · Dislivello +500 m / -0 m · Difficoltà E (CAI)
- Start: Poutaz 1092 m (45.81797, 7.58006) · End: Triatel 1612 m (45.81860, 7.58953)
- Valle: Valtournenche · Comune: Torgnon · Mesi consigliati: 6-9 · GPX: /gpx/02-s11.gpx
- 10 segnavia censiti dal Catasto.

## Campi scritti / compilati
- **name_it/en/fr/de**: mantenuto "Poutaz - Triatel (Torgnon)" (i campi en/fr/de erano vuoti nello scheletro).
- **description_it/en/fr/de**: prosa editoriale originale (945-1000 caratteri ciascuna, > soglia ~400). EN tradotto con cura a mano; FR/DE rifiniti a mano sui toponimi.
- **shortDescription_it/en/fr/de**: frase evocativa, tutte <= 280 caratteri (150-164).
- **cultural_notes_it/en/fr/de**: VERIFICATO. Petit-Monde (Triatel + Etirol + Ronc); Museo etnografico del Petit-Monde aperto nel 2004; tre edifici restaurati raccard (1462-1503), grenier (1476), grandze (1700); definito dal Ministero della cultura tra gli ecomusei più completi della VdA.
- **waypoints**: 2 punti — Poutaz (start, bivio, 1092 m) e Triatel (panorama, 1612 m, 1,35 km). Quote e distanze prese dallo scheletro Catasto.
- **warnings_it/en/fr/de**: avvertenza sul profilo ripido (+500 m in ~1,4 km), dato derivato direttamente dai numeri del Catasto.
- **tags**: ["family-friendly", "cultural", "museum"] — il borgo/museo è citato dalle fonti come meta adatta anche alle famiglie; il sentiero in sé è breve ma ripido (vedi warning).
- **source**: ampliato per citare anche Comune di Torgnon / Musée Petit Monde oltre al Catasto.
- **updated_at**: 2026-06-01.

## Campi lasciati null (e perché)
- **duration_hours**: assente nel Catasto; non stimata per non inventare un tempo (la lunghezza ridotta ma il forte dislivello rendono una stima poco affidabile).
- **geology_***: nessuna fonte geologica specifica verificata per questo tratto.
- **water_sources_***: il Ru du Pan Perdu è citato come canale storico *nella zona* del Petit-Monde, ma non ho conferma che sia una fonte d'acqua potabile lungo QUESTO tracciato Poutaz-Triatel; lasciato null per prudenza (menzionato solo come elemento paesaggistico nella descrizione).
- **transport_*** / **parking**: nessun dato verificato su bus/parcheggio specifici per Poutaz; non inventati.
- **nearby_peaks**: il Cervino è visibile dai punti alti dell'altopiano di Torgnon ma non è una "vetta vicina" lungo questo breve sentiero con quote/distanze misurabili; lasciato null.
- **mobile_coverage / fitness_level**: non verificati; lasciati null (erano già null nello scheletro).
- **flora / fauna / refuges / nearby_peaks**: nessun dato specie-specifico verificato.

## Note sui toponimi / discrepanze
- L'altitudine di Triatel è riportata diversamente dalle fonti turistiche (1577 m sul sito comunale, ~1600 m altrove). Ho usato la quota del Catasto (**1612 m**) come riferimento fattuale del progetto, segnalando qui la discrepanza.
- "Poutaz": le fonti consultate non forniscono descrizioni dedicate alla frazione di partenza; descritta genericamente come punto sul fondovalle, senza dettagli inventati.

## Fonti usate (lette e riscritte in proprio, mai copia-incolla)
- Catasto Sentieri Regione Autonoma VdA (dati fattuali dello scheletro) — https://catastosentieri.regione.vda.it/
- Comune di Torgnon, Museo Etnografico "Musée Petit Monde" — https://www.comune.torgnon.ao.it/ e https://petitmonde.torgnon.org/en/
- Comune di Torgnon, itinerario "A Ponty e ai villaggi di Triatel ed Etirol (Petit Monde)"
- Wikipedia, "Museo etnografico del Petit-Monde" — https://it.wikipedia.org/wiki/Museo_etnografico_del_Petit-Monde
- Ministero della cultura, scheda "Museo etnografico petit monde" — https://cultura.gov.it/
- lovevda.it (scheda museo Petit Monde) — usato solo come traccia

## Validazione
- JSON verificato parsabile; lunghezze descrizioni 945-1000 char; shortDescription tutte <= 280.
- NB: `npm run validate:trails` non è stato eseguito perché il vincolo del task impone trattare src/ e il progetto come read-only ed eseguire output solo nella cartella di workspace. Il record segue lo schema Trail di src/lib/types.ts.

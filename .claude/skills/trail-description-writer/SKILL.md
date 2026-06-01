---
name: trail-description-writer
description: >-
  Write accurate, editorial, 4-language (it/en/fr/de) descriptions and deep
  fields for Sentieri VdA trails — turning auto-generated skeleton placeholders
  into real content WITHOUT inventing data. Use this skill whenever you are
  asked to write, expand, enrich or improve a trail description, fill fields
  like geology / water_sources / transport / cultural_notes / warnings /
  waypoints, "arricchisci il sentiero X", "scrivi la scheda", "completa le
  descrizioni", or when a sub-agent is assigned a batch of trails to describe.
  This is THE bottleneck of the project: maps and photos are ~done, but only
  ~1% of the 1150 trails have real prose. Enforces sourcing rules (Catasto VdA,
  OSM, rewritten — never copied, never invented) and always ends by running the
  validator at the enriched level.
---

# Trail Description Writer — la scheda editoriale, mai inventata

Lo stato reale del progetto: mappe ~100% fatte, foto ~95%, **descrizioni ~1%**.
Quasi tutto il lavoro che resta è qui. L'obiettivo è trasformare le descrizioni
auto-generate dai template ("X è un sentiero ufficiale del Catasto…") in prosa
editoriale vera, accurata e in 4 lingue, **senza inventare nulla**.

La regola n. 3 del `CLAUDE.md` è tassativa: *mai inventare dati sui sentieri.*
Un sentiero descritto bene ma con una quota sbagliata o un colle che non esiste
è peggio di uno scheletro. Meglio un campo `null` segnalato che un dato falso.

## Da dove vengono i fatti (e da dove NON vengono)

Ogni scheletro in `trails-skeleton.json` ha già **dati reali dal Catasto
Sentieri VdA**: distanza, dislivelli, quote di partenza/arrivo, difficoltà CAI,
comune, valle, traccia GPX. Questi sono la tua spina dorsale fattuale — usali,
non reinventarli.

Per il resto, fonti ammesse (e da **citare** nel campo `source`):

- **Catasto Sentieri Regione VdA** — `catastosentieri.partout.it` / dati SCT già nel progetto.
- **OpenStreetMap / OpenTopoMap** — toponimi, colli, laghi, fonti, rifugi.
- **lovevda.it e fonti regionali** — solo come *traccia*: leggi, capisci, e
  **riscrivi in proprio**. Mai copia-incolla (è violazione di copyright e Google
  penalizza il contenuto duplicato).

Vietato: inventare quote, tempi, nomi di colli/laghi; copiare prosa altrui;
"riempire" campi scientifici (geologia, flora, fauna) con genericità plausibili
ma non verificate. Se non trovi il dato verificato, **non scrivere quel campo**
(vedi sotto la regola null-vs-ometti) e segnalalo nel diff.

### Regola critica: omettere, NON mettere `null`

Questa è la trappola numero uno, scoperta validando output reali. Nello schema
`TrailSchema` i campi profondi sono `z.string().optional()`: *opzionale*
significa che la chiave può **mancare**, non che può valere `null`. Scrivere
`"geology_it": null` fa **fallire** lo schema (`Expected string, received null`).

Quindi:

- Campo profondo che NON puoi verificare → **ometti del tutto la chiave**. Non
  scrivere `null`. (Vale per `geology_*`, `water_sources_*`, `transport_*`,
  `cultural_notes_*`, `warnings_*`, `waypoints`, `nearby_peaks`, `parking`.)
- Campi **obbligatori** → devono esserci sempre, mai `null`. In particolare
  `duration_hours` non è mai vuoto: se non hai un tempo ufficiale, calcolalo con
  la formula CAI (`distanza/4 + salita/400 + discesa/600`, già usata in
  `skeleton-trails.ts`) e arrotonda alla mezz'ora.

(Nota: il `CLAUDE.md` dice genericamente "lascia il campo a null". Per i campi
opzionali della scheda curata la mossa corretta è **ometterli**; il validator
lo conferma.)

## Cosa scrivere (campi della scheda `Trail`)

Obbligatori, in **tutte e 4 le lingue** (it/en/fr/de — o nessuna, mai miste):

- `description_*` — prosa editoriale, **≥ ~400 caratteri**, idealmente ~200
  parole. Racconta il percorso: punto di partenza, sviluppo, ambiente,
  panorami, punti notevoli, arrivo. Tono "editorial alpino", non burocratico.
- `shortDescription_*` — una frase evocativa, **≤ 280 caratteri**.

Da compilare quando hai fonti verificate (altrimenti **ometti la chiave**, vedi
la regola null-vs-ometti sopra):

- `geology_*` — vuoto su TUTTI i 1150 oggi: alto valore. Solo se documentato.
- `water_sources_*`, `transport_*`, `parking`, `cultural_notes_*`,
  `warnings_*` (array di stringhe), `waypoints[]` (con `type`, `elevation_m`,
  `distance_from_start_km`), `nearby_peaks[]`, `flora[]`/`fauna[]` (slug specie).

## Procedura per sentiero

1. **Leggi lo scheletro**: `npm run ledger:status` per sapere su quali slug
   lavorare, o ricevi la lista dall'orchestratore (`batch-ledger`). Apri il
   record in `trails-skeleton.json` e annota i fatti del Catasto.
2. **Ricerca mirata** sulle fonti ammesse per: ambiente, punti notevoli, colli,
   laghi, eventuali avvertenze stagionali, note culturali. Tieni traccia di cosa
   è verificato e cosa no.
3. **Scrivi in italiano** `description_it` e `shortDescription_it`, poi i campi
   profondi che hai potuto verificare. Prosa tua, fatti reali.
4. **Traduci** in en/fr/de. Per una prima passata di FR/DE puoi usare lo script
   esistente, poi rifinisci a mano i toponimi:
   ```bash
   npm run translate:trails-fr-de
   ```
   Per EN traduci tu con cura (è la lingua di traffico principale). Mantieni i
   toponimi nella forma corretta (es. "Colle" → "Col"/"Pass" dove appropriato,
   ma i nomi propri restano).
5. **Aggiorna** `source` (name/url/license) e `updated_at`. Lascia `enriched`
   a `true` **solo dopo** che il validator passa (vedi punto 7).
6. **Parti dal record scheletro esistente, non ricostruirlo da zero.** Copia il
   record così com'è e **aggiungi/sostituisci** solo i campi narrativi. Se
   costruisci un oggetto nuovo perdi campi obbligatori già normalizzati
   (`mobile_coverage`, `best_months`, `fitness_level`, `season`, `start`, `end`,
   `source`…) e il validator fallirà con "Required". Scrivi il record nel file
   giusto: le schede curate vivono in `src/data/trails.json`; gli scheletri
   arricchiti restano in `trails-skeleton.json` con i campi compilati. Segui lo
   schema in `src/lib/types.ts`.
7. **Valida — sempre, prima di considerarlo fatto:**
   ```bash
   npm run validate:trails -- --slug <slug> --level enriched --strict
   ```
   Se fallisce, correggi i `FAIL` e ripeti. Il validator rifiuta le frasi-spia
   dei template e le descrizioni troppo corte: è il modo per non auto-ingannarti.
8. **Aggiorna il ledger**: `npm run ledger:build`. L'asse `desc` completato
   libera il claim e fa avanzare la percentuale.

## Strumenti di supporto già nel progetto

- `npm run enrich:skeletons -- --slug=<slug> --write` — compila i campi
  *fattuali* (comune, valle, stagione, gpx_path) e le descrizioni *template*.
  Utile come base PRIMA di scrivere la prosa, non come sostituto della prosa.
- `npm run generate:descriptions -- --limit=N` — bozza editoriale via Gemini
  (richiede `GEMINI_API_KEY` in `.env.local`). **Attenzione**: è una bozza
  generata; va riletta, verificata contro le fonti e fatta passare dal
  validator. Non marcare `enriched` su output non verificato.

## Stile (coerente con CLAUDE.md)

- Direzione "editorial alpino": evocativo ma asciutto, niente marketing gonfio.
- Niente claim non verificabili ("il sentiero più bello della valle").
- Concreto: nomi reali di colli, alpeggi, laghi, quote.
- Sicurezza nei `warnings_*` quando pertinente (tratti esposti, nevai tardivi,
  guadi) — ma solo se documentato.

## Cosa NON fa questa skill

Non scarica foto (→ `trail-photo-sourcer`) né tocca i GPX (→ `trail-map-builder`).
Si occupa solo del testo. Il giudizio finale di completezza è del
`trail-validator`; la distribuzione del lavoro è del `batch-ledger`.

---
name: trail-validator
description: >-
  Validate Sentieri VdA trail records before they are merged into
  src/data/trails.json (or written back to trails-skeleton.json). Use this
  skill ANY TIME you, or a sub-agent you are coordinating, have written or
  edited trail descriptions, photos, GPX/map data, or marked a trail
  enriched: true — and before committing or merging that work. It is the
  gatekeeper that lets many sub-agents enrich the 1150 skeleton trails in
  parallel without producing inconsistent or hallucinated data. Trigger it on
  phrases like "valida i sentieri", "controlla la scheda", "è pronta per
  l'indicizzazione", "ho finito la descrizione del sentiero X", "merge delle
  schede", or whenever trail JSON has changed. Catches schema violations,
  missing/mismatched translations, leftover auto-generated placeholder text,
  unverified photos, implausible numbers, and broken GPX/image paths.
---

# Trail Validator — il guardiano delle schede sentiero

Questo progetto deve arricchire **1150 schede scheletro** in schede editoriali
complete, in 4 lingue (it/en/fr/de), facendo lavorare molti sotto-agenti in
parallelo. Il rischio numero uno non è la lentezza: è che gli agenti
**inventino dati** (quote sbagliate, foto della valle sbagliata, prosa
allucinata) o producano formati leggermente diversi che poi non si fondono.

La regola n. 3 del `CLAUDE.md` è tassativa: **mai inventare dati sui sentieri.**
Questo validator è ciò che rende quella regola applicabile su scala. Ogni
output di ogni agente passa di qui **prima** di essere unito a `trails.json` o
di essere marcato `enriched: true`.

## Quando usarlo

- Dopo aver scritto/modificato la descrizione, le foto, il GPX o i waypoint di
  uno o più sentieri.
- Prima di marcare un sentiero `enriched: true` (= candidato all'indicizzazione).
- Prima di fare il merge del lavoro di un sotto-agente in `src/data/trails.json`.
- Come check periodico sull'intero dataset.

## Come eseguirlo

Lo script vive in `scripts/validate-trails.ts` ed è esposto come comando npm.
Importa il **vero** `TrailSchema` da `src/lib/types.ts`, quindi le regole
strutturali non possono divergere dallo schema dell'app.

```bash
# Valida tutto il dataset curato al livello base (schema strutturale)
npm run validate:trails

# Valida un solo sentiero a un livello specifico
npm run validate:trails -- --slug lago-djouan-cogne --level enriched

# Valida un file candidato prodotto da un sotto-agente, in modalità bloccante
npm run validate:trails -- --file tmp/agent-batch-03.json --level index --strict
```

Argomenti:

- `--file <path>` — file JSON da validare (default `src/data/trails.json`).
  Accetta sia un array di sentieri sia `trails-skeleton.json`.
- `--slug <slug>` — valida un solo record (utile per il check rapido di un agente).
- `--level <schema|enriched|index>` — **la barra da superare** (vedi sotto).
- `--strict` — esce con codice ≠ 0 se c'è anche un solo errore. Usalo nei
  controlli pre-merge e nelle pipeline, così un fallimento blocca il commit.

## I tre livelli (cosa significa "completa e accurata")

Il codice del sito definisce già, in `src/lib/skeleton-trails.ts`, cosa rende
una scheda indicizzabile (`shouldIndexTrail`). Il validator usa gli stessi tre
gradini, dal più permissivo al più severo:

1. **`schema`** — Il record passa `TrailSchema.safeParse`. È il contratto
   strutturale minimo: tipi giusti, slug valido, coordinate dentro i confini
   VdA (lat 45–46, lng 6.5–8), `source` con url e licenza. Una scheda scheletro
   appena normalizzata supera già questo livello.

2. **`enriched`** — Il record è editorialmente **vero e completo**, quindi può
   essere marcato `enriched: true`. In più rispetto a `schema`:
   - le descrizioni **non** contengono il testo-template auto-generato (vedi
     "Anti-allucinazione" sotto) — devono essere prosa scritta apposta;
   - `description_*` è sostanziosa (prosa, non la riga di una frase) in tutte e
     4 le lingue;
   - parità linguistica: ogni gruppo multilingue è completo in 4 lingue o
     assente in tutte e 4 — **mai** misto;
   - numeri plausibili (vedi "Sanity numerica");
   - `gpx_path` valido e il file esiste in `public/` (salvo `is_transfer_stage`).

3. **`index`** — La scheda è candidabile all'indicizzazione pubblica. In più
   rispetto a `enriched`, deve avere una **foto verificata e geolocalizzata**,
   esattamente come pretende `hasVerifiedGeolocatedPhoto`: sia `image` sia
   `hero_image` puntano a `/trails/geo/…` (path locale o Vercel Blob) **e**
   `image_credit` e `image_source` sono presenti.

Se non specifichi `--level`, il default è `schema`.

## Anti-allucinazione: le frasi-spia

Le schede scheletro nascono con descrizioni fattuali generate da template in
`skeleton-trails.ts`. Sono utili come segnaposto ma **non** sono contenuto
editoriale: una scheda che le contiene ancora **non** è arricchita, anche se
qualcuno ha messo `enriched: true`. Il validator le riconosce e le segnala come
errore ai livelli `enriched` e `index`. Frasi-spia (per lingua):

- IT: `scheda in arricchimento`, `sentiero ufficiale del Catasto Sentieri della Valle d'Aosta (`
- EN: `page being enriched`, `official trail from the Aosta Valley trail registry (`
- FR: `fiche en cours d'enrichissement`, `sentier officiel du cadastre des sentiers`
- DE: `Seite wird ergänzt`, `offizieller Weg aus dem Wegekataster`

Inoltre l'immagine placeholder `/trails/_placeholder.svg` non è una foto
verificata.

Se aggiungi nuovi template in `skeleton-trails.ts`, aggiorna l'elenco delle
frasi-spia in cima a `scripts/validate-trails.ts` (costante `TEMPLATE_MARKERS`).

## Sanity numerica

Non possiamo verificare ogni quota contro la realtà, ma possiamo intercettare
i **typo e i dati implausibili**, che sono il sintomo più comune di un errore o
di un dato inventato:

- `distance_km` > 0 e < 80 (una singola tappa/sentiero realistico).
- `elevation_gain_m` / `elevation_loss_m` ≥ 0 e < 3000.
- quote di partenza/arrivo tra 300 e 4810 m (range VdA).
- `duration_hours` coerente con la stima CAI (distanza/4 + salita/400 +
  discesa/600) entro un fattore ragionevole — uno scarto enorme è quasi sempre
  un errore di battitura.
- `best_months` tutti in 1–12.

Questi sono **warning**, non errori bloccanti: un sentiero può legittimamente
essere fuori norma. Ma ogni warning va guardato a mano prima del merge.

## Come leggere l'output

Per ogni sentiero lo script stampa le voci `FAIL` (bloccanti al livello
richiesto), `WARN` (da controllare a mano) e un riepilogo finale con i conteggi.
Con `--strict` un solo `FAIL` fa uscire lo script con codice 1.

Quando un agente ti riporta "ho finito il sentiero X", **non fidarti: validalo.**
Il flusso corretto è:

```bash
npm run validate:trails -- --slug <slug> --level enriched --strict
```

Se passa, il record può essere marcato `enriched: true` e unito. Se fallisce,
rimanda all'agente l'elenco dei `FAIL` come istruzioni di correzione.

## Cosa NON fa questo validator

- Non corregge i dati: solo li giudica. La correzione spetta all'agente che ha
  prodotto la scheda.
- Non verifica la *verità* delle descrizioni contro le fonti (non può sapere se
  un colle è davvero a quella quota). Verifica struttura, completezza,
  coerenza e plausibilità. La veridicità è responsabilità della skill di
  scrittura (`trail-description-writer`) e delle sue regole sulle fonti.
- Non scarica né ottimizza immagini/GPX: per quello esistono gli script
  `fetch:*`, `build:tracks`, `audit:img`.

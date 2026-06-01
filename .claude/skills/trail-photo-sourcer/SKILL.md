---
name: trail-photo-sourcer
description: >-
  Source, attribute, optimize and verify legally-usable geolocated photos for
  Sentieri VdA trails. Use this skill whenever you need a hero/card photo for a
  trail, are told "trova una foto per il sentiero X", "le immagini mancano",
  "sistema le foto", "verifica i crediti", or when a sub-agent is assigned a
  batch of trails to illustrate. Enforces the project's legal sourcing rules
  (Wikimedia Commons / Unsplash only — never Instagram/Google scraping), always
  captures credit + license, runs the geolocated fetcher and the image audit,
  and ends by checking the trail passes the validator's photo bar. Note: photos
  are ~95% done across the 1150 trails, so this is mostly for the remaining
  ~60, for re-verification, and for new trails.
---

# Trail Photo Sourcer — foto legali, geolocalizzate, attribuite

Stato reale: le foto sono **~95% fatte** (1109/1169). Questa skill serve per i
~60 sentieri scoperti, per ri-verificare attribuzioni, e per i sentieri nuovi.
Il punto critico non è la quantità ma la **legalità** e la **correttezza
geografica**: una foto della valle sbagliata, o senza licenza, è un problema
serio moltiplicato per quanti agenti la commettono in parallelo.

## Regole legali (da AVVIO.md — non negoziabili)

Fonti ammesse:

- **Wikimedia Commons** (`commons.wikimedia.org`) — filtra licenze libere (CC).
  **Cita autore + licenza** in `image_credit`, e l'URL della pagina in
  `image_source`.
- **Unsplash** — licenza permissiva. Cerca "Aosta Valley", "Mont Blanc",
  "Gran Paradiso", "Cervino".
- **Foto proprie** dell'utente, se fornite.

Vietato: scraping di Instagram / Pinterest / Google Images; uso di foto
lovevda o di siti terzi senza permesso scritto. In dubbio → non usarla.

## Cosa rende una foto "verificata" (la barra del validator)

Il codice (`hasVerifiedGeolocatedPhoto`) considera valida una foto solo se:

- sia `image` sia `hero_image` puntano a **`/trails/geo/…`** (path locale o URL
  Vercel Blob), **e**
- `image_credit` e `image_source` sono entrambi presenti.

Una foto in `/trails/geo/` è una foto **geolocalizzata**: scelta perché scattata
vicino al tracciato del sentiero, non una generica "montagna". È questo che la
rende affidabile su scala.

## Procedura

1. **Quali sentieri**: prendi gli slug da `npm run ledger:status` (asse `photo`)
   o dall'orchestratore (`batch-ledger`, `--need=photo`).
2. **Scarica automaticamente** le foto geolocalizzate da Wikimedia per gli
   scheletri SCT — lo script fa già ricerca per raggio (1–3 km dal tracciato),
   scarta immagini troppo piccole (< 1200px), e scrive `image`, `hero_image`,
   `image_credit`, `image_source`, `enriched`:
   ```bash
   npm run fetch:geolocated-photos -- --slug=<slug>
   npm run fetch:geolocated-photos -- --limit=20            # a lotti
   npm run fetch:geolocated-photos -- --limit=20 --dry-run  # prova prima
   ```
3. **Casi scoperti**: se per quel raggio non esiste una foto CC, NON forzare una
   foto generica. Cerca a mano su Wikimedia/Unsplash una foto realmente
   pertinente (stessa valle/vetta), salvala in `public/trails/geo/<slug>.webp`,
   e compila a mano `image`, `hero_image`, `image_credit`, `image_source`. Se
   davvero non c'è nulla di legale e pertinente, lascia il placeholder e
   segnalalo: il sentiero resterà non indicizzabile finché non hai una foto vera.
4. **Audit qualità/dimensioni**:
   ```bash
   npm run audit:img
   ```
   Scrive `image-audit.json` e segnala le immagini sotto i 1600px di larghezza
   per gli hero o in formato non ottimale. Nota: il fetcher accetta min 1200px
   ma l'hero ideale è ≥ 1600px — per gli hero preferisci la versione più grande
   disponibile. Per ridimensionare/ottimizzare gli hero esiste
   `npm run optimize:heroes`.
5. **Blur placeholder** (evita layout shift, richiesto da CLAUDE.md perf):
   ```bash
   npm run blur
   ```
   Rigenera `src/data/image-blur.json` per le immagini in `public/trails`.
6. **(Opzionale) Sposta le foto sul CDN** per non appesantire git — le ~441 MB
   di foto vanno su Vercel Blob e i record puntano agli URL:
   ```bash
   npm run upload:blob -- --dry-run   # mostra cosa farebbe
   npm run upload:blob                # richiede BLOB_READ_WRITE_TOKEN in .env.local
   ```
7. **Verifica** che il sentiero superi la barra foto e aggiorna il ledger:
   ```bash
   npm run validate:trails -- --slug <slug> --level index --strict
   npm run ledger:build
   ```
   Il livello `index` controlla esattamente la foto geolocalizzata + crediti.
   (Se la descrizione non è ancora pronta il livello `index` fallirà su quella:
   è atteso — la foto è "fatta" quando spariscono i `FAIL` relativi a
   `photo`/`hero_image`/`image`.)

## Attribuzione: come scriverla

`image_credit` deve permettere di risalire ad autore e licenza, es.:
`"Foto: Mario Rossi / Wikimedia Commons, CC BY-SA 4.0"`. `image_source` è l'URL
della pagina del file (non il link diretto all'immagine), così l'attribuzione è
verificabile. Le immagini rifiutate note vanno tenute fuori (lo script ha già
una lista `REJECTED_SOURCES`: aggiungi lì gli URL da escludere).

## Cosa NON fa questa skill

Non scrive testo (→ `trail-description-writer`) né costruisce tracce GPX
(→ `trail-map-builder`). Si occupa solo delle immagini e della loro
attribuzione. Completezza giudicata da `trail-validator`; distribuzione da
`batch-ledger`.

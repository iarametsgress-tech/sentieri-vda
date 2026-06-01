---
name: trail-map-builder
description: >-
  Build, validate and repair the GPX tracks, geometry and waypoints behind
  Sentieri VdA trail maps. Use this skill whenever you need to generate or fix a
  trail's GPX, sync start/end coordinates to the track, add waypoints, or are
  told "la mappa non si vede", "il tracciato è sbagliato", "rigenera il GPX",
  "manca la traccia del sentiero X", or when a sub-agent is assigned map work.
  Wraps the project's existing track tooling (build:tracks from the official
  Catasto GeoJSON, validate:gpx, sync:coords) and enforces that geometry stays
  within Valle d'Aosta bounds. Note: maps are ~100% done across the 1150 trails,
  so this is mostly for verification, repair of broken/duplicate tracks, and new
  trails.
---

# Trail Map Builder — tracce GPX corrette e dentro la valle

Stato reale: le mappe sono **~100% fatte** (1169/1169 hanno un `gpx_path`
valido con file presente). Questa skill serve quindi soprattutto per
**verificare**, **riparare** tracce rotte o duplicate, e generare i GPX dei
sentieri nuovi. Una mappa è l'elemento dove un errore è più visibile e meno
perdonabile: una traccia fuori dalla valle o sovrapposta a quella di un'altra
tappa salta subito all'occhio.

## Da dove vengono le tracce

La fonte ufficiale è **`src/data/sct-raw.geojson`** (Catasto Sentieri VdA). Lo
script `build:tracks` estrae da lì le tracce GPX (`public/gpx/`) e GeoJSON
(`public/tracks/`), interpolando le quote. **Non disegnare tracce a mano**: si
generano dal dato ufficiale.

Vincoli geografici (già nello schema `CoordsSchema`): tutte le coordinate
devono stare dentro la Valle d'Aosta — lat **45–46**, lng **6.5–8**. Una traccia
fuori da questo riquadro è un errore.

## Procedura

1. **Quali sentieri**: da `npm run ledger:status` (asse `map`) o
   dall'orchestratore (`batch-ledger`, `--need=map`).
2. **Genera/rigenera la traccia** dal Catasto:
   ```bash
   npm run build:tracks -- --slug=<slug>   # un sentiero
   npm run build:tracks -- --write         # tutti (~1150)
   ```
   Produce `public/gpx/<slug>.gpx` e il GeoJSON in `public/tracks/`. Imposta poi
   `gpx_path` del record a `/gpx/<slug>.gpx` (formato richiesto dallo schema:
   `^/gpx/.+\.gpx$`).
3. **Sincronizza start/end** del record con i capi reali della traccia, così i
   marker sulla mappa coincidono con il GPX:
   ```bash
   npm run sync:coords
   ```
4. **Valida la geometria** — esistenza file, numero di punti, vicinanza
   start/end ai waypoint, e **tracce duplicate** (stessa traccia su tappe diverse
   dello stesso tour, errore tipico):
   ```bash
   npm run validate:gpx
   ```
   Risolvi i duplicati e i capi fuori posto che lo script segnala.
5. **Tappe di trasferimento**: alcune tappe (es. spostamenti in bus) non hanno
   una traccia continua. In quel caso imposta `is_transfer_stage: true` e lascia
   `gpx_path: null` — il validator lo accetta senza pretendere il GPX.
6. **Waypoint** (opzionale ma prezioso): aggiungi `waypoints[]` con `type`
   (`col`, `rifugio`, `lago`, `panorama`, `fonte-acqua`, `bivio`, `bivacco`),
   `elevation_m` e `distance_from_start_km`. Usa solo punti reali e verificati
   (toponimi da OSM/Catasto), mai inventati.
7. **Verifica finale + ledger**:
   ```bash
   npm run validate:trails -- --slug <slug> --level enriched --strict
   npm run ledger:build
   ```
   Il validator a livello `enriched` controlla che `gpx_path` sia valido e che
   il file esista davvero in `public/gpx` (salvo tappe di trasferimento).

## Riparazioni comuni

Il progetto ha già script dedicati per i casi noti — usali invece di
reinventare:

- `npm run fix:tour-gpx` — sistema le tracce dei tour ad anello.
- `npm run fix:stage-images` — (immagini delle tappe; non GPX, ma spesso si
  lavora in coppia).
- `npm run fetch:gpx` — recupera GPX mancanti da fonte esterna quando il Catasto
  non basta.
- Script una-tantum presenti in `scripts/` (es. `fix-broken-tour-gpx.mjs`,
  `reuse-gpx-segments.mjs`, `fix-special-gpx.mjs`) per casi particolari.

## Cosa controlla `validate:gpx` (e perché conta)

- **file mancante / pochi punti** → la mappa non si disegna.
- **start/end lontani dai waypoint** → marker e traccia non coincidono, l'utente
  si confonde.
- **tracce duplicate** → due tappe diverse mostrano lo stesso percorso: è il
  bug più frequente quando si generano centinaia di tracce, e il più
  imbarazzante in pubblico.

## Cosa NON fa questa skill

Non scrive testo (→ `trail-description-writer`) né scarica foto
(→ `trail-photo-sourcer`). Si occupa solo di tracce, geometria e waypoint.
Completezza giudicata da `trail-validator`; distribuzione da `batch-ledger`.

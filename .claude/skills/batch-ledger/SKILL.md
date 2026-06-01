---
name: batch-ledger
description: >-
  Coordinate many sub-agents enriching the 1150 Sentieri VdA skeleton trails in
  parallel without collisions. Use this skill whenever you are about to split
  trail work across sub-agents, assign a batch to an agent, ask "quanti sentieri
  mancano", "a che punto siamo", "quali sentieri sono ancora da fare", "assegna
  un lotto", or need to know the per-trail status of descriptions, photos and
  maps. It maintains trail-ledger.json — a derived, never-hand-edited registry
  of which trails are done on each axis (desc/photo/map) and which are claimed
  by which agent. Trigger it at the START of any parallel enrichment session to
  hand out work, and after agents report back to recompute progress.
---

# Batch Ledger — coordinare i sotto-agenti sui 1150 sentieri

Per arricchire 1150 sentieri serve far lavorare molti agenti insieme. Senza un
registro condiviso, due agenti finiscono per lavorare sullo stesso sentiero, o
nessuno sa cosa manca. Questa skill mantiene **`trail-ledger.json`** nella root
del progetto: la mappa di chi-fa-cosa e di cosa è già fatto.

Principio chiave: **lo stato è derivato dai file, non dichiarato a mano.** Il
comando `build` rilegge `trails.json` + `trails-skeleton.json` e ricalcola per
ogni sentiero se i tre assi sono completi. Un agente non può "barare" dicendo
che ha finito: o il dato c'è nei file, o l'asse risulta da fare. La verità
ultima su "completo" resta `npm run validate:trails`; il ledger usa gli stessi
criteri per dare la vista d'insieme e distribuire il lavoro.

## I tre assi

Per ogni sentiero il ledger traccia:

- **`desc`** — descrizione editoriale vera in tutte e 4 le lingue (no testo
  template, ≥ 400 caratteri). La produce la skill `trail-description-writer`.
- **`photo`** — foto geolocalizzata verificata (`/trails/geo/` + credit +
  source), come pretende `hasVerifiedGeolocatedPhoto`. La produce
  `trail-photo-sourcer`.
- **`map`** — `gpx_path` valido e file presente in `public/gpx` (o tappa di
  trasferimento). La produce `trail-map-builder`.

Quando tutti e tre sono fatti, il sentiero è **`indexable`**: pronto per
`enriched: true` e per l'indicizzazione.

## Comandi

```bash
# Ricostruisci lo stato dai file (fallo all'inizio e dopo ogni round di lavoro)
npm run ledger:build

# Riepilogo a colpo d'occhio: % fatte per asse, quanti indicizzabili, chi ha cosa
npm run ledger:status

# Assegna 20 sentieri SENZA descrizione all'agente "a1"
npm run ledger:claim -- --agent=a1 --count=20 --need=desc

# Assegna lavoro su un asse specifico (desc | photo | map) o su tutto (all)
npm run ledger:claim -- --agent=a2 --count=15 --need=photo

# Libera i claim di un agente (es. ha finito o si è bloccato)
npm run ledger:release -- --agent=a1

# Libera i claim abbandonati (più vecchi di 6h)
npm run ledger:release -- --stale
```

## Il flusso di orchestrazione

Quando ti accingi a far lavorare più agenti in parallelo:

1. **`npm run ledger:build`** — fotografa lo stato reale.
2. **`npm run ledger:status`** — guarda cosa manca e su quale asse.
3. Per ogni sotto-agente che stai per lanciare, **rivendica un lotto** con
   `ledger:claim --agent=<nome> --count=N --need=<asse>`. Lo script ti
   restituisce la lista esatta di slug da passare a quell'agente. Slug già
   completati o già rivendicati da altri non vengono mai riassegnati.
4. Lancia ogni agente dicendogli: "lavora SOLO su questi slug, usando la skill
   `trail-description-writer` / `trail-photo-sourcer` / `trail-map-builder`".
5. Quando un agente riporta, **non fidarti**: esegui
   `npm run validate:trails -- --slug <slug> --level enriched --strict` e poi
   `npm run ledger:build`. Un asse completato libera da solo il suo claim, così
   il sentiero esce dalla coda.
6. Ripeti dal punto 2 finché `ledger:status` non mostra abbastanza
   indicizzabili.

## Note importanti

- **Concorrenza**: il claim è un read-modify-write sul file JSON. Va benissimo
  per un'orchestrazione a turni (tu assegni i lotti uno dopo l'altro, poi
  lanci gli agenti). Non lanciare due `ledger:claim` *davvero simultanei* sullo
  stesso istante: assegna i lotti in sequenza, poi parti.
- **`trail-ledger.json` è generato**: non modificarlo a mano e non serve
  committarlo come fonte di verità (puoi rigenerarlo sempre con `build`). Se
  vuoi tenerlo fuori da git, aggiungilo a `.gitignore`.
- **TTL claim = 6h**: un agente che non chiude entro 6h vede il suo lotto
  tornare disponibile, così il lavoro non resta bloccato se qualcosa va storto.
- Il ledger **non produce contenuto**: distribuisce e misura. Il contenuto lo
  fanno le tre skill produttrici; il giudizio finale lo dà `trail-validator`.

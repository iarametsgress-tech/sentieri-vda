# CLAUDE.md — Istruzioni per Claude Code

Questo file viene letto automaticamente da Claude Code quando viene avviato nella root del progetto. Definisce le regole e il contesto.

## Cos'è questo progetto

Sito editoriale bilingue (IT/EN) sui sentieri della Valle d'Aosta, costruito con Next.js 14 App Router, TypeScript, Tailwind, MapLibre. Vedi `README.md` per la visione completa.

## Regole tecniche tassative

1. **Stack fisso**: Next.js 14 App Router + TypeScript + Tailwind + Framer Motion + next-intl + MapLibre GL. Non sostituire con altre librerie senza chiedere.
2. **Server Components di default**. Aggiungi `"use client"` solo quando serve (mappe, animazioni, filtri).
3. **Mai inventare dati sui sentieri**. Se devi popolare schede, usa solo fonti ufficiali (Catasto Sentieri VdA, OSM, lovevda.it come traccia ma riscritta) e cita la fonte nel campo `source` dello schema Trail. Se non trovi dato verificato, lascia il campo `null` e segnala.
4. **Bilingue strict**: ogni stringa visibile passa da `next-intl`. Schede sentiero hanno campi `name_it`/`name_en`, `description_it`/`description_en` etc.
5. **Mai hard-code di chiavi API**. Usa `.env.local` per `NEXT_PUBLIC_MAPTILER_KEY`, `ADSENSE_CLIENT`, `RESEND_API_KEY`. C'è `.env.example` come template.
6. **Performance**: ogni immagine via `next/image` con dimensioni esplicite, `priority` solo sull'hero, `placeholder="blur"` se possibile. Niente layout shift. Target Lighthouse > 90 mobile.
7. **SEO**: ogni pagina dinamica esporta `generateMetadata` con title/description/OG/hreflang. Schede sentiero esportano JSON-LD `HikingTrail`.
8. **Accessibilità**: contrasto WCAG AA minimo, focus visibili, alt sulle immagini, aria-label su icon-button. Niente div con onClick → sempre button/a.
9. **Stile codice**: ESLint + Prettier già configurati. Componenti in PascalCase, file in kebab-case eccetto componenti React.

## Estetica (frontend-design)

- Direzione: editorial alpino. **NON** verde forestale + Comic Sans. **NON** gradiente viola tech-bro.
- Palette CSS in `globals.css`: `--ink: #0A0A0A`, `--snow: #FAFAF7`, `--ice: #5BC0EB`, `--alpenglow: #D4A574`.
- Font display: **Fraunces** (Google Fonts, weight 400/600, optical size). Font body: **Geist** (Vercel font). Fallback solo se necessario.
- Foto sempre full-bleed. Mappe sempre dominanti nelle pagine sentiero.
- Motion misurato: scroll reveal staggered su hero, transizioni pagina fade-up 200ms, hover state su card con scale 1.01 + shadow.
- Mobile-first. Hero verticale su mobile, orizzontale wide su desktop.

## Convenzioni dati

Lo schema `Trail` è in `src/lib/types.ts`. Ogni nuova scheda va in `src/data/trails.json` rispettando lo schema. Validazione con Zod in `src/lib/schemas.ts`.

Le difficoltà seguono la scala CAI ufficiale:
- `T` Turistico
- `E` Escursionistico
- `EE` Escursionisti Esperti
- `EEA` Escursionisti Esperti con Attrezzatura
- `A` Alpinistico

## Monetizzazione: dove vanno gli slot pubblicitari

Tutti gli slot sono componenti `<AdSlot slot="..." />`. Posizioni standard:
- `header-billboard` (homepage + sezioni)
- `sidebar-sticky` (pagina sentiero, desktop)
- `in-content-mid` (a metà descrizione sentiero)
- `footer-leaderboard` (footer ogni pagina)
- `affiliate-refuge` (sopra blocco rifugi su pagina sentiero)

In dev mostrano un placeholder. In produzione caricano AdSense via `<Script>` con `data-ad-slot`. Variabile `NEXT_PUBLIC_ADSENSE_CLIENT` controlla l'inserimento.

## Comandi utili

```bash
npm run dev          # dev server
npm run build        # build produzione
npm run lint
npm run import:sct   # script che fetcha sentieri da WFS Regione VdA (vedi scripts/)
```

## Cosa fare PER PRIMA COSA

Quando Claude Code parte qui per la prima volta:

1. Leggi `README.md` e questo file
2. Esegui `npm install`
3. Crea `.env.local` da `.env.example` e chiedi all'utente le chiavi API mancanti (MapTiler gratis, AdSense quando ce l'ha)
4. Esegui `npm run dev`, verifica che parta su `localhost:3000`
5. Mostra all'utente la homepage e proponi il primo step: "popolo 30 schede sentiero" o "rifinisco il design hero" o "configuro deploy Vercel"

Non scrivere mai 500 righe senza confermare la direzione. Lavora a piccoli passi, mostra il risultato, chiedi conferma.

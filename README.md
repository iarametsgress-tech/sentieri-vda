# Sentieri VdA — Piattaforma sentieri Valle d'Aosta

Sito moderno, editorial, bilingue (IT/EN) sui sentieri della Valle d'Aosta, costruito su dati ufficiali aperti della Regione e pensato per monetizzare via pubblicità e affiliazioni.

---

## 1. Obiettivo strategico

Il mercato attuale (lovevda.it sezione sentieri, catastosentieri.regione.vda.it, siti CAI locali) è funzionale ma datato: UX anni 2010, niente 3D, niente storytelling, mobile mediocre, zero SEO internazionale. C'è uno spazio enorme per un prodotto editoriale fotografico in stile *Outside Magazine* + *Apple Maps* alimentato dai dati open della Regione.

**Target:** escursionisti italiani + turisti esteri (DE, FR, EN, NL) che cercano "TMB stages Valle d'Aosta", "Alta Via 1", "Gran Paradiso trails", "Rifugio Bonatti hike" su Google. Volume di ricerca alto, competizione informativa bassa.

**Monetizzazione:**
- Google AdSense (slot già predisposti nel codice, vedi `AdSlot.tsx`)
- Affiliazioni Booking.com / GetYourGuide per rifugi e tour
- Affiliazioni Amazon per attrezzatura (links contestuali nelle pagine difficoltà)
- Sponsor diretti (rifugi, guide alpine, noleggio attrezzatura) — slot premium hero
- Newsletter sponsorizzata (mailing list da costruire)

Le slot pubblicitarie sono già nel layout: header banner, sidebar sticky, in-content, footer. Sono componenti React che caricano AdSense quando approvato; in dev mostrano placeholder. Vedi `src/components/AdSlot.tsx`.

---

## 2. Stack tecnico

| Layer | Scelta | Perché |
|---|---|---|
| Framework | **Next.js 14 App Router** | SSR/SSG → SEO eccellente, Image optimization, edge runtime |
| Linguaggio | **TypeScript** | Manutenibilità, autocompletamento sui tipi sentiero |
| Styling | **Tailwind CSS** + CSS variables | Velocità, design system coerente |
| Animazioni | **Framer Motion** | Scroll reveal, parallax, transizioni pagina |
| Mappe 2D | **MapLibre GL JS** | Open source, supporto WMS, performance, niente token a pagamento |
| Mappe 3D | **MapLibre GL terrain** + RGB DEM | 3D terrain free, niente Cesium ion |
| Tile sfondo | **MapTiler Outdoor** (free tier) o **OpenTopoMap** | Stile alpino curato |
| Overlay sentieri | **WMS Catasto VdA** `https://geoservizi.regione.vda.it/geoserver/sctGeoSentieri/wms` | Ufficiale, sempre aggiornato |
| GPX | **togpx / @tmcw/togeojson** | Parse + visualizzazione |
| i18n | **next-intl** | App Router-native, ottimo per IT/EN |
| CMS dati | JSON locale + script di import | Semplice, versionato in git |
| Hosting | **Vercel** (free tier basta inizialmente) | Deploy automatico, edge, ottimo per Next.js |
| Analytics | **Plausible** o **Umami** (privacy-friendly) | Niente cookie banner pesante |
| Email | **Resend** | Newsletter, transazionali |

Domini suggeriti: `sentierivda.it`, `valdaostatrails.com` (per SEO EN), `altevievda.it`.

---

## 3. Fonti dati ufficiali (tutte open data)

### Catasto Sentieri Regione Valle d'Aosta — il dato chiave
- Portale: <https://catastosentieri.regione.vda.it/>
- ~5.000 km di rete ufficiale, manutenzione regionale
- **WMS**: `https://geoservizi.regione.vda.it/geoserver/sctGeoSentieri/wms`
- WFS: stesso geoserver, layer `sctGeoSentieri:sentieri`
- Licenza: open data (DGR 899/2014)

### Geoportale SCT
- Home: <https://geoportale.regione.vda.it/>
- DEM 2m per terrain 3D, ortofoto, CTR
- Download rete sentieristica: <https://geoportale.regione.vda.it/download/rete-sentieristica/>

### OpenStreetMap
- Rifugi e bivacchi (`tourism=alpine_hut`, `tourism=wilderness_hut`)
- API Overpass per estrazione mirata Valle d'Aosta

### Wikidata / Wikipedia
- Foto Creative Commons, descrizioni multilingua di vette, valli, rifugi

### Lovevda.it
- Solo come **fonte di ispirazione editoriale**, NON copiare testi (copyright). Riscrivere sempre in proprio.

### Flora e fauna
- Parco Nazionale Gran Paradiso open data: <https://www.pngp.it/scopri-il-parco/dati>
- iNaturalist API per osservazioni geolocalizzate
- GBIF per dati distribuzione specie

---

## 4. Struttura sito

```
/                       Hero film-like + sentieri in evidenza + mappa interattiva regione
/sentieri               Catalogo filtrabile (difficoltà, lunghezza, dislivello, durata, valle)
/sentieri/[slug]        Pagina dettaglio: hero foto, mappa 2D+3D, profilo altimetrico, descrizione,
                        flora/fauna lungo il percorso, rifugi correlati, gallery, GPX download
/alte-vie               Sezione editoriale dedicata: AV1 Giganti, AV2 Naturalista, AV3, AV4
/alte-vie/[slug]        Tappe singole con mappa, dislivelli, rifugi tappa
/rifugi                 Catalogo rifugi e bivacchi con filtro mappa
/rifugi/[slug]          Dettaglio rifugio + link affiliato Booking + sentieri di accesso
/flora-fauna            Hub editoriale: specie iconiche (stambecco, camoscio, gipeto, edelweiss…)
/flora-fauna/[slug]     Scheda specie con habitat, foto, sentieri dove avvistarla
/parchi                 Gran Paradiso, Mont Avic, riserve
/blog                   Articoli stagionali, news, sicurezza, equipaggiamento (SEO long-tail)
/about
/it /en                 Versioni lingua
```

Ogni rotta è statica (SSG) dove possibile per velocità + indicizzazione, con `revalidate` su pagine dinamiche.

---

## 5. Esperienza utente / design

Direzione estetica scelta: **editorial alpino**. Pensa al *New York Times Travel* incrociato con *Apple Maps* e un pizzico di Patagonia. NON il solito sito di sentieri verde-marroncino-comic-sans.

- Palette: nero `#0A0A0A` base, bianco neve `#FAFAF7`, accent ghiaccio `#5BC0EB` e oro alpino `#D4A574`. Niente gradienti viola.
- Tipografia: display serif elegante (**Fraunces** o **PP Editorial New**), body sans pulito (**Geist** o **Söhne** fallback Inter solo se necessario). Numeri tabular per dati tecnici.
- Foto: full-bleed, sempre la prima cosa. Lazy load + blur placeholder.
- Motion: scroll reveal misurato, parallax leggero sul hero, transizioni pagina morbide. Mai animazioni gratuite.
- Mobile-first ma desktop spettacolare. Hero verticale su mobile, orizzontale wide su desktop.
- Mappa sempre dominante nella pagina sentiero: prende il 100% della viewport in modalità "esplora".

---

## 6. Funzionalità chiave (MVP → V1)

### MVP (lanciabile in 2 settimane con Claude Code)
- Homepage con hero, 6 sentieri in evidenza, mappa interattiva Valle d'Aosta
- Catalogo `/sentieri` con filtri client-side (difficoltà, durata, lunghezza, dislivello)
- ~30 schede sentiero (Alte Vie tappe + classici Gran Paradiso, Monte Rosa, Cervino, Monte Bianco)
- Mappa 2D MapLibre con overlay WMS Catasto VdA + GPX
- Profilo altimetrico (Recharts) calcolato dal GPX
- Lingua IT + EN
- Slot AdSense predisposti (in attesa approvazione, intanto placeholder)
- SEO completo: sitemap.xml, robots.txt, JSON-LD `HikingTrail`, OG image dinamiche
- Lighthouse score > 90 su tutte le metriche

### V1 (mese 2-3)
- Mappa 3D terrain con MapLibre + DEM
- Sezione rifugi con filtro mappa e link affiliato Booking
- Sezione flora/fauna
- Blog con MDX
- Newsletter (Resend)
- 100+ sentieri

### V2 (mese 4+)
- User generated content: recensioni sentieri (Supabase)
- Bollettini meteo per zona (api OpenWeather/MeteoBlue)
- Bollettino valanghe AINEVA in stagione
- App PWA installabile con sentieri offline
- Sponsorship dashboard per rifugi

---

## 7. SEO — la chiave del traffico organico

1. **URL puliti bilingue**: `/it/sentieri/alta-via-1-tappa-1` e `/en/trails/alta-via-1-stage-1`
2. **Schema.org `HikingTrail`** in JSON-LD su ogni pagina sentiero (Google li mostra come rich result)
3. **Hreflang** corretti tra IT e EN
4. **Sitemap dinamico** generato da Next.js
5. **Core Web Vitals**: ottimizzazione immagini (next/image + AVIF), font display swap, no layout shift, Edge runtime
6. **Long-tail target**: "alta via 1 valle d'aosta tappe", "rifugio bonatti come arrivare", "anello gran paradiso giorni", "monte fallere sentiero"
7. **Backlink strategy**: collaborazioni con CAI, AVS Aosta, rifugi (recensione = link), guide alpine, blog outdoor

---

## 8. Roadmap di implementazione con Claude Code

1. `cd sentieri-vda && claude` — lancia Claude Code nella cartella
2. Apre `CLAUDE.md` automaticamente come contesto progetto
3. Comanda a Claude Code in sequenza:
   - "Esegui `npm install` e verifica che il dev server parta"
   - "Costruisci la homepage seguendo `src/components/Hero.tsx` come riferimento estetico"
   - "Genera 30 schede sentiero in `src/data/trails.json` partendo dalle Alte Vie 1 e 2 tappe ufficiali, usando lo schema `Trail` in `src/lib/types.ts`. Per ogni tappa includi nome IT/EN, distanza km, dislivello +/-, durata ore, difficoltà (E/EE/EEA), partenza, arrivo, rifugi tappa, descrizione 200 parole IT + 200 EN, coordinate start/end, slug. NON inventare dati: cerca su fonti ufficiali e cita."
   - "Implementa la pagina dettaglio sentiero con mappa MapLibre, profilo altimetrico, gallery"
   - "Configura next-intl e popola i file di traduzione"
   - "Aggiungi sitemap.xml, robots.txt, JSON-LD HikingTrail"
   - "Deploy su Vercel"

Vedi `CLAUDE.md` per le regole del progetto che Claude Code deve seguire.

---

## 9. Costi mensili stimati (lancio)

| Voce | Costo |
|---|---|
| Dominio | ~12 €/anno |
| Hosting Vercel | 0 € (free tier basta fino a ~100k visite/mese) |
| MapTiler tile | 0 € (free tier 100k richieste/mese) |
| Plausible Analytics | 9 €/mese (oppure Umami self-host gratis) |
| Resend Email | 0 € fino a 3000 mail/mese |
| **Totale** | **~10 €/mese** + dominio |

Ricavi attesi realistici dopo 6 mesi con buon SEO: 50–500 €/mese AdSense + affiliazioni, scalabile.

---

## 10. Aspetti legali

- **Disclaimer obbligatorio**: il sito fornisce informazioni a scopo divulgativo. L'utente è responsabile della propria sicurezza. Verificare condizioni meteo e nivologiche prima di partire. Pagina `/it/avvertenze`.
- **Privacy**: GDPR. Plausible/Umami non usano cookie identificativi → niente banner pesante, basta una privacy policy pulita.
- **Open data attribution**: footer con "Dati sentieri © Regione Autonoma Valle d'Aosta — Catasto Sentieri, licenza open data". Per OpenStreetMap "© OpenStreetMap contributors".
- **Foto**: usare solo proprie, Creative Commons (Wikimedia, Unsplash) o licenziate. Mai scraping.
- **Tor des Géants / TORX**: marchio registrato. Si può parlare della gara come informazione editoriale, non usare il logo senza permesso.

---

Pronto. Apri `CLAUDE.md` e via.

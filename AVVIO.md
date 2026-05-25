# Guida di avvio rapida — Sentieri VdA

Dal momento in cui scarichi `sentieri-vda.zip` al sito online, ecco i passi esatti.

## 1. Prerequisiti (una volta sola)

- **Node.js 20 LTS** o superiore: <https://nodejs.org>
- **Claude Code**: `npm install -g @anthropic-ai/claude-code` (vedi <https://docs.claude.com/claude-code>)
- **Account Vercel** (gratis): <https://vercel.com>
- **Account MapTiler** (gratis fino a 100k richieste/mese): <https://www.maptiler.com> → copia la "Default API key"
- **Account Google AdSense** (richiede dominio pubblicato e contenuti): <https://www.google.com/adsense> — fai questo dopo che il sito è online da almeno un mese, con 20+ articoli

## 2. Scompatta e setup locale

```bash
unzip sentieri-vda.zip
cd sentieri-vda
cp .env.example .env.local
# Apri .env.local e incolla la chiave MapTiler. AdSense lascialo vuoto per ora.

npm install
npm run dev
```

Vai su <http://localhost:3000>. Vedrai la home con l'hero (immagine placeholder), 3 sentieri di esempio, mappa interattiva con i sentieri ufficiali della Regione VdA caricati dal loro WMS.

## 3. Lancia Claude Code per espandere il sito

Nella stessa cartella:

```bash
claude
```

Claude Code legge automaticamente `CLAUDE.md` e capisce il progetto. Da qui dagli istruzioni in linguaggio naturale. Esempi di prompt che funzionano bene:

> Popola `src/data/trails.json` con tutte le 17 tappe ufficiali dell'Alta Via 1 della Valle d'Aosta. Per ognuna usa lo schema `Trail` da `src/lib/types.ts`. Cerca i dati ufficiali su catastosentieri.regione.vda.it e lovevda.it, ma riscrivi le descrizioni in proprio (200 parole IT, 200 parole EN). Se un dato non lo trovi verificato, lascia il campo a `null` e segnalalo nel diff.

> Aggiungi una pagina `/[locale]/alte-vie` con hero editoriale e griglia delle quattro Alte Vie (1 Giganti, 2 Naturalista, 3, 4). Stile coerente con `Hero.tsx` e `TrailCard.tsx`.

> Implementa il profilo altimetrico nella pagina dettaglio sentiero usando Recharts. I dati arrivano dal GPX: scrivi una utility `src/lib/gpx.ts` che parse il file con `@tmcw/togeojson` e ritorna `{distance, elevation}[]`.

> Aggiungi la sezione rifugi: dati da OpenStreetMap via Overpass API (query: `node[tourism=alpine_hut](45.4,6.7,46.0,8.0)`). Crea pagina catalogo `/rifugi` e dettaglio `/rifugi/[slug]` con link affiliato Booking se disponibile.

> Configura Plausible Analytics nel layout. Aggiungi una pagina `/privacy` GDPR-compliant.

> Genera 20 immagini AVIF placeholder in `public/images/` con dimensioni 1600x1200 partendo dai sentieri in `trails.json`. Per ora usa colori solidi tematici, poi le sostituirò con foto reali.

## 4. Le immagini

Il sito è fortemente fotografico — fonti legali:

- **Foto tue** (la migliore opzione). Anche scattate col cellulare in alta qualità.
- **Wikimedia Commons** — `commons.wikimedia.org`, filtra "creative commons". Cita autore + licenza nel campo `image_credit` (aggiungilo allo schema se vuoi).
- **Unsplash** — `unsplash.com`, licenza permissiva. Cerca "Aosta Valley", "Mont Blanc", "Gran Paradiso".
- **Lovevda** — solo se hai permesso scritto. Altrimenti **NO**.

NON fare scraping di Instagram/Pinterest/Google Images: è violazione di copyright.

## 5. Deploy su Vercel

```bash
# Installa CLI Vercel
npm install -g vercel

# Login
vercel login

# Deploy (dalla cartella del progetto)
vercel
# segui le istruzioni: link a tuo account, conferma framework Next.js

# Aggiungi le variabili ambiente da .env.local nella dashboard Vercel
# Poi:
vercel --prod
```

Ti ritrovi un URL `nomedeploy.vercel.app`. Per collegare il dominio personalizzato (`sentierivda.it` o quello che hai comprato):
1. Compra dominio su Namecheap / Cloudflare / OVH (8-15 €/anno)
2. Vercel dashboard → progetto → Settings → Domains → aggiungi
3. Configura i record DNS come ti dice Vercel

## 6. SEO e monetizzazione — checklist primo mese

- [ ] Configurato Google Search Console (`search.google.com/search-console`) con dominio verificato
- [ ] Inviato `sitemap.xml` (Vercel lo serve da `/sitemap.xml` automaticamente)
- [ ] Bing Webmaster Tools (10% traffico extra gratis)
- [ ] 20+ pagine sentiero pubblicate e indicizzate
- [ ] Plausible Analytics attivo (per vedere il traffico in tempo reale)
- [ ] Mail a 3-5 rifugi proponendo recensione = link reciproco
- [ ] Newsletter attiva (Resend free tier)
- [ ] Solo DOPO 30+ giorni con contenuti: richiesta AdSense

## 7. Espansioni che generano soldi più velocemente

In ordine di ROI atteso:

1. **Affiliazione Booking.com** sulle pagine rifugio — commissioni 25-40% su ogni prenotazione. Iscriviti come affiliate: `partner.booking.com`
2. **Affiliazione GetYourGuide** per tour con guida alpina, biglietti funivia (Monte Bianco, Skyway). Commissioni 8%.
3. **AdSense** dopo approvazione — RPM atteso su contenuto outdoor: 5-15 €/1000 visite.
4. **Sponsorship rifugi** — pacchetti annuali 300-800 € per "scheda evidenziata + foto + link diretto sito rifugio". Vendita diretta.
5. **Affiliazione Amazon** su pagine equipaggiamento (`/blog/zaino-trekking-30l`, `/blog/scarponi-alta-via`). Commissioni 1-4% ma volumi alti.
6. **Newsletter sponsorizzata** quando hai 5000+ iscritti.

## 8. Quando torno da te a chiedere aiuto

Se ti blocchi, copia-incolla l'errore e il file in cui succede a Claude (questo Claude, in chat web), o usa direttamente Claude Code: lui ha accesso al filesystem e può debuggare in autonomia.

Buon cammino.

import fs from 'node:fs/promises';
import path from 'node:path';

// Carica variabili d'ambiente da .env.local manualmente
async function loadEnv() {
  try {
    const envContent = await fs.readFile('.env.local', 'utf-8');
    for (const line of envContent.split('\n')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch (e) {
    // Ignora se il file non esiste
  }
}

const SKELETON_PATH = path.join(process.cwd(), 'src/data/trails-skeleton.json');
const CURATED_PATH = path.join(process.cwd(), 'src/data/trails.json');

async function main() {
  await loadEnv();
  const API_KEY = process.env.GEMINI_API_KEY;
  const MODEL = 'gemini-1.5-flash';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const limit = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '0');
  const specificSlugs = args.filter(a => !a.startsWith('--')).length > 0 ? args.filter(a => !a.startsWith('--')) : null;

  console.log('--- Generazione descrizioni editoriali ---');

  if (!API_KEY) {
    console.error('ERRORE: GEMINI_API_KEY non trovata in .env.local');
    process.exit(1);
  }

  const skeletonData = JSON.parse(await fs.readFile(SKELETON_PATH, 'utf-8'));
  const curatedData = JSON.parse(await fs.readFile(CURATED_PATH, 'utf-8'));
  const curatedSlugs = new Set(curatedData.map((t: any) => t.slug));

  let generatedCount = 0;
  let totalCostEstimate = 0;

  let trailsToProcess = skeletonData.filter((trail: any) => {
    if (curatedSlugs.has(trail.slug)) return false;
    if (trail.description_generated) return false;
    return true;
  });

  if (specificSlugs) {
    trailsToProcess = skeletonData.filter((trail: any) => specificSlugs.includes(trail.slug));
  }

  console.log(`Trovati ${skeletonData.length} sentieri totali.`);
  console.log(`Salto ${curatedSlugs.size} sentieri curati a mano.`);
  console.log(`Rimangono ${trailsToProcess.length} sentieri da processare.`);

  const processBatch = limit > 0 ? trailsToProcess.slice(0, limit) : (isDryRun && !specificSlugs ? trailsToProcess.slice(0, 3) : trailsToProcess);

  for (const trail of processBatch) {
    console.log(`\n[${generatedCount + 1}/${processBatch.length}] Generazione per: ${trail.name_it} (${trail.slug})...`);
    
    try {
      const result = await generateDescription(trail, API_URL);
      
      if (!isDryRun) {
        // Aggiorna i campi
        trail.description_it = result.description_it;
        trail.description_en = result.description_en;
        trail.description_fr = result.description_fr;
        trail.description_de = result.description_de;
        trail.shortDescription_it = result.shortDescription_it;
        trail.shortDescription_en = result.shortDescription_en;
        trail.shortDescription_fr = result.shortDescription_fr;
        trail.shortDescription_de = result.shortDescription_de;
        trail.description_generated = true;
        
        // Salvataggio ogni 10
        if (generatedCount % 10 === 0 && generatedCount > 0) {
           await fs.writeFile(SKELETON_PATH, JSON.stringify(skeletonData, null, 2));
           console.log('...checkpoint salvato.');
        }
      } else {
        console.log('--- OUTPUT (DRY RUN) ---');
        console.log(JSON.stringify(result, null, 2));
      }

      generatedCount++;
      totalCostEstimate += 0.00025; 

      // Rate limiting: 1s
      if (!isDryRun) await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Errore su ${trail.slug}:`, error);
    }
  }

  if (!isDryRun && generatedCount > 0) {
    await fs.writeFile(SKELETON_PATH, JSON.stringify(skeletonData, null, 2));
    console.log('\nFile trails-skeleton.json aggiornato con successo.');
  }

  console.log('\n--- Run completata ---');
  console.log(`Generati: ${generatedCount}`);
  console.log(`Costo stimato: ~${totalCostEstimate.toFixed(4)} USD`);
}

async function generateDescription(trail: any, apiUrl: string) {
  const facts = {
    name: trail.name_it,
    start: trail.start?.name,
    start_ele: trail.start?.elevation_m,
    end: trail.end?.name,
    end_ele: trail.end?.elevation_m,
    valley: trail.valley,
    municipalities: trail.municipalities.join(', '),
    distance: trail.distance_km?.toFixed(1),
    gain: trail.elevation_gain_m,
    loss: trail.elevation_loss_m,
    difficulty: trail.difficulty,
    seasons: trail.season.join(', '),
    sct_code: trail.sct_code
  };

  const systemPrompt = `Sei una guida escursionistica professionale della Valle d'Aosta. 
Scrivi descrizioni brevi (3-5 frasi) in 4 lingue (IT, EN, FR, DE) per il sentiero fornito.

REGOLE TASSATIVE:
- Usa SOLO i dati forniti nei fatti.
- NON inventare rifugi, laghi, panorami, flora, fauna o dettagli del terreno se non sono presenti nei fatti.
- NON usare superlativi roboanti o marketing aggressivo. Tono sobrio e informativo.
- Riformula i dati in modo elegante (es. "Il percorso si snoda nel comune di...", "L'itinerario collega...").
- Fornisci anche una 'shortDescription' di circa 120-150 caratteri che riassuma i dati principali.
- Restituisci esclusivamente un oggetto JSON con queste chiavi: 
  description_it, description_en, description_fr, description_de, 
  shortDescription_it, shortDescription_en, shortDescription_fr, shortDescription_de`;

  const userPrompt = `Fatti verificati per il sentiero:
${JSON.stringify(facts, null, 2)}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `SYSTEM: ${systemPrompt}\n\nUSER: ${userPrompt}` }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API request failed: ${response.status} - ${errorBody}`);
  }

  const data: any = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) throw new Error('Risposta API vuota');
  
  return JSON.parse(text);
}

main().catch(console.error);

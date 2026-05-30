/** Scarica lo sfondo Sicurezza (mappa topografica + bussola) da Wikimedia Commons. */
import fs from 'node:fs/promises';

const SOURCE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Day_1-_Hiking_Essentials_%2819444913913%29.jpg/1920px-Day_1-_Hiking_Essentials_%2819444913913%29.jpg';
const DEST = 'public/safety/hero-map-compass.jpg';

const res = await fetch(SOURCE);
if (!res.ok) throw new Error(`${res.status} ${SOURCE}`);
await fs.writeFile(DEST, Buffer.from(await res.arrayBuffer()));
console.log('Saved', DEST);

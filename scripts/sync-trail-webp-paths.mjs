import fs from 'node:fs';
import path from 'node:path';

const DATA = path.join(process.cwd(), 'src/data');

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(fp);
    else if (ent.name.endsWith('.json')) {
      let raw = fs.readFileSync(fp, 'utf8');
      const updated = raw.replace(/\/trails\/([a-z0-9-]+)\.(jpg|jpeg|png)/gi, (match, base) => {
        const webp = `/trails/${base}.webp`;
        if (fs.existsSync(path.join(process.cwd(), 'public', webp.slice(1)))) return webp;
        return match;
      });
      if (updated !== raw) {
        fs.writeFileSync(fp, updated);
        console.log('Updated', path.relative(process.cwd(), fp));
      }
    }
  }
}

walk(DATA);

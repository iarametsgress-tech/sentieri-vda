import fs from 'fs';

const updates = [
  ['src/app/[locale]/about/page.tsx', '/about'],
  ['src/app/[locale]/flora-fauna/page.tsx', '/flora-fauna'],
  ['src/app/[locale]/rifugi/page.tsx', '/rifugi'],
  ['src/app/[locale]/avvertenze/page.tsx', '/avvertenze'],
  ['src/app/[locale]/blog/page.tsx', '/blog'],
  ['src/app/[locale]/cookie/page.tsx', '/cookie'],
  ['src/app/[locale]/privacy/page.tsx', '/privacy'],
];

for (const [file, route] of updates) {
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes('localeAlternatesAbsolute')) {
    c = c.replace(
      "import { SITE_URL } from '@/lib/config';",
      "import { SITE_URL } from '@/lib/config';\nimport { localeAlternatesAbsolute } from '@/lib/metadata-languages';"
    );
  }
  c = c.replace(/languages: \{[\s\S]*?\},\n    \},\n  \};/m, () =>
    `languages: localeAlternatesAbsolute('${route}'),\n    },\n  };`
  );
  fs.writeFileSync(file, c);
}

let c = fs.readFileSync('src/app/[locale]/rifugi/[slug]/page.tsx', 'utf8');
if (!c.includes('localeAlternatesAbsolute')) {
  c = c.replace(
    "import { SITE_URL } from '@/lib/config';",
    "import { SITE_URL } from '@/lib/config';\nimport { localeAlternatesAbsolute } from '@/lib/metadata-languages';"
  );
}
c = c.replace(/languages: \{[\s\S]*?\},\n    \},\n  \};/m, () =>
  'languages: localeAlternatesAbsolute(`/rifugi/${slug}`),\n    },\n  };'
);
fs.writeFileSync('src/app/[locale]/rifugi/[slug]/page.tsx', c);

c = fs.readFileSync('src/app/[locale]/sentieri/[slug]/page.tsx', 'utf8');
if (!c.includes('localeAlternatesAbsolute')) {
  c = c.replace(
    "import { SITE_URL } from '@/lib/config';",
    "import { SITE_URL } from '@/lib/config';\nimport { localeAlternatesAbsolute } from '@/lib/metadata-languages';"
  );
}
c = c.replace(
  /languages: \{ it: `\/it\/sentieri\/\$\{slug\}`, en: `\/en\/sentieri\/\$\{slug\}` \}/,
  'languages: localeAlternatesAbsolute(`/sentieri/${slug}`)'
);
fs.writeFileSync('src/app/[locale]/sentieri/[slug]/page.tsx', c);

console.log('metadata updated');

import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/lib/seo';

export default function SiteJsonLd() {
  const schemas = [buildWebSiteJsonLd(), buildOrganizationJsonLd()];
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

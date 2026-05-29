import { setRequestLocale } from 'next-intl/server';
import { SITE_URL } from '@/lib/config';
import { localeAlternatesAbsolute } from '@/lib/metadata-languages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: 'Privacy Policy',
    description:
      locale === 'it'
        ? 'Informativa sul trattamento dei dati personali ai sensi del GDPR (Reg. UE 2016/679).'
        : 'Privacy notice on personal data processing pursuant to GDPR (EU Reg. 2016/679).',
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy`,
      languages: {
        it: `${SITE_URL}/it/privacy`,
        en: `${SITE_URL}/en/privacy`,
      },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isIT = locale === 'it';

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
      <div className="max-w-2xl">
        <p className="text-xs font-mono tracking-widest text-alpenglow/80 uppercase mb-4">
          {isIT ? 'Legale' : 'Legal'}
        </p>
        <h1 className="font-display text-3xl tracking-tighter mb-2">Privacy Policy</h1>
        <p className="text-snow/40 text-xs font-mono mb-10">
          {isIT ? 'Aggiornata: maggio 2026' : 'Updated: May 2026'}
        </p>

        <div className="space-y-8 text-snow/60 text-sm leading-relaxed">
          <section>
            <h2 className="text-snow font-semibold mb-3 text-base">
              {isIT ? '1. Titolare del trattamento' : '1. Data controller'}
            </h2>
            <p>
              {isIT
                ? 'Il titolare del trattamento è il gestore del sito Sentieri VdA, raggiungibile all\'indirizzo info@sentierivda.it. Il sito è un progetto personale e indipendente, non collegato a società o enti.'
                : 'The data controller is the operator of the Sentieri VdA website, reachable at info@sentierivda.it. The site is a personal, independent project, not affiliated with any company or organisation.'}
            </p>
          </section>

          <section>
            <h2 className="text-snow font-semibold mb-3 text-base">
              {isIT ? '2. Dati raccolti' : '2. Data collected'}
            </h2>
            <p className="mb-3">
              {isIT
                ? 'Il sito raccoglie esclusivamente dati tecnici minimi necessari al funzionamento:'
                : 'The site collects only the minimum technical data necessary for operation:'}
            </p>
            <ul className="list-disc list-inside space-y-1 text-snow/50">
              <li>
                {isIT
                  ? 'Log del server (IP, browser, pagine visitate) conservati automaticamente da Vercel per 7 giorni'
                  : 'Server logs (IP, browser, pages visited) automatically retained by Vercel for 7 days'}
              </li>
              <li>
                {isIT
                  ? 'Dati di analytics aggregati e anonimi tramite Plausible Analytics (nessun cookie, nessun dato personale)'
                  : 'Aggregated, anonymous analytics data via Plausible Analytics (no cookies, no personal data)'}
              </li>
              <li>
                {isIT
                  ? 'Indirizzo email se fornito volontariamente per la newsletter (con consenso esplicito)'
                  : 'Email address if voluntarily provided for the newsletter (with explicit consent)'}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-snow font-semibold mb-3 text-base">
              {isIT ? '3. Finalità e base giuridica' : '3. Purpose and legal basis'}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-snow/50">
              <li>
                {isIT
                  ? 'Erogazione del servizio e sicurezza — base giuridica: legittimo interesse (art. 6 par. 1 lett. f GDPR)'
                  : 'Service delivery and security — legal basis: legitimate interest (Art. 6(1)(f) GDPR)'}
              </li>
              <li>
                {isIT
                  ? 'Analisi statistica anonima del traffico — base giuridica: legittimo interesse'
                  : 'Anonymous statistical traffic analysis — legal basis: legitimate interest'}
              </li>
              <li>
                {isIT
                  ? 'Invio newsletter — base giuridica: consenso (art. 6 par. 1 lett. a GDPR)'
                  : 'Newsletter delivery — legal basis: consent (Art. 6(1)(a) GDPR)'}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-snow font-semibold mb-3 text-base">
              {isIT ? '4. Trasferimento verso paesi terzi' : '4. Transfer to third countries'}
            </h2>
            <p>
              {isIT
                ? "Il sito è ospitato su Vercel Inc. (USA). Il trasferimento è coperto dalle Standard Contractual Clauses (SCC) adottate dalla Commissione Europea (decisione 2021/914). I dati di analytics sono elaborati da Plausible Analytics, con server in UE (Germania)."
                : 'The site is hosted on Vercel Inc. (USA). The transfer is covered by Standard Contractual Clauses (SCCs) adopted by the European Commission (Decision 2021/914). Analytics data is processed by Plausible Analytics, with servers in the EU (Germany).'}
            </p>
          </section>

          <section>
            <h2 className="text-snow font-semibold mb-3 text-base">
              {isIT ? '5. Diritti degli interessati' : '5. Data subject rights'}
            </h2>
            <p>
              {isIT
                ? 'Hai il diritto di accedere, rettificare, cancellare i tuoi dati, opporti al trattamento, richiederne la portabilità e revocare il consenso in qualsiasi momento. Per esercitare i tuoi diritti scrivi a info@sentierivda.it. Hai inoltre il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).'
                : 'You have the right to access, rectify, erase your data, object to processing, request portability and withdraw consent at any time. To exercise your rights write to info@sentierivda.it. You also have the right to lodge a complaint with the Italian Data Protection Authority (www.garanteprivacy.it).'}
            </p>
          </section>

          <section>
            <h2 className="text-snow font-semibold mb-3 text-base">
              {isIT ? '6. Cookie' : '6. Cookies'}
            </h2>
            <p>
              {isIT ? (
                <>
                  Il sito non utilizza cookie di profilazione. Per i dettagli consulta la{' '}
                  <a href={`/${locale}/cookie`} className="text-alpenglow hover:underline">
                    Cookie Policy
                  </a>
                  .
                </>
              ) : (
                <>
                  The site does not use profiling cookies. For details see the{' '}
                  <a href={`/${locale}/cookie`} className="text-alpenglow hover:underline">
                    Cookie Policy
                  </a>
                  .
                </>
              )}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

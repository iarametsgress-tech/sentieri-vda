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
    title: 'Cookie Policy',
    description:
      locale === 'it'
        ? 'Informativa sull\'uso dei cookie su Sentieri VdA.'
        : 'Information on the use of cookies on Sentieri VdA.',
    alternates: {
      canonical: `${SITE_URL}/${locale}/cookie`,
      languages: {
        it: `${SITE_URL}/it/cookie`,
        en: `${SITE_URL}/en/cookie`,
      },
    },
  };
}

export default async function CookiePage({
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
        <h1 className="font-display text-3xl tracking-tighter mb-2">Cookie Policy</h1>
        <p className="text-snow/40 text-xs font-mono mb-10">
          {isIT ? 'Aggiornata: maggio 2026' : 'Updated: May 2026'}
        </p>

        <div className="space-y-8 text-snow/60 text-sm leading-relaxed">
          <section>
            <h2 className="text-snow font-semibold mb-3 text-base">
              {isIT ? '1. Cosa sono i cookie' : '1. What are cookies'}
            </h2>
            <p>
              {isIT
                ? "I cookie sono piccoli file di testo salvati dal browser sul tuo dispositivo quando visiti un sito. Possono essere tecnici (necessari al funzionamento), analitici (statistiche di utilizzo) o di profilazione (per mostrare pubblicità personalizzata)."
                : 'Cookies are small text files stored by your browser on your device when you visit a website. They can be technical (necessary for operation), analytical (usage statistics) or profiling (for showing personalised advertising).'}
            </p>
          </section>

          <section>
            <h2 className="text-snow font-semibold mb-3 text-base">
              {isIT ? '2. Cookie utilizzati da questo sito' : '2. Cookies used by this site'}
            </h2>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-snow/50 font-mono">
                      {isIT ? 'Cookie' : 'Cookie'}
                    </th>
                    <th className="text-left py-2 pr-4 text-snow/50 font-mono">
                      {isIT ? 'Tipo' : 'Type'}
                    </th>
                    <th className="text-left py-2 text-snow/50 font-mono">
                      {isIT ? 'Scopo' : 'Purpose'}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-snow/40">
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono">NEXT_LOCALE</td>
                    <td className="py-2 pr-4">
                      {isIT ? 'Tecnico' : 'Technical'}
                    </td>
                    <td className="py-2">
                      {isIT
                        ? 'Memorizza la lingua scelta (IT/EN)'
                        : 'Stores the chosen language (IT/EN)'}
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4 font-mono">_plausible</td>
                    <td className="py-2 pr-4">
                      {isIT ? 'Analitico' : 'Analytical'}
                    </td>
                    <td className="py-2">
                      {isIT
                        ? 'Analytics anonime, nessun dato personale (Plausible Analytics)'
                        : 'Anonymous analytics, no personal data (Plausible Analytics)'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-snow/40 text-xs">
              {isIT
                ? 'Il sito non utilizza cookie di profilazione o marketing. Se in futuro verranno integrati sistemi pubblicitari (es. Google AdSense), questa pagina verrà aggiornata e verrà richiesto il consenso prima dell\'attivazione.'
                : 'The site does not use profiling or marketing cookies. If advertising systems (e.g. Google AdSense) are integrated in the future, this page will be updated and consent will be requested before activation.'}
            </p>
          </section>

          <section>
            <h2 className="text-snow font-semibold mb-3 text-base">
              {isIT ? '3. Come disabilitare i cookie' : '3. How to disable cookies'}
            </h2>
            <p>
              {isIT
                ? "Puoi disabilitare o cancellare i cookie dalle impostazioni del tuo browser. Tieni presente che disabilitare i cookie tecnici potrebbe compromettere alcune funzionalità del sito (es. la scelta della lingua). I principali browser offrono istruzioni nelle rispettive sezioni di supporto."
                : 'You can disable or delete cookies from your browser settings. Please note that disabling technical cookies may impair some site functionality (e.g. language selection). Major browsers provide instructions in their respective support sections.'}
            </p>
          </section>

          <section>
            <h2 className="text-snow font-semibold mb-3 text-base">
              {isIT ? '4. Aggiornamenti' : '4. Updates'}
            </h2>
            <p>
              {isIT
                ? "Questa Cookie Policy può essere aggiornata in qualsiasi momento. La data di ultima modifica è indicata in cima alla pagina. Per domande scrivi a info@sentierivda.it."
                : 'This Cookie Policy may be updated at any time. The date of last modification is shown at the top of the page. For questions write to info@sentierivda.it.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

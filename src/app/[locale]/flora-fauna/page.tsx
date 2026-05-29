import { redirect } from 'next/navigation';

export default async function FloraFaunaRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === 'string') qs.set(k, v);
    else if (Array.isArray(v)) v.forEach((x) => qs.append(k, x));
  }
  const query = qs.toString();
  const hash = query.includes('specie=') ? '' : '#flora-fauna';
  redirect(`/${locale}/ambiente${query ? `?${query}` : ''}${hash}`);
}

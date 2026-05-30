'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import {
  Search,
  Mountain,
  Home,
  Tent,
  Phone,
  ExternalLink,
  ChevronRight,
  Calendar,
  BedDouble,
  MapPin,
  Globe,
  Mail,
  Instagram,
  Facebook,
} from 'lucide-react';
import type { Refuge } from '@/lib/types';
import {
  getRefugeName,
  getRefugeValley,
  getRefugeOpenPeriod,
  getRefugeManager,
  getRefugeImageAlt,
} from '@/lib/refuge-locale';

type Tab = 'all' | 'rifugio' | 'bivacco';

interface RefugesExplorerProps {
  refuges: Refuge[];
  locale: string;
  labels: {
    search: string;
    all: string;
    rifugio: string;
    bivacco: string;
    elevation: string;
    valley: string;
    beds: string;
    open: string;
    viewProfile: string;
    noResults: string;
    book: string;
  };
}

function RefugeCard({ refuge, locale, labels }: { refuge: Refuge; locale: string; labels: RefugesExplorerProps['labels'] }) {
  const name = getRefugeName(refuge, locale);
  const valley = getRefugeValley(refuge, locale);
  const open = getRefugeOpenPeriod(refuge, locale);
  const image = refuge.images[0];
  const isBivacco = refuge.type === 'bivacco';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-alpenglow/30 hover:bg-alpenglow/[0.03] transition-colors"
    >
      <Link href={`/rifugi/${refuge.slug}`} className="block">
        <div className="relative h-44 overflow-hidden bg-ink/60">
          {image ? (
            <Image
              src={image.src}
              alt={getRefugeImageAlt(image, locale)}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-snow/20">
              {isBivacco ? <Tent size={40} /> : <Home size={40} />}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <span
            className={`absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${
              isBivacco
                ? 'bg-ice/10 text-ice border-ice/25'
                : 'bg-alpenglow/10 text-alpenglow border-alpenglow/25'
            }`}
          >
            {isBivacco ? labels.bivacco : labels.rifugio}
          </span>
          <p className="absolute bottom-3 left-3 font-display text-xl text-snow leading-tight pr-4">
            {name}
          </p>
        </div>

        <div className="p-5 space-y-3">
          <dl className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <dt className="text-snow/55 mb-0.5 flex items-center gap-1">
                <Mountain size={11} /> {labels.elevation}
              </dt>
              <dd className="text-ice tabular-nums">{refuge.elevation_m} m</dd>
            </div>
            <div>
              <dt className="text-snow/55 mb-0.5 flex items-center gap-1">
                <MapPin size={11} /> {labels.valley}
              </dt>
              <dd className="text-snow/70 truncate">{valley}</dd>
            </div>
            {refuge.beds ? (
              <div>
                <dt className="text-snow/55 mb-0.5 flex items-center gap-1">
                  <BedDouble size={11} /> {labels.beds}
                </dt>
                <dd className="text-snow/70">{refuge.beds}</dd>
              </div>
            ) : null}
            {open ? (
              <div className="col-span-2">
                <dt className="text-snow/55 mb-0.5 flex items-center gap-1">
                  <Calendar size={11} /> {labels.open}
                </dt>
                <dd className="text-snow/60 leading-snug">{open}</dd>
              </div>
            ) : null}
          </dl>

          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-alpenglow group-hover:gap-2.5 transition-all">
            {labels.viewProfile}
            <ChevronRight size={14} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export default function RefugesExplorer({ refuges, locale, labels }: RefugesExplorerProps) {
  const [tab, setTab] = useState<Tab>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return refuges.filter((r) => {
      if (tab === 'rifugio' && r.type !== 'rifugio') return false;
      if (tab === 'bivacco' && r.type !== 'bivacco') return false;
      if (!q) return true;
      const name = getRefugeName(r, locale).toLowerCase();
      const valley = getRefugeValley(r, locale).toLowerCase();
      return name.includes(q) || valley.includes(q) || r.slug.includes(q);
    });
  }, [refuges, tab, query, locale]);

  const rifugioCount = refuges.filter((r) => r.type === 'rifugio').length;
  const bivaccoCount = refuges.filter((r) => r.type === 'bivacco').length;

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all', label: labels.all, count: refuges.length },
    { id: 'rifugio', label: labels.rifugio, count: rifugioCount },
    { id: 'bivacco', label: labels.bivacco, count: bivaccoCount },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-mono border transition-colors ${
                tab === t.id
                  ? 'bg-alpenglow/15 border-alpenglow/40 text-alpenglow'
                  : 'border-white/10 text-snow/50 hover:border-white/20 hover:text-snow/70'
              }`}
            >
              {t.label}
              <span className="ml-2 opacity-60 tabular-nums">{t.count}</span>
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-snow/50" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.search}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-snow placeholder:text-snow/50 focus:outline-none focus:border-alpenglow/40"
          />
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <p className="text-snow/55 font-mono text-sm py-12 text-center">{labels.noResults}</p>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <RefugeCard key={r.slug} refuge={r} locale={locale} labels={labels} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RefugeDetailStats({
  refuge,
  locale,
  labels,
}: {
  refuge: Refuge;
  locale: string;
  labels: Record<string, string>;
}) {
  const open = getRefugeOpenPeriod(refuge, locale);
  const manager = getRefugeManager(refuge, locale);
  const valley = getRefugeValley(refuge, locale);

  const items = [
    { icon: <Mountain size={14} />, label: labels.elevation, value: `${refuge.elevation_m} m` },
    { icon: <MapPin size={14} />, label: labels.valley, value: valley },
    refuge.beds ? { icon: <BedDouble size={14} />, label: labels.beds, value: String(refuge.beds) } : null,
    open ? { icon: <Calendar size={14} />, label: labels.open, value: open } : null,
    manager ? { icon: <Home size={14} />, label: labels.manager, value: manager } : null,
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-white/8 bg-white/[0.03] p-4 flex gap-3"
        >
          <div className="text-alpenglow/80 shrink-0 mt-0.5">{item.icon}</div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-snow/55 mb-1">
              {item.label}
            </p>
            <p className="text-sm text-snow/85 leading-snug">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RefugeContactsSection({
  refuge,
  labels,
}: {
  refuge: Refuge;
  labels: {
    title: string;
    subtitle: string;
    call: string;
    website: string;
    book: string;
    instagram: string;
    facebook: string;
    email: string;
    noSocial: string;
  };
}) {
  const website = refuge.website;
  const bookUrl = refuge.booking_url ?? refuge.website;

  if (!website && !refuge.phone && !refuge.email && !refuge.instagram && !refuge.facebook) {
    return null;
  }

  const items = [
    refuge.phone
      ? {
          key: 'phone',
          href: `tel:${refuge.phone.replace(/\s/g, '')}`,
          icon: <Phone size={18} />,
          label: labels.call,
          value: refuge.phone,
          external: false,
          primary: false,
        }
      : null,
    website
      ? {
          key: 'website',
          href: website,
          icon: <Globe size={18} />,
          label: labels.website,
          value: new URL(website).hostname.replace(/^www\./, ''),
          external: true,
          primary: true,
        }
      : null,
    refuge.email
      ? {
          key: 'email',
          href: `mailto:${refuge.email}`,
          icon: <Mail size={18} />,
          label: labels.email,
          value: refuge.email,
          external: false,
          primary: false,
        }
      : null,
    refuge.instagram
      ? {
          key: 'instagram',
          href: refuge.instagram,
          icon: <Instagram size={18} />,
          label: labels.instagram,
          value: '@' + refuge.instagram.replace(/\/$/, '').split('/').pop(),
          external: true,
          primary: false,
        }
      : null,
    refuge.facebook
      ? {
          key: 'facebook',
          href: refuge.facebook,
          icon: <Facebook size={18} />,
          label: labels.facebook,
          value: 'Facebook',
          external: true,
          primary: false,
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    href: string;
    icon: React.ReactNode;
    label: string;
    value: string;
    external: boolean;
    primary: boolean;
  }[];

  return (
    <section
      aria-labelledby="refuge-contacts-heading"
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] via-transparent to-alpenglow/[0.06] p-6 sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ice/5 blur-3xl"
      />
      <div className="relative">
        <h2
          id="refuge-contacts-heading"
          className="font-display text-2xl sm:text-3xl tracking-tight text-snow mb-2"
        >
          {labels.title}
        </h2>
        <p className="text-sm text-snow/55 leading-relaxed max-w-2xl mb-6">{labels.subtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {items.map((item) => (
            <a
              key={item.key}
              href={item.href}
              {...(item.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className={`group flex items-start gap-4 rounded-xl border p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alpenglow/60 ${
                item.primary
                  ? 'border-alpenglow/30 bg-alpenglow/[0.08] hover:border-alpenglow/50 hover:bg-alpenglow/[0.12]'
                  : 'border-white/10 bg-ink/30 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <span
                className={`mt-0.5 shrink-0 rounded-lg p-2 ${
                  item.primary ? 'bg-alpenglow/20 text-alpenglow' : 'bg-white/5 text-ice/90'
                }`}
              >
                {item.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-snow/55 mb-1">
                  {item.label}
                </span>
                <span className="block text-sm text-snow/90 truncate group-hover:text-snow transition-colors">
                  {item.value}
                </span>
              </span>
              {item.external ? (
                <ExternalLink
                  size={14}
                  className="ml-auto shrink-0 text-snow/50 group-hover:text-alpenglow transition-colors"
                  aria-hidden
                />
              ) : null}
            </a>
          ))}
        </div>

        {bookUrl && bookUrl !== website ? (
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-alpenglow px-5 py-3 text-sm font-medium text-ink hover:bg-alpenglow/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alpenglow/60"
          >
            <ExternalLink size={15} />
            {labels.book}
          </a>
        ) : null}
      </div>
    </section>
  );
}

export function RefugeBookingBar({
  refuge,
  locale,
  labels,
}: {
  refuge: Refuge;
  locale: string;
  labels: { book: string; call: string; website: string };
}) {
  const bookUrl = refuge.booking_url ?? refuge.website;
  if (!bookUrl && !refuge.phone) return null;

  return (
    <div className="sticky bottom-0 z-20 border-t border-white/10 bg-ink/95 backdrop-blur-md px-6 py-4">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <p className="font-display text-lg text-snow">
          {getRefugeName(refuge, locale)}
        </p>
        <div className="flex flex-wrap gap-3">
          {refuge.phone ? (
            <a
              href={`tel:${refuge.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-sm hover:border-alpenglow/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alpenglow/60"
            >
              <Phone size={14} />
              {labels.call}
            </a>
          ) : null}
          {bookUrl ? (
            <a
              href={bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-alpenglow text-ink text-sm font-medium hover:bg-alpenglow/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alpenglow/60"
            >
              <ExternalLink size={14} />
              {labels.book}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

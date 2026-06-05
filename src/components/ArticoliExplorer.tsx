'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Camera, Compass, Droplets, Mountain, Tent, Users } from 'lucide-react';
import { Link } from '@/i18n/routing';
import ScrollReveal from '@/components/ScrollReveal';
import SectionScrollNav from '@/components/SectionScrollNav';
import { topicClasses, type TopicThemeKey } from '@/lib/topic-themes';
import { cn } from '@/lib/cn';
import type { ArticoloMeta } from '@/lib/articoli';

type SectionId = 'classici' | 'laghi' | 'famiglia' | 'rifugi' | 'scoperta' | 'foto';

const SECTIONS: {
  id: SectionId;
  icon: typeof Mountain;
  theme: TopicThemeKey;
  categories: ArticoloMeta['category'][];
}[] = [
  { id: 'classici', icon: Mountain, theme: 'mountains', categories: ['classici'] },
  { id: 'laghi', icon: Droplets, theme: 'water', categories: ['laghi'] },
  { id: 'famiglia', icon: Users, theme: 'safetyFamily', categories: ['famiglia'] },
  { id: 'rifugi', icon: Tent, theme: 'culture', categories: ['rifugi'] },
  { id: 'scoperta', icon: Compass, theme: 'traditions', categories: ['scoperta'] },
  { id: 'foto', icon: Camera, theme: 'food', categories: ['foto'] },
];

interface ArticoliExplorerProps {
  locale: string;
  posts: ArticoloMeta[];
  labels: {
    navClassici: string;
    navLaghi: string;
    navFamiglia: string;
    navRifugi: string;
    navScoperta: string;
    navFoto: string;
    readArticle: string;
    sectionIntroClassici: string;
    sectionIntroLaghi: string;
    sectionIntroFamiglia: string;
    sectionIntroRifugi: string;
    sectionIntroScoperta: string;
    sectionIntroFoto: string;
  };
}

function sectionLabel(id: SectionId, labels: ArticoliExplorerProps['labels']): string {
  const map: Record<SectionId, string> = {
    classici: labels.navClassici,
    laghi: labels.navLaghi,
    famiglia: labels.navFamiglia,
    rifugi: labels.navRifugi,
    scoperta: labels.navScoperta,
    foto: labels.navFoto,
  };
  return map[id];
}

function sectionIntro(id: SectionId, labels: ArticoliExplorerProps['labels']): string {
  const map: Record<SectionId, string> = {
    classici: labels.sectionIntroClassici,
    laghi: labels.sectionIntroLaghi,
    famiglia: labels.sectionIntroFamiglia,
    rifugi: labels.sectionIntroRifugi,
    scoperta: labels.sectionIntroScoperta,
    foto: labels.sectionIntroFoto,
  };
  return map[id];
}

function ArticleCard({
  post,
  locale,
  readLabel,
}: {
  post: ArticoloMeta;
  locale: string;
  readLabel: string;
}) {
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(post.date));

  return (
    <article className="group">
      <Link href={`/articoli/${post.slug}`} className="block h-full">
        <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-slate-900">
          <Image
            src={post.cover}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 400px"
            unoptimized={post.cover.startsWith('http') || post.cover.endsWith('.png')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        </div>
        <time
          dateTime={post.date}
          className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-snow/45"
        >
          {formattedDate}
        </time>
        <h3 className="mb-3 font-display text-xl leading-tight tracking-tight text-snow transition-colors group-hover:text-alpenglow lg:text-2xl">
          {post.title}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-snow/60">{post.description}</p>
        <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-alpenglow">
          {readLabel}
          <ArrowRight size={12} />
        </span>
      </Link>
    </article>
  );
}

export default function ArticoliExplorer({ locale, posts, labels }: ArticoliExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<SectionId>('classici');

  const scrollTo = useCallback((id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const sectionLabels = {
    classici: labels.navClassici,
    laghi: labels.navLaghi,
    famiglia: labels.navFamiglia,
    rifugi: labels.navRifugi,
    scoperta: labels.navScoperta,
    foto: labels.navFoto,
  } as const;

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const visibleSections = SECTIONS.filter(({ categories }) =>
    posts.some((p) => categories.includes(p.category)),
  );

  return (
    <div ref={containerRef} className="relative">
      <SectionScrollNav
        containerRef={containerRef}
        sections={visibleSections}
        activeSection={active}
        sectionLabels={sectionLabels}
        onNavigate={scrollTo}
        ariaLabel={locale === 'it' ? 'Sezioni articoli' : 'Article sections'}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 lg:px-10 lg:pb-32">
        {SECTIONS.map(({ id, icon: Icon, theme, categories }) => {
          const sectionPosts = posts.filter((p) => categories.includes(p.category));
          if (sectionPosts.length === 0) return null;
          const t = topicClasses(theme);

          return (
            <section key={id} id={id} className="scroll-mt-28 py-14 lg:py-20">
              <ScrollReveal>
                <div className="mb-10 flex items-start gap-4">
                  <div
                    className={cn(
                      'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border',
                      t.card,
                    )}
                  >
                    <Icon size={26} className={t.icon} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl tracking-tight text-snow lg:text-[2rem]">
                      {sectionLabel(id, labels)}
                    </h2>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-snow/75 lg:text-[17px]">
                      {sectionIntro(id, labels)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                  {sectionPosts.map((post) => (
                    <ArticleCard
                      key={post.slug}
                      post={post}
                      locale={locale}
                      readLabel={labels.readArticle}
                    />
                  ))}
                </div>
              </ScrollReveal>
            </section>
          );
        })}
      </div>
    </div>
  );
}

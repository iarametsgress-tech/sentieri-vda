import { Link } from '@/i18n/routing';
import { ExternalLink } from 'lucide-react';
import { linkifyText } from '@/lib/content-links';

export default function LinkedText({
  text,
  locale,
  className,
}: {
  text: string;
  locale: string;
  className?: string;
}) {
  const segments = linkifyText(text, locale);

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return <span key={i}>{seg.value}</span>;
        }
        if (seg.external) {
          return (
            <a
              key={i}
              href={seg.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-alpenglow hover:underline inline-flex items-center gap-0.5"
            >
              {seg.value}
              <ExternalLink size={11} className="inline shrink-0 opacity-70" aria-hidden />
            </a>
          );
        }
        return (
          <Link
            key={i}
            href={seg.href}
            className="text-alpenglow hover:underline"
          >
            {seg.value}
          </Link>
        );
      })}
    </span>
  );
}

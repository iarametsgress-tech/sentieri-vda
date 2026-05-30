import { getImageCredit } from '@/lib/culture';

export default function CulturaImageCredit({
  item,
}: {
  item: { image_credit?: string; image_source?: string };
}) {
  const c = getImageCredit(item);
  if (!c) return null;
  const text = `© ${c.credit}`;
  return (
    <span className="text-on-image-sm pointer-events-auto absolute bottom-1.5 right-2 z-10 font-mono text-[9px] text-snow/55">
      {c.source ? (
        <a
          href={c.source}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-snow/90"
        >
          {text}
        </a>
      ) : (
        text
      )}
    </span>
  );
}

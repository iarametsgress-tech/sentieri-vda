import Image from 'next/image';
import { trailImageBlurProps } from '@/lib/blur';

export default function CulturaStaticDivider({
  image,
  title,
  subtitle,
}: {
  image: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative my-0 h-[70vh] min-h-[420px] overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        loading="lazy"
        className="object-cover"
        sizes="100vw"
        {...trailImageBlurProps(image)}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink/80" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h2 className="font-display text-display-lg max-w-4xl tracking-tighter text-snow">{title}</h2>
        {subtitle ? (
          <p className="mt-4 max-w-xl text-lg font-light text-snow/70">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

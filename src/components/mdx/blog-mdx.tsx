import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { MDXComponents } from 'mdx/types';

function MdxLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href?.startsWith('/')) {
    return (
      <Link href={href} className="blog-link" {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="blog-link"
      {...props}
    >
      {children}
    </a>
  );
}

function MdxImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  if (src.startsWith('http')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ''} className="blog-inline-image" loading="lazy" />
    );
  }
  return (
    <span className="blog-figure">
      <Image
        src={src}
        alt={alt ?? ''}
        width={1200}
        height={675}
        className="blog-inline-image"
        sizes="(max-width: 768px) 100vw, 720px"
      />
    </span>
  );
}

export const blogMdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="blog-h2 font-display text-3xl tracking-tight text-snow mt-14 mb-5 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="blog-h3 font-display text-xl tracking-tight text-snow/95 mt-10 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="blog-p text-snow/75 leading-[1.85] text-[1.05rem] font-light mb-6">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="blog-ul mb-6 space-y-2 pl-5 list-disc marker:text-alpenglow text-snow/75 leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="blog-ol mb-6 space-y-2 pl-5 list-decimal marker:text-alpenglow text-snow/75 leading-relaxed">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[320px] text-left text-sm text-snow/75">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-white/10 bg-white/[0.03]">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-white/5">{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-alpenglow">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="px-4 py-3 leading-relaxed">{children}</td>,
  blockquote: ({ children }) => (
    <blockquote className="blog-quote my-8 border-l-2 border-alpenglow/60 pl-6 text-snow/70 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-white/10" />,
  a: MdxLink,
  img: MdxImage,
};

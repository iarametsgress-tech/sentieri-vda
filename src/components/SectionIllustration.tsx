import type { ReactNode } from 'react';

export type SectionIllustrationId =
  | 'alte-vie'
  | 'tour'
  | 'flora-fauna'
  | 'sentieri'
  | 'about'
  | 'rifugi';

interface SectionIllustrationProps {
  id: SectionIllustrationId;
  className?: string;
}

/** Illustrazioni editoriali alpine — line art con palette del sito */
export function SectionIllustration({ id, className = '' }: SectionIllustrationProps) {
  const art = ILLUSTRATIONS[id];
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      aria-hidden
    >
      {art}
    </svg>
  );
}

const stroke = '#D4A574';
const ice = '#5BC0EB';
const snow = '#FAFAF7';

const ILLUSTRATIONS: Record<SectionIllustrationId, ReactNode> = {
  'alte-vie': (
    <>
      <path d="M40 320 L120 180 L200 240 L280 120 L360 280" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <path d="M80 320 L160 200 L240 260 L320 160 L360 220" stroke={ice} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="120" cy="180" r="6" fill={stroke} />
      <circle cx="200" cy="240" r="6" fill={stroke} />
      <circle cx="280" cy="120" r="6" fill={stroke} />
      <path d="M100 80 L140 40 L180 80 L140 120 Z" stroke={snow} strokeWidth="1.5" opacity="0.4" />
      <path d="M220 60 L280 20 L340 70 L280 110 Z" stroke={snow} strokeWidth="1.5" opacity="0.35" />
      <text x="200" y="360" textAnchor="middle" fill={stroke} fontSize="11" fontFamily="monospace" opacity="0.6">AV1 · AV2</text>
    </>
  ),
  tour: (
    <>
      <ellipse cx="200" cy="200" rx="130" ry="90" stroke={ice} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
      <path d="M200 70 L240 130 L320 150 L260 210 L280 290 L200 250 L120 290 L140 210 L80 150 L160 130 Z" stroke={stroke} strokeWidth="2" strokeLinejoin="round" opacity="0.85" />
      <path d="M200 250 L200 310" stroke={stroke} strokeWidth="2" markerEnd="url(#arrow)" />
      <circle cx="200" cy="70" r="8" fill={ice} opacity="0.8" />
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={stroke} />
        </marker>
      </defs>
    </>
  ),
  'flora-fauna': (
    <>
      <path d="M200 340 L200 160" stroke={stroke} strokeWidth="2" />
      <path d="M200 220 C160 200 140 160 160 130 C180 150 200 180 200 180" stroke={ice} strokeWidth="1.5" fill="none" />
      <path d="M200 200 C240 180 260 140 240 120 C220 140 200 170 200 170" stroke={ice} strokeWidth="1.5" fill="none" />
      <path d="M200 260 C150 250 120 220 130 190" stroke={stroke} strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M200 240 C250 230 280 200 270 170" stroke={stroke} strokeWidth="1.5" fill="none" opacity="0.7" />
      <ellipse cx="200" cy="130" rx="28" ry="35" stroke={snow} strokeWidth="1.5" opacity="0.5" />
      <circle cx="200" cy="120" r="12" fill={ice} opacity="0.4" />
      <path d="M100 280 Q130 260 160 280" stroke={stroke} strokeWidth="1" opacity="0.5" />
      <path d="M240 290 Q270 270 300 290" stroke={stroke} strokeWidth="1" opacity="0.5" />
    </>
  ),
  sentieri: (
    <>
      <path d="M60 320 Q120 280 160 240 T240 180 T320 100" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M160 240 L180 260 M240 180 L260 200" stroke={ice} strokeWidth="1.5" opacity="0.6" />
      <circle cx="60" cy="320" r="5" fill={ice} />
      <circle cx="320" cy="100" r="5" fill={stroke} />
      <path d="M280 60 L320 40 L360 80 L320 100 Z" stroke={snow} strokeWidth="1.5" opacity="0.35" />
      <path d="M40 200 L80 160 L120 180" stroke={snow} strokeWidth="1" opacity="0.25" />
    </>
  ),
  about: (
    <>
      <circle cx="200" cy="200" r="100" stroke={stroke} strokeWidth="1.5" opacity="0.5" />
      <circle cx="200" cy="200" r="70" stroke={ice} strokeWidth="1" opacity="0.4" />
      <path d="M200 100 L200 200 L270 240" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <circle cx="200" cy="200" r="6" fill={stroke} />
      <text x="200" y="90" textAnchor="middle" fill={snow} fontSize="14" fontFamily="serif" opacity="0.5">N</text>
      <path d="M130 280 L170 250 L210 270 L250 230 L290 260" stroke={ice} strokeWidth="1" opacity="0.4" />
    </>
  ),
  rifugi: (
    <>
      <path d="M120 280 L200 160 L280 280 Z" stroke={stroke} strokeWidth="2" strokeLinejoin="round" fill="none" />
      <rect x="160" y="240" width="80" height="40" stroke={stroke} strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M180 280 L180 260 M220 280 L220 260" stroke={ice} strokeWidth="1.5" />
      <path d="M200 160 L200 120" stroke={stroke} strokeWidth="2" />
      <path d="M185 130 L200 110 L215 130" stroke={stroke} strokeWidth="1.5" fill="none" />
      <path d="M80 200 L120 160 L160 190" stroke={snow} strokeWidth="1" opacity="0.3" />
      <path d="M240 190 L280 150 L320 180" stroke={snow} strokeWidth="1" opacity="0.3" />
      <circle cx="340" cy="80" r="20" stroke={ice} strokeWidth="1" opacity="0.4" />
    </>
  ),
};

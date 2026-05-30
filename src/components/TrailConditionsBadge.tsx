import { cn } from '@/lib/cn';
import type { TrailConditionStatus } from '@/lib/types';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const STATUS_STYLES: Record<
  TrailConditionStatus,
  { container: string; icon: typeof CheckCircle2 }
> = {
  open: {
    container: 'border-emerald-400/35 bg-emerald-500/10 text-emerald-100',
    icon: CheckCircle2,
  },
  caution: {
    container: 'border-amber-400/35 bg-amber-500/10 text-amber-100',
    icon: AlertTriangle,
  },
  closed: {
    container: 'border-red-400/35 bg-red-500/10 text-red-100',
    icon: XCircle,
  },
};

export type TrailConditionsBadgeLabels = {
  statusOpen: string;
  statusCaution: string;
  statusClosed: string;
  updated: string;
};

type Props = {
  status: TrailConditionStatus;
  note: string;
  updatedAt: string;
  locale: string;
  labels: TrailConditionsBadgeLabels;
};

export default function TrailConditionsBadge({
  status,
  note,
  updatedAt,
  locale,
  labels,
}: Props) {
  const { container, icon: Icon } = STATUS_STYLES[status];
  const statusLabel =
    status === 'open'
      ? labels.statusOpen
      : status === 'caution'
        ? labels.statusCaution
        : labels.statusClosed;

  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(updatedAt));

  return (
    <div
      className={cn(
        'mb-5 flex gap-3 rounded-xl border px-4 py-3 max-w-3xl',
        container
      )}
      role="status"
      aria-label={`${statusLabel}: ${note}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0 opacity-90" aria-hidden />
      <div className="min-w-0">
        <p className="text-xs font-mono uppercase tracking-widest opacity-90 mb-1">
          {statusLabel}
        </p>
        <p className="text-sm leading-relaxed text-snow/90">{note}</p>
        <p className="mt-1.5 text-xs text-snow/55">
          {labels.updated}:{' '}
          <time dateTime={updatedAt}>{formattedDate}</time>
        </p>
      </div>
    </div>
  );
}

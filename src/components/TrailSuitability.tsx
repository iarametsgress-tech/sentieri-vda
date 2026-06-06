import { Baby, Dog, Check, AlertTriangle, X } from 'lucide-react';
import type { Suitability } from '@/lib/trail-suitability';

type Labels = {
  title: string;
  children: string;
  dogs: string;
  yes: string;
  caution: string;
  no: string;
  dogPark: string;
  note: string;
};

const STATUS_STYLE: Record<Suitability, string> = {
  yes: 'border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-200',
  caution: 'border-amber-500/30 bg-amber-500/[0.08] text-amber-200',
  no: 'border-rose-500/30 bg-rose-500/[0.08] text-rose-200',
};

function StatusIcon({ status }: { status: Suitability }) {
  if (status === 'yes') return <Check size={14} aria-hidden />;
  if (status === 'caution') return <AlertTriangle size={14} aria-hidden />;
  return <X size={14} aria-hidden />;
}

export default function TrailSuitability({
  childrenStatus,
  dogStatus,
  dogPark,
  labels,
}: {
  childrenStatus: Suitability;
  dogStatus: Suitability;
  dogPark: boolean;
  labels: Labels;
}) {
  const statusText = (s: Suitability) =>
    s === 'yes' ? labels.yes : s === 'caution' ? labels.caution : labels.no;

  return (
    <section>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-snow/55 mb-4">
        {labels.title}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`flex items-center gap-3 rounded-xl border p-4 ${STATUS_STYLE[childrenStatus]}`}>
          <Baby size={20} className="shrink-0 text-snow/80" aria-hidden />
          <div className="min-w-0">
            <p className="text-sm text-snow/80">{labels.children}</p>
            <p className="flex items-center gap-1.5 font-display text-base">
              <StatusIcon status={childrenStatus} />
              {statusText(childrenStatus)}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-3 rounded-xl border p-4 ${STATUS_STYLE[dogStatus]}`}>
          <Dog size={20} className="shrink-0 text-snow/80" aria-hidden />
          <div className="min-w-0">
            <p className="text-sm text-snow/80">{labels.dogs}</p>
            <p className="flex items-center gap-1.5 font-display text-base">
              <StatusIcon status={dogStatus} />
              {dogPark ? labels.dogPark : statusText(dogStatus)}
            </p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-snow/45">{labels.note}</p>
    </section>
  );
}

/** Skeleton per cataloghi explorer — stesso layout nav + griglia, zero layout shift */
export function TourCatalogSkeleton() {
  return (
    <section
      className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-20 lg:grid-cols-2 lg:px-10 lg:gap-10"
      aria-hidden
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
        >
          <div className="aspect-[16/10] animate-pulse bg-white/[0.04] sm:aspect-[2/1]" />
          <div className="space-y-3 p-6">
            <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-7 w-3/4 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-4 w-full animate-pulse rounded bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </section>
  );
}

export function CulturaValliSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24" aria-hidden>
      <div className="mb-10 space-y-3">
        <div className="h-3 w-32 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-10 w-2/3 max-w-md animate-pulse rounded bg-white/[0.06]" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-white/[0.04]" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
        ))}
      </div>
    </section>
  );
}

export function CulturaBelowFoldSkeleton() {
  return (
    <div aria-hidden>
      <div className="h-[70vh] min-h-[420px] animate-pulse bg-white/[0.02]" />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="mb-10 space-y-3">
          <div className="h-3 w-32 animate-pulse rounded bg-white/[0.06]" />
          <div className="h-10 w-1/2 max-w-sm animate-pulse rounded bg-white/[0.06]" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
          ))}
        </div>
      </section>
    </div>
  );
}

export function CulturaExplorerSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24" aria-hidden>
      <div className="mb-10 flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-28 animate-pulse rounded-full bg-white/[0.04]" />
        ))}
      </div>
      <div className="mb-10 space-y-3">
        <div className="h-3 w-32 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-10 w-2/3 max-w-md animate-pulse rounded bg-white/[0.06]" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-white/[0.04]" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
        ))}
      </div>
    </div>
  );
}

export function AmbienteExplorerSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24" aria-hidden>
      <div className="mb-10 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-white/[0.04]" />
        ))}
      </div>
      <div className="mb-10 space-y-3">
        <div className="h-3 w-32 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-10 w-1/2 max-w-sm animate-pulse rounded bg-white/[0.06]" />
        <div className="h-4 w-full max-w-lg animate-pulse rounded bg-white/[0.04]" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
        ))}
      </div>
    </div>
  );
}

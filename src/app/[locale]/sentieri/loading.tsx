export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-28 pb-16 lg:px-10 animate-pulse">
      <div className="h-8 w-48 rounded-xl bg-white/8 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
            <div className="aspect-[4/3] bg-white/5" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-3/4 rounded bg-white/8" />
              <div className="h-3 w-1/2 rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

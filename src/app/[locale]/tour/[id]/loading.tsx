export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-[60vh] bg-white/[0.03]" />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 space-y-6">
        <div className="h-6 w-56 rounded bg-white/8" />
        <div className="h-[520px] rounded-2xl bg-white/[0.03]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </div>
  );
}

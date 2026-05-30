export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-[60vh] bg-white/[0.03]" />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </div>
  );
}

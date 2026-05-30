export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 lg:px-10 lg:pt-28 animate-pulse">
      <div className="w-full h-[420px] rounded-2xl bg-white/[0.04] mb-10" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-5">
          <div className="h-8 w-1/2 rounded bg-white/8" />
          <div className="h-4 w-full rounded bg-white/5" />
          <div className="h-4 w-5/6 rounded bg-white/5" />
          <div className="h-[360px] rounded-2xl bg-white/[0.03] mt-8" />
        </div>
        <div className="space-y-4">
          <div className="h-48 rounded-2xl bg-white/[0.03]" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-7 w-36 bg-border rounded" />
          <div className="h-4 w-52 bg-border/60 rounded mt-2" />
        </div>
        <div className="h-9 w-32 bg-border rounded-lg" />
      </div>
      {/* KPI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card p-5">
            <div className="h-3 w-24 bg-border/60 rounded mb-3" />
            <div className="h-6 w-28 bg-border rounded" />
          </div>
        ))}
      </div>
      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="h-4 w-20 bg-border rounded" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="h-4 w-1/4 bg-border/60 rounded" />
              <div className="h-4 w-1/3 bg-border/40 rounded" />
              <div className="h-4 w-1/5 bg-border/30 rounded" />
              <div className="ml-auto h-4 w-24 bg-border/40 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

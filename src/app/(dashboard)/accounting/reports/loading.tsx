export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-7 w-40 bg-border rounded" />
          <div className="h-4 w-56 bg-border/60 rounded mt-2" />
        </div>
        <div className="h-9 w-28 bg-border rounded-lg" />
      </div>
      {/* Monthly summary table */}
      <div className="glass-card overflow-x-auto mb-6">
        <div className="px-6 py-4 border-b border-border">
          <div className="h-4 w-32 bg-border rounded" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-6">
              <div className="h-4 w-20 bg-border/60 rounded flex-shrink-0" />
              <div className="h-4 w-24 bg-border/40 rounded" />
              <div className="h-4 w-24 bg-border/40 rounded" />
              <div className="ml-auto h-4 w-20 bg-border/30 rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* Category breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <div className="h-4 w-36 bg-border rounded" />
            </div>
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="px-6 py-3 flex items-center justify-between">
                  <div className="h-4 w-32 bg-border/60 rounded" />
                  <div className="h-4 w-20 bg-border/40 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

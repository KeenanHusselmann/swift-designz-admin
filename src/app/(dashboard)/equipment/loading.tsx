export default function EquipmentLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-52 bg-border/60 rounded-lg" />
          <div className="h-4 w-80 bg-border/40 rounded" />
        </div>
        <div className="h-9 w-36 bg-border/60 rounded-lg" />
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <div className="h-3 w-32 bg-border/60 rounded" />
            <div className="h-7 w-28 bg-border/40 rounded" />
            <div className="h-3 w-44 bg-border/30 rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex gap-10">
          {["Name", "Category", "Condition", "Purchase Price", "Current Value", "Status"].map((h) => (
            <div key={h} className="h-3 w-20 bg-border/60 rounded" />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-5 py-4 border-b border-border flex gap-10 items-center">
            <div className="h-4 w-36 bg-border/50 rounded" />
            <div className="h-3 w-20 bg-border/40 rounded" />
            <div className="h-3 w-16 bg-border/40 rounded" />
            <div className="h-3 w-20 bg-border/40 rounded" />
            <div className="h-3 w-20 bg-border/40 rounded" />
            <div className="h-5 w-16 bg-border/30 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

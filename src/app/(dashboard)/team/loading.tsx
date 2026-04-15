export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-7 w-24 bg-border rounded" />
        <div className="h-4 w-48 bg-border/60 rounded mt-2" />
      </div>
      {/* Two navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="glass-card p-8 text-center">
            <div className="h-10 w-10 bg-border rounded-lg mx-auto mb-4" />
            <div className="h-5 w-24 bg-border rounded mx-auto mb-2" />
            <div className="h-3 w-40 bg-border/50 rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

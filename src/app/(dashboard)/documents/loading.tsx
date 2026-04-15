export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-7 w-36 bg-border rounded" />
          <div className="h-4 w-52 bg-border/60 rounded mt-2" />
        </div>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="h-4 w-20 bg-border rounded" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="h-4 w-1/3 bg-border/60 rounded" />
              <div className="h-4 w-1/6 bg-border/40 rounded" />
              <div className="h-4 w-1/5 bg-border/30 rounded" />
              <div className="ml-auto h-4 w-16 bg-border/40 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

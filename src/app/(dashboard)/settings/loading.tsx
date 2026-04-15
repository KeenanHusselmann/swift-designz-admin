export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-7 w-44 bg-border rounded" />
          <div className="h-4 w-36 bg-border/60 rounded mt-2" />
        </div>
      </div>
      <div className="max-w-2xl space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-8 bg-border/60 rounded-lg" />
              <div className="h-4 w-28 bg-border rounded" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j}>
                  <div className="h-3 w-20 bg-border/50 rounded mb-2" />
                  <div className="h-9 w-full bg-border/30 rounded-lg" />
                </div>
              ))}
              <div className="h-9 w-24 bg-border/50 rounded-lg mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

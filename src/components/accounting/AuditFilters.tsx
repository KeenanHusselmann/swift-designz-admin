"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface Props {
  totalCount: number;
  filteredCount: number;
  flaggedCount: number;
}

export default function AuditFilters({ totalCount, filteredCount, flaggedCount }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const [q, setQ] = useState(params.get("q") ?? "");

  // Debounce text search
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (q) next.set("q", q);
      else next.delete("q");
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="px-5 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Text search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search descriptions..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder-gray-600 focus:outline-none focus:border-teal/50 w-52"
          />
        </div>

        {/* Type filter */}
        <select
          value={params.get("type") ?? ""}
          onChange={(e) => update("type", e.target.value)}
          className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-teal/50"
        >
          <option value="">All types</option>
          <option value="income">Income only</option>
          <option value="expense">Expenses only</option>
        </select>

        {/* Flagged toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={params.get("flagged") === "1"}
            onChange={(e) => update("flagged", e.target.checked ? "1" : "")}
            className="w-3.5 h-3.5 accent-teal"
          />
          <span className="text-sm text-gray-400">
            Flagged only
            {flaggedCount > 0 && (
              <span className="ml-1.5 bg-amber-400/15 text-amber-400 text-xs px-1.5 py-0.5 rounded-full">
                {flaggedCount}
              </span>
            )}
          </span>
        </label>
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-600 shrink-0">
        Showing {filteredCount} of {totalCount} entries
      </p>
    </div>
  );
}

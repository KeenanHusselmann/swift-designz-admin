"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentMonth: string; // YYYY-MM
}

function addMonths(ym: string, delta: number): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
}

export default function MonthNav({ currentMonth }: Props) {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prevMonth = addMonths(currentMonth, -1);
  const nextMonth = addMonths(currentMonth, 1);
  const isCurrentMonth = currentMonth === thisMonth;

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/accounting?month=${prevMonth}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:border-teal/50 hover:text-teal text-gray-500 transition-colors"
        title="Previous month"
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      <span className="text-sm font-medium text-foreground min-w-35 text-center">
        {formatLabel(currentMonth)}
      </span>
      <Link
        href={isCurrentMonth ? "/accounting" : `/accounting?month=${nextMonth}`}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
          isCurrentMonth
            ? "border-border/30 text-gray-700 cursor-not-allowed pointer-events-none"
            : "border-border hover:border-teal/50 hover:text-teal text-gray-500"
        }`}
        title="Next month"
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
      {!isCurrentMonth && (
        <Link
          href="/accounting"
          className="text-xs text-teal hover:underline ml-1"
        >
          Today
        </Link>
      )}
    </div>
  );
}

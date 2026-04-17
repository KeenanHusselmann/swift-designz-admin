import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  accent?: "teal" | "green" | "red" | "amber" | "default";
  className?: string;
}

const ACCENT_VALUE: Record<string, string> = {
  teal: "text-teal",
  green: "text-green-400",
  red: "text-red-400",
  amber: "text-amber-400",
  default: "text-foreground",
};

export default function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  accent = "default",
  className,
}: StatCardProps) {
  return (
    <div className={cn("glass-card p-4 flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider leading-none">{title}</p>
        {Icon && <Icon className="h-3.5 w-3.5 text-gray-600 shrink-0" />}
      </div>
      <p className={cn("text-2xl font-bold leading-tight", ACCENT_VALUE[accent])}>{value}</p>
      {sub && <p className="text-xs text-gray-600 leading-none">{sub}</p>}
    </div>
  );
}

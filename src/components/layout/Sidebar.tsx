"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Receipt,
  TrendingUp,
  FolderOpen,
  Landmark,
  UserCog,
  Settings,
  LogOut,
  Menu,
  X,
  UserPlus,
  Sun,
  Moon,
  Package,
  BarChart2,
} from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { createClient } from "@/lib/supabase/client";
import { getDocumentLibraryCountForRole } from "@/lib/document-templates";
import type { Profile } from "@/types/database";

interface SidebarProps {
  profile: Profile | null;
}

const NAV_SECTIONS = [
  {
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/leads", label: "Leads", icon: UserPlus, countKey: "leads" },
      { href: "/clients", label: "Clients", icon: Users, countKey: "clients" },
      { href: "/projects", label: "Projects", icon: Briefcase, countKey: "projects" },
      { href: "/invoices", label: "Invoices", icon: FileText, countKey: "invoices" },
    ],
  },
  {
    items: [
      { href: "/accounting", label: "Accounting", icon: TrendingUp },
      { href: "/documents", label: "Documents", icon: FolderOpen, countKey: "documents" },
      { href: "/investors", label: "Investors", icon: Landmark, countKey: "investors" },
      { href: "/team", label: "Team", icon: UserCog, countKey: "team" },
      { href: "/equipment", label: "Equipment", icon: Package, countKey: "equipment" },
    ],
  },
  {
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const INVESTOR_NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: Briefcase, countKey: "projects" },
  { href: "/documents", label: "Documents", icon: FolderOpen, countKey: "documents" },
  { href: "/investors", label: "Investors", icon: Landmark, countKey: "investors" },
  { href: "/equipment", label: "Equipment", icon: Package, countKey: "equipment" },
  { href: "/accounting/reports", label: "Reports", icon: BarChart2 },
];

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const documentLibraryCount = getDocumentLibraryCountForRole(profile?.role);

  // Fetch nav counts client-side so the layout never blocks on them
  useEffect(() => {
    const supabase = createClient();
    const tables = ["leads", "clients", "projects", "invoices", "documents", "investors", "employees", "ai_agents", "equipment"] as const;
    Promise.all(
      tables.map((t) => supabase.from(t).select("id", { count: "exact", head: true }))
    ).then((results) => {
      setCounts(
        Object.fromEntries(tables.map((t, i) => [t, results[i].count ?? 0]))
      );
    });
  }, [pathname]); // re-fetch when route changes

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navContent = (
    <>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-border flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/favicon.png"
          alt="Swift Designz"
          width={32}
          height={32}
          className="shrink-0"
        />
        <div>
          <h1 className="text-lg font-bold text-teal tracking-tight leading-tight">
            Swift Designz
          </h1>
          <p className="text-xs text-teal-muted">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {profile?.role === "investor" ? (
          <ul className="space-y-1">
            {INVESTOR_NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const count = item.countKey
                ? item.countKey === "documents"
                  ? profile?.role === "investor"
                    ? documentLibraryCount
                    : (counts.documents ?? 0) + documentLibraryCount
                  : counts[item.countKey] ?? 0
                : null;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-teal/10 text-teal border border-teal/20"
                        : "text-gray-400 hover:text-foreground hover:bg-card"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                    {count !== null && count > 0 && (
                      <span className="ml-auto text-xs tabular-nums px-1.5 py-0.5 rounded-full bg-border text-gray-400">
                        {count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx}>
            {sIdx > 0 && (
              <hr className="my-3 border-border" />
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                const count = item.countKey
                  ? item.countKey === "team"
                    ? (counts.employees ?? 0) + (counts.ai_agents ?? 0)
                    : item.countKey === "documents"
                      ? profile?.role === "investor"
                        ? documentLibraryCount
                        : (counts.documents ?? 0) + documentLibraryCount
                    : counts[item.countKey] ?? 0
                  : null;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        active
                          ? "bg-teal/10 text-teal border border-teal/20"
                          : "text-gray-400 hover:text-foreground hover:bg-card"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                      {count !== null && count > 0 && (
                        <span className="ml-auto text-xs tabular-nums px-1.5 py-0.5 rounded-full bg-border text-gray-400">
                          {count}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
        )}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-teal/20 flex items-center justify-center text-teal text-sm font-bold">
            {profile?.full_name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {profile?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-500">{profile?.role || "admin"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <form action={signOut} className="flex-1">
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors w-full px-1"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-gray-500 hover:text-teal hover:bg-card transition-colors"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg text-gray-400 hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — mobile (slide-over) */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-border flex flex-col transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        {navContent}
      </aside>

      {/* Sidebar — desktop (fixed) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 bg-sidebar border-r border-border flex-col">
        {navContent}
      </aside>
    </>
  );
}

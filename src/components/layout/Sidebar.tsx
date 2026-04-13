"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  ChevronRight,
} from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";

interface SidebarProps {
  profile: Profile | null;
}

const NAV_SECTIONS = [
  {
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/leads", label: "Leads", icon: ChevronRight },
      { href: "/clients", label: "Clients", icon: Users },
      { href: "/projects", label: "Projects", icon: Briefcase },
      { href: "/invoices", label: "Invoices", icon: FileText },
    ],
  },
  {
    items: [
      { href: "/accounting", label: "Accounting", icon: TrendingUp },
      { href: "/documents", label: "Documents", icon: FolderOpen },
      { href: "/investors", label: "Investors", icon: Landmark },
      { href: "/team", label: "Team", icon: UserCog },
    ],
  },
  {
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navContent = (
    <>
      {/* Brand */}
      <div className="px-5 py-6 border-b border-[#2a2a2a]">
        <h1 className="text-lg font-bold text-[#30B0B0] tracking-tight">
          Swift Designz
        </h1>
        <p className="text-xs text-[#509090] mt-0.5">Admin Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx}>
            {sIdx > 0 && (
              <hr className="my-3 border-[#2a2a2a]" />
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        active
                          ? "bg-[#30B0B0]/10 text-[#30B0B0] border border-[#30B0B0]/20"
                          : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-[#30B0B0]/20 flex items-center justify-center text-[#30B0B0] text-sm font-bold">
            {profile?.full_name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {profile?.full_name || "User"}
            </p>
            <p className="text-xs text-gray-500">{profile?.role || "admin"}</p>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors w-full px-1"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-gray-400 hover:text-white"
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
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#141414] border-r border-[#2a2a2a] flex flex-col transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        {navContent}
      </aside>

      {/* Sidebar — desktop (fixed) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 bg-[#141414] border-r border-[#2a2a2a] flex-col">
        {navContent}
      </aside>
    </>
  );
}

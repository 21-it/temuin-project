"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
  schoolName: string;
}

export function AdminSidebar({ user, schoolName }: AdminSidebarProps) {
  const pathname = usePathname();

  const links = [
    {
      href: "/admin",
      label: "Ringkasan",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/laporan",
      label: "Daftar Laporan",
      icon: FileText,
      exact: false,
    },
    {
      href: "/admin/klaim",
      label: "Verifikasi Klaim",
      icon: ShieldCheck,
      exact: false,
    },
    {
      href: "/admin/pengaturan",
      label: "Pengaturan Kampus",
      icon: Settings,
      exact: false,
    },
  ];

  return (
    <aside className="flex flex-col w-64 border-r border-slate-200 bg-white min-h-screen shrink-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 p-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-sm shadow-xs">
          T
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1">
            Temuin <span className="text-[10px] text-sky-600 font-semibold bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100">Admin</span>
          </span>
          <span className="text-[11px] text-slate-400 truncate">
            {schoolName}
          </span>
        </div>
      </div>

      {/* User profile card */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {user.name || "Petugas Sekolah"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>
          <span className="rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
            {user.role || "STAFF"}
          </span>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer navigation */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-slate-400" />
            <span>Lihat Web Publik</span>
          </span>
          <Sparkles className="h-3 w-3 text-sky-500" />
        </Link>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}

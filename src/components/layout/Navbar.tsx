"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Search, PlusCircle, Compass, Shield, Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  schoolName: string;
  tagline?: string | null;
  logoUrl?: string | null;
}

export function Navbar({ schoolName, logoUrl }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/barang", label: "Jelajah Barang", icon: Compass },
    { href: "/lapor", label: "Lapor Barang", icon: PlusCircle },
    { href: "/lacak", label: "Lacak Laporan", icon: Search },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90 focus:outline-none"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-900 text-white shadow-xs">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={schoolName}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <span className="font-bold text-sky-400">T</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-slate-900 text-base leading-tight">
              Temuin
            </span>
            <span className="text-[11px] font-medium text-slate-500 truncate max-w-[170px] sm:max-w-[260px]">
              {schoolName}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-950 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <link.icon className="h-4 w-4 stroke-[2]" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/lapor"
            className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700 shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Buat Laporan</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Masuk Portal Petugas"
          >
            <Shield className="h-3.5 w-3.5 text-slate-500" />
            <span>Petugas</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/lapor"
            className="rounded-lg bg-sky-600 p-2 text-white hover:bg-sky-700"
            aria-label="Lapor Cepat"
          >
            <PlusCircle className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden animate-in slide-in-from-top duration-200 shadow-sm">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname === "/"
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600"
              }`}
            >
              Beranda
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  pathname.startsWith(link.href)
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <link.icon className="h-4 w-4 text-slate-500" />
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-slate-100" />
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-400" />
                Login Guru / Petugas
              </span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

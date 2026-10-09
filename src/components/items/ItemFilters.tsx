"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Filter, RotateCcw } from "lucide-react";

interface FilterOption {
  id: string;
  name: string;
}

interface ItemFiltersProps {
  categories: FilterOption[];
  locations: FilterOption[];
  totalCount: number;
}

export function ItemFilters({
  categories,
  locations,
  totalCount,
}: ItemFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("q") || "";
  const currentType = searchParams.get("type") || "ALL";
  const currentCategory = searchParams.get("category") || "";
  const currentLocation = searchParams.get("location") || "";
  const currentStatus = searchParams.get("status") || "ALL";

  const [searchInput, setSearchInput] = useState(currentSearch);

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset ke halaman pertama

    startTransition(() => {
      router.push(`/barang?${params.toString()}`);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateQuery("q", searchInput.trim());
  }

  function handleReset() {
    setSearchInput("");
    startTransition(() => {
      router.push("/barang");
    });
  }

  const hasActiveFilters = Boolean(
    currentSearch ||
      currentType !== "ALL" ||
      currentCategory ||
      currentLocation ||
      currentStatus !== "ALL"
  );

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
      {/* Search Bar & Type Tabs */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari barang berdasarkan nama, ciri, merek, atau kode lacak..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-24 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-sky-500 focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Cari
          </button>
        </form>

        {/* Type Toggle Pills */}
        <div className="flex items-center rounded-lg bg-slate-100 p-1 text-xs font-medium text-slate-600 shrink-0">
          <button
            type="button"
            onClick={() => updateQuery("type", "ALL")}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              currentType === "ALL"
                ? "bg-white text-slate-900 font-semibold shadow-2xs"
                : "hover:text-slate-900"
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => updateQuery("type", "LOST")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
              currentType === "LOST"
                ? "bg-white text-amber-900 font-semibold shadow-2xs"
                : "hover:text-slate-900"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Barang Hilang
          </button>
          <button
            type="button"
            onClick={() => updateQuery("type", "FOUND")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
              currentType === "FOUND"
                ? "bg-white text-emerald-900 font-semibold shadow-2xs"
                : "hover:text-slate-900"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Barang Temuan
          </button>
        </div>
      </div>

      {/* Dropdown Filters Row */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 pt-1 border-t border-slate-100">
        {/* Kategori */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Kategori
          </label>
          <select
            value={currentCategory}
            onChange={(e) => updateQuery("category", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-sky-500 focus:outline-none"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Lokasi */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Lokasi
          </label>
          <select
            value={currentLocation}
            onChange={(e) => updateQuery("location", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-sky-500 focus:outline-none"
          >
            <option value="">Semua Lokasi</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Status Barang
          </label>
          <select
            value={currentStatus}
            onChange={(e) => updateQuery("status", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-sky-500 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif (Tersedia / Dicari)</option>
            <option value="CLAIMED">Dalam Proses Klaim</option>
            <option value="RETURNED">Sudah Dikembalikan</option>
          </select>
        </div>

        {/* Reset / Status summary */}
        <div className="flex flex-col justify-end">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Filter
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 py-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Menampilkan <strong>{totalCount}</strong> barang
              </span>
            </div>
          )}
        </div>
      </div>

      {isPending && (
        <div className="text-center text-[11px] text-sky-600 animate-pulse font-medium">
          Memperbarui daftar barang...
        </div>
      )}
    </div>
  );
}

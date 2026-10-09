import { prisma } from "@/lib/prisma";
import { ItemCard } from "@/components/items/ItemCard";
import { ItemFilters } from "@/components/items/ItemFilters";
import { PackageOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { Prisma } from "@prisma/client";

interface BrowsePageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    category?: string;
    location?: string;
    status?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const q = params.q?.trim();
  const type = params.type;
  const categoryId = params.category;
  const locationId = params.location;
  const statusParam = params.status;

  // Bangun query filter Prisma
  const where: Prisma.ItemWhereInput = {
    // Abaikan laporan yang berstatus REJECTED di katalog umum
    status: { not: "REJECTED" },
  };

  if (type && (type === "LOST" || type === "FOUND")) {
    where.type = type;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (locationId) {
    where.locationId = locationId;
  }

  if (statusParam && statusParam !== "ALL") {
    where.status = statusParam;
  } else {
    // Default: tampilkan yang ACTIVE, CLAIMED, atau RETURNED
    where.status = { in: ["ACTIVE", "CLAIMED", "RETURNED"] };
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { trackingCode: { contains: q } },
    ];
  }

  const [categories, locations, items, totalCount] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
    prisma.item.findMany({
      where,
      include: {
        category: true,
        location: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.item.count({ where }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Katalog Barang Kampus</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Jelajah Barang Hilang & Temuan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Temukan barangmu yang dilaporkan hilang atau lihat daftar barang temuan yang diamankan.
        </p>
      </div>

      {/* Filters Bar */}
      <ItemFilters
        categories={categories}
        locations={locations}
        totalCount={totalCount}
      />

      {/* Item List / Grid */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <PackageOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Tidak Ada Barang Ditemukan
          </h3>
          <p className="mx-auto max-w-md text-xs text-slate-500 leading-relaxed">
            Tidak ada laporan barang yang sesuai dengan kata kunci atau filter yang Anda pilih. Coba sesuaikan filter atau laporkan barang baru.
          </p>
          <div className="pt-2">
            <Link
              href="/lapor"
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 transition-colors"
            >
              Buat Laporan Baru
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

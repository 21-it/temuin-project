import { prisma } from "@/lib/prisma";
import { AdminReportsManager } from "@/components/admin/AdminReportsManager";
import { FileText, PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminLaporanPage() {
  const [items, categories, locations] = await Promise.all([
    prisma.item.findMany({
      include: {
        category: true,
        location: true,
        images: true,
        claims: {
          select: {
            id: true,
            claimantName: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
            <FileText className="h-4 w-4" />
            <span>Manajemen Data Laporan</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Semua Laporan Barang
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Setujui, tolak, periksa kontak pelapor, atau catat serah terima barang kepada pemilik sah.
          </p>
        </div>

        <Link
          href="/lapor"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-sky-700 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Laporan Baru</span>
        </Link>
      </div>

      {/* Reports Manager Table */}
      <AdminReportsManager
        initialItems={items}
        categories={categories}
        locations={locations}
      />
    </div>
  );
}

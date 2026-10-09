import { prisma } from "@/lib/prisma";
import { ItemReportForm } from "@/components/forms/ItemReportForm";
import { HelpCircle } from "lucide-react";
import Link from "next/link";

export default async function LaporHilangPage() {
  const [categories, locations] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Formulir Kehilangan
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Lapor Barang Hilang
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Isi detail barang yang hilang di lingkungan sekolah. Laporan Anda akan diperiksa oleh petugas dan dapat dipantau menggunakan kode pelacakan.
        </p>
      </div>

      {/* Form */}
      <ItemReportForm
        type="LOST"
        categories={categories}
        locations={locations}
      />
    </div>
  );
}

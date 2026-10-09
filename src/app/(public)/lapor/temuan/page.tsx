import { prisma } from "@/lib/prisma";
import { ItemReportForm } from "@/components/forms/ItemReportForm";
import { PlusCircle } from "lucide-react";

export default async function LaporTemuanPage() {
  const [categories, locations] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.location.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <PlusCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Formulir Temuan
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Lapor Barang Temuan
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Terima kasih atas kejujuran Anda! Laporkan rincian barang yang Anda temukan agar pemilik aslinya dapat segera mengidentifikasi dan mengambilnya.
        </p>
      </div>

      {/* Form */}
      <ItemReportForm
        type="FOUND"
        categories={categories}
        locations={locations}
      />
    </div>
  );
}

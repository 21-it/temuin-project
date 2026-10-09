import { prisma } from "@/lib/prisma";
import { AdminSettingsManager } from "@/components/admin/AdminSettingsManager";
import { Settings } from "lucide-react";

export default async function AdminPengaturanPage() {
  const [setting, categories, locations] = await Promise.all([
    prisma.schoolSetting.findFirst({ where: { id: "default" } }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.location.findMany({
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const defaultSetting = {
    name: setting?.name || "SMA Negeri 1 Teladan",
    tagline: setting?.tagline || "Layanan Terpadu Lapor & Temu Barang Hilang Kampus",
    contactEmail: setting?.contactEmail || "info@sekolah.sch.id",
    contactPhone: setting?.contactPhone || "+62 812-3456-7890",
    address: setting?.address || "Jl. Pendidikan Wijaya No. 12, Jakarta",
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
          <Settings className="h-4 w-4" />
          <span>Konfigurasi Sistem</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Pengaturan Sekolah & Master Data
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Atur informasi sekolah, kelola kategori barang, dan tentukan daftar lokasi resmi kampus.
        </p>
      </div>

      <AdminSettingsManager
        initialSetting={defaultSetting}
        initialCategories={categories}
        initialLocations={locations}
      />
    </div>
  );
}

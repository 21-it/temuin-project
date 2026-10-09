import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FileText,
  Search,
  PackageCheck,
  Clock,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { formatDateIndonesian } from "@/lib/utils";
import { ItemStatusBadge } from "@/components/items/ItemStatusBadge";

export default async function AdminOverviewPage() {
  const [
    totalReports,
    activeLost,
    activeFound,
    returnedCount,
    pendingReportsCount,
    pendingClaimsCount,
    recentReports,
    recentClaims,
  ] = await Promise.all([
    prisma.item.count(),
    prisma.item.count({ where: { type: "LOST", status: "ACTIVE" } }),
    prisma.item.count({ where: { type: "FOUND", status: "ACTIVE" } }),
    prisma.item.count({ where: { status: "RETURNED" } }),
    prisma.item.count({ where: { status: "PENDING" } }),
    prisma.claim.count({ where: { status: "PENDING" } }),
    prisma.item.findMany({
      include: {
        category: true,
        location: true,
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.claim.findMany({
      where: { status: "PENDING" },
      include: {
        item: {
          select: {
            id: true,
            title: true,
            trackingCode: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Ringkasan Operasional Kampus
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau arus laporan kehilangan, barang temuan, dan penyelesaian serah terima di sekolah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/laporan"
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Kelola Semua Laporan
          </Link>
          <Link
            href="/lapor"
            target="_blank"
            className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-sky-700 transition-colors shadow-2xs"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Input Laporan Manual</span>
          </Link>
        </div>
      </div>

      {/* Action Needed Alert Banner */}
      {(pendingReportsCount > 0 || pendingClaimsCount > 0) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Perhatian: Memerlukan Tindakan Petugas</span>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Ada {pendingReportsCount} laporan baru menunggu moderasi dan {pendingClaimsCount} klaim kepemilikan menunggu verifikasi.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingReportsCount > 0 && (
              <Link
                href="/admin/laporan?status=PENDING"
                className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
              >
                Tinjau Laporan ({pendingReportsCount})
              </Link>
            )}
            {pendingClaimsCount > 0 && (
              <Link
                href="/admin/klaim"
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Tinjau Klaim ({pendingClaimsCount})
              </Link>
            )}
          </div>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Laporan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Total Laporan
            </span>
            <FileText className="h-4 w-4" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalReports}</div>
          <p className="text-[10px] text-slate-400">Akumulasi seluruh laporan</p>
        </div>

        {/* Hilang Aktif */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Hilang (Dicari)
            </span>
            <Search className="h-4 w-4" />
          </div>
          <div className="text-2xl font-black text-amber-700">{activeLost}</div>
          <p className="text-[10px] text-slate-400">Belum ditemukan</p>
        </div>

        {/* Temuan Aktif */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Temuan (Tersedia)
            </span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{activeFound}</div>
          <p className="text-[10px] text-slate-400">Diamankan di sekolah</p>
        </div>

        {/* Selesai Dikembalikan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-sky-600">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Sudah Diserahkan
            </span>
            <PackageCheck className="h-4 w-4" />
          </div>
          <div className="text-2xl font-black text-sky-700">{returnedCount}</div>
          <p className="text-[10px] text-slate-400">Kembali ke pemilik</p>
        </div>
      </div>

      {/* Grid: Laporan Terkini & Klaim Tertunda */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Table Laporan Terkini (2 Kolom) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Laporan Masuk Terbaru
              </h3>
              <p className="text-[11px] text-slate-400">
                Aktivitas pelaporan terkini dari siswa dan staf
              </p>
            </div>
            <Link
              href="/admin/laporan"
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400 font-semibold uppercase">
                  <th className="pb-2.5">Barang</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5">Pelapor</th>
                  <th className="pb-2.5">Waktu</th>
                  <th className="pb-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentReports.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pr-3">
                      <div className="font-semibold text-slate-900 line-clamp-1 max-w-[200px]">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.trackingCode} · {item.category.name}
                      </div>
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      <ItemStatusBadge status={item.status} type={item.type} showType />
                    </td>
                    <td className="py-3 pr-3 text-slate-600">
                      <div>{item.reporterName}</div>
                      <div className="text-[10px] text-slate-400">
                        {item.reporterClass || "-"}
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-slate-400 whitespace-nowrap text-[11px]">
                      {formatDateIndonesian(item.createdAt)}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/laporan?id=${item.id}`}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Eye className="h-3 w-3 text-slate-400" />
                        <span>Detail</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Klaim Menunggu Tinjauan (1 Kolom) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Antrean Klaim Menunggu
              </h3>
              <p className="text-[11px] text-slate-400">
                Bukti kepemilikan yang perlu diverifikasi
              </p>
            </div>
            <Link
              href="/admin/klaim"
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Semua</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentClaims.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 space-y-2">
              <CheckCircle2 className="mx-auto h-8 w-8 text-slate-300" />
              <p>Tidak ada klaim menunggu verifikasi saat ini.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-xs text-slate-900">
                      {claim.claimantName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {claim.claimantClass || "-"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">
                    Barang: <strong>{claim.item.title}</strong>
                  </p>
                  <div className="pt-1 flex items-center justify-end">
                    <Link
                      href="/admin/klaim"
                      className="rounded-md bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Periksa Bukti
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

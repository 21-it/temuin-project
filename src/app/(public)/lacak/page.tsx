import { trackItemByCode } from "@/app/actions/items";
import { ItemStatusBadge } from "@/components/items/ItemStatusBadge";
import { formatDateIndonesian, formatRelativeTime } from "@/lib/utils";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Tag,
  ShieldCheck,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
} from "lucide-react";

interface LacakPageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function LacakPage({ searchParams }: LacakPageProps) {
  const { code: queryCode } = await searchParams;
  const trackingCode = queryCode?.trim();

  let result = null;
  if (trackingCode) {
    result = await trackItemByCode(trackingCode);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
          Penelusuran Mandiri
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Lacak Status Laporan Barang
        </h1>
        <p className="mx-auto max-w-lg text-xs sm:text-sm text-slate-500">
          Masukkan kode unik pelacakan yang Anda peroleh saat membuat laporan untuk melihat status tindak lanjut oleh petugas sekolah.
        </p>
      </div>

      {/* Input Kode Form */}
      <div className="mx-auto max-w-xl">
        <form
          action="/lacak"
          method="GET"
          className="relative flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 transition-all"
        >
          <Search className="ml-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            name="code"
            defaultValue={trackingCode || ""}
            placeholder="Masukkan kode pelacakan (contoh: TMN-2026-F001)..."
            className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm font-mono uppercase text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-sky-700 transition-colors"
          >
            Lacak
          </button>
        </form>
      </div>

      {/* Tampilan Hasil Pencarian */}
      {result && (
        <div className="pt-2">
          {result.error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center space-y-3">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-rose-900">
                Laporan Tidak Ditemukan
              </h3>
              <p className="text-xs text-rose-700 max-w-md mx-auto leading-relaxed">
                {result.error}
              </p>
            </div>
          ) : result.item ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-8">
              {/* Top Banner Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ItemStatusBadge
                      status={result.item.status}
                      type={result.item.type}
                      showType
                    />
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      #{result.item.trackingCode}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {result.item.title}
                  </h2>
                </div>

                <Link
                  href={`/barang/${result.item.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span>Lihat di Katalog</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Progress Timeline Tracker */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Riwayat & Progres Tindak Lanjut
                </h3>

                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {/* Step 1: Laporan Dibuat */}
                  <div className="relative">
                    <div className="absolute -left-6 sm:-left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Laporan Diterima Sistem
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Dilaporkan oleh <strong>{result.item.reporterName}</strong> ({result.item.reporterClass || "Warga Kampus"}) pada {formatDateIndonesian(result.item.createdAt, true)}
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Moderasi / Verifikasi Petugas */}
                  <div className="relative">
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${
                        result.item.status !== "PENDING"
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-400 text-white"
                      }`}
                    >
                      {result.item.status !== "PENDING" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {result.item.status === "PENDING"
                          ? "Menunggu Tinjauan Petugas Sekolah"
                          : result.item.status === "REJECTED"
                          ? "Laporan Ditolak / Dibatalkan"
                          : "Terverifikasi & Tayang di Katalog"}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {result.item.status === "PENDING"
                          ? "Petugas sedang memeriksa keabsahan laporan barang."
                          : result.item.status === "REJECTED"
                          ? "Laporan ditolak oleh admin (duplikat atau data tidak sesuai)."
                          : "Laporan telah disetujui dan aktif dicocokkan dengan laporan warga sekolah lainnya."}
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Proses Klaim (Jika ada) */}
                  <div className="relative">
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${
                        result.item.status === "CLAIMED" ||
                        result.item.status === "RETURNED"
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {result.item.status === "CLAIMED" ||
                      result.item.status === "RETURNED" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Pengajuan Klaim Kepemilikan
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {result.item.claims.length > 0
                          ? `Terdapat ${result.item.claims.length} pengajuan klaim yang sedang/sudah ditinjau oleh petugas.`
                          : "Belum ada pengajuan klaim bukti kepemilikan."}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Serah Terima / Selesai */}
                  <div className="relative">
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${
                        result.item.status === "RETURNED"
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {result.item.status === "RETURNED" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {result.item.status === "RETURNED"
                          ? "Selesai: Barang Sudah Diserahkan"
                          : "Menunggu Pengambilan / Serah Terima"}
                      </h4>
                      {result.item.status === "RETURNED" && (
                        <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                          Diserahkan kepada <strong>{result.item.handoverReceiver || "Pemilik Sah"}</strong> pada {result.item.handoverDate ? formatDateIndonesian(result.item.handoverDate, true) : "-"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rincian Tambahan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Kategori & Lokasi:</span>
                  <span className="font-semibold text-slate-800">
                    {result.item.category.name} · {result.item.location.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Waktu Kejadian:</span>
                  <span className="font-semibold text-slate-800">
                    {formatDateIndonesian(result.item.dateOccurred, true)}
                  </span>
                </div>
                {result.item.adminNotes && (
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Catatan Petugas:</span>
                    <span className="text-slate-800 italic">
                      &ldquo;{result.item.adminNotes}&rdquo;
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* FAQ Pelacakan */}
      {!result && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">
            Pertanyaan Umum Pelacakan
          </h3>
          <div className="space-y-3 text-xs text-slate-600">
            <div>
              <p className="font-semibold text-slate-800">
                Di mana saya bisa menemukan kode pelacakan?
              </p>
              <p className="text-slate-500 mt-0.5">
                Kode ditampilkan di layar sukses sesaat setelah Anda mengirim formulir laporan (contoh: <code>TMN-2026-F001</code>).
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                Bagaimana jika kode hilang atau lupa dicatat?
              </p>
              <p className="text-slate-500 mt-0.5">
                Anda dapat mencari barang di menu Katalog Barang dengan kata kunci nama barang, atau mendatangi pos pelayanan sekolah dengan menyebutkan nama pelapor.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

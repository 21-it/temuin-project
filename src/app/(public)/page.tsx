import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ItemCard } from "@/components/items/ItemCard";
import {
  Search,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";

export default async function HomePage() {
  const setting = await prisma.schoolSetting.findFirst({
    where: { id: "default" },
  });

  const schoolName = setting?.name || "SMA Negeri 1 Teladan";

  // Ambil metrik ringkas
  const [totalReports, activeFound, returnedCount, latestItems] = await Promise.all([
    prisma.item.count({ where: { status: { not: "REJECTED" } } }),
    prisma.item.count({ where: { type: "FOUND", status: "ACTIVE" } }),
    prisma.item.count({ where: { status: "RETURNED" } }),
    prisma.item.findMany({
      where: {
        status: { in: ["ACTIVE", "CLAIMED", "RETURNED"] },
      },
      include: {
        category: true,
        location: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <div className="space-y-14 pb-16">
      {/* Hero Section */}
      <section className="relative border-b border-slate-200 bg-linear-to-b from-sky-50/60 to-white px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          {/* Badge Kampus */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/80 px-3.5 py-1 text-xs font-semibold text-sky-800 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            <span>Portal Resmi Lapor & Temu Barang · {schoolName}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl sm:leading-tight">
            Kehilangan atau menemukan barang di sekolah?{" "}
            <span className="text-sky-600 underline decoration-sky-300 decoration-wavy decoration-1 underline-offset-8">
              Temuin
            </span>{" "}
            solusinya.
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">
            Laporkan barang yang tercecer, cari barang milikmu yang ditemukan,
            atau ajukan klaim kepemilikan secara aman, jujur, dan terverifikasi.
          </p>

          {/* Search bar cepat */}
          <div className="mx-auto max-w-xl pt-2">
            <form action="/barang" method="GET" className="relative flex items-center shadow-xs">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="q"
                placeholder="Cari barang (misal: botol minum, kartu pelajar, kalkulator)..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-28 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
              <button
                type="submit"
                className="absolute right-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 transition-colors"
              >
                Cari Sekarang
              </button>
            </form>
          </div>

          {/* Two Main CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/lapor/hilang"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-amber-600 transition-all hover:scale-[1.02]"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Lapor Barang Hilang</span>
            </Link>

            <Link
              href="/lapor/temuan"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Lapor Barang Temuan</span>
            </Link>

            <Link
              href="/lacak"
              className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Clock className="h-4 w-4 text-slate-400" />
              <span>Lacak Status</span>
            </Link>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="mx-auto mt-12 max-w-4xl grid grid-cols-3 gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xs text-center backdrop-blur-xs">
          <div className="p-2 border-r border-slate-100">
            <div className="text-xl sm:text-2xl font-black text-slate-900">{totalReports}</div>
            <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">Total Laporan Masuk</div>
          </div>
          <div className="p-2 border-r border-slate-100">
            <div className="text-xl sm:text-2xl font-black text-emerald-600">{activeFound}</div>
            <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">Barang Temuan Aktif</div>
          </div>
          <div className="p-2">
            <div className="text-xl sm:text-2xl font-black text-sky-600">{returnedCount}</div>
            <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">Berhasil Dikembalikan</div>
          </div>
        </div>
      </section>

      {/* Latest Items Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
              Pembaruan Terkini
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
              Daftar Barang Terkini
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Barang yang baru dilaporkan atau ditemukan di lingkungan sekolah.
            </p>
          </div>

          <Link
            href="/barang"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700"
          >
            <span>Lihat Semua Barang</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {latestItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center">
            <p className="text-sm text-slate-500">Belum ada laporan barang aktif saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="pt-4 text-center">
          <Link
            href="/barang"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <span>Buka Katalog Lengkap</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* How it Works / 3 Langkah Mudah */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
              Prosedur Sederhana
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Bagaimana Temuin Bekerja?
            </h2>
            <p className="text-xs text-slate-500">
              Tiga langkah mudah mengembalikan barang ke pemilik aslinya secara aman dan transparan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700 font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Laporkan Barang</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Isi formulir barang hilang atau barang temuan. Unggah foto pendukung dan dapatkan kode pelacakan instan.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Ajukan Bukti Kepemilikan</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pemilik yang mengenali barangnya dapat mengajukan klaim dengan menyebutkan ciri unik/nomor seri/isi barang.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Verifikasi & Serah Terima</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Petugas TU/Keamanan memeriksa keabsahan bukti dan menyerahkan barang secara tertib di ruang pelayanan.
              </p>
            </div>
          </div>

          {/* Banner Integritas */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-sky-100 bg-sky-50/80 p-4 text-xs text-sky-900">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-sky-700 shrink-0" />
              <span>
                <strong>Jaminan Privasi:</strong> Nomor kontak pelapor dilindungi dari akses publik. Seluruh koordinasi serah terima dilakukan lewat petugas sekolah.
              </span>
            </div>
            <Link
              href="/lapor"
              className="shrink-0 rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700 transition-colors"
            >
              Mulai Lapor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

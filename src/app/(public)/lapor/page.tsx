import Link from "next/link";
import { HelpCircle, PlusCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LaporChoicePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
          <Sparkles className="h-3.5 w-3.5 text-sky-600" />
          <span>Formulir Pelaporan Kampus</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Pilih Jenis Laporan
        </h1>
        <p className="mx-auto max-w-xl text-xs sm:text-sm text-slate-500 leading-relaxed">
          Pilih kategori pelaporan di bawah ini. Semua laporan akan mendapatkan kode pelacakan unik untuk memantau proses tindak lanjut.
        </p>
      </div>

      {/* Two Choice Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-4">
        {/* Lapor Barang Hilang */}
        <Link
          href="/lapor/hilang"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-amber-200 bg-white p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-amber-400 hover:shadow-md"
        >
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <HelpCircle className="h-7 w-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                Opsi 1 · Kehilangan
              </span>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors mt-0.5">
                Lapor Barang Hilang
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gunakan opsi ini jika Anda kehilangan barang pribadi (misal: dompet, ponsel, tumbler, jaket, buku) di lingkungan sekolah dan sedang mencarinya.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-500 pt-1">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Catat ciri-ciri khusus & lokasi terakhir
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Dapatkan notifikasi status pelacakan
              </li>
            </ul>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-amber-700">
            <span>Buka Formulir Barang Hilang</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Lapor Barang Temuan */}
        <Link
          href="/lapor/temuan"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-md"
        >
          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <PlusCircle className="h-7 w-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                Opsi 2 · Menemukan
              </span>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mt-0.5">
                Lapor Barang Temuan
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gunakan opsi ini jika Anda menemukan barang milik orang lain yang tertinggal atau tercecer dan ingin membantu mengembalikannya ke pemilik sah.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-500 pt-1">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Unggah foto dokumentasi barang
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Barang dapat dititipkan ke Pos Satpam / TU
              </li>
            </ul>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-emerald-700">
            <span>Buka Formulir Barang Temuan</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* Security notice */}
      <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-4 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1.5 font-medium text-slate-700 mb-1">
          <ShieldCheck className="h-4 w-4 text-sky-600" />
          Menjaga Nilai Kejujuran & Integritas
        </p>
        Pastikan setiap laporan diisi dengan data yang benar dan dapat dipertanggungjawabkan demi kenyamanan seluruh warga sekolah.
      </div>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Check,
  Search,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

function SuksesContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "TMN-SAMPLE";
  const type = searchParams.get("type") || "LOST";
  const title = searchParams.get("title") || "Barang";

  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const isLost = type === "LOST";

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs text-center space-y-6">
        {/* Icon checkmark */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-2xs">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            Laporan Berhasil Terkirim
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Terima Kasih atas Laporan Anda
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Laporan untuk <strong>&ldquo;{title}&rdquo;</strong> telah berhasil disimpan ke sistem Temuin sekolah.
          </p>
        </div>

        {/* Kode Pelacakan Box */}
        <div className="rounded-xl border border-dashed border-sky-300 bg-sky-50/60 p-5 space-y-2 text-center">
          <span className="text-[11px] font-medium text-sky-800 uppercase tracking-wider block">
            Kode Pelacakan Anda
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-wider text-sky-950">
              {code}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-2xs border border-sky-200 hover:bg-sky-100 transition-colors"
              title="Salin Kode"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Disalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-sky-700">
            Simpan atau catat kode ini untuk mengecek status tindak lanjut tanpa perlu login.
          </p>
        </div>

        {/* Guidance Notice */}
        <div className="rounded-xl bg-slate-50 p-4 text-left space-y-2 border border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-sky-600" />
            <span>Langkah Selanjutnya:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1">
            {isLost ? (
              <>
                <li>Petugas akan meninjau laporan dan mencocokkan dengan barang temuan di pos pelayanan.</li>
                <li>Jika ada yang menyerahkan barang yang cocok, petugas akan menghubungi kontak Anda.</li>
              </>
            ) : (
              <>
                <li>Jika barang fisik ada pada Anda, mohon titipkan ke Ruang Tata Usaha atau Pos Satpam.</li>
                <li>Petugas akan mengumumkan dan menunggu pemilik sah mengajukan klaim bukti kepemilikan.</li>
              </>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <Link
            href={`/lacak?code=${encodeURIComponent(code)}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-sky-600 py-3 text-xs font-semibold text-white hover:bg-sky-700 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Cek Status Sekarang</span>
          </Link>

          <Link
            href="/barang"
            className="flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Kembali ke Katalog</span>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuksesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl py-16 text-center text-xs text-slate-400">
          Memuat informasi laporan...
        </div>
      }
    >
      <SuksesContent />
    </Suspense>
  );
}

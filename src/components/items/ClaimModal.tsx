"use client";

import { useState } from "react";
import { X, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { createClaimAction } from "@/app/actions/claims";

interface ClaimModalProps {
  itemId: string;
  itemTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ClaimModal({
  itemId,
  itemTitle,
  isOpen,
  onClose,
}: ClaimModalProps) {
  const [claimantName, setClaimantName] = useState("");
  const [claimantClass, setClaimantClass] = useState("");
  const [claimantContact, setClaimantContact] = useState("");
  const [proofDescription, setProofDescription] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const res = await createClaimAction({
      itemId,
      claimantName,
      claimantClass,
      claimantContact,
      proofDescription,
      honeypot,
    });

    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage(
        res.message || "Pengajuan klaim berhasil dikirim dan menunggu verifikasi."
      );
    }
  }

  function handleResetAndClose() {
    setClaimantName("");
    setClaimantClass("");
    setClaimantContact("");
    setProofDescription("");
    setErrorMessage(null);
    setSuccessMessage(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700">
              <ShieldCheck className="h-3 w-3" />
              Verifikasi Kepemilikan
            </span>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Ajukan Klaim Barang
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              Barang: <strong>{itemTitle}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success screen */}
        {successMessage ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Klaim Berhasil Dikirim!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {successMessage}
            </p>
            <p className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100">
              Petugas sekolah (TU/Satpam/Kesiswaan) akan memeriksa bukti Anda. Silakan bawa tanda pengenal (Kartu Pelajar) saat mengambil barang di ruang pelayanan.
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Tutup & Selesai
            </button>
          </div>
        ) : (
          /* Claim Form */
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Honeypot field (hidden from legitimate users) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_url"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap Pemilik <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="Contoh: Muhammad Farhan"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Kelas / Jabatan
                </label>
                <input
                  type="text"
                  value={claimantClass}
                  onChange={(e) => setClaimantClass(e.target.value)}
                  placeholder="Contoh: XI MIPA 2 / Guru"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nomor Kontak Aktif (WhatsApp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={claimantContact}
                onChange={(e) => setClaimantContact(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Petugas akan menghubungi nomor ini untuk konfirmasi serah terima.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Bukti atau Ciri-ciri Khusus <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                placeholder="Jelaskan hal-hal yang membuktikan ini barang Anda: nomor seri, rincian isi di dalam dompet/tas, gantungan/stiker khusus, wallpaper layar, atau bukti transaksi pembelian..."
                className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none leading-relaxed"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Minimal 15 karakter. Semakin rinci, semakin cepat petugas menyetujui klaim Anda.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="rounded-lg px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Mengirimkan...</span>
                  </>
                ) : (
                  <span>Kirim Pengajuan Klaim</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

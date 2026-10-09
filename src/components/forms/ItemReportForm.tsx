"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Send, Lock } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { createItemAction } from "@/app/actions/items";

interface Option {
  id: string;
  name: string;
}

interface ItemReportFormProps {
  type: "LOST" | "FOUND";
  categories: Option[];
  locations: Option[];
}

export function ItemReportForm({
  type,
  categories,
  locations,
}: ItemReportFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [locationId, setLocationId] = useState(locations[0]?.id || "");
  const [dateOccurred, setDateOccurred] = useState(
    () => new Date().toISOString().slice(0, 16) // format YYYY-MM-DDTHH:mm
  );
  const [reporterName, setReporterName] = useState("");
  const [reporterClass, setReporterClass] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [honeypot, setHoneypot] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const res = await createItemAction({
      type,
      title,
      description,
      categoryId,
      locationId,
      dateOccurred,
      reporterName,
      reporterClass,
      reporterContact,
      imageUrls,
      honeypot,
    });

    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else if (res.trackingCode) {
      router.push(
        `/lapor/sukses?code=${encodeURIComponent(
          res.trackingCode
        )}&type=${type}&title=${encodeURIComponent(res.itemTitle || title)}`
      );
    }
  }

  const isLost = type === "LOST";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="user_web_site"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Bagian 1: Rincian Barang */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2.5">
          1. Rincian Barang yang {isLost ? "Hilang" : "Ditemukan"}
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Nama Barang <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              isLost
                ? "Contoh: Botol Minum Lock&Lock Biru 500ml"
                : "Contoh: Kunci Motor Beat Gantungan Boneka Kelinci"
            }
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Kategori Barang <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-sky-500 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Lokasi Terakhir / Ditemukan <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-sky-500 focus:outline-none"
            >
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Tanggal & Perkiraan Waktu Kejadian <span className="text-rose-500">*</span>
          </label>
          <input
            type="datetime-local"
            required
            value={dateOccurred}
            onChange={(e) => setDateOccurred(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-700 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Deskripsi & Ciri-Ciri Khusus <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              isLost
                ? "Jelaskan warna, stiker, goresan, nomor seri jika ada, atau isi di dalamnya untuk mempermudah identifikasi..."
                : "Sebutkan kondisi barang dan tempat spesifik barang diamankan saat ini (misal: diserahkan ke pos satpam)..."
            }
            className="w-full rounded-lg border border-slate-200 p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none leading-relaxed"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Minimal 10 karakter. Berikan rincian yang jelas dan sopan.
          </span>
        </div>

        {/* Foto Dokumentasi */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Foto Dokumentasi (Opsional, Maks. 3 Foto)
          </label>
          <ImageUploader
            value={imageUrls}
            onChange={setImageUrls}
            maxFiles={3}
          />
        </div>
      </div>

      {/* Bagian 2: Identitas Pelapor */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-sm font-semibold text-slate-900">
            2. Identitas Pelapor
          </h3>
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <Lock className="h-3 w-3 text-slate-400" />
            Kontak Terlindungi
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nama Lengkap Pelapor <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Contoh: Andi Pratama"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Kelas / Peran di Sekolah
            </label>
            <input
              type="text"
              value={reporterClass}
              onChange={(e) => setReporterClass(e.target.value)}
              placeholder="Contoh: X MIPA 3 / Guru Biologi / Staf TU"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Nomor Kontak WhatsApp / Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={reporterContact}
            onChange={(e) => setReporterContact(e.target.value)}
            placeholder="Contoh: 081234567890"
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
          />
          <div className="mt-1.5 flex items-start gap-1.5 rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-500 border border-slate-100">
            <Lock className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sky-600" />
            <span>
              Privasi aman: Kontak Anda hanya dapat dilihat oleh admin/petugas sekolah untuk koordinasi serah terima, dan tidak akan dipublikasikan ke publik.
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Kembali
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-sky-700 transition-colors disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memproses Laporan...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Kirim Laporan {isLost ? "Kehilangan" : "Temuan"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

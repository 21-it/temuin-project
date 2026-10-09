"use client";

import { useState } from "react";
import { reviewClaimAction } from "@/app/actions/claims";
import { formatDateIndonesian } from "@/lib/utils";
import {
  ShieldCheck,
  Check,
  X,
  Phone,
  PackageCheck,
  AlertCircle,
  Loader2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface ClaimItem {
  id: string;
  claimantName: string;
  claimantClass: string | null;
  claimantContact: string;
  proofDescription: string;
  status: string;
  adminNotes: string | null;
  createdAt: Date | string;
  item: {
    id: string;
    title: string;
    type: string;
    status: string;
    trackingCode: string;
    location: { name: string };
  };
}

export function AdminClaimsManager({
  initialClaims,
}: {
  initialClaims: ClaimItem[];
}) {
  const [claims, setClaims] = useState<ClaimItem[]>(initialClaims);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Review Form state
  const [reviewStatus, setReviewStatus] = useState<"APPROVED" | "REJECTED">(
    "APPROVED"
  );
  const [markItemReturned, setMarkItemReturned] = useState(true);
  const [handoverReceiver, setHandoverReceiver] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredClaims = claims.filter((c) =>
    filterStatus === "ALL" ? true : c.status === filterStatus
  );

  function openReview(claim: ClaimItem, defaultDecision: "APPROVED" | "REJECTED") {
    setSelectedClaim(claim);
    setReviewStatus(defaultDecision);
    setMarkItemReturned(defaultDecision === "APPROVED");
    setHandoverReceiver(
      `${claim.claimantName} (${claim.claimantClass || "Pemilik"})`
    );
    setAdminNotes(
      defaultDecision === "APPROVED"
        ? "Bukti kepemilikan telah dicocokkan dan diverifikasi oleh staf sekolah."
        : "Bukti yang diberikan tidak sesuai dengan spesifikasi barang."
    );
    setError(null);
    setIsModalOpen(true);
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClaim) return;

    setLoading(true);
    setError(null);

    const res = await reviewClaimAction({
      claimId: selectedClaim.id,
      status: reviewStatus,
      adminNotes,
      markItemReturned: reviewStatus === "APPROVED" ? markItemReturned : false,
      handoverReceiver:
        reviewStatus === "APPROVED" && markItemReturned
          ? handoverReceiver
          : undefined,
    });

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setClaims((prev) =>
        prev.map((c) =>
          c.id === selectedClaim.id
            ? {
                ...c,
                status: reviewStatus,
                adminNotes,
                item: {
                  ...c.item,
                  status:
                    reviewStatus === "APPROVED" && markItemReturned
                      ? "RETURNED"
                      : c.item.status,
                },
              }
            : c
        )
      );
      setIsModalOpen(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters bar */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">Semua Klaim ({claims.length})</option>
            <option value="PENDING">
              Menunggu Verifikasi (
              {claims.filter((c) => c.status === "PENDING").length})
            </option>
            <option value="APPROVED">
              Disetujui ({claims.filter((c) => c.status === "APPROVED").length})
            </option>
            <option value="REJECTED">
              Ditolak ({claims.filter((c) => c.status === "REJECTED").length})
            </option>
          </select>
        </div>
        <span className="text-xs text-slate-400">
          Total {filteredClaims.length} klaim ditampilkan
        </span>
      </div>

      {/* Table of claims */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Pengklaim</th>
                <th className="py-3 px-4">Barang Terkait</th>
                <th className="py-3 px-4">Bukti yang Diberikan</th>
                <th className="py-3 px-4">Status Klaim</th>
                <th className="py-3 px-4">Tanggal Pengajuan</th>
                <th className="py-3 px-4 text-right">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada pengajuan klaim dalam daftar ini.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Pengklaim & Kontak WA */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {claim.claimantName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {claim.claimantClass || "Siswa/Staf"}
                      </div>
                      <a
                        href={`https://wa.me/${claim.claimantContact.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:underline mt-1"
                      >
                        <Phone className="h-3 w-3" />
                        <span>{claim.claimantContact}</span>
                      </a>
                    </td>

                    {/* Barang */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <Link
                        href={`/barang/${claim.item.id}`}
                        target="_blank"
                        className="font-medium text-slate-900 hover:text-sky-600 flex items-center gap-1"
                      >
                        <span className="line-clamp-1">{claim.item.title}</span>
                        <ExternalLink className="h-3 w-3 text-slate-400 shrink-0" />
                      </Link>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {claim.item.trackingCode} · {claim.item.location.name}
                      </div>
                    </td>

                    {/* Bukti Deskripsi */}
                    <td className="py-3.5 px-4 max-w-xs text-slate-600">
                      <p className="line-clamp-2 leading-relaxed">
                        {claim.proofDescription}
                      </p>
                    </td>

                    {/* Status Klaim */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {claim.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Menunggu Review
                        </span>
                      )}
                      {claim.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Disetujui
                        </span>
                      )}
                      {claim.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-800 border border-rose-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          Ditolak
                        </span>
                      )}
                    </td>

                    {/* Tanggal */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-400">
                      {formatDateIndonesian(claim.createdAt)}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {claim.status === "PENDING" ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openReview(claim, "APPROVED")}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                          >
                            Setujui
                          </button>
                          <button
                            type="button"
                            onClick={() => openReview(claim, "REJECTED")}
                            className="rounded-lg border border-rose-200 px-3 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openReview(claim, claim.status as any)}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                        >
                          Lihat Catatan
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Review Klaim */}
      {isModalOpen && selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Verifikasi Bukti Klaim Barang
                </h3>
                <p className="text-xs text-slate-500">
                  Pengklaim: <strong>{selectedClaim.claimantName}</strong> ({selectedClaim.claimantClass || "-"})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Bukti Teks Pengklaim */}
            <div className="space-y-1 rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs">
              <span className="font-semibold text-slate-400 uppercase text-[10px]">
                Deskripsi Bukti dari Pengklaim:
              </span>
              <p className="text-slate-800 leading-relaxed italic whitespace-pre-line">
                &ldquo;{selectedClaim.proofDescription}&rdquo;
              </p>
            </div>

            {/* Form Putusan */}
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Keputusan Verifikasi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewStatus("APPROVED")}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2 font-semibold transition-colors ${
                      reviewStatus === "APPROVED"
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    <span>Setujui Klaim</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewStatus("REJECTED")}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2 font-semibold transition-colors ${
                      reviewStatus === "REJECTED"
                        ? "bg-rose-600 text-white shadow-2xs"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <X className="h-4 w-4" />
                    <span>Tolak Klaim</span>
                  </button>
                </div>
              </div>

              {reviewStatus === "APPROVED" && (
                <>
                  <div className="space-y-2 rounded-xl bg-emerald-50/60 border border-emerald-200 p-3.5">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-emerald-950">
                      <input
                        type="checkbox"
                        checked={markItemReturned}
                        onChange={(e) => setMarkItemReturned(e.target.checked)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Tandai barang langsung &ldquo;Sudah Dikembalikan&rdquo; (Serah Terima Selesai)</span>
                    </label>

                    {markItemReturned && (
                      <div className="pt-2">
                        <label className="block text-[11px] font-medium text-emerald-900 mb-1">
                          Nama Penerima Barang:
                        </label>
                        <input
                          type="text"
                          required={markItemReturned}
                          value={handoverReceiver}
                          onChange={(e) => setHandoverReceiver(e.target.value)}
                          className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Admin / Alasan Verifikasi
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Catat keterangan verifikasi..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-white font-semibold hover:bg-slate-800 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Keputusan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

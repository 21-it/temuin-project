"use client";

import { useState } from "react";
import {
  updateItemAdminAction,
  deleteItemAdminAction,
} from "@/app/actions/items";
import { ItemStatusBadge } from "@/components/items/ItemStatusBadge";
import { formatDateIndonesian, formatRelativeTime } from "@/lib/utils";
import Image from "next/image";
import {
  Search,
  Filter,
  Check,
  X,
  PackageCheck,
  Trash2,
  Eye,
  Phone,
  User,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  ExternalLink,
  Lock,
} from "lucide-react";
import Link from "next/link";

interface ItemData {
  id: string;
  type: string;
  title: string;
  description: string;
  categoryId: string;
  locationId: string;
  dateOccurred: Date | string;
  status: string;
  trackingCode: string;
  reporterName: string;
  reporterClass: string | null;
  reporterContact: string;
  handoverDate: Date | string | null;
  handoverReceiver: string | null;
  adminNotes: string | null;
  createdAt: Date | string;
  category: { id: string; name: string };
  location: { id: string; name: string };
  images: { id: string; url: string }[];
  claims: { id: string; claimantName: string; status: string }[];
}

interface AdminReportsManagerProps {
  initialItems: ItemData[];
  categories: { id: string; name: string }[];
  locations: { id: string; name: string }[];
}

export function AdminReportsManager({
  initialItems,
  categories,
  locations,
}: AdminReportsManagerProps) {
  const [items, setItems] = useState<ItemData[]>(initialItems);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Selected item for detail / action modal
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHandoverOpen, setIsHandoverOpen] = useState(false);

  // Form serah terima
  const [handoverReceiver, setHandoverReceiver] = useState("");
  const [handoverNotes, setHandoverNotes] = useState("");

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Filter items locally for instant responsiveness
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      item.reporterName.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    const matchesType = typeFilter === "ALL" || item.type === typeFilter;
    const matchesCat =
      categoryFilter === "ALL" || item.categoryId === categoryFilter;

    return matchesSearch && matchesStatus && matchesType && matchesCat;
  });

  async function handleQuickStatusChange(
    item: ItemData,
    newStatus: "PENDING" | "ACTIVE" | "CLAIMED" | "RETURNED" | "REJECTED"
  ) {
    setLoadingAction(item.id);
    setActionError(null);

    const res = await updateItemAdminAction({
      id: item.id,
      status: newStatus,
      adminNotes:
        newStatus === "ACTIVE"
          ? "Disetujui oleh admin kampus."
          : newStatus === "REJECTED"
          ? "Ditolak / tidak memenuhi syarat pelaporan."
          : undefined,
    });

    setLoadingAction(null);

    if (res.error) {
      setActionError(res.error);
    } else {
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, status: newStatus } : it
        )
      );
      if (selectedItem?.id === item.id) {
        setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    }
  }

  async function handleHandoverSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedItem) return;

    setLoadingAction("handover");
    setActionError(null);

    const res = await updateItemAdminAction({
      id: selectedItem.id,
      status: "RETURNED",
      handoverReceiver,
      adminNotes: handoverNotes || "Barang telah diserahkan di pos pelayanan.",
    });

    setLoadingAction(null);

    if (res.error) {
      setActionError(res.error);
    } else {
      setItems((prev) =>
        prev.map((it) =>
          it.id === selectedItem.id
            ? {
                ...it,
                status: "RETURNED",
                handoverReceiver,
                adminNotes: handoverNotes,
                handoverDate: new Date(),
              }
            : it
        )
      );
      setIsHandoverOpen(false);
      setIsDetailOpen(false);
      setHandoverReceiver("");
      setHandoverNotes("");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus laporan ini secara permanen?")) {
      return;
    }

    setLoadingAction(id);
    const res = await deleteItemAdminAction(id);
    setLoadingAction(null);

    if (res.error) {
      alert(res.error);
    } else {
      setItems((prev) => prev.filter((it) => it.id !== id));
      if (selectedItem?.id === id) {
        setIsDetailOpen(false);
      }
    }
  }

  function openDetail(item: ItemData) {
    setSelectedItem(item);
    setIsDetailOpen(true);
  }

  function openHandoverModal(item: ItemData) {
    setSelectedItem(item);
    setHandoverReceiver(
      item.claims.length > 0 ? item.claims[0].claimantName : ""
    );
    setHandoverNotes("");
    setIsHandoverOpen(true);
  }

  return (
    <div className="space-y-6">
      {actionError && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama barang, kode lacak, nama pelapor..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="PENDING">Menunggu Verifikasi</option>
              <option value="ACTIVE">Aktif</option>
              <option value="CLAIMED">Sedang Diklaim</option>
              <option value="RETURNED">Sudah Dikembalikan</option>
              <option value="REJECTED">Ditolak</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">Semua Tipe</option>
              <option value="LOST">Barang Hilang</option>
              <option value="FOUND">Barang Temuan</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:border-sky-500 hidden md:block"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Menampilkan <strong>{filteredItems.length}</strong> dari {items.length} laporan
          </span>
          {(search || statusFilter !== "ALL" || typeFilter !== "ALL" || categoryFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
                setTypeFilter("ALL");
                setCategoryFilter("ALL");
              }}
              className="text-sky-600 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Table Laporan */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Barang & Kode</th>
                <th className="py-3 px-4">Kategori & Lokasi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Pelapor (Privat)</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada laporan yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isProcessing = loadingAction === item.id;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Barang & Kode */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {item.images.length > 0 ? (
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                              <Image
                                src={item.images[0].url}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[10px] text-slate-400">
                              Foto-
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-900 line-clamp-1 block hover:text-sky-600 cursor-pointer" onClick={() => openDetail(item)}>
                              {item.title}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {item.trackingCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Kategori & Lokasi */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="font-medium">{item.category.name}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {item.location.name}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <ItemStatusBadge status={item.status} type={item.type} showType />
                        {item.claims.length > 0 && (
                          <span className="mt-1 block text-[10px] text-indigo-600 font-medium">
                            {item.claims.length} klaim diajukan
                          </span>
                        )}
                      </td>

                      {/* Pelapor (Kontak Privat) */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-medium">{item.reporterName}</div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{item.reporterContact}</span>
                        </div>
                      </td>

                      {/* Waktu */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-400">
                        {formatDateIndonesian(item.createdAt)}
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* If PENDING: Approve or Reject */}
                          {item.status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleQuickStatusChange(item, "ACTIVE")
                                }
                                title="Setujui Laporan (Aktifkan)"
                                className="rounded-lg bg-emerald-600 p-1.5 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleQuickStatusChange(item, "REJECTED")
                                }
                                title="Tolak Laporan (Spam / Salah)"
                                className="rounded-lg bg-rose-600 p-1.5 text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}

                          {/* If ACTIVE or CLAIMED: Selesaikan Serah Terima */}
                          {(item.status === "ACTIVE" ||
                            item.status === "CLAIMED") && (
                            <button
                              type="button"
                              onClick={() => openHandoverModal(item)}
                              title="Tandai Sudah Diserahkan"
                              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                            >
                              <PackageCheck className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Serah Terima</span>
                            </button>
                          )}

                          {/* Detail Button */}
                          <button
                            type="button"
                            onClick={() => openDetail(item)}
                            className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
                            title="Buka Rincian Lengkap"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Hapus Laporan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Detail Lengkap Laporan */}
      {isDetailOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ItemStatusBadge
                    status={selectedItem.status}
                    type={selectedItem.type}
                    showType
                  />
                  <span className="font-mono text-xs text-slate-400">
                    {selectedItem.trackingCode}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedItem.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Photos */}
            {selectedItem.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {selectedItem.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200"
                  >
                    <Image
                      src={img.url}
                      alt={selectedItem.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Deskripsi */}
            <div className="space-y-1 bg-slate-50 p-4 rounded-xl text-xs">
              <span className="text-[11px] font-semibold uppercase text-slate-400">
                Deskripsi Barang
              </span>
              <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                {selectedItem.description}
              </p>
            </div>

            {/* Identitas Pelapor Khusus Admin */}
            <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-sky-900">
                <Lock className="h-3.5 w-3.5 text-sky-600" />
                <span>Identitas Pelapor (Rahasia / Internal Admin):</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-[11px] text-slate-400 block">Nama Pelapor:</span>
                  <span className="font-semibold">{selectedItem.reporterName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Kelas / Peran:</span>
                  <span className="font-semibold">{selectedItem.reporterClass || "-"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] text-slate-400 block">Kontak WhatsApp / Telepon:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-bold text-slate-900">
                      {selectedItem.reporterContact}
                    </span>
                    <a
                      href={`https://wa.me/${selectedItem.reporterContact.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700"
                    >
                      Hubungi via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Lokasi & Tanggal */}
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
              <div>
                <span className="text-[11px] text-slate-400 block">Lokasi:</span>
                <span className="font-medium">{selectedItem.location.name}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Waktu Kejadian:</span>
                <span className="font-medium">
                  {formatDateIndonesian(selectedItem.dateOccurred, true)}
                </span>
              </div>
            </div>

            {/* Quick Status Buttons inside detail modal */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickStatusChange(selectedItem, "ACTIVE")}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Setujui (Aktif)
                </button>
                <button
                  type="button"
                  onClick={() => openHandoverModal(selectedItem)}
                  className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
                >
                  Serah Terima
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStatusChange(selectedItem, "REJECTED")}
                  className="rounded-lg border border-rose-200 text-rose-600 px-3 py-1.5 text-xs font-semibold hover:bg-rose-50"
                >
                  Tolak
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Serah Terima Barang (Handover) */}
      {isHandoverOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pencatatan Serah Terima Barang
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Barang: <strong>{selectedItem.title}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsHandoverOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleHandoverSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nama Penerima / Pemilik Sah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={handoverReceiver}
                  onChange={(e) => setHandoverReceiver(e.target.value)}
                  placeholder="Contoh: Bagas Wicaksono (XII MIPA 4)"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Catatan Petugas & Bukti Pengambilan
                </label>
                <textarea
                  rows={3}
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  placeholder="Contoh: Pemilik menunjukkan kartu pelajar dan mencocokkan nomor seri di belakang kalkulator."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="rounded-lg bg-emerald-50 p-3 text-[11px] text-emerald-800 border border-emerald-100">
                Setelah disimpan, status barang akan otomatis diubah menjadi <strong>&ldquo;Sudah Dikembalikan&rdquo;</strong> dan tanggal serah terima akan dicatat.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsHandoverOpen(false)}
                  className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loadingAction === "handover"}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
                >
                  {loadingAction === "handover" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Konfirmasi Penyerahan</span>
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

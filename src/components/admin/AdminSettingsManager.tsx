"use client";

import { useState } from "react";
import {
  updateSchoolSettingAction,
  addCategoryAction,
  deleteCategoryAction,
  addLocationAction,
  deleteLocationAction,
} from "@/app/actions/settings";
import {
  Building2,
  FolderTree,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
} from "lucide-react";

interface CategoryWithCount {
  id: string;
  name: string;
  _count: { items: number };
}

interface LocationWithCount {
  id: string;
  name: string;
  _count: { items: number };
}

interface AdminSettingsManagerProps {
  initialSetting: {
    name: string;
    tagline: string | null;
    contactEmail: string;
    contactPhone: string;
    address: string | null;
  };
  initialCategories: CategoryWithCount[];
  initialLocations: LocationWithCount[];
}

export function AdminSettingsManager({
  initialSetting,
  initialCategories,
  initialLocations,
}: AdminSettingsManagerProps) {
  // School settings form
  const [name, setName] = useState(initialSetting.name);
  const [tagline, setTagline] = useState(initialSetting.tagline || "");
  const [contactEmail, setContactEmail] = useState(initialSetting.contactEmail);
  const [contactPhone, setContactPhone] = useState(initialSetting.contactPhone);
  const [address, setAddress] = useState(initialSetting.address || "");

  // Master lists
  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories);
  const [locations, setLocations] = useState<LocationWithCount[]>(initialLocations);

  // New item inputs
  const [newCatName, setNewCatName] = useState("");
  const [newLocName, setNewLocName] = useState("");

  const [savingSetting, setSavingSetting] = useState(false);
  const [settingMsg, setSettingMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [savingCat, setSavingCat] = useState(false);
  const [savingLoc, setSavingLoc] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleSaveSchool(e: React.FormEvent) {
    e.preventDefault();
    setSavingSetting(true);
    setSettingMsg(null);

    const res = await updateSchoolSettingAction({
      name,
      tagline,
      contactEmail,
      contactPhone,
      address,
    });

    setSavingSetting(false);
    if (res.error) {
      setSettingMsg({ type: "error", text: res.error });
    } else {
      setSettingMsg({
        type: "success",
        text: "Pengaturan dan identitas sekolah berhasil diperbarui!",
      });
      setTimeout(() => setSettingMsg(null), 3000);
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setSavingCat(true);
    setActionError(null);

    const res = await addCategoryAction(newCatName.trim());
    setSavingCat(false);

    if (res.error) {
      setActionError(res.error);
    } else if (res.category) {
      setCategories((prev) => [
        ...prev,
        { id: res.category.id, name: res.category.name, _count: { items: 0 } },
      ]);
      setNewCatName("");
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Hapus kategori ini?")) return;
    setActionError(null);

    const res = await deleteCategoryAction(id);
    if (res.error) {
      setActionError(res.error);
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  }

  async function handleAddLocation(e: React.FormEvent) {
    e.preventDefault();
    if (!newLocName.trim()) return;

    setSavingLoc(true);
    setActionError(null);

    const res = await addLocationAction(newLocName.trim());
    setSavingLoc(false);

    if (res.error) {
      setActionError(res.error);
    } else if (res.location) {
      setLocations((prev) => [
        ...prev,
        { id: res.location.id, name: res.location.name, _count: { items: 0 } },
      ]);
      setNewLocName("");
    }
  }

  async function handleDeleteLocation(id: string) {
    if (!confirm("Hapus lokasi ini?")) return;
    setActionError(null);

    const res = await deleteLocationAction(id);
    if (res.error) {
      setActionError(res.error);
    } else {
      setLocations((prev) => prev.filter((l) => l.id !== id));
    }
  }

  return (
    <div className="space-y-8">
      {actionError && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* 1. Pengaturan Identitas Sekolah */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <Building2 className="h-5 w-5 text-sky-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Identitas & Kontak Sekolah (Multi-Instance SaaS Ready)
            </h2>
            <p className="text-xs text-slate-400">
              Nama sekolah, narasi tagline, dan nomor pos pelayanan yang tampil pada portal publik.
            </p>
          </div>
        </div>

        {settingMsg && (
          <div
            className={`flex items-center gap-2 rounded-lg p-3 text-xs ${
              settingMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            {settingMsg.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{settingMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveSchool} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Institusi / Sekolah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: SMA Negeri 1 Teladan"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tagline / Slogan Layanan
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Contoh: Layanan Terpadu Lapor & Temu Barang Hilang Kampus"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Pelayanan / Pengaduan <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="lostandfound@sekolah.sch.id"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Hotline Telepon / WhatsApp Pos Satpam <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+62 812-3456-7890"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alamat Kampus
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Pendidikan Wijaya No. 12, Kebayoran Baru, Jakarta Selatan"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingSetting}
              className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-60 shadow-2xs"
            >
              {savingSetting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Perubahan Identitas</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Grid: Kategori & Lokasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Kelola Kategori */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FolderTree className="h-4 w-4 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Kelola Kategori Barang ({categories.length})
            </h3>
          </div>

          {/* Form Tambah Kategori */}
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Nama kategori baru..."
              className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={savingCat}
              className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah</span>
            </button>
          </form>

          {/* List Kategori */}
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-800">{cat.name}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.2 text-[10px] text-slate-500">
                    {cat._count.items} barang
                  </span>
                </div>
                {cat._count.items === 0 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Kelola Lokasi */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="h-4 w-4 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Kelola Lokasi Kampus ({locations.length})
            </h3>
          </div>

          {/* Form Tambah Lokasi */}
          <form onSubmit={handleAddLocation} className="flex gap-2">
            <input
              type="text"
              required
              value={newLocName}
              onChange={(e) => setNewLocName(e.target.value)}
              placeholder="Nama area / ruangan baru..."
              className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={savingLoc}
              className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah</span>
            </button>
          </form>

          {/* List Lokasi */}
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center justify-between py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-800">{loc.name}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.2 text-[10px] text-slate-500">
                    {loc._count.items} barang
                  </span>
                </div>
                {loc._count.items === 0 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteLocation(loc.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Hapus Lokasi"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

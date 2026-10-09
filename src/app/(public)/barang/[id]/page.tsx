import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Tag,
  Camera,
  ShieldAlert,
  CheckCircle2,
  Lock,
  User,
  Clock,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { formatDateIndonesian, formatRelativeTime } from "@/lib/utils";
import { ItemStatusBadge } from "@/components/items/ItemStatusBadge";
import { ItemDetailActions } from "@/components/items/ItemDetailActions";

interface ItemDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      category: true,
      location: true,
      images: true,
    },
  });

  if (!item) {
    notFound();
  }

  const primaryImage =
    item.images && item.images.length > 0 ? item.images[0].url : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <Link href="/barang" className="hover:text-slate-900">
          Katalog Barang
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <span className="text-slate-800 font-medium truncate max-w-[200px]">
          {item.title}
        </span>
      </nav>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Kolom Kiri / Tengah: Foto & Deskripsi Lengkap (2 Kolom) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Foto Utama */}
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-2xs">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={item.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-300">
                <Camera className="h-12 w-12 stroke-[1.5]" />
                <span className="text-xs font-medium text-slate-400">
                  Tidak ada foto dokumentasi
                </span>
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <ItemStatusBadge status={item.status} type={item.type} showType />
            </div>
          </div>

          {/* Galeri foto tambahan jika ada */}
          {item.images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {item.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative aspect-4/3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <Image
                    src={img.url}
                    alt={`Foto detail ${idx + 1}`}
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Judul & Meta Singkat */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                <Tag className="h-3.5 w-3.5" />
                {item.category.name}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Kode: <strong>{item.trackingCode}</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {item.title}
            </h1>

            {/* Deskripsi Lengkap */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Deskripsi & Ciri-Ciri
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>
          </div>

          {/* Jika Sudah Dikembalikan: Banner Serah Terima */}
          {item.status === "RETURNED" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Barang Sudah Diserahkan Kembali</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-950">
                <div>
                  <span className="text-emerald-700 block text-[11px]">Diterima oleh:</span>
                  <span className="font-semibold">{item.handoverReceiver || "Pemilik Sah"}</span>
                </div>
                <div>
                  <span className="text-emerald-700 block text-[11px]">Tanggal Serah Terima:</span>
                  <span className="font-semibold">
                    {item.handoverDate ? formatDateIndonesian(item.handoverDate, true) : "-"}
                  </span>
                </div>
              </div>
              {item.adminNotes && (
                <p className="text-xs text-emerald-800 italic bg-white/60 p-2.5 rounded-lg border border-emerald-100">
                  &ldquo;{item.adminNotes}&rdquo;
                </p>
              )}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Rincian Lokasi, Waktu, Pelapor & Aksi Klaim (1 Kolom) */}
        <div className="space-y-5">
          {/* Card Aksi Klaim */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Tindakan untuk Barang Ini
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Jika ini barang milik Anda atau Anda memiliki informasi relevan,
              silakan hubungi atau ajukan verifikasi klaim.
            </p>

            <ItemDetailActions
              itemId={item.id}
              itemTitle={item.title}
              status={item.status}
              type={item.type}
            />
          </div>

          {/* Card Informasi Lokasi & Waktu */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2.5">
              Informasi Kejadian
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-[11px]">Lokasi</span>
                  <span className="font-semibold text-slate-800">
                    {item.location.name}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-[11px]">
                    Tanggal Kejadian
                  </span>
                  <span className="font-semibold text-slate-800">
                    {formatDateIndonesian(item.dateOccurred, true)}
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    ({formatRelativeTime(item.dateOccurred)})
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 text-[11px]">
                    Waktu Laporan Dibuat
                  </span>
                  <span className="font-semibold text-slate-800">
                    {formatDateIndonesian(item.createdAt, true)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Informasi Pelapor (Kontak Disembunyikan) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2.5">
              Identitas Pelapor
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-slate-800">
                  {item.reporterName}
                </span>
                {item.reporterClass && (
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 font-medium">
                    {item.reporterClass}
                  </span>
                )}
              </div>

              {/* Secure contact notice */}
              <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 border border-slate-100">
                <Lock className="h-3.5 w-3.5 text-sky-600 shrink-0 mt-0.5" />
                <span>
                  Nomor kontak pelapor dirahasiakan untuk mencegah spam. Verifikasi dan koordinasi serah terima dilakukan lewat petugas sekolah.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

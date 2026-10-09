import { prisma } from "@/lib/prisma";
import { AdminClaimsManager } from "@/components/admin/AdminClaimsManager";
import { ShieldCheck } from "lucide-react";

export default async function AdminKlaimPage() {
  const claims = await prisma.claim.findMany({
    include: {
      item: {
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          trackingCode: true,
          location: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
          <ShieldCheck className="h-4 w-4" />
          <span>Verifikasi Kepemilikan</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Daftar Pengajuan Klaim Barang
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Periksa kecocokan bukti yang diajukan oleh pemilik barang, hubungi nomor kontak yang tertera, dan sahkan serah terima.
        </p>
      </div>

      <AdminClaimsManager initialClaims={claims} />
    </div>
  );
}

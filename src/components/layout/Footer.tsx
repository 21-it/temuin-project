import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck, Heart } from "lucide-react";

interface FooterProps {
  schoolName: string;
  tagline?: string | null;
  contactEmail: string;
  contactPhone: string;
  address?: string | null;
}

export function Footer({
  schoolName,
  tagline,
  contactEmail,
  contactPhone,
  address,
}: FooterProps) {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Info Sekolah */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs">
                T
              </div>
              <span className="font-bold text-slate-900 text-base">
                Temuin — {schoolName}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              {tagline ||
                "Portal pencatatan dan pencarian barang hilang atau ditemukan untuk seluruh warga sekolah. Jujur, tertib, dan transparan."}
            </p>
            {address && (
              <p className="flex items-start gap-2 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                <span>{address}</span>
              </p>
            )}
          </div>

          {/* Kontak Bantuan */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Pos Pelayanan / Bantuan
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{contactPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate">{contactEmail}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Ruang Tata Usaha / Keamanan</span>
              </li>
            </ul>
          </div>

          {/* Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Tautan Cepat
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link href="/barang?type=LOST" className="hover:text-slate-900">
                  Daftar Barang Hilang
                </Link>
              </li>
              <li>
                <Link href="/barang?type=FOUND" className="hover:text-slate-900">
                  Daftar Barang Ditemukan
                </Link>
              </li>
              <li>
                <Link href="/lapor" className="hover:text-slate-900">
                  Formulir Laporan
                </Link>
              </li>
              <li>
                <Link href="/lacak" className="hover:text-slate-900">
                  Lacak Kode Laporan
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-slate-900">
                  Login Administrator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} {schoolName}. Hak cipta dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibangun dengan rasa peduli & integritas kampus
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}

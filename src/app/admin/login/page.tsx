"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, AlertCircle, Loader2, ArrowLeft, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau kata sandi tidak cocok. Periksa kembali data Anda.");
        setLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan saat masuk. Silakan coba lagi.");
      setLoading(false);
    }
  }

  function handleFillDemo(demoEmail: string, demoPass: string) {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xs">
            <Shield className="h-6 w-6 text-sky-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Portal Petugas & Admin
          </h1>
          <p className="text-xs text-slate-500">
            Masuk untuk memverifikasi laporan barang, meninjau klaim, dan mengelola data sekolah.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Email Petugas
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sekolah.sch.id"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-60 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
                  <span>Memverifikasi akun...</span>
                </>
              ) : (
                <span>Masuk ke Dashboard</span>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials for Testing */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 text-[11px] uppercase tracking-wider">
              <KeyRound className="h-3.5 w-3.5 text-sky-600" />
              <span>Akun Uji Coba Tersedia (Klik untuk isi cepat):</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleFillDemo("admin@sekolah.sch.id", "admin123")}
                className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 border border-slate-200 text-left hover:border-sky-400 transition-colors"
              >
                <span className="font-medium text-slate-700 text-[11px]">
                  Administrator: <code>admin@sekolah.sch.id</code>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">admin123</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("petugas@sekolah.sch.id", "petugas123")}
                className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 border border-slate-200 text-left hover:border-sky-400 transition-colors"
              >
                <span className="font-medium text-slate-700 text-[11px]">
                  Staf / Satpam: <code>petugas@sekolah.sch.id</code>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">petugas123</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back to public link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Halaman Publik</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

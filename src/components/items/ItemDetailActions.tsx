"use client";

import { useState } from "react";
import { ClaimModal } from "./ClaimModal";
import { ShieldCheck, Share2, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ItemDetailActionsProps {
  itemId: string;
  itemTitle: string;
  status: string;
  type: string;
}

export function ItemDetailActions({
  itemId,
  itemTitle,
  status,
  type,
}: ItemDetailActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const isReturned = status === "RETURNED";

  return (
    <div className="flex flex-col gap-3">
      {/* Tombol Klaim (hanya untuk barang temuan atau barang hilang yang belum diserahkan) */}
      {!isReturned ? (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-sky-700 transition-colors"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>
            {type === "FOUND"
              ? "Ini Barang Saya (Ajukan Klaim)"
              : "Saya Menemukan Barang Ini"}
          </span>
        </button>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-center text-xs text-slate-500">
          Barang ini telah berhasil diserahkan kepada pemilik resminya.
        </div>
      )}

      {/* Action helpers */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>Tautan Disalin</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Bagikan Tautan</span>
            </>
          )}
        </button>

        <Link
          href="/barang"
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        itemId={itemId}
        itemTitle={itemTitle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

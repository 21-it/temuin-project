"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function ImageUploader({
  value = [],
  onChange,
  maxFiles = 3,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (value.length + files.length > maxFiles) {
      setError(`Maksimal hanya dapat mengunggah ${maxFiles} foto.`);
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validasi lokal
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("Format berkas harus JPG, PNG, atau WebP.");
        setUploading(false);
        return;
      }

      if (file.size > 3 * 1024 * 1024) {
        setError(`Ukuran berkas "${file.name}" melebihi batas 3 MB.`);
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          setError(data.error || "Gagal mengunggah foto.");
          break;
        }

        newUrls.push(data.url);
      } catch (err) {
        console.error("Upload error:", err);
        setError("Terjadi kendala jaringan saat mengunggah foto.");
        break;
      }
    }

    if (newUrls.length > 0) {
      onChange([...value, ...newUrls]);
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemove(index: number) {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      {/* Upload button area */}
      {value.length < maxFiles && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center transition-colors hover:border-sky-500 hover:bg-sky-50/30"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
              <span className="text-xs font-medium">Mengunggah foto...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-slate-500">
              <div className="rounded-full bg-white p-2 shadow-2xs border border-slate-200">
                <UploadCloud className="h-5 w-5 text-slate-600" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-sky-700">Pilih foto</span> atau tarik berkas ke sini
              </div>
              <p className="text-[11px] text-slate-400">
                JPG, PNG, atau WebP (Maks. 3 MB per foto, hingga {maxFiles} foto)
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Thumbnails preview */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5">
          {value.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-4/3 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              <Image
                src={url}
                alt={`Foto dokumentasi ${idx + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute right-1.5 top-1.5 rounded-full bg-slate-900/70 p-1 text-white opacity-90 transition-opacity hover:bg-slate-900"
                aria-label="Hapus foto"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTrackingCode(type: "LOST" | "FOUND"): string {
  const year = new Date().getFullYear();
  const prefix = type === "LOST" ? "L" : "F";
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TMN-${year}-${prefix}${randomChars}`;
}

export function formatDateIndonesian(
  dateInput: string | Date,
  includeTime = false
): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    weekday: includeTime ? "short" : undefined,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: includeTime ? "2-digit" : undefined,
    minute: includeTime ? "2-digit" : undefined,
  }).format(date);
}

export function formatRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "-";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay === 1) return "Kemarin";
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return formatDateIndonesian(date);
}

export function getItemTypeBadge(type: string) {
  if (type === "LOST") {
    return {
      label: "Barang Hilang",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
      dotClass: "bg-amber-500",
    };
  }
  return {
    label: "Barang Temuan",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
  };
}

export function getItemStatusBadge(status: string, type?: string) {
  switch (status) {
    case "PENDING":
      return {
        label: "Menunggu Verifikasi",
        badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
        dotClass: "bg-sky-500",
      };
    case "ACTIVE":
      if (type === "LOST") {
        return {
          label: "Masih Dicari",
          badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
          dotClass: "bg-amber-500",
        };
      }
      return {
        label: "Tersedia / Ditemukan",
        badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
        dotClass: "bg-emerald-500",
      };
    case "CLAIMED":
      return {
        label: "Sedang Diklaim",
        badgeClass: "bg-indigo-50 text-indigo-800 border-indigo-200",
        dotClass: "bg-indigo-500",
      };
    case "RETURNED":
      return {
        label: "Sudah Dikembalikan",
        badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-300",
        dotClass: "bg-neutral-500",
      };
    case "REJECTED":
      return {
        label: "Ditolak / Batal",
        badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
        dotClass: "bg-rose-500",
      };
    default:
      return {
        label: status,
        badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-300",
        dotClass: "bg-neutral-400",
      };
  }
}

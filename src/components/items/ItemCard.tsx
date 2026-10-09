import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Camera, Tag } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { ItemStatusBadge } from "./ItemStatusBadge";

export interface ItemCardData {
  id: string;
  type: string;
  title: string;
  description: string;
  dateOccurred: Date | string;
  status: string;
  trackingCode: string;
  category: { id: string; name: string };
  location: { id: string; name: string };
  images: { id: string; url: string }[];
}

export function ItemCard({ item }: { item: ItemCardData }) {
  const primaryImage = item.images && item.images.length > 0 ? item.images[0].url : null;

  return (
    <Link
      href={`/barang/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
    >
      {/* Thumbnail */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-50 border-b border-slate-100">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-103"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-300">
            <Camera className="h-8 w-8 stroke-[1.5]" />
            <span className="text-[11px] font-medium text-slate-400">Tanpa Foto</span>
          </div>
        )}

        {/* Floating badge for Item Type & Status */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1 pointer-events-none">
          <ItemStatusBadge status={item.status} type={item.type} showType />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category & Date */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
          <span className="flex items-center gap-1 font-medium text-slate-600 truncate">
            <Tag className="h-3 w-3 text-slate-400 shrink-0" />
            {item.category.name}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
            <Calendar className="h-3 w-3" />
            {formatRelativeTime(item.dateOccurred)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-sm line-clamp-1 group-hover:text-sky-600 transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Location & Code Footer */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 truncate max-w-[65%]">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location.name}</span>
          </span>
          <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
            {item.trackingCode}
          </span>
        </div>
      </div>
    </Link>
  );
}

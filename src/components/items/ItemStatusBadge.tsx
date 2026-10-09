import { getItemStatusBadge, getItemTypeBadge } from "@/lib/utils";

interface ItemStatusBadgeProps {
  status: string;
  type?: string;
  showType?: boolean;
}

export function ItemStatusBadge({
  status,
  type,
  showType = false,
}: ItemStatusBadgeProps) {
  const statusInfo = getItemStatusBadge(status, type);
  const typeInfo = type ? getItemTypeBadge(type) : null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {showType && typeInfo && (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${typeInfo.badgeClass}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${typeInfo.dotClass}`} />
          {typeInfo.label}
        </span>
      )}
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${statusInfo.badgeClass}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotClass}`} />
        {statusInfo.label}
      </span>
    </div>
  );
}

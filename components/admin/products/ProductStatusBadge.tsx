import type { ProductStatus } from "@/types"
import { cn } from "@/lib/utils"

interface ProductStatusBadgeProps {
  status: ProductStatus
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 text-xs font-medium",
        status === "active"
          ? "bg-[#22ff991f] text-[#46fea5d4]"
          : "border border-[#d9edff40] text-[#f1f7feb5]"
      )}
    >
      {status === "active" ? "Active" : "Archived"}
    </span>
  )
}

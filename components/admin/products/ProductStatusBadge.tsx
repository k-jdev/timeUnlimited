import type { ProductStatus } from "@/types"
import { cn } from "@/lib/utils"

interface ProductStatusBadgeProps {
  status: ProductStatus
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium",
        status === "active"
          ? "bg-[#30a46c]/15 text-[#30a46c]"
          : "bg-[#8b8d98]/15 text-[#8b8d98]"
      )}
    >
      {status === "active" ? "Active" : "Archived"}
    </span>
  )
}

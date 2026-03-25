import type { RequestType } from "@/types"
import { cn } from "@/lib/utils"

interface RequestTypeBadgeProps {
  type: RequestType
}

export function RequestTypeBadge({ type }: RequestTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium tracking-wide",
        type === "specific"
          ? "bg-[#0090ff]/10 text-[#5eb1ef]"
          : "bg-[#8E00F1]/10 text-[#bf7af0]"
      )}
    >
      {type === "specific" ? "Specific" : "Assisted"}
    </span>
  )
}

import { RiFilterLine } from "@remixicon/react"
import { cn } from "@/lib/utils"
import type { RequestTab } from "@/hooks/useRequests"

const TABS: { value: RequestTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "specific", label: "Specific" },
  { value: "assisted", label: "Assisted" },
]

interface RequestsToolbarProps {
  activeTab: RequestTab
  onTabChange: (tab: RequestTab) => void
  onOpenFilter: () => void
}

export function RequestsToolbar({
  activeTab,
  onTabChange,
  onOpenFilter,
}: RequestsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "h-10 px-4 text-[16px] font-medium transition-colors duration-200",
              activeTab === tab.value
                ? "bg-[#191c1e] text-[#edeef0]"
                : "bg-[#111213] text-[#8b8d98] hover:bg-white/8 hover:text-[#edeef0]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenFilter}
        className="flex size-10 items-center justify-center bg-[#191c1e] text-[#8b8d98] transition-colors hover:text-[#edeef0]"
        aria-label="Open filters"
      >
        <RiFilterLine className="size-4.5" />
      </button>
    </div>
  )
}

import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ITEMS_PER_PAGE_OPTIONS = ["15", "30", "50"]

interface ProductsPaginationProps {
  totalItems: number
  currentPage: number
  totalPages: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (count: number) => void
}

export function ProductsPagination({
  totalItems,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: ProductsPaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-[#2e3135] py-4">
      <span className="text-sm text-[#8b8d98]">
        All products: <span className="text-[#edeef0]">{totalItems}</span>
      </span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1 text-[#8b8d98] transition-colors duration-200 hover:text-[#edeef0] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous page"
        >
          <RiArrowLeftSLine className="size-4" />
        </button>
        <span className="text-sm text-[#edeef0]">{currentPage}</span>
        <span className="text-sm text-[#8b8d98]">From {totalPages}</span>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1 text-[#8b8d98] transition-colors duration-200 hover:text-[#edeef0] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next page"
        >
          <RiArrowRightSLine className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-[#8b8d98]">In this page</span>
        <Select
          value={String(itemsPerPage)}
          onValueChange={(v) => onItemsPerPageChange(Number(v))}
        >
          <SelectTrigger className="h-8 w-16 rounded-none border-[#2e3135] bg-transparent text-sm text-[#edeef0] focus-visible:ring-[#5eb1ef]/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

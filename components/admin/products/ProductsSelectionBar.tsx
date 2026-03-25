"use client"

import { RiDeleteBin6Line, RiCloseLine } from "@remixicon/react"

interface ProductsSelectionBarProps {
  selectedCount: number
  onDelete: () => void
  onClear: () => void
}

export function ProductsSelectionBar({
  selectedCount,
  onDelete,
  onClear,
}: ProductsSelectionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-[#2e3135] bg-[#111213] shadow-[0px_10px_18px_0px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-6 py-3 pr-3 pl-6">
        <p className="shrink-0 text-sm text-[#8b8d98]">
          Selected:{" "}
          <span className="text-[rgba(252,253,255,0.94)]">
            {selectedCount} {selectedCount === 1 ? "product" : "products"}
          </span>
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onDelete}
            className="flex h-8 items-center gap-2 bg-[#e5484d] px-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#e5484d]/85"
          >
            <RiDeleteBin6Line className="size-4" />
            Delete
          </button>
          <button
            type="button"
            onClick={onClear}
            className="flex size-8 items-center justify-center text-[#b0b4ba] transition-colors duration-200 hover:text-[#edeef0]"
            aria-label="Clear selection"
          >
            <RiCloseLine className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

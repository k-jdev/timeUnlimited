"use client"

import { useRef, useState } from "react"
import { RiDeleteBinLine, RiSearchLine } from "@remixicon/react"
import { cn } from "@/lib/utils"
import type { ProductTab } from "@/hooks/useProducts"

const TABS: { value: ProductTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
]

interface ProductsToolbarProps {
  activeTab: ProductTab
  onTabChange: (tab: ProductTab) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCount: number
  onDeleteSelected: () => void
}

export function ProductsToolbar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  selectedCount,
  onDeleteSelected,
}: ProductsToolbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function openSearch() {
    setIsSearchOpen(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function handleSearchBlur() {
    if (!searchQuery) {
      setIsSearchOpen(false)
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-[#2e3135]">
      <div className="flex items-center gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "px-4 py-3 text-sm transition-colors duration-200",
              activeTab === tab.value
                ? "border-b-2 border-[#edeef0] text-[#edeef0]"
                : "border-b-2 border-transparent text-[#8b8d98] hover:text-[#edeef0]"
            )}
          >
            {tab.label}
          </button>
        ))}

        {selectedCount > 0 && (
          <div className="ml-4 flex items-center gap-3">
            <span className="text-sm text-[#8b8d98]">
              {selectedCount} selected
            </span>
            <button
              type="button"
              onClick={onDeleteSelected}
              className="flex items-center gap-1.5 text-sm text-[#e54d4d] transition-colors duration-200 hover:text-[#ff6b6b]"
            >
              <RiDeleteBinLine className="size-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center pb-1">
        {isSearchOpen ? (
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onBlur={handleSearchBlur}
            placeholder="Search by model, brand..."
            className="w-48 border-b border-[#2e3135] bg-transparent py-1 text-sm text-[#edeef0] outline-none placeholder:text-[#8b8d98] focus:border-[#5eb1ef]"
          />
        ) : (
          <button
            type="button"
            onClick={openSearch}
            className="p-1 text-[#8b8d98] transition-colors duration-200 hover:text-[#edeef0]"
            aria-label="Search"
          >
            <RiSearchLine className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}

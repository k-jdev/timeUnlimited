"use client"

import { useRef, useState } from "react"
import { RiSearchLine } from "@remixicon/react"
import { cn } from "@/lib/utils"
import type { ProductTab } from "@/hooks/useProducts"

const TABS: { value: ProductTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
  { value: "featured", label: "Featured" },
]

interface ProductsToolbarProps {
  activeTab: ProductTab
  onTabChange: (tab: ProductTab) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ProductsToolbar({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
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
    <div className="flex flex-col gap-2 border-b border-[#2e3135] pb-2 sm:pb-0">
      {/* Mobile: search on top */}
      <div className="sm:hidden">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by model, brand..."
          className="w-full border-b border-[#edeef0] bg-transparent py-2 text-sm text-[#edeef0] outline-none placeholder:text-[#8b8d98] focus:border-white"
        />
      </div>

      <div className="flex items-center justify-between sm:border-b-0">
        <div className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "h-10 px-4 text-base font-medium transition-colors duration-200",
                activeTab === tab.value
                  ? "bg-[#191c1e] text-[#edeef0]"
                  : "bg-[#111213] text-[#b0b4ba] hover:text-[#edeef0]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Desktop: search icon/input on right */}
        <div className="hidden items-center sm:flex">
          {isSearchOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onBlur={handleSearchBlur}
              placeholder="Search by model, brand..."
              className="w-48 border-b border-[#edeef0] bg-transparent py-1 text-sm text-[#edeef0] outline-none placeholder:text-[#8b8d98] focus:border-white"
            />
          ) : (
            <button
              type="button"
              onClick={openSearch}
              className="flex size-10 items-center justify-center text-[#b0b4ba] transition-colors duration-200 hover:text-[#edeef0]"
              aria-label="Search"
            >
              <RiSearchLine className="size-4.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

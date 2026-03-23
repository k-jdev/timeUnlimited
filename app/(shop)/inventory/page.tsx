"use client"

import { useState, useMemo } from "react"
import { RiSearchLine, RiArrowDownSLine, RiFilterLine } from "@remixicon/react"
import { INVENTORY_WATCHES, BRANDS } from "@/data/inventory"
import { InventoryFilterSidebar } from "@/components/inventory/InventoryFilterSidebar"
import { InventoryWatchCard } from "@/components/inventory/InventoryWatchCard"
import { CtaSection } from "@/components/home/CtaSection"
import { Footer } from "@/components/layout/Footer"

type SortOrder = "new-to-old" | "old-to-new" | "price-high" | "price-low"

export default function InventoryPage() {
  const [search, setSearch] = useState("")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<SortOrder>("new-to-old")
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const activeBrandChips = useMemo(() => {
    if (selectedBrands.length === 0) return []
    return BRANDS.filter((b) =>
      selectedBrands.some((sb) => sb.toLowerCase() === b.toLowerCase())
    )
  }, [selectedBrands])

  const filteredWatches = useMemo(() => {
    let result = [...INVENTORY_WATCHES]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (w) =>
          w.brand.toLowerCase().includes(q) ||
          w.name.toLowerCase().includes(q) ||
          w.ref.toLowerCase().includes(q)
      )
    }

    if (selectedBrands.length > 0) {
      result = result.filter((w) =>
        selectedBrands.some((b) => b.toLowerCase() === w.brand.toLowerCase())
      )
    }

    if (selectedConditions.length > 0) {
      result = result.filter((w) => selectedConditions.includes(w.condition))
    }

    switch (sortOrder) {
      case "new-to-old":
        result.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        )
        break
      case "old-to-new":
        result.sort(
          (a, b) =>
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        )
        break
      case "price-high":
        result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
        break
      case "price-low":
        result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
        break
    }

    return result
  }, [search, selectedBrands, selectedConditions, sortOrder])

  const sortLabels: Record<SortOrder, string> = {
    "new-to-old": "New to Old",
    "old-to-new": "Old to New",
    "price-high": "Price: High to Low",
    "price-low": "Price: Low to High",
  }

  return (
    <div className="min-h-screen bg-[#020208]">
      <InventoryFilterSidebar
        selectedBrands={selectedBrands}
        onBrandsChange={setSelectedBrands}
        selectedConditions={selectedConditions}
        onConditionsChange={setSelectedConditions}
        mobileOpen={showMobileFilter}
        onMobileClose={() => setShowMobileFilter(false)}
      />

      <div className="lg:pr-[320px]">
        <div className="flex flex-col gap-8 px-4 pt-10 pb-4 lg:px-10 lg:pt-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-3">
              <h1 className="font-serif text-[48px] leading-none text-[#edeef0] lg:text-[64px] lg:leading-[66px]">
                Inventory
              </h1>
              <span className="mt-1 text-[16px] leading-6 text-[#edeef0] underline">
                {filteredWatches.length}
              </span>
            </div>
            <p className="max-w-[504px] text-[16px] leading-6 font-light text-[#60646c]">
              Pieces come and go quickly. If something catches your eye, move on
              it — and if it&apos;s not here, we&apos;ll find it.
            </p>
          </div>

          <div className="flex h-10 items-center gap-3 bg-[rgba(255,255,255,0.06)] px-4">
            <RiSearchLine className="size-[18px] text-[#edeef0]" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[16px] leading-6 text-[#edeef0] placeholder:text-[#edeef0]/50 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="scrollbar-none flex flex-1 gap-1 overflow-x-auto">
              {BRANDS.map((brand) => {
                const isActive = activeBrandChips.includes(brand)
                return (
                  <button
                    key={brand}
                    onClick={() =>
                      setSelectedBrands(
                        isActive
                          ? selectedBrands.filter(
                              (b) => b.toLowerCase() !== brand.toLowerCase()
                            )
                          : [...selectedBrands, brand]
                      )
                    }
                    className={`flex h-10 shrink-0 items-center justify-center px-4 text-[16px] leading-6 font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-[rgba(0,144,255,0.18)] text-[#70b8ff]"
                        : "bg-[rgba(255,255,255,0.06)] text-[#60646c] hover:text-[#edeef0]"
                    }`}
                  >
                    {brand}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setShowMobileFilter(true)}
              className="flex h-10 shrink-0 items-center gap-2 bg-[rgba(255,255,255,0.06)] px-4 lg:hidden"
            >
              <RiFilterLine className="size-4 text-[#edeef0]" />
              <span className="text-[14px] text-[#edeef0]">Filter</span>
            </button>

            <div className="relative hidden shrink-0 lg:block">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex h-10 items-center gap-3 bg-[rgba(255,255,255,0.06)] px-4 whitespace-nowrap"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[16px] leading-6 text-[#edeef0]">
                    {sortOrder.startsWith("price") ? "Price:" : "Date:"}
                  </span>
                  <span className="text-[16px] leading-6 text-[#80838d]">
                    {sortOrder === "new-to-old"
                      ? "New to Old"
                      : sortOrder === "old-to-new"
                        ? "Old to New"
                        : sortOrder === "price-high"
                          ? "High to Low"
                          : "Low to High"}
                  </span>
                </div>
                <RiArrowDownSLine className="size-4 shrink-0 text-[#edeef0]" />
              </button>
              {showSortDropdown && (
                <div className="absolute top-full right-0 z-10 mt-1 flex min-w-full flex-col border border-[#2E3135] bg-[#111113] whitespace-nowrap shadow-lg">
                  {(Object.keys(sortLabels) as SortOrder[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSortOrder(key)
                        setShowSortDropdown(false)
                      }}
                      className={`px-4 py-2 text-left text-[14px] leading-5 hover:bg-[rgba(255,255,255,0.06)] ${
                        sortOrder === key ? "text-[#70b8ff]" : "text-[#edeef0]"
                      }`}
                    >
                      {sortLabels[key]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 xl:grid-cols-3">
          {filteredWatches.map((watch) => (
            <InventoryWatchCard key={watch.id} watch={watch} />
          ))}
        </div>
        <CtaSection />

        <Footer />
      </div>
    </div>
  )
}

function parsePrice(price: string): number {
  return Number(price.replace(/[^0-9]/g, ""))
}

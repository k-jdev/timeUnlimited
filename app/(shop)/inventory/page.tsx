"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import {
  RiSearchLine,
  RiArrowDownSLine,
  RiFilterLine,
  RiCheckLine,
} from "@remixicon/react"
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
  const [selectedCaseMaterials, setSelectedCaseMaterials] = useState<string[]>(
    []
  )
  const [selectedBraceletMaterials, setSelectedBraceletMaterials] = useState<
    string[]
  >([])
  const [selectedDialColors, setSelectedDialColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedSpecials, setSelectedSpecials] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000])
  const [sortOrder, setSortOrder] = useState<SortOrder>("new-to-old")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const sortDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showSortDropdown) return
    const handleClick = (e: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      ) {
        setShowSortDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showSortDropdown])

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

    if (selectedCaseMaterials.length > 0) {
      result = result.filter((w) =>
        selectedCaseMaterials.includes(w.caseMaterial)
      )
    }

    if (selectedBraceletMaterials.length > 0) {
      result = result.filter((w) =>
        selectedBraceletMaterials.includes(w.braceletMaterial)
      )
    }

    if (selectedDialColors.length > 0) {
      result = result.filter((w) =>
        selectedDialColors.some(
          (c) => c.toLowerCase() === w.dialColor.toLowerCase()
        )
      )
    }

    if (selectedSizes.length > 0) {
      result = result.filter((w) => selectedSizes.includes(w.size))
    }

    if (priceRange[0] > 0 || priceRange[1] < 200000) {
      result = result.filter((w) => {
        const p = parsePrice(w.price)
        return (
          p >= priceRange[0] && (priceRange[1] >= 200000 || p <= priceRange[1])
        )
      })
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
  }, [
    search,
    selectedBrands,
    selectedConditions,
    selectedCaseMaterials,
    selectedBraceletMaterials,
    selectedDialColors,
    selectedSizes,
    priceRange,
    sortOrder,
  ])

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
        selectedCaseMaterials={selectedCaseMaterials}
        onCaseMaterialsChange={setSelectedCaseMaterials}
        selectedBraceletMaterials={selectedBraceletMaterials}
        onBraceletMaterialsChange={setSelectedBraceletMaterials}
        selectedDialColors={selectedDialColors}
        onDialColorsChange={setSelectedDialColors}
        selectedSizes={selectedSizes}
        onSizesChange={setSelectedSizes}
        selectedSpecials={selectedSpecials}
        onSpecialsChange={setSelectedSpecials}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        mobileOpen={showMobileFilter}
        onMobileClose={() => setShowMobileFilter(false)}
      />

      <div className="lg:pr-[320px]">
        <div className="lg:mx-auto lg:max-w-[1400px]">
          <div className="flex flex-col gap-8 px-4 pt-10 pb-8 lg:pt-16">
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
                Pieces come and go quickly. If something catches your eye, move
                on it — and if it&apos;s not here, we&apos;ll find it.
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

              <div
                ref={sortDropdownRef}
                className="relative hidden shrink-0 lg:block"
              >
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex h-10 items-center gap-2 bg-[rgba(255,255,255,0.06)] px-4 whitespace-nowrap transition-colors hover:bg-[rgba(255,255,255,0.09)]"
                >
                  <span className="text-[13px] tracking-widest text-[#60646c] uppercase">
                    Sort
                  </span>
                  <span className="text-[13px] text-[#80838d]">/</span>
                  <span className="text-[13px] text-[#edeef0]">
                    {sortLabels[sortOrder]}
                  </span>
                  <RiArrowDownSLine
                    className={`size-4 shrink-0 text-[#60646c] transition-transform duration-200 ${showSortDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showSortDropdown && (
                  <div className="absolute top-full right-0 z-20 mt-1.5 flex min-w-[200px] flex-col border border-[#1e2024] bg-[#0e0f14] shadow-2xl">
                    <div className="border-b border-[#1e2024] px-4 py-2.5">
                      <span className="text-[11px] tracking-widest text-[#40444c] uppercase">
                        Sort by
                      </span>
                    </div>
                    <div className="py-1">
                      <div className="px-4 pt-2 pb-1">
                        <span className="text-[10px] tracking-widest text-[#30343c] uppercase">
                          Date Added
                        </span>
                      </div>
                      {(["new-to-old", "old-to-new"] as SortOrder[]).map(
                        (key) => (
                          <button
                            key={key}
                            onClick={() => {
                              setSortOrder(key)
                              setShowSortDropdown(false)
                            }}
                            className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-[rgba(255,255,255,0.04)]"
                          >
                            <span
                              className={`text-[13px] ${sortOrder === key ? "text-[#edeef0]" : "text-[#60646c]"}`}
                            >
                              {sortLabels[key]}
                            </span>
                            {sortOrder === key && (
                              <RiCheckLine className="size-3.5 text-[#70b8ff]" />
                            )}
                          </button>
                        )
                      )}
                    </div>
                    <div className="border-t border-[#1e2024] py-1">
                      <div className="px-4 pt-2 pb-1">
                        <span className="text-[10px] tracking-widest text-[#30343c] uppercase">
                          Price
                        </span>
                      </div>
                      {(["price-high", "price-low"] as SortOrder[]).map(
                        (key) => (
                          <button
                            key={key}
                            onClick={() => {
                              setSortOrder(key)
                              setShowSortDropdown(false)
                            }}
                            className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-[rgba(255,255,255,0.04)]"
                          >
                            <span
                              className={`text-[13px] ${sortOrder === key ? "text-[#edeef0]" : "text-[#60646c]"}`}
                            >
                              {sortLabels[key]}
                            </span>
                            {sortOrder === key && (
                              <RiCheckLine className="size-3.5 text-[#70b8ff]" />
                            )}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="grid gap-1 lg:pr-0"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {filteredWatches.map((watch) => (
              <InventoryWatchCard key={watch.id} watch={watch} />
            ))}
          </div>
        </div>
        <div className="pb-16 lg:pb-32" />
        <CtaSection />

        <Footer />
      </div>
    </div>
  )
}

function parsePrice(price: string): number {
  return Number(price.replace(/[^0-9]/g, ""))
}

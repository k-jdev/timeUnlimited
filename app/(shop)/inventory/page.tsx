"use client"

import Link from "next/link"
import { useState, useMemo, useEffect, useRef } from "react"
import {
  RiSearchLine,
  RiArrowDownSLine,
  RiFilterLine,
  RiCheckLine,
} from "@remixicon/react"
import { BRANDS } from "@/data/inventory"
import type { InventoryWatch } from "@/data/inventory"
import { mapProductToWatch } from "@/lib/mapProduct"
import {
  InventoryFilterSidebar,
  FilterState,
  DEFAULT_FILTERS,
} from "@/components/inventory/InventoryFilterSidebar"
import { InventoryWatchCard } from "@/components/inventory/InventoryWatchCard"
import { Skeleton } from "@/components/ui/skeleton"
import { CtaSection } from "@/components/home/CtaSection"
import { Footer } from "@/components/layout/Footer"
import { BrandLogo } from "@/components/layout/BrandLogo"
import { RequestWatchModal } from "@/components/home/RequestWatchModal"
import { SellWatchModal } from "@/components/home/SellWatchModal"

type SortOrder = "new-to-old" | "old-to-new" | "price-high" | "price-low"

export default function InventoryPage() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const handleFiltersChange = (key: keyof FilterState, items: string[]) =>
    setFilters((prev) => ({ ...prev, [key]: items }))
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
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)

  const [watches, setWatches] = useState<InventoryWatch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchWatches() {
      try {
        const res = await fetch("/api/inventary")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setWatches(data.products.map(mapProductToWatch))
      } catch (err) {
        console.error("Error fetching inventory:", err)
      }
      setIsLoading(false)
    }
    fetchWatches()
  }, [])

  const activeBrandChips = useMemo(() => {
    if (filters.brands.length === 0) return []
    return BRANDS.filter((b) =>
      filters.brands.some((sb) => sb.toLowerCase() === b.toLowerCase())
    )
  }, [filters.brands])

  const filteredWatches = useMemo(() => {
    let result = [...watches]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (w) =>
          w.brand.toLowerCase().includes(q) ||
          w.name.toLowerCase().includes(q) ||
          w.ref.toLowerCase().includes(q)
      )
    }

    if (filters.brands.length > 0) {
      result = result.filter((w) =>
        filters.brands.some((b) => b.toLowerCase() === w.brand.toLowerCase())
      )
    }

    if (filters.caseMaterials.length > 0) {
      result = result.filter((w) =>
        filters.caseMaterials.includes(w.caseMaterial)
      )
    }

    if (filters.braceletMaterials.length > 0) {
      result = result.filter((w) =>
        filters.braceletMaterials.includes(w.braceletMaterial)
      )
    }

    if (filters.dialColors.length > 0) {
      result = result.filter((w) =>
        filters.dialColors.some(
          (c) => c.toLowerCase() === w.dialColor.toLowerCase()
        )
      )
    }

    if (filters.sizes.length > 0) {
      result = result.filter((w) => filters.sizes.includes(w.size))
    }

    if (priceRange[0] > 0 || priceRange[1] < 200000) {
      result = result.filter((w) => {
        const p = parsePrice(w.price)
        return (
          p >= priceRange[0] && (priceRange[1] >= 200000 || p <= priceRange[1])
        )
      })
    }

    if (filters.conditions.length > 0) {
      result = result.filter((w) => filters.conditions.includes(w.condition))
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
  }, [watches, search, filters, priceRange, sortOrder])

  const sortLabels: Record<SortOrder, string> = {
    "new-to-old": "New to Old",
    "old-to-new": "Old to New",
    "price-high": "Price: High to Low",
    "price-low": "Price: Low to High",
  }

  return (
    <div className="min-h-screen bg-[#020208]">
      <InventoryFilterSidebar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        mobileOpen={showMobileFilter}
        onMobileClose={() => setShowMobileFilter(false)}
        onRequestWatch={() => setIsRequestModalOpen(true)}
        onSellWatch={() => setIsSellModalOpen(true)}
      />

      <div className="lg:pr-[320px]">
        <div className="lg:mx-auto lg:max-w-[1400px]">
          <div className="px-4 pt-8 pb-2 lg:pt-10">
            <Link href="/">
              <BrandLogo />
            </Link>
          </div>
          <div className="flex flex-col gap-8 px-4 pt-10 pb-8 lg:pt-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
              <div className="flex items-start gap-3">
                <h1 className="font-serif text-[48px] leading-none text-[#edeef0] lg:text-[64px] lg:leading-[66px]">
                  Inventory
                </h1>
                <span className="mt-1 text-[16px] leading-6 text-[#edeef0] underline">
                  {filteredWatches.length}
                </span>
              </div>
              <p className="max-w-[504px] text-[16px] font-light text-[#B0B4BA]">
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
                        handleFiltersChange(
                          "brands",
                          isActive
                            ? filters.brands.filter(
                                (b) => b.toLowerCase() !== brand.toLowerCase()
                              )
                            : [...filters.brands, brand]
                        )
                      }
                      className={`flex h-10 shrink-0 items-center justify-center px-4 text-[16px] leading-6 font-medium whitespace-nowrap transition-colors ${
                        isActive
                          ? "bg-[#002a55] text-[#C2E6FF]"
                          : "bg-[#111213] text-[#B0B4BA] hover:text-[#edeef0]"
                      }`}
                    >
                      {brand}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setShowMobileFilter(true)}
                className="flex h-10 shrink-0 items-center gap-2 bg-[#111213] px-4 lg:hidden"
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
                  <div className="absolute top-full right-0 z-20 mt-1.5 flex min-w-[200px] flex-col border border-[#252830] bg-[#0e0f14] shadow-2xl">
                    <div className="border-b border-[#252830] px-4 py-2.5">
                      <span className="text-[11px] tracking-widest text-[#555c6a] uppercase">
                        Sort by
                      </span>
                    </div>
                    <div className="py-1">
                      <div className="px-4 pt-2 pb-1">
                        <span className="text-[10px] tracking-widest text-[#4e5563] uppercase">
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
                            className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                          >
                            <span
                              className={`text-[13px] ${sortOrder === key ? "text-[#edeef0]" : "text-[#8b909c]"}`}
                            >
                              {sortLabels[key]}
                            </span>
                            {sortOrder === key && (
                              <RiCheckLine className="size-3.5 text-white" />
                            )}
                          </button>
                        )
                      )}
                    </div>
                    <div className="border-t border-[#252830] py-1">
                      <div className="px-4 pt-2 pb-1">
                        <span className="text-[10px] tracking-widest text-[#4e5563] uppercase">
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
                            className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                          >
                            <span
                              className={`text-[13px] ${sortOrder === key ? "text-[#edeef0]" : "text-[#8b909c]"}`}
                            >
                              {sortLabels[key]}
                            </span>
                            {sortOrder === key && (
                              <RiCheckLine className="size-3.5 text-white" />
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
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative h-[493px] overflow-hidden bg-[#111113]"
                  >
                    <div className="absolute top-0 left-1/2 size-[350px] -translate-x-1/2">
                      <Skeleton className="size-full rounded-none bg-[#1a1b1f]" />
                    </div>
                    <div className="absolute top-[325px] left-1/2 flex w-[243px] -translate-x-1/2 flex-col items-center gap-4">
                      <div className="flex w-full flex-col items-center gap-2">
                        <Skeleton className="h-3.5 w-24 rounded-none bg-[#1a1b1f]" />
                        <Skeleton className="h-5 w-40 rounded-none bg-[#1a1b1f]" />
                        <div className="mt-1 flex gap-2">
                          <Skeleton className="h-5 w-16 rounded-none bg-[#1a1b1f]" />
                          <Skeleton className="h-5 w-12 rounded-none bg-[#1a1b1f]" />
                        </div>
                      </div>
                      <Skeleton className="h-7 w-28 rounded-none bg-[#1a1b1f]" />
                    </div>
                  </div>
                ))
              : filteredWatches.map((watch) => (
                  <InventoryWatchCard key={watch.id} watch={watch} />
                ))}
          </div>
        </div>
        <div className="pb-16 lg:pb-32" />
        <div className="mx-auto max-w-[1440px]">
          {" "}
          <CtaSection />
          <Footer />
        </div>
      </div>
      <RequestWatchModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
      <SellWatchModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
      />
    </div>
  )
}

function parsePrice(price: string): number {
  return Number(price.replace(/[^0-9]/g, ""))
}

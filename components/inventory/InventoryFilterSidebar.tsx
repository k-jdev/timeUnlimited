"use client"

import { useState } from "react"
import {
  RiSearchLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiUploadLine,
  RiMailLine,
  RiCloseLine,
} from "@remixicon/react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BRANDS, CONDITIONS, FILTER_SECTIONS } from "@/data/inventory"

function WatchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="6" />
      <polyline points="12 10 12 12 13 13" />
      <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
      <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
    </svg>
  )
}

const ACTION_ITEMS = [
  { label: "Request", icon: WatchIcon, highlighted: true },
  { label: "Sell", icon: RiUploadLine, highlighted: false },
  { label: "Contact", icon: RiMailLine, highlighted: false },
]

interface InventoryFilterSidebarProps {
  selectedBrands: string[]
  onBrandsChange: (brands: string[]) => void
  selectedConditions: string[]
  onConditionsChange: (conditions: string[]) => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function InventoryFilterSidebar({
  selectedBrands,
  onBrandsChange,
  selectedConditions,
  onConditionsChange,
  mobileOpen = false,
  onMobileClose,
}: InventoryFilterSidebarProps) {
  const [brandSearch, setBrandSearch] = useState("")
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Brand: true,
    Condition: true,
  })

  const toggleSection = (name: string) => {
    setOpenSections((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const toggleBrand = (brand: string) => {
    onBrandsChange(
      selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand]
    )
  }

  const toggleCondition = (condition: string) => {
    onConditionsChange(
      selectedConditions.includes(condition)
        ? selectedConditions.filter((c) => c !== condition)
        : [...selectedConditions, condition]
    )
  }

  const filteredBrands = BRANDS.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  )

  const filterContent = (
    <>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col px-6 pt-6 pb-8 lg:pt-16 lg:pr-10 lg:pl-16">
          <div className="border-b border-[#2E3135] pb-3">
            <button
              onClick={() => toggleSection("Brand")}
              className="flex w-full items-center justify-between pt-3"
            >
              <span className="text-[16px] leading-6 font-medium text-[#edeef0]">
                Brand
              </span>
              {openSections.Brand ? (
                <RiArrowUpSLine className="size-4 text-[#edeef0]" />
              ) : (
                <RiArrowDownSLine className="size-4 text-[#edeef0]" />
              )}
            </button>
            {openSections.Brand && (
              <div className="mt-3 flex flex-col gap-3">
                <div className="flex h-8 items-center gap-2 bg-[rgba(255,255,255,0.06)] px-3">
                  <RiSearchLine className="size-4 text-[#edeef0]/50" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] leading-5 text-[#edeef0] placeholder:text-[#edeef0]/50 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  {filteredBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex cursor-pointer items-start gap-2"
                    >
                      <Checkbox
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                        className="mt-0.5"
                      />
                      <span className="flex-1 text-[14px] leading-5 text-[#edeef0]">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-b border-[#2E3135] pb-3">
            <button
              onClick={() => toggleSection("Condition")}
              className="flex w-full items-center justify-between pt-3"
            >
              <span className="text-[16px] leading-6 font-medium text-[#edeef0]">
                Condition
              </span>
              {openSections.Condition ? (
                <RiArrowUpSLine className="size-4 text-[#edeef0]" />
              ) : (
                <RiArrowDownSLine className="size-4 text-[#edeef0]" />
              )}
            </button>
            {openSections.Condition && (
              <div className="mt-3 flex flex-col gap-2">
                {CONDITIONS.map((condition) => (
                  <label
                    key={condition}
                    className="flex cursor-pointer items-start gap-2"
                  >
                    <Checkbox
                      checked={selectedConditions.includes(condition)}
                      onCheckedChange={() => toggleCondition(condition)}
                      className="mt-0.5"
                    />
                    <span className="flex-1 text-[14px] leading-5 text-[#edeef0]">
                      {condition}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {FILTER_SECTIONS.map((section) => (
            <div key={section} className="border-b border-[#2E3135]">
              <button
                onClick={() => toggleSection(section)}
                className="flex w-full items-center justify-between py-3"
              >
                <span className="text-[16px] leading-6 font-medium text-[#edeef0]">
                  {section}
                </span>
                {openSections[section] ? (
                  <RiArrowUpSLine className="size-4 text-[#edeef0]" />
                ) : (
                  <RiArrowDownSLine className="size-4 text-[#edeef0]" />
                )}
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2 bg-black px-3 pb-3 lg:pr-3 lg:pl-[54px]">
        {ACTION_ITEMS.map((item) => {
          const isHighlighted = hoveredAction
            ? hoveredAction === item.label
            : item.highlighted
          return (
            <button
              key={item.label}
              className={`flex h-16 flex-1 flex-col items-center justify-center gap-2 text-[12px] leading-4 tracking-[0.04px] transition-colors duration-200 ${
                isHighlighted
                  ? "bg-[#0c2746] text-[#70b8ff]"
                  : "bg-[#111113] text-[#edeef0]"
              }`}
              onMouseEnter={() => setHoveredAction(item.label)}
              onMouseLeave={() => setHoveredAction(null)}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed top-0 right-0 z-30 hidden h-screen w-[320px] flex-col lg:flex">
        {filterContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onMobileClose}
          />
          <aside className="absolute top-0 right-0 flex h-full w-[320px] max-w-[85vw] flex-col bg-[#020208]">
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
              <span className="text-[18px] font-medium text-[#edeef0]">
                Filters
              </span>
              <button onClick={onMobileClose}>
                <RiCloseLine className="size-6 text-[#edeef0]" />
              </button>
            </div>
            {filterContent}
          </aside>
        </div>
      )}
    </>
  )
}

"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
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
import {
  BRANDS,
  CONDITIONS,
  CASE_MATERIALS,
  BRACELET_MATERIALS,
  DIAL_COLORS,
  SIZES,
  SPECIAL_FEATURES,
} from "@/data/inventory"

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

const PRICE_MIN = 0
const PRICE_MAX = 200000

function formatPrice(v: number) {
  if (v >= PRICE_MAX) return "$200 000+"
  return "$" + v.toLocaleString("en-US")
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-[#2E3135]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3"
      >
        <span className="text-[16px] leading-6 font-medium text-[#edeef0]">
          {title}
        </span>
        {open ? (
          <RiArrowUpSLine className="size-4 text-[#edeef0]" />
        ) : (
          <RiArrowDownSLine className="size-4 text-[#edeef0]" />
        )}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  )
}

function CheckboxList({
  items,
  selected,
  onToggle,
}: {
  items: readonly string[]
  selected: string[]
  onToggle: (item: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <label key={item} className="flex cursor-pointer items-center gap-2">
          <Checkbox
            checked={selected.includes(item)}
            onCheckedChange={() => onToggle(item)}
          />
          <span className="flex-1 text-[14px] leading-5 text-[#edeef0]">
            {item}
          </span>
        </label>
      ))}
    </div>
  )
}

export interface InventoryFilterSidebarProps {
  selectedBrands: string[]
  onBrandsChange: (brands: string[]) => void
  selectedConditions: string[]
  onConditionsChange: (conditions: string[]) => void
  selectedCaseMaterials: string[]
  onCaseMaterialsChange: (materials: string[]) => void
  selectedBraceletMaterials: string[]
  onBraceletMaterialsChange: (materials: string[]) => void
  selectedDialColors: string[]
  onDialColorsChange: (colors: string[]) => void
  selectedSizes: string[]
  onSizesChange: (sizes: string[]) => void
  selectedSpecials: string[]
  onSpecialsChange: (specials: string[]) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function InventoryFilterSidebar({
  selectedBrands,
  onBrandsChange,
  selectedConditions,
  onConditionsChange,
  selectedCaseMaterials,
  onCaseMaterialsChange,
  selectedBraceletMaterials,
  onBraceletMaterialsChange,
  selectedDialColors,
  onDialColorsChange,
  selectedSizes,
  onSizesChange,
  selectedSpecials,
  onSpecialsChange,
  priceRange,
  onPriceRangeChange,
  mobileOpen = false,
  onMobileClose,
}: InventoryFilterSidebarProps) {
  const [brandSearch, setBrandSearch] = useState("")
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Brand: true,
    Condition: true,
    "Price range": true,
    "Case material": false,
    "Bracelet Material": false,
    "Dial Color": false,
    Size: false,
    Special: false,
  })

  const toggle = (name: string) =>
    setOpenSections((prev) => ({ ...prev, [name]: !prev[name] }))

  const toggleItem = (
    list: string[],
    item: string,
    onChange: (v: string[]) => void
  ) => {
    onChange(
      list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
    )
  }

  const filteredBrands = BRANDS.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  )

  const filterContent = (
    <>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col px-6 pt-6 pb-8 lg:pt-16 lg:pr-10 lg:pl-8">
          {/* Brand */}
          <div className="border-b border-[#2E3135]">
            <button
              onClick={() => toggle("Brand")}
              className="flex w-full items-center justify-between py-3"
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
              <div className="flex flex-col gap-3 pb-3">
                <div className="flex h-8 items-center gap-2 bg-[rgba(255,255,255,0.06)] px-3">
                  <RiSearchLine className="size-4 text-[#edeef0]/50" />
                  <input
                    type="text"
                    placeholder="Select..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] leading-5 text-[#edeef0] placeholder:text-[#edeef0]/50 focus:outline-none"
                  />
                </div>
                <CheckboxList
                  items={filteredBrands}
                  selected={selectedBrands}
                  onToggle={(item) =>
                    toggleItem(selectedBrands, item, onBrandsChange)
                  }
                />
              </div>
            )}
          </div>

          {/* Condition */}
          <FilterSection
            title="Condition"
            open={openSections.Condition}
            onToggle={() => toggle("Condition")}
          >
            <CheckboxList
              items={CONDITIONS}
              selected={selectedConditions}
              onToggle={(item) =>
                toggleItem(selectedConditions, item, onConditionsChange)
              }
            />
          </FilterSection>

          {/* Price range */}
          <FilterSection
            title="Price range"
            open={openSections["Price range"]}
            onToggle={() => toggle("Price range")}
          >
            <div className="flex flex-col gap-3">
              <Slider
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={1000}
                value={priceRange}
                onValueChange={(v) =>
                  onPriceRangeChange(v as [number, number])
                }
                className="**:data-[slot=slider-track]:border-0 **:data-[slot=slider-track]:bg-[#2E3135] **:data-[slot=slider-track]:shadow-none **:data-[slot=slider-range]:bg-[#70b8ff]"
              />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#80838d]">
                  {formatPrice(priceRange[0])}
                </span>
                <span className="text-[13px] text-[#80838d]">
                  {formatPrice(priceRange[1])}
                </span>
              </div>
            </div>
          </FilterSection>

          {/* Case material */}
          <FilterSection
            title="Case material"
            open={openSections["Case material"]}
            onToggle={() => toggle("Case material")}
          >
            <CheckboxList
              items={CASE_MATERIALS}
              selected={selectedCaseMaterials}
              onToggle={(item) =>
                toggleItem(selectedCaseMaterials, item, onCaseMaterialsChange)
              }
            />
          </FilterSection>

          {/* Bracelet Material */}
          <FilterSection
            title="Bracelet Material"
            open={openSections["Bracelet Material"]}
            onToggle={() => toggle("Bracelet Material")}
          >
            <CheckboxList
              items={BRACELET_MATERIALS}
              selected={selectedBraceletMaterials}
              onToggle={(item) =>
                toggleItem(
                  selectedBraceletMaterials,
                  item,
                  onBraceletMaterialsChange
                )
              }
            />
          </FilterSection>

          {/* Dial Color */}
          <FilterSection
            title="Dial Color"
            open={openSections["Dial Color"]}
            onToggle={() => toggle("Dial Color")}
          >
            <CheckboxList
              items={DIAL_COLORS}
              selected={selectedDialColors}
              onToggle={(item) =>
                toggleItem(selectedDialColors, item, onDialColorsChange)
              }
            />
          </FilterSection>

          {/* Size */}
          <FilterSection
            title="Size"
            open={openSections.Size}
            onToggle={() => toggle("Size")}
          >
            <CheckboxList
              items={SIZES}
              selected={selectedSizes}
              onToggle={(item) =>
                toggleItem(selectedSizes, item, onSizesChange)
              }
            />
          </FilterSection>

          {/* Special */}
          <FilterSection
            title="Special"
            open={openSections.Special}
            onToggle={() => toggle("Special")}
          >
            <CheckboxList
              items={SPECIAL_FEATURES}
              selected={selectedSpecials}
              onToggle={(item) =>
                toggleItem(selectedSpecials, item, onSpecialsChange)
              }
            />
          </FilterSection>
        </div>
      </ScrollArea>

      <div className="flex gap-2 bg-black px-3 pb-3 lg:pr-3 lg:pl-13.5">
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

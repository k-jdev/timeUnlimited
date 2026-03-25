"use client"

import { useEffect, useState } from "react"
import { RiCheckLine, RiCloseLine } from "@remixicon/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { RequestFilters } from "@/types"
import { EMPTY_FILTERS } from "@/types"

const BUDGET_OPTIONS = [
  "$5,000 – $10,000",
  "$10,000 – $20,000",
  "$25,000 – $35,000",
  "$30,000 – $45,000",
  "$40,000 – $60,000",
  "$60,000 – $90,000",
  "$80,000 – $120,000",
  "$150,000 – $250,000",
]

const TIMEFRAME_OPTIONS = [
  "Within 1 week",
  "Within 1–2 weeks",
  "Within 2 weeks",
  "Within 2–3 weeks",
  "Within 3 weeks",
  "Within 3–4 weeks",
  "Within 1 month",
  "Flexible",
  "No rush",
]

const BRAND_OPTIONS = [
  "A. Lange & Söhne",
  "Audemars Piguet",
  "Cartier",
  "Grand Seiko",
  "IWC",
  "Longines",
  "Nomos",
  "Oris",
  "Patek Philippe",
  "Rolex",
  "Tudor",
  "Vacheron Constantin",
]

const MATERIAL_OPTIONS = [
  "Platinum",
  "Rose Gold",
  "Stainless Steel",
  "Titanium",
  "Two-Tone",
  "White Gold",
  "Yellow Gold",
]

const REGION_OPTIONS = [
  "Australia",
  "China",
  "France",
  "Germany",
  "Japan",
  "Korea",
  "Switzerland",
  "UAE",
  "United Kingdom",
  "United States",
]

interface FilterFieldProps {
  label: string
  placeholder: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

function FilterField({
  label,
  placeholder,
  options,
  value,
  onChange,
}: FilterFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[#edeef0]">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-full rounded-none border-[#2e3135] bg-white/5 text-sm text-[#edeef0] data-placeholder:text-[#8b8d98]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="border-[#2e3135] bg-[#111217]">
          {options.map((opt) => (
            <SelectItem
              key={opt}
              value={opt}
              className="text-[#edeef0] focus:bg-white/10 focus:text-[#edeef0]"
            >
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface RequestsFilterModalProps {
  isOpen: boolean
  onClose: () => void
  filters: RequestFilters
  onApply: (filters: RequestFilters) => void
}

export function RequestsFilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
}: RequestsFilterModalProps) {
  const [draft, setDraft] = useState<RequestFilters>(filters)

  // Sync draft from parent when modal opens
  useEffect(() => {
    if (isOpen) {
      setDraft(filters)
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  function setField(field: keyof RequestFilters, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  function handleReset() {
    setDraft(EMPTY_FILTERS)
  }

  function handleApply() {
    onApply(draft)
    onClose()
  }

  function handleOverlayClick() {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleOverlayClick}
    >
      <div
        className="relative flex w-[500px] flex-col gap-6 bg-[#0d1117] p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 flex size-10 items-center justify-center text-[#8b8d98] transition-colors hover:text-[#edeef0]"
          aria-label="Close filters"
        >
          <RiCloseLine className="size-5" />
        </button>

        {/* Title */}
        <h2 className="font-serif text-[40px] leading-none text-[#edeef0]">
          Filters
        </h2>

        {/* Filter fields */}
        <div className="flex flex-col gap-4">
          <FilterField
            label="Budget Range"
            placeholder="Select budget range"
            options={BUDGET_OPTIONS}
            value={draft.budgetRange}
            onChange={(v) => setField("budgetRange", v)}
          />
          <FilterField
            label="Timeframe"
            placeholder="When do you need it?"
            options={TIMEFRAME_OPTIONS}
            value={draft.timeframe}
            onChange={(v) => setField("timeframe", v)}
          />
          <FilterField
            label="Brand Preferences"
            placeholder="Brand Preferences"
            options={BRAND_OPTIONS}
            value={draft.brandPreferences}
            onChange={(v) => setField("brandPreferences", v)}
          />
          <FilterField
            label="Material"
            placeholder="Material"
            options={MATERIAL_OPTIONS}
            value={draft.material}
            onChange={(v) => setField("material", v)}
          />
          <FilterField
            label="Region"
            placeholder="Your region"
            options={REGION_OPTIONS}
            value={draft.region}
            onChange={(v) => setField("region", v)}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex h-8 items-center justify-center bg-white/6 px-3 text-sm font-medium text-[#edeef0] transition-colors hover:bg-white/10"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex h-8 items-center justify-center gap-2 bg-[#edeef0] px-3 text-sm font-medium text-[#020208] transition-colors hover:bg-white"
          >
            Apply filters
            <RiCheckLine className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

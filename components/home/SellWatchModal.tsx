"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiAuctionLine,
  RiCheckLine,
  RiCloseLine,
  RiFlashlightFill,
  RiSearchLine,
  RiUpload2Line,
} from "@remixicon/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FooterButtons,
  FormField,
  ModalHeader,
  ModalInput,
  ModalSelect,
} from "@/components/modal/ModalPrimitives"
import {
  BRAND_OPTIONS,
  CONDITION_OPTIONS_SELL,
  PAPERS_OPTIONS,
  PAYMENT_OPTIONS,
} from "@/constants/options"

// --- Types ------------------------------------------------------------------

type SellType = "outright" | "consignment" | "not-sure"
type Mode = "search" | "manual"
type Step = 1 | 2 | 3 | 4 | 5 | "success"

interface SearchResult {
  id: string
  brand: string
  name: string
  reference_number: string | null
  imageUrl: string | null
}

interface FormData {
  searchQuery: string
  selectedWatch: SearchResult | null
  sellType: SellType
  brand: string
  watchReference: string
  condition: string
  boxAndPapers: string
  yearOfProduction: string
  askingPrice: string
  paymentMethod: string
  contactMethod: string
}

const EMPTY_FORM: FormData = {
  searchQuery: "",
  selectedWatch: null,
  sellType: "outright",
  brand: "",
  watchReference: "",
  condition: "",
  boxAndPapers: "",
  yearOfProduction: "",
  askingPrice: "",
  paymentMethod: "",
  contactMethod: "",
}

// --- Sell type options -------------------------------------------------------

const SELL_TYPES: {
  id: SellType
  label: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    id: "outright",
    label: "Sell Outright",
    description: "Instant liquidity, fast quote, fast payment",
    icon: <RiFlashlightFill className="size-5" />,
  },
  {
    id: "consignment",
    label: "Consignment",
    description:
      "We list it and sell it for top dollar, you set the floor price",
    icon: <RiAuctionLine className="size-5" />,
  },
  {
    id: "not-sure",
    label: "Not Sure Yet",
    description: "We'll help you decide",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M9 14.25C9.621 14.25 10.125 14.754 10.125 15.375C10.125 15.996 9.621 16.5 9 16.5C8.379 16.5 7.875 15.996 7.875 15.375C7.875 14.754 8.379 14.25 9 14.25ZM9 1.5C11.4855 1.5 13.5 3.5145 13.5 6C13.5 7.62375 12.9353 8.4675 11.4945 9.69225C10.0493 10.92 9.75 11.4728 9.75 12.75H8.25C8.25 10.8945 8.84025 9.97875 10.5233 8.54925C11.661 7.5825 12 7.0755 12 6C12 4.3425 10.6575 3 9 3C7.3425 3 6 4.3425 6 6V6.75H4.5V6C4.5 3.5145 6.5145 1.5 9 1.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
]

// --- Step 2: Sell type ------------------------------------------------------

function Step2SellType({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: SellType
  onChange: (v: SellType) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-col gap-8">
      <ModalHeader
        step={2}
        title="Ready to let one go?"
        subtitle="Two ways to sell. One prioritizes speed, the other maximizes return"
        totalSteps={5}
      />

      <div className="flex flex-col gap-3">
        {SELL_TYPES.map((type) => {
          const isSelected = value === type.id
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              className={`flex items-center gap-4 border p-4 text-left transition-colors ${
                isSelected
                  ? "border-[#2e3135] bg-[#0d0d0e]"
                  : "border-[#2e3135] bg-[#0d0d0e] hover:bg-white/3"
              }`}
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center ${
                  isSelected
                    ? "bg-[#1a3a5c] text-[#5eb1ef]"
                    : "bg-white/5 text-[#8b8d98]"
                }`}
              >
                {type.icon}
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-[14px] font-medium text-[#edeef0]">
                  {type.label}
                </span>
                <span className="text-[13px] font-light text-[#8b8d98]">
                  {type.description}
                </span>
              </div>
              <div
                className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isSelected
                    ? "border-[#5eb1ef] bg-[#5eb1ef]"
                    : "border-[#60646c] bg-transparent"
                }`}
              >
                {isSelected && (
                  <div className="size-1.5 rounded-full bg-white" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      <FooterButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

// --- Step 1: Search ---------------------------------------------------------

function Step1Search({
  data,
  onQueryChange,
  onSelectWatch,
  onEnterManually,
  onNext,
}: {
  data: FormData
  onQueryChange: (q: string) => void
  onSelectWatch: (watch: SearchResult) => void
  onEnterManually: () => void
  onNext: () => void
}) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [chips, setChips] = useState<string[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chipsRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  })

  useEffect(() => {
    fetch("/api/inventary/search/brands")
      .then((r) => (r.ok ? r.json() : { brands: [] }))
      .then((json) => setChips((json.brands ?? []).slice(0, 8)))
      .catch(() => {})
  }, [])

  function onChipsMouseDown(e: React.MouseEvent) {
    const el = chipsRef.current
    if (!el) return
    dragRef.current = {
      active: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      moved: false,
    }
  }
  function onChipsMouseMove(e: React.MouseEvent) {
    const d = dragRef.current
    if (!d.active) return
    const el = chipsRef.current
    if (!el) return
    const x = e.pageX - el.offsetLeft
    const walk = x - d.startX
    if (Math.abs(walk) > 4) d.moved = true
    el.scrollLeft = d.scrollLeft - walk
  }
  function onChipsEnd() {
    dragRef.current.active = false
  }
  function onChipsClick(e: React.MouseEvent) {
    if (dragRef.current.moved) {
      e.stopPropagation()
      dragRef.current.moved = false
    }
  }

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `/api/inventary/search?search=${encodeURIComponent(q)}&limit=20`
      )
      if (!res.ok) throw new Error("Search failed")
      const json = await res.json()
      const products: SearchResult[] = (json.products ?? json ?? []).map(
        (p: {
          id: string
          brand: string
          model: string
          reference_number: string | null
          images?: Array<{ image_url: string; is_main: boolean }>
        }) => ({
          id: p.id,
          brand: p.brand ?? "",
          name: p.model ?? "",
          reference_number: p.reference_number ?? null,
          imageUrl:
            p.images?.find((img) => img.is_main)?.image_url ??
            p.images?.[0]?.image_url ??
            null,
        })
      )
      setResults(products)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    onQueryChange(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(q), 300)
  }

  function handleClear() {
    onQueryChange("")
    setResults([])
    inputRef.current?.focus()
  }

  function handleChip(chip: string) {
    onQueryChange(chip)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(chip), 0)
  }

  function handleSelectResult(watch: SearchResult) {
    onSelectWatch(watch)
    onQueryChange(
      `${watch.name}${watch.reference_number ? ` – ${watch.reference_number}` : ""}`
    )
    setResults([])
    onNext()
  }

  const showResults = results.length > 0 && data.searchQuery.trim().length > 0

  return (
    <div className="flex min-h-75 flex-col justify-between gap-8">
      <div className="flex flex-col gap-6">
        <ModalHeader
          step={1}
          title="What are you selling?"
          subtitle="Tell us as much or as little as you have."
          totalSteps={5}
        />

        <div className="flex flex-col gap-3">
          {/* Search input */}
          <div className="relative">
            <div className="flex h-8 items-center border border-[#2e3135] bg-[#111113]">
              <div className="flex size-8 shrink-0 items-center justify-center text-[#8b8d98]">
                <RiSearchLine className="size-4" />
              </div>
              <input
                ref={inputRef}
                type="text"
                className="h-full flex-1 bg-transparent pr-2 text-[14px] text-[#edeef0] outline-none placeholder:text-[#8b8d98]"
                placeholder="e.g. Submariner 126610LN or Nautilus 5711"
                value={data.searchQuery}
                onChange={handleInput}
                autoComplete="off"
              />
              {data.searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex size-8 shrink-0 items-center justify-center text-[#8b8d98] transition-colors hover:text-[#edeef0]"
                  aria-label="Clear"
                >
                  <RiCloseLine className="size-4" />
                </button>
              )}
            </div>

            {/* Search results dropdown */}
            {showResults && (
              <div className="absolute top-full right-0 left-0 z-10 mt-0.5 border border-[#2e3135] bg-[#111113]">
                <ScrollArea className="h-80">
                  {loading ? (
                    <div className="px-4 py-3 text-[13px] text-[#8b8d98]">
                      Searching…
                    </div>
                  ) : (
                    results.map((watch, i) => (
                      <button
                        key={watch.id}
                        type="button"
                        onClick={() => handleSelectResult(watch)}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left transition-colors hover:bg-white/5 ${
                          i % 2 === 1 ? "bg-white/2" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {watch.imageUrl ? (
                            <img
                              src={watch.imageUrl}
                              alt={watch.name}
                              className="size-15 shrink-0 object-cover"
                            />
                          ) : (
                            <div className="size-15 shrink-0 bg-[#1a1a1c]" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-[14px] leading-5 text-[#8b8d98]">
                              {watch.brand}
                            </span>
                            <span className="text-[16px] leading-6 text-[#edeef0]">
                              {watch.name}
                            </span>
                            {watch.reference_number && (
                              <span className="text-[12px] leading-4 tracking-[0.04px] text-[#8b8d98]">
                                {watch.reference_number}
                              </span>
                            )}
                          </div>
                        </div>
                        <RiArrowRightLine className="size-4 shrink-0 text-[#8b8d98]" />
                      </button>
                    ))
                  )}
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Quick chips */}
          <div className="relative overflow-hidden">
            <div
              ref={chipsRef}
              className="scrollbar-hide flex cursor-grab gap-2 overflow-x-auto select-none active:cursor-grabbing"
              onMouseDown={onChipsMouseDown}
              onMouseMove={onChipsMouseMove}
              onMouseUp={onChipsEnd}
              onMouseLeave={onChipsEnd}
              onClick={onChipsClick}
            >
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChip(chip)}
                  className="flex h-8 shrink-0 items-center justify-center bg-white/6 px-3 text-[14px] font-medium text-[#edeef0] transition-colors hover:bg-white/10"
                >
                  {chip}
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-r from-transparent to-[#111113]" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onEnterManually}
          className="flex h-8 items-center justify-center bg-white/6 px-3 text-[14px] font-medium text-[#edeef0] transition-colors hover:bg-white/10"
        >
          Enter manually
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!data.searchQuery.trim()}
          className="flex h-8 items-center justify-center gap-2 bg-[#edeef0] px-3 text-[14px] font-medium text-[#020208] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <RiArrowRightLine className="size-4" />
        </button>
      </div>
    </div>
  )
}

// --- Step 2a: Watch details after search selection --------------------------

function Step2SearchSelected({
  data,
  onChange,
  onBack,
  onNext,
}: {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  onBack: () => void
  onNext: () => void
}) {
  const w = data.selectedWatch
  return (
    <div className="flex flex-col gap-8">
      <ModalHeader
        step={3}
        title="Tell us about your watch"
        subtitle="Add your watch details to get a more precise valuation"
        totalSteps={5}
      />

      <div className="flex flex-col gap-4">
        {/* Selected watch card */}
        {w && (
          <div className="border border-[#2e3135] bg-[#0d0d0e] p-4">
            <p className="mb-2 text-[12px] leading-4 text-[#8b8d98]">
              Selected watch
            </p>
            <div className="flex flex-col gap-0.5">
              <span className="font-serif text-[22px] leading-7 text-[#edeef0]">
                {w.name}
              </span>
              {w.reference_number && (
                <span className="text-[12px] leading-4 tracking-[0.04px] text-[#8b8d98]">
                  {w.reference_number}
                </span>
              )}
            </div>
          </div>
        )}

        <FormField label="Condition">
          <ModalSelect
            placeholder="Select condition"
            options={CONDITION_OPTIONS_SELL}
            value={data.condition}
            onChange={(v) => onChange("condition", v)}
          />
        </FormField>

        <FormField label="Box & Papers?">
          <ModalSelect
            placeholder="Select an option"
            options={PAPERS_OPTIONS}
            value={data.boxAndPapers}
            onChange={(v) => onChange("boxAndPapers", v)}
          />
        </FormField>

        <FormField label="Year of production (optional)">
          <ModalInput
            placeholder="e.g. 2019"
            value={data.yearOfProduction}
            onChange={(e) => onChange("yearOfProduction", e.target.value)}
          />
        </FormField>
      </div>

      <FooterButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

// --- Step 2b: Watch details manual entry ------------------------------------

function Step2Manual({
  data,
  onChange,
  onBack,
  onNext,
}: {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-col gap-8">
      <ModalHeader
        step={3}
        title="Tell us about your watch"
        subtitle="Add your watch details to get a more precise valuation"
        totalSteps={5}
      />

      <div className="flex flex-col gap-4">
        <FormField label="Brand">
          <ModalSelect
            placeholder="Select brand"
            options={BRAND_OPTIONS}
            value={data.brand}
            onChange={(v) => onChange("brand", v)}
          />
        </FormField>

        <FormField label="Reference / Model">
          <ModalInput
            placeholder="e.g. Submariner 126610LN or Nautilus 5711"
            value={data.watchReference}
            onChange={(e) => onChange("watchReference", e.target.value)}
          />
        </FormField>

        <FormField label="Condition">
          <ModalSelect
            placeholder="Select condition"
            options={CONDITION_OPTIONS_SELL}
            value={data.condition}
            onChange={(v) => onChange("condition", v)}
          />
        </FormField>

        <FormField label="Box & Papers?">
          <ModalSelect
            placeholder="Select an option"
            options={PAPERS_OPTIONS}
            value={data.boxAndPapers}
            onChange={(v) => onChange("boxAndPapers", v)}
          />
        </FormField>

        <FormField label="Year of production (optional)">
          <ModalInput
            placeholder="e.g. 2019"
            value={data.yearOfProduction}
            onChange={(e) => onChange("yearOfProduction", e.target.value)}
          />
        </FormField>
      </div>

      <FooterButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

// --- Step 4: Final details --------------------------------------------------

function Step4FinalDetails({
  data,
  onChange,
  photos,
  onPhotos,
  onBack,
  onNext,
}: {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  photos: File[]
  onPhotos: (files: File[]) => void
  onBack: () => void
  onNext: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFiles(files: FileList | null) {
    if (!files) return
    onPhotos(Array.from(files))
  }

  return (
    <div className="flex flex-col gap-8">
      <ModalHeader
        step={4}
        title="Final details"
        subtitle="Set your expectations and tell us how to reach you"
        totalSteps={5}
      />

      <div className="flex flex-col gap-4">
        <FormField label="Asking price or expectation">
          <ModalInput
            placeholder="e.g. $12,000 or open to offers"
            value={data.askingPrice}
            onChange={(e) => onChange("askingPrice", e.target.value)}
          />
        </FormField>

        <FormField label="How do you want to be paid?">
          <ModalSelect
            placeholder="Select payment method"
            options={PAYMENT_OPTIONS}
            value={data.paymentMethod}
            onChange={(v) => onChange("paymentMethod", v)}
          />
        </FormField>

        <FormField label="Upload photo (Optional but encouraged)">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              handleFiles(e.dataTransfer.files)
            }}
            className={`flex h-24 w-full flex-col items-center justify-center gap-2 border border-dashed transition-colors ${
              dragging
                ? "border-[#5eb1ef] bg-white/5"
                : "border-[#2e3135] bg-transparent hover:bg-white/3"
            }`}
          >
            <RiUpload2Line className="size-5 text-[#8b8d98]" />
            <span className="text-[13px] font-light text-[#8b8d98]">
              {photos.length > 0
                ? `${photos.length} file${photos.length > 1 ? "s" : ""} selected`
                : "Drag & drop photos or click to upload"}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </FormField>
      </div>

      <FooterButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

// --- Step 5: Secure this piece ----------------------------------------------

function Step5SecurePiece({
  data,
  onChange,
  onBack,
  onSubmit,
}: {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  onBack: () => void
  onSubmit: () => void
}) {
  return (
    <div className="flex flex-col gap-8">
      <ModalHeader
        step={5}
        title="Secure this piece"
        subtitle="Tell us how you'd like to proceed — we'll take care of the rest."
        totalSteps={5}
      />

      <div className="flex flex-col gap-4">
        <FormField label="Best way to reach you">
          <ModalInput
            placeholder="WhatsApp number, email, or Twitter handle"
            value={data.contactMethod}
            onChange={(e) => onChange("contactMethod", e.target.value)}
          />
        </FormField>
      </div>

      <FooterButtons
        onBack={onBack}
        onNext={onSubmit}
        nextLabel="Submit "
        nextIcon={<RiCheckLine className="size-4" />}
        note="Quotes within 48 hours. No obligation"
      />
    </div>
  )
}

// --- Success screen ---------------------------------------------------------

function SuccessScreen({
  requestNumber,
  onClose,
}: {
  requestNumber: string
  onClose: () => void
}) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4">
      <img src="/images/request/clock.png" alt="Clock" className="size-34" />

      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="font-serif text-[44px] leading-13.5 text-[#edeef0]">
          Request received
        </h3>
        <p className="text-[14px] leading-5 font-light text-[#8b8d98]">
          Our team will review your watch and get back to you with a quote for
          request #{requestNumber}.
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          onClose()
          router.push("/inventory")
        }}
        className="flex h-8 items-center justify-center gap-2 bg-[#edeef0] px-3 text-[14px] font-medium text-[#020208] transition-colors hover:bg-white"
      >
        <RiArrowRightUpLine className="size-4" />
        View collection
      </button>
    </div>
  )
}

// --- Main Component ---------------------------------------------------------

interface SellWatchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SellWatchModal({ isOpen, onClose }: SellWatchModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [mode, setMode] = useState<Mode>("search")
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)

  const [photos, setPhotos] = useState<File[]>([])
  const [requestNumber, setRequestNumber] = useState("")

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep(1)
        setMode("search")
        setFormData(EMPTY_FORM)
        setPhotos([])
      }, 300)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  function setField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleEnterManually() {
    setMode("manual")
    setStep(3)
  }

  function handleStep1Next() {
    setMode("search")
    setStep(3)
  }

  function handleSelectWatch(watch: SearchResult) {
    setFormData((prev) => ({ ...prev, selectedWatch: watch }))
  }

  function handleSubmit() {
    const w = formData.selectedWatch
    const purposeParts = [
      `Sell type: ${formData.sellType}`,
      formData.boxAndPapers ? `Box & Papers: ${formData.boxAndPapers}` : "",
      formData.yearOfProduction ? `Year: ${formData.yearOfProduction}` : "",
    ]
      .filter(Boolean)
      .join(". ")

    const payload = {
      created_date: new Date().toISOString(),
      status: "new",
      client_name:
        mode === "search"
          ? w
            ? `${w.name}${w.reference_number ? ` – ${w.reference_number}` : ""}`
            : formData.searchQuery
          : formData.watchReference,
      email: "",
      phone: formData.contactMethod || "",
      brand_preferences:
        mode === "search" ? (w?.brand ?? "") : (formData.brand ?? ""),
      budget_range: formData.askingPrice || "",
      material: formData.condition || "",
      timeframe: formData.paymentMethod || "",
      region: "",
      purpose: purposeParts,
      assisted_by: null,
      type: "sell",
    }

    fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create request")
        return res.json()
      })
      .then((data) => {
        setRequestNumber(
          data.id || String(Math.floor(10000 + Math.random() * 90000))
        )
        setStep("success")
      })
      .catch((err) => {
        console.error(err)
        alert("Failed to submit. Please try again.")
      })
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 sm:px-0"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-150 bg-[#111113] p-10"
        style={{ boxShadow: "0 8px 40px 0 rgba(0,0,0,0.8)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 flex size-8 items-center justify-center text-[#8b8d98] transition-colors hover:text-[#edeef0]"
          aria-label="Close"
        >
          <RiCloseLine className="size-4" />
        </button>

        {step === 1 && (
          <Step1Search
            data={formData}
            onQueryChange={(q) =>
              setFormData((prev) => ({ ...prev, searchQuery: q }))
            }
            onSelectWatch={handleSelectWatch}
            onEnterManually={handleEnterManually}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2SellType
            value={formData.sellType}
            onChange={(v) => setFormData((prev) => ({ ...prev, sellType: v }))}
            onBack={() => setStep(1)}
            onNext={handleStep1Next}
          />
        )}

        {step === 3 && mode === "search" && (
          <Step2SearchSelected
            data={formData}
            onChange={setField}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 3 && mode === "manual" && (
          <Step2Manual
            data={formData}
            onChange={setField}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <Step4FinalDetails
            data={formData}
            onChange={setField}
            photos={photos}
            onPhotos={setPhotos}
            onBack={() => setStep(3)}
            onNext={() => setStep(5)}
          />
        )}

        {step === 5 && (
          <Step5SecurePiece
            data={formData}
            onChange={setField}
            onBack={() => setStep(4)}
            onSubmit={handleSubmit}
          />
        )}

        {step === "success" && (
          <SuccessScreen requestNumber={requestNumber} onClose={onClose} />
        )}
      </div>
    </div>
  )
}

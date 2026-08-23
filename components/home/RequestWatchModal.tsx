"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiCloseLine,
  RiLoaderLine,
  RiSearchLine,
  RiTimeLine,
} from "@remixicon/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FormField,
  FooterButtons,
  ModalHeader,
  ModalInput,
  ModalSelect,
  ModalTextarea,
} from "@/components/modal/ModalPrimitives"
import {
  BRAND_OPTIONS,
  BUDGET_OPTIONS,
  CONDITION_OPTIONS,
} from "@/constants/options"

// --- Types ------------------------------------------------------------------

type Mode = "search" | "manual"
type Step = 1 | 2 | 3 | 4 | "success"

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
  brand: string
  watchReference: string
  budgetRange: string
  conditionPreference: string
  additionalDetails: string
  paymentMethod: string
  contactMethod: string
}

const EMPTY_FORM: FormData = {
  searchQuery: "",
  selectedWatch: null,
  brand: "",
  watchReference: "",
  budgetRange: "",
  conditionPreference: "",
  additionalDetails: "",
  paymentMethod: "",
  contactMethod: "",
}

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

  const showResults =
    (loading || results.length > 0) && data.searchQuery.trim().length > 0

  return (
    <div className="flex min-h-75 flex-col justify-between gap-8">
      <div className="flex flex-col gap-6">
        <ModalHeader
          step={1}
          title="What are you looking for?"
          subtitle="Give us as much or as little as you have."
          totalSteps={4}
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
              {loading ? (
                <RiLoaderLine className="mr-2 size-4 shrink-0 animate-spin text-[#8b8d98]" />
              ) : data.searchQuery ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex size-8 shrink-0 items-center justify-center text-[#8b8d98] transition-colors hover:text-[#edeef0]"
                  aria-label="Clear"
                >
                  <RiCloseLine className="size-4" />
                </button>
              ) : null}
            </div>

            {/* Search results dropdown */}
            {showResults && (
              <div className="absolute top-full right-0 left-0 z-10 mt-0.5 border border-[#2e3135] bg-[#111113]">
                <ScrollArea className="h-80">
                  {loading ? (
                    <div className="px-4 py-6 text-center text-[15px] text-[#8b8d98]">
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
            {/* Fade gradient */}
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

// --- Step 2a: After search selection ----------------------------------------

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
        step={2}
        title="What are you looking for?"
        subtitle="Give us as much or as little as you have."
        totalSteps={4}
      />

      <div className="flex flex-col gap-4">
        {/* Selected watch card */}
        {w && (
          <div className="border border-[#2e3135] bg-[#0d0d0e] p-4">
            <p className="mb-2 text-[12px] leading-4 text-[#8b8d98]">
              Selected watch
            </p>
            <div className="flex items-center gap-3">
              {w.imageUrl ? (
                <img
                  src={w.imageUrl}
                  alt={w.name}
                  className="size-15 shrink-0 object-cover"
                />
              ) : (
                <div className="size-15 shrink-0 bg-[#1a1a1c]" />
              )}
              <div className="flex flex-col">
                <span className="text-[16px] leading-6 font-medium text-[#edeef0]">
                  {w.name}
                </span>
                {w.reference_number && (
                  <span className="text-[12px] leading-4 tracking-[0.04px] text-[#8b8d98]">
                    {w.reference_number}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <FormField label="Budget range">
          <ModalSelect
            placeholder="Select your budget range"
            options={BUDGET_OPTIONS}
            value={data.budgetRange}
            onChange={(v) => onChange("budgetRange", v)}
          />
        </FormField>
      </div>

      <FooterButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

// --- Step 2b: Manual entry --------------------------------------------------

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
        step={2}
        title="What are you looking for?"
        subtitle="Give us as much or as little as you have."
        totalSteps={4}
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

        <FormField label="Budget range">
          <ModalSelect
            placeholder="Select your budget range"
            options={BUDGET_OPTIONS}
            value={data.budgetRange}
            onChange={(v) => onChange("budgetRange", v)}
          />
        </FormField>
      </div>

      <FooterButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

// --- Step 3: More details ---------------------------------------------------

function Step3MoreDetails({
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
        title="Add more details"
        subtitle="The more details you share, the better we can match your request"
        totalSteps={4}
      />

      <div className="flex flex-col gap-4">
        <FormField label="Condition preference">
          <ModalSelect
            placeholder="Select condition preference"
            options={CONDITION_OPTIONS}
            value={data.conditionPreference}
            onChange={(v) => onChange("conditionPreference", v)}
          />
        </FormField>

        <FormField label="Additional Details">
          <ModalTextarea
            placeholder="Box & papers, year, dial color, condition specifics, preferred region, etc."
            value={data.additionalDetails}
            onChange={(e) => onChange("additionalDetails", e.target.value)}
          />
        </FormField>
      </div>

      <FooterButtons
        onBack={onBack}
        onNext={onNext}
        note="* All fields are optional"
      />
    </div>
  )
}

// --- Step 4: How to reach ---------------------------------------------------

function Step4HowReach({
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
        step={4}
        title="Secure this piece"
        subtitle="Tell us how you'd like to proceed — we'll take care of the rest."
        totalSteps={4}
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
        nextLabel={
          <>
            <span className="sm:hidden">Submit</span>
            <span className="hidden sm:inline">Submit request</span>
          </>
        }
        nextIcon={<RiArrowRightLine className="size-4" />}
        note={
          <span className="flex items-center gap-1.5">
            <RiTimeLine className="size-3.5 shrink-0" />
            We&rsquo;ll get back to you within 48 hours
          </span>
        }
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
          Our team will reach out soon with available options for your request #
          {requestNumber}.
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

// --- Main modal -------------------------------------------------------------

interface RequestWatchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RequestWatchModal({ isOpen, onClose }: RequestWatchModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [mode, setMode] = useState<Mode>("search")
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [requestNumber, setRequestNumber] = useState("")

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep(1)
        setMode("search")
        setFormData(EMPTY_FORM)
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
    setStep(2)
  }

  function handleStep1Next() {
    setMode("search")
    setStep(2)
  }

  function handleSelectWatch(watch: SearchResult) {
    setFormData((prev) => ({ ...prev, selectedWatch: watch }))
  }

  async function handleSubmit() {
    const w = formData.selectedWatch
    const payload = {
      created_date: new Date().toISOString(),
      status: "new",
      assisted_by: null,
      brand_preferences:
        mode === "search" ? (w?.brand ?? "") : (formData.brand ?? ""),
      budget_range: formData.budgetRange || "",
      material: formData.conditionPreference || "",
      timeframe: formData.paymentMethod || "",
      client_name:
        mode === "search"
          ? w
            ? `${w.name}${w.reference_number ? ` – ${w.reference_number}` : ""}`
            : formData.searchQuery
          : formData.watchReference,
      region: "",
      phone: formData.contactMethod || "",
      email: "",
      purpose: formData.additionalDetails || "",
      type: "request",
    }

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to create request")

      const createdRequest = await res.json()
      setRequestNumber(createdRequest.id || "")
      setStep("success")
    } catch (err) {
      console.error(err)
      alert("Failed to create request. Please try again.")
    }
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
            onNext={handleStep1Next}
          />
        )}

        {step === 2 && mode === "search" && (
          <Step2SearchSelected
            data={formData}
            onChange={setField}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 2 && mode === "manual" && (
          <Step2Manual
            data={formData}
            onChange={setField}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <Step3MoreDetails
            data={formData}
            onChange={setField}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <Step4HowReach
            data={formData}
            onChange={setField}
            onBack={() => setStep(3)}
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

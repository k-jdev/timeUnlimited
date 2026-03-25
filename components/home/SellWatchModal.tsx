"use client"

import { useEffect, useRef, useState } from "react"
import {
  RiArrowRightLine,
  RiArrowRightUpLine,
  RiCheckLine,
  RiCloseLine,
  RiFlashlightLine,
  RiArrowLeftRightLine,
  RiQuestionLine,
  RiUpload2Line,
} from "@remixicon/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// --- Options ----------------------------------------------------------------

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

const CONDITION_OPTIONS = [
  "New (unworn)",
  "Like new",
  "Excellent",
  "Good",
  "Fair",
]

const PAPERS_OPTIONS = [
  "Full set (box + papers)",
  "Papers only",
  "Box only",
  "No box or papers",
]

const PAYMENT_OPTIONS = [
  "Bank transfer",
  "Credit / Debit card",
  "Cryptocurrency",
  "Cash",
  "Trade-in",
]

// --- Types ------------------------------------------------------------------

type SellType = "outright" | "consignment" | "not-sure"
type Step = 1 | 2 | 3 | "success"

interface FormData {
  sellType: SellType
  brand: string
  watchReference: string
  condition: string
  boxAndPapers: string
  yearOfPurchase: string
  askingPrice: string
  paymentMethod: string
  contactMethod: string
}

const EMPTY_FORM: FormData = {
  sellType: "outright",
  brand: "",
  watchReference: "",
  condition: "",
  boxAndPapers: "",
  yearOfPurchase: "",
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
    icon: <RiFlashlightLine className="size-5" />,
  },
  {
    id: "consignment",
    label: "Consignment",
    description:
      "We list it and sell it for top dollar, you set the floor price",
    icon: <RiArrowLeftRightLine className="size-5" />,
  },
  {
    id: "not-sure",
    label: "Not Sure Yet",
    description: "We'll help you decide",
    icon: <RiQuestionLine className="size-5" />,
  },
]

// --- Shared sub-components --------------------------------------------------

function ModalHeader({
  step,
  title,
  subtitle,
  totalSteps = 3,
}: {
  step: number
  title: string
  subtitle: string
  totalSteps?: number
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-[38px] leading-none text-[#edeef0]">
          {title}
        </h2>
        <p className="text-[14px] leading-5 font-light text-[#8b8d98]">
          {subtitle}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1 pt-1 text-[12px] tracking-[0.04px]">
        <span className="text-[#edeef0]">Step {step}</span>
        <span className="text-[#8b8d98]">of {totalSteps}</span>
      </div>
    </div>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] leading-5 font-medium text-[#edeef0]">
        {label}
      </span>
      {children}
    </div>
  )
}

function ModalSelect({
  placeholder,
  options,
  value,
  onChange,
}: {
  placeholder: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-full rounded-none border-[#2e3135] bg-white/5 text-[14px] text-[#edeef0] data-placeholder:text-[#8b8d98]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="border-[#2e3135] bg-[#111214]">
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
  )
}

function ModalInput(props: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className="h-8 rounded-none border-[#2e3135] bg-white/5 text-[14px] text-[#edeef0] placeholder:text-[#8b8d98] focus-visible:border-white/30 focus-visible:ring-0"
    />
  )
}

function FooterButtons({
  onBack,
  onNext,
  nextLabel = "Next",
  nextIcon = <RiArrowRightLine className="size-4" />,
  showBack = true,
  note,
}: {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  nextIcon?: React.ReactNode
  showBack?: boolean
  note?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      {note ? (
        <span className="text-[12px] leading-5 font-light text-[#8b8d98]">
          {note}
        </span>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-3">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-8 items-center justify-center bg-white/6 px-3 text-[14px] font-medium text-[#edeef0] transition-colors hover:bg-white/10"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          className="flex h-8 items-center justify-center gap-2 bg-[#edeef0] px-3 text-[14px] font-medium text-[#020208] transition-colors hover:bg-white"
        >
          {nextLabel}
          {nextIcon}
        </button>
      </div>
    </div>
  )
}

// --- Step 1: Ready to let one go? -------------------------------------------

function Step1SellType({
  value,
  onChange,
  onNext,
}: {
  value: SellType
  onChange: (v: SellType) => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-col gap-8">
      <ModalHeader
        step={1}
        title="Ready to let one go?"
        subtitle="Two ways to sell. One prioritizes speed, the other maximizes return"
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
                  ? "border-[#2e3135] bg-white/5"
                  : "border-[#2e3135] bg-transparent hover:bg-white/3"
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

      <FooterButtons onNext={onNext} showBack={false} />
    </div>
  )
}

// --- Step 2: Tell us about your watch ----------------------------------------

function Step2WatchDetails({
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
        title="Tell us about your watch"
        subtitle="Add your watch details to get a more precise valuation"
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
            options={CONDITION_OPTIONS}
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

        <FormField label="Year of purchase (optional)">
          <ModalInput
            placeholder="e.g. 2019"
            value={data.yearOfPurchase}
            onChange={(e) => onChange("yearOfPurchase", e.target.value)}
          />
        </FormField>
      </div>

      <FooterButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

// --- Step 3: Final details ---------------------------------------------------

function Step3FinalDetails({
  data,
  onChange,
  photos,
  onPhotos,
  onBack,
  onSubmit,
}: {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  photos: File[]
  onPhotos: (files: File[]) => void
  onBack: () => void
  onSubmit: () => void
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
        step={3}
        title="Final details"
        subtitle="Set your expectations and tell us how to reach you"
      />

      <div className="flex flex-col gap-4">
        <FormField label="Asking price or expectation">
          <ModalInput
            placeholder="e.g. $12,000 or open to offers"
            value={data.askingPrice}
            onChange={(e) => onChange("askingPrice", e.target.value)}
          />
        </FormField>

        <FormField label="How do you want to pay?">
          <ModalSelect
            placeholder="Select payment method"
            options={PAYMENT_OPTIONS}
            value={data.paymentMethod}
            onChange={(v) => onChange("paymentMethod", v)}
          />
        </FormField>

        <FormField label="Best way to reach you">
          <ModalInput
            placeholder="WhatsApp number, email, or Twitter handle"
            value={data.contactMethod}
            onChange={(e) => onChange("contactMethod", e.target.value)}
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

      <FooterButtons
        onBack={onBack}
        onNext={onSubmit}
        nextLabel="Submit request"
        nextIcon={<RiCheckLine className="size-4" />}
        note="Quotes within 48 hours. No obligation"
      />
    </div>
  )
}

// --- Success Screen ----------------------------------------------------------

function SuccessScreen({
  requestNumber,
  onClose,
}: {
  requestNumber: string
  onClose: () => void
}) {
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
        onClick={onClose}
        className="flex h-8 items-center justify-center gap-2 bg-[#edeef0] px-3 text-[14px] font-medium text-[#020208] transition-colors hover:bg-white"
      >
        <RiArrowRightUpLine className="size-4" />
        View collection
      </button>
    </div>
  )
}

// --- Main Component ----------------------------------------------------------

interface SellWatchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SellWatchModal({ isOpen, onClose }: SellWatchModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [photos, setPhotos] = useState<File[]>([])
  const [requestNumber, setRequestNumber] = useState("")

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1)
        setFormData(EMPTY_FORM)
        setPhotos([])
      }, 300)
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

  function handleSubmit() {
    const num = String(Math.floor(10000 + Math.random() * 90000))
    setRequestNumber(num)
    setStep("success")
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative w-150 bg-[#111113] p-10"
        style={{ boxShadow: "0 8px 40px 0 rgba(0,0,0,0.8)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 flex size-12 items-center justify-center text-[#8b8d98] transition-colors hover:text-[#edeef0]"
          aria-label="Close"
        >
          <RiCloseLine className="size-5" />
        </button>

        {step === 1 && (
          <Step1SellType
            value={formData.sellType}
            onChange={(v) => setFormData((prev) => ({ ...prev, sellType: v }))}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2WatchDetails
            data={formData}
            onChange={setField}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <Step3FinalDetails
            data={formData}
            onChange={setField}
            photos={photos}
            onPhotos={setPhotos}
            onBack={() => setStep(2)}
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

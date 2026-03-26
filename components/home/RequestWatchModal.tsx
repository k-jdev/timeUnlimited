"use client"

import { useEffect, useState } from "react"
import {
  RiCheckLine,
  RiCloseLine,
  RiArrowRightUpLine,
  RiTimeLine,
} from "@remixicon/react"
import {
  ModalHeader,
  FormField,
  ModalSelect,
  ModalInput,
  ModalTextarea,
  FooterButtons,
} from "@/components/modal/ModalPrimitives"
import {
  BRAND_OPTIONS,
  BUDGET_OPTIONS,
  CONDITION_OPTIONS,
  PAYMENT_OPTIONS,
} from "@/constants/options"

// --- Types ------------------------------------------------------------------

type Step = 1 | 2 | 3 | "success"

interface FormData {
  brand: string
  watchReference: string
  budgetRange: string
  conditionPreference: string
  additionalDetails: string
  paymentMethod: string
  contactMethod: string
}

const EMPTY_FORM: FormData = {
  brand: "",
  watchReference: "",
  budgetRange: "",
  conditionPreference: "",
  additionalDetails: "",
  paymentMethod: "",
  contactMethod: "",
}

function Step1WhatLookingFor({
  data,
  onChange,
  onNext,
}: {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-col gap-8">
      <ModalHeader
        step={1}
        title="What are you looking for?"
        subtitle="Give us as much or as little as you have."
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

      <FooterButtons onNext={onNext} showBack={false} />
    </div>
  )
}

function Step2MoreDetails({
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
        title="Add more details"
        subtitle="The more details you share, the better we can match your request"
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

function Step3HowReach({
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
        step={3}
        title="How should we reach you?"
        subtitle="Tell us how you'd like to proceed — we'll take care of the rest"
      />

      <div className="flex flex-col gap-4">
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
      </div>

      <FooterButtons
        onBack={onBack}
        onNext={onSubmit}
        nextLabel="Submit "
        nextIcon={<RiCheckLine className="size-4" />}
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
          Our team will reach out soon with available options for your request #
          {requestNumber}.
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

interface RequestWatchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RequestWatchModal({ isOpen, onClose }: RequestWatchModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [requestNumber, setRequestNumber] = useState("")

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1)
        setFormData(EMPTY_FORM)
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
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-0 flex size-12 items-center justify-center text-[#8b8d98] transition-colors hover:text-[#edeef0]"
          aria-label="Close"
        >
          <RiCloseLine className="size-5" />
        </button>

        {step === 1 && (
          <Step1WhatLookingFor
            data={formData}
            onChange={setField}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2MoreDetails
            data={formData}
            onChange={setField}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <Step3HowReach
            data={formData}
            onChange={setField}
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

"use client"

import { useState } from "react"
import {
  RiArrowRightLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiInformationLine,
  RiMailLine,
  RiShieldCheckLine,
  RiFlightTakeoffFill,
} from "@remixicon/react"

interface Spec {
  label: string
  value: string
}

interface WatchDetailsProps {
  brand: string
  name: string
  price: string
  specs: Spec[]
  description: string
}

export function WatchDetails({
  brand,
  name,
  price,
  specs,
  description,
}: WatchDetailsProps) {
  const [aboutOpen, setAboutOpen] = useState(true)

  const brandFormatted = brand
    .split(" ")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ")

  return (
    <div className="flex flex-col gap-10 px-4 pt-8 pb-4 lg:flex-1 lg:px-16 lg:pt-[78px]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="font-serif text-[20px] leading-[22px] tracking-[0.4px] text-[rgba(237,238,240,0.62)] uppercase">
            {brand}
          </p>
          <p className="text-[28px] leading-9 tracking-[-0.16px] text-[#edeef0] sm:text-[35px] sm:leading-10">
            {name}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-serif text-[36px] leading-none tracking-[-0.1px] text-[#edeef0] sm:text-[48px]">
            {price}
          </p>
          <div className="flex items-center gap-1">
            <RiInformationLine className="size-4 text-[#80838d]" />
            <p className="text-[12px] leading-4 tracking-[0.04px] text-[#80838d]">
              Authenticated &amp; inspected in-house. No hidden fees.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button className="flex h-10 items-center justify-center gap-3 bg-[#edeef0] px-4">
            <RiArrowRightLine className="size-[18px] text-[#020208]" />
            <span className="text-[16px] leading-6 font-medium text-[#020208]">
              Inquire Now
            </span>
          </button>
          {/* <button className="flex h-10 items-center justify-center gap-3 border border-[rgba(237,238,240,0.62)] px-4">
            <RiMailLine className="size-[18px] text-[#edeef0]" />
            <span className="text-[16px] leading-6 font-medium text-[#edeef0]">
              Request a Quote
            </span>
          </button> */}
        </div>
      </div>

      <div className="flex flex-col text-[14px] leading-5">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-center justify-between border-b border-[#2E3135] py-3"
          >
            <span className="flex-[1_0_0] text-[#edeef0]">{spec.label}</span>
            <span className="flex-[1_0_0] font-light text-[#80838d]">
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <div className="border-b border-[#2E3135]">
          <button
            onClick={() => setAboutOpen(!aboutOpen)}
            className="flex w-full items-center justify-between py-3"
          >
            <span className="text-[16px] leading-6 font-medium text-[#edeef0]">
              About this watch
            </span>
            {aboutOpen ? (
              <RiArrowUpSLine className="size-4 text-[#edeef0]" />
            ) : (
              <RiArrowDownSLine className="size-4 text-[#edeef0]" />
            )}
          </button>
          {aboutOpen && (
            <div className="pb-4 text-[14px] leading-5 font-light whitespace-pre-line text-[#8b8d98]">
              {description}
            </div>
          )}
        </div>

        <div className="flex gap-6 border-b border-[#2E3135] py-4">
          <div className="flex size-10 shrink-0 items-center justify-center bg-[rgba(0,143,245,0.1)]">
            <RiShieldCheckLine className="size-[18px] text-[#0090ff]" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-[16px] leading-6 font-medium text-[#edeef0]">
              Authenticated In-House
            </p>
            <p className="text-[14px] leading-5 font-light text-[#80838d]">
              This {brandFormatted} passed our multi-step inspection. Movement
              tested. Serial verified. Photographed before shipping.
            </p>
          </div>
        </div>

        <div className="flex gap-6 border-b border-[#2E3135] py-4">
          <div className="flex size-10 shrink-0 items-center justify-center bg-[rgba(255,255,255,0.06)]">
            <RiFlightTakeoffFill className="size-[18px] text-[#edeef0]" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-[16px] leading-6 font-medium text-[#edeef0]">
              Worldwide Shipping
            </p>
            <p className="text-[14px] leading-5 font-light text-[#80838d]">
              Fully insured international shipping with tracking. Delivered to
              your door with signature confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

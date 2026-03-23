"use client"

import { use, useState, useMemo } from "react"
import Link from "next/link"
import {
  RiArrowRightLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiInformationLine,
  RiMailLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiShieldCheckLine,
  RiFlightTakeoffFill,
} from "@remixicon/react"
import { INVENTORY_WATCHES } from "@/data/inventory"
import { InventoryWatchCard } from "@/components/inventory/InventoryWatchCard"
import { CtaSection } from "@/components/home/CtaSection"
import { Footer } from "@/components/layout/Footer"
import { BrandLogo } from "@/components/layout/BrandLogo"

export default function WatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [aboutOpen, setAboutOpen] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  const watchIndex = INVENTORY_WATCHES.findIndex((w) => w.id === id)
  const watch = INVENTORY_WATCHES[watchIndex]

  const prevWatch =
    watchIndex > 0 ? INVENTORY_WATCHES[watchIndex - 1] : undefined
  const nextWatch =
    watchIndex < INVENTORY_WATCHES.length - 1
      ? INVENTORY_WATCHES[watchIndex + 1]
      : undefined

  const relatedWatches = useMemo(() => {
    return INVENTORY_WATCHES.filter((w) => w.id !== id).slice(0, 3)
  }, [id])

  if (!watch) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[18px] text-[#edeef0]">Watch not found</p>
      </div>
    )
  }

  const gallery = watch.galleryImages ?? [
    watch.image,
    watch.image,
    watch.image,
    watch.image,
  ]

  const specs = [
    {
      label: "Reference Number",
      value: watch.referenceNumber ?? watch.ref.replace("Ref. ", ""),
    },
    { label: "Condition", value: "Pre-Owned" },
    { label: "Case material", value: watch.caseMaterial },
    { label: "Case Size", value: watch.size },
    { label: "Dial", value: watch.dial ?? watch.dialColor },
    { label: "Complete Set", value: watch.completeSet ?? "Box & Papers" },
  ]

  const description =
    watch.description ??
    `The ${watch.brand} ${watch.name} ${watch.ref} is a remarkable timepiece that combines elegant design with exceptional craftsmanship. This pre-owned piece has been authenticated and inspected in-house to ensure its condition meets our high standards.\n\nPlease Note: All product details, including pricing and availability, reflect current market conditions at the time of listing and may change without notice due to market shifts, tariffs, or sourcing costs.`

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020208]">
      {/* Top bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:pt-[33px]">
        {/* Logo */}
        <div className="shrink-0 px-4 pt-6 lg:w-[732px] lg:px-0 lg:pt-0 lg:pl-6">
          <Link href="/">
            <BrandLogo />
          </Link>
        </div>

        {/* Breadcrumb + Prev/Next — visible on all sizes */}
        <div className="flex flex-1 items-center justify-between px-4 py-3 lg:px-16 lg:py-3">
          {/* Breadcrumb */}
          <div className="flex min-w-0 items-center">
            <Link
              href="/"
              className="shrink-0 text-[14px] leading-5 text-[#b9bbc6] transition-colors hover:text-[#edeef0]"
            >
              Home
            </Link>
            <RiArrowRightSLine className="size-4 shrink-0 text-[#b9bbc6]" />
            <Link
              href="/inventory"
              className="shrink-0 text-[14px] leading-5 text-[#b9bbc6] transition-colors hover:text-[#edeef0]"
            >
              Inventory
            </Link>
            <RiArrowRightSLine className="size-4 shrink-0 text-[#b9bbc6]" />
            <span className="truncate text-[14px] leading-5 text-[#60646c]">
              {watch.name}
            </span>
          </div>

          {/* Previous / Next */}
          <div className="ml-4 flex shrink-0 items-center gap-4">
            {prevWatch ? (
              <Link
                href={`/watch/${prevWatch.id}`}
                className="flex items-center gap-1 text-[14px] leading-5 text-[#8b8d98] transition-colors hover:text-[#edeef0]"
              >
                <RiArrowLeftSLine className="size-4" />
                Previous
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-[14px] leading-5 text-[#8b8d98]/40">
                <RiArrowLeftSLine className="size-4" />
                Previous
              </span>
            )}
            {nextWatch ? (
              <Link
                href={`/watch/${nextWatch.id}`}
                className="flex items-center gap-1 text-[14px] leading-5 text-[#8b8d98] transition-colors hover:text-[#edeef0]"
              >
                Next
                <RiArrowRightSLine className="size-4" />
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-[14px] leading-5 text-[#8b8d98]/40">
                Next
                <RiArrowRightSLine className="size-4" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row lg:gap-0">
        {/* Left: Gallery */}
        <div className="flex flex-col gap-0.5 pt-4 lg:w-[732px] lg:shrink-0 lg:pt-[30px]">
          {/* Hero image */}
          <div className="relative h-[300px] overflow-hidden bg-[#111113] sm:h-[400px] lg:h-[682px]">
            <img
              src={gallery[selectedImage] ?? watch.image}
              alt={watch.name}
              className="absolute top-1/2 left-1/2 size-[280px] -translate-x-1/2 -translate-y-1/2 object-cover sm:size-[340px] lg:size-[682px]"
              style={{
                filter: "drop-shadow(0px 4px 88px rgba(0,0,0,0.64))",
              }}
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-2 gap-0.5 lg:flex lg:flex-wrap">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative h-[160px] overflow-hidden bg-[#111113] transition-opacity lg:h-[364.5px] lg:min-w-[200px] lg:flex-[1_0_0] ${
                  selectedImage === i
                    ? "opacity-100"
                    : "opacity-60 hover:opacity-80"
                }`}
              >
                <img
                  src={img}
                  alt={`${watch.name} - ${i + 1}`}
                  className="absolute inset-0 size-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col gap-10 px-4 pt-8 pb-4 lg:flex-1 lg:px-16 lg:pt-[34px]">
          {/* Brand + Name + Price */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <p className="font-serif text-[20px] leading-[22px] tracking-[0.4px] text-[rgba(237,238,240,0.62)] uppercase">
                {watch.brand}
              </p>
              <p className="text-[28px] leading-9 tracking-[-0.16px] text-[#edeef0] sm:text-[35px] sm:leading-10">
                {watch.name}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-serif text-[36px] leading-none tracking-[-0.1px] text-[#edeef0] sm:text-[48px]">
                {watch.price}
              </p>
              <div className="flex items-center gap-1">
                <RiInformationLine className="size-4 text-[#80838d]" />
                <p className="text-[12px] leading-4 tracking-[0.04px] text-[#80838d]">
                  Authenticated &amp; inspected in-house. No hidden fees.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button className="flex h-10 items-center justify-center gap-3 bg-[#edeef0] px-4">
                <RiArrowRightLine className="size-[18px] text-[#020208]" />
                <span className="text-[16px] leading-6 font-medium text-[#020208]">
                  Inquire Now
                </span>
              </button>
              <button className="flex h-10 items-center justify-center gap-3 border border-[rgba(237,238,240,0.62)] px-4">
                <RiMailLine className="size-[18px] text-[#edeef0]" />
                <span className="text-[16px] leading-6 font-medium text-[#edeef0]">
                  Request a Quote
                </span>
              </button>
            </div>
          </div>

          {/* Specs Table */}
          <div className="flex flex-col text-[14px] leading-5">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between border-b border-[#2E3135] py-3"
              >
                <span className="flex-[1_0_0] text-[#edeef0]">
                  {spec.label}
                </span>
                <span className="flex-[1_0_0] font-light text-[#80838d]">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* About this watch */}
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

            {/* Authenticated In-House */}
            <div className="flex gap-6 border-b border-[#2E3135] py-4">
              <div className="flex size-10 shrink-0 items-center justify-center bg-[rgba(0,143,245,0.1)]">
                <RiShieldCheckLine className="size-[18px] text-[#0090ff]" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-[16px] leading-6 font-medium text-[#edeef0]">
                  Authenticated In-House
                </p>
                <p className="text-[14px] leading-5 font-light text-[#80838d]">
                  This{" "}
                  {watch.brand
                    .split(" ")
                    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
                    .join(" ")}{" "}
                  passed our multi-step inspection. Movement tested. Serial
                  verified. Photographed before shipping.
                </p>
              </div>
            </div>

            {/* Worldwide Shipping */}
            <div className="flex gap-6 border-b border-[#2E3135] py-4">
              <div className="flex size-10 shrink-0 items-center justify-center bg-[rgba(255,255,255,0.06)]">
                <RiFlightTakeoffFill className="size-[18px] text-[#edeef0]" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-[16px] leading-6 font-medium text-[#edeef0]">
                  Worldwide Shipping
                </p>
                <p className="text-[14px] leading-5 font-light text-[#80838d]">
                  Fully insured international shipping with tracking. Delivered
                  to your door with signature confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You Might Also Like */}
      <div className="flex w-full max-w-[1120px] flex-col items-start gap-1 overflow-hidden px-4 lg:px-0">
        <div className="w-full pt-12 pb-8 pl-0 lg:pt-16 lg:pb-12 lg:pl-10">
          <h2 className="font-serif text-[36px] leading-none text-[#edeef0] sm:text-[48px] lg:text-[64px] lg:leading-[66px]">
            You Might Also Like
          </h2>
        </div>

        <div className="flex w-full gap-1 overflow-x-auto lg:overflow-x-visible">
          {relatedWatches.map((w) => (
            <Link
              key={w.id}
              href={`/watch/${w.id}`}
              className="relative h-[493px] w-[280px] shrink-0 overflow-hidden bg-[#111113] sm:w-[340px] lg:w-auto lg:min-w-[340px] lg:flex-[1_0_0] lg:shrink"
            >
              <div className="absolute top-[49px] left-1/2 size-[342px] -translate-x-1/2">
                <img
                  src={w.image}
                  alt={w.name}
                  loading="lazy"
                  decoding="async"
                  className="pointer-events-none absolute inset-0 size-full object-cover"
                />
              </div>
              <div className="absolute top-[325px] left-1/2 flex h-[119px] w-[243px] -translate-x-1/2 flex-col items-center gap-4">
                <div className="flex w-full flex-col items-start gap-[11px]">
                  <div className="flex w-full flex-col items-start gap-1 text-center">
                    <p className="w-full font-serif text-[16px] leading-[19px] tracking-[0.32px] text-[rgba(237,238,240,0.62)] uppercase">
                      {w.brand}
                    </p>
                    <p className="w-full text-[18px] leading-[26px] tracking-[-0.04px] text-[#edeef0]">
                      {w.name}
                    </p>
                  </div>
                  <div className="flex w-full flex-wrap items-start justify-center gap-2">
                    <span className="bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[12px] leading-4 font-medium tracking-[0.04px] text-[rgba(237,238,240,0.62)]">
                      {w.ref}
                    </span>
                    <span className="bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[12px] leading-4 font-medium tracking-[0.04px] text-[rgba(237,238,240,0.62)]">
                      {w.size}
                    </span>
                  </div>
                </div>
                <p className="w-full flex-[1_0_0] text-center font-serif text-[26px] leading-none tracking-[-0.1px] text-[#edeef0]">
                  {w.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/inventory"
          className="flex h-12 w-full items-center justify-center gap-3 bg-[#111213]"
        >
          <RiArrowRightLine className="size-[18px] text-[#60646c]" />
          <span className="text-[16px] leading-6 font-medium text-[#60646c]">
            See inventory
          </span>
        </Link>
      </div>

      <CtaSection />
      <Footer />
    </div>
  )
}

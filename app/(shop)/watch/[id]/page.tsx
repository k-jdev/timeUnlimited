"use client"

import { use, useMemo } from "react"
import { INVENTORY_WATCHES } from "@/data/inventory"
import { WatchTopBar } from "@/components/watches/WatchTopBar"
import { WatchGallery } from "@/components/watches/WatchGallery"
import { WatchDetails } from "@/components/watches/WatchDetails"
import { WatchRelated } from "@/components/watches/WatchRelated"
import { CtaSection } from "@/components/home/CtaSection"
import { Footer } from "@/components/layout/Footer"

export default function WatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const watchIndex = INVENTORY_WATCHES.findIndex((w) => w.id === id)
  const watch = INVENTORY_WATCHES[watchIndex]

  const prevWatch =
    watchIndex > 0 ? INVENTORY_WATCHES[watchIndex - 1] : undefined
  const nextWatch =
    watchIndex < INVENTORY_WATCHES.length - 1
      ? INVENTORY_WATCHES[watchIndex + 1]
      : undefined

  const relatedWatches = useMemo(
    () => INVENTORY_WATCHES.filter((w) => w.id !== id).slice(0, 3),
    [id]
  )

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
      <WatchTopBar
        watchName={watch.name}
        prevWatch={prevWatch}
        nextWatch={nextWatch}
      />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="flex flex-col lg:h-[calc(100vh-78px)] lg:flex-row">
          <div className="lg:h-full lg:scrollbar lg:w-[732px] lg:shrink-0 lg:overflow-y-auto">
            <WatchGallery images={gallery} watchName={watch.name} />
          </div>

          <div className="lg:h-full lg:scrollbar lg:flex-1 lg:overflow-y-auto">
            <WatchDetails
              brand={watch.brand}
              name={watch.name}
              price={watch.price}
              specs={specs}
              description={description}
            />
          </div>
        </div>

        <WatchRelated watches={relatedWatches} />

        <CtaSection />
        <Footer />
      </div>
    </div>
  )
}

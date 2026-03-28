"use client"

import { use, useState, useEffect } from "react"
import type { InventoryWatch } from "@/data/inventory"
import { mapProductToWatch } from "@/lib/mapProduct"
import { WatchTopBar } from "@/components/watches/WatchTopBar"
import { WatchGallery } from "@/components/watches/WatchGallery"
import { WatchDetails } from "@/components/watches/WatchDetails"
import { WatchRelated } from "@/components/watches/WatchRelated"
import { CtaSection } from "@/components/home/CtaSection"
import { Footer } from "@/components/layout/Footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function WatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [watch, setWatch] = useState<InventoryWatch | null>(null)
  const [relatedWatches, setRelatedWatches] = useState<InventoryWatch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/inventory/${id}`)
        if (!res.ok) {
          setIsLoading(false)
          return
        }
        const data = await res.json()
        setWatch(mapProductToWatch(data))

        const relRes = await fetch("/api/inventary")
        if (relRes.ok) {
          const relData = await relRes.json()
          setRelatedWatches(
            relData.products
              .map(mapProductToWatch)
              .filter((w: InventoryWatch) => w.id !== id)
              .slice(0, 3)
          )
        }
      } catch (err) {
        console.error("Error fetching watch:", err)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#020208]">
        <div className="relative mx-auto max-w-[1440px]">
          {/* TopBar skeleton */}
          <div className="relative z-10 flex flex-col lg:absolute lg:inset-x-0 lg:top-0 lg:z-20 lg:flex-row lg:items-center lg:pt-[33px]">
            <div className="shrink-0 px-4 pt-6 lg:w-[732px] lg:px-0 lg:pt-0 lg:pl-6">
              <Skeleton className="h-[34px] w-[140px] rounded-none bg-[#1a1b1f]" />
            </div>
            <div className="flex flex-1 items-center justify-between px-4 py-2 lg:px-16">
              <Skeleton className="h-4 w-32 rounded-none bg-[#1a1b1f]" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-none bg-[#1a1b1f]" />
                <Skeleton className="h-8 w-8 rounded-none bg-[#1a1b1f]" />
              </div>
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="flex flex-col lg:h-screen lg:flex-row">
            {/* Gallery skeleton */}
            <div className="lg:h-full lg:w-[732px] lg:shrink-0">
              <Skeleton className="h-[480px] w-full rounded-none bg-[#1a1b1f] lg:h-full" />
            </div>

            {/* Details skeleton */}
            <div className="flex flex-1 flex-col gap-8 px-4 pt-8 pb-4 lg:mt-[78px] lg:px-16 lg:pt-16">
              {/* Brand + name */}
              <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-24 rounded-none bg-[#1a1b1f]" />
                <Skeleton className="h-9 w-3/4 rounded-none bg-[#1a1b1f]" />
              </div>

              {/* Price */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-12 w-40 rounded-none bg-[#1a1b1f]" />
                <Skeleton className="h-4 w-64 rounded-none bg-[#1a1b1f]" />
              </div>

              {/* Specs */}
              <div className="flex flex-col gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-[#1a1b1f] pb-3"
                  >
                    <Skeleton className="h-4 w-28 rounded-none bg-[#1a1b1f]" />
                    <Skeleton className="h-4 w-32 rounded-none bg-[#1a1b1f]" />
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-full rounded-none bg-[#1a1b1f]" />
                <Skeleton className="h-4 w-full rounded-none bg-[#1a1b1f]" />
                <Skeleton className="h-4 w-5/6 rounded-none bg-[#1a1b1f]" />
              </div>

              {/* CTA button */}
              <Skeleton className="h-12 w-full rounded-none bg-[#1a1b1f]" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!watch) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020208]">
        <p className="text-[18px] text-[#edeef0]">Watch not found</p>
      </div>
    )
  }

  const gallery =
    watch.galleryImages && watch.galleryImages.length > 0
      ? watch.galleryImages
      : [watch.image, watch.image, watch.image, watch.image]

  const specs = [
    {
      label: "Reference Number",
      value: watch.referenceNumber ?? watch.ref.replace("Ref. ", ""),
    },
    { label: "Condition", value: watch.condition || "Pre-Owned" },
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
      <div className="relative mx-auto max-w-[1440px]">
        <WatchTopBar watchName={watch.name} />

        <div className="flex flex-col lg:h-screen lg:flex-row">
          <div className="lg:scrollbar-none lg:h-full lg:w-[732px] lg:shrink-0 lg:overflow-y-auto">
            <WatchGallery images={gallery} watchName={watch.name} />
          </div>

          <div className="lg:mt-[78px] lg:scrollbar-none lg:h-[calc(100vh-78px)] lg:flex-1 lg:overflow-y-auto">
            <WatchDetails
              brand={watch.brand}
              name={watch.name}
              price={watch.price}
              specs={specs}
              description={description}
            />
          </div>
        </div>
        <div className="py-16"></div>
        <WatchRelated watches={relatedWatches} />
        <div className="py-16"></div>
        <CtaSection />
        <Footer />
      </div>
    </div>
  )
}

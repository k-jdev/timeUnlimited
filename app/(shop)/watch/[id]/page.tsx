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
import { WatchLoader } from "@/components/ui/WatchLoader"

export default function WatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [watch, setWatch] = useState<InventoryWatch | null>(null)
  const [prevWatch, setPrevWatch] = useState<InventoryWatch | undefined>(
    undefined
  )
  const [nextWatch, setNextWatch] = useState<InventoryWatch | undefined>(
    undefined
  )
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
          const allWatches: InventoryWatch[] =
            relData.products.map(mapProductToWatch)
          const idx = allWatches.findIndex((w) => w.id === id)
          setPrevWatch(idx > 0 ? allWatches[idx - 1] : undefined)
          setNextWatch(
            idx !== -1 && idx < allWatches.length - 1
              ? allWatches[idx + 1]
              : undefined
          )
          setRelatedWatches(allWatches.filter((w) => w.id !== id).slice(0, 3))
        }
      } catch (err) {
        console.error("Error fetching watch:", err)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [id])

  if (isLoading) {
    return <WatchLoader />
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
        <WatchTopBar
          watchName={watch.name}
          prevWatch={prevWatch}
          nextWatch={nextWatch}
        />

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

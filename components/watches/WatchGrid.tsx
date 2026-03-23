"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { RiAddLine } from "@remixicon/react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface WatchCard {
  id: string
  href: string
  brand: string
  name: string
  ref: string
  size: string
  price: string
  image: string
  featured?: boolean
  imageClassName?: string
  glowColor: string
  borderColor: string
}

const WATCHES: WatchCard[] = [
  {
    id: "patek-nautilus",
    href: "/watch/patek-nautilus-1",
    brand: "PATEK PHILIPPE",
    name: "Nautilus Perpetual",
    ref: "Ref. 5740/1G-001",
    size: "40mm",
    price: "$32,000",
    image: "/images/watches/patek-nautilus.webp",
    featured: true,

    glowColor: "#0090FF",
    borderColor: "#5eb1ef",
  },
  {
    id: "ap-royal-oak",
    href: "/watch/ap-royal-oak-1",
    brand: "AUDEMARS PIGUET",
    name: "Royal Oak",
    ref: "Ref. 15500ST",
    size: "41mm",
    price: "$38,500",
    image: "/images/watches/ap-royal-oak.webp",

    glowColor: "#ac871c",
    borderColor: "#ac871c",
  },
  {
    id: "ap-perpetual",
    href: "/watch/ap-perpetual-1",
    brand: "AUDEMARS PIGUET",
    name: "Royal Oak Perpetual",
    ref: "Ref. 26579CE",
    size: "41mm",
    price: "$95,000",
    image: "/images/watches/ap-perpetual.webp",
    imageClassName: "scale-130",
    glowColor: "#eb8e90",
    borderColor: "#eb8e90",
  },
  {
    id: "patek-aquanaut",
    href: "/watch/patek-aquanaut-1",
    brand: "PATEK PHILIPPE",
    name: "Aquanaut Travel Time",
    ref: "Ref. 5164A-001",
    size: "40.8mm",
    price: "$45,000",
    image: "/images/watches/patek-aquanaut.webp",

    glowColor: "#60646c",
    borderColor: "#60646c",
  },
]

export function WatchGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [scrollActiveId, setScrollActiveId] = useState<string | null>(null)
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const setCardRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) cardRefs.current.set(id, el)
      else cardRefs.current.delete(id)
    },
    []
  )

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)")
    if (mql.matches) return

    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.watchId
          if (!id) continue
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }

        let bestId: string | null = null
        let bestRatio = 0
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        })
        if (bestId) setScrollActiveId(bestId)
      },
      {
        rootMargin: "-30% 0px -30% 0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    )

    cardRefs.current.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const activeId =
    hoveredId ?? scrollActiveId ?? WATCHES.find((w) => w.featured)?.id ?? null

  return (
    <div className="flex flex-col">
      <div
        className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2"
        onMouseLeave={() => setHoveredId(null)}
      >
        {WATCHES.map((watch, i) => (
          <motion.div
            key={watch.id}
            ref={setCardRef(watch.id)}
            data-watch-id={watch.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
          >
            <Link href={watch.href} className="block">
              <WatchCardItem
                watch={watch}
                isActive={watch.id === activeId}
                onHover={() => setHoveredId(watch.id)}
              />
            </Link>
          </motion.div>
        ))}
      </div>

      <Link href="/inventory">
        <motion.div
          className="flex h-12 w-full items-center justify-center gap-3 bg-[#111213] text-base font-medium text-[#60646c] transition-colors hover:bg-[#111213]/90 hover:text-[#edeef0]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Show more
          <RiAddLine className="size-4.5" />
        </motion.div>
      </Link>
    </div>
  )
}

function WatchCardItem({
  watch,
  isActive,
  onHover,
}: {
  watch: WatchCard
  isActive: boolean
  onHover: () => void
}) {
  return (
    <div
      className="relative aspect-square cursor-pointer overflow-hidden border-b-4 border-transparent bg-[#111113] transition-[border-color] duration-500 lg:aspect-square"
      style={{ borderColor: isActive ? watch.borderColor : "transparent" }}
      onMouseEnter={onHover}
    >
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 size-79.25 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
        style={{ background: watch.glowColor }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <motion.img
        src={watch.image}
        alt={watch.name}
        draggable={false}
        loading="lazy"
        decoding="async"
        className={cn(
          "absolute left-1/2 w-auto -translate-x-1/2 object-contain",
          watch.imageClassName ?? ""
        )}
        animate={{
          opacity: isActive ? 1 : 0.8,
          filter: isActive
            ? "drop-shadow(0 4px 88px rgba(0,0,0,0.64))"
            : "drop-shadow(0 0px 0px rgba(0,0,0,0))",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      <motion.div
        className="absolute bottom-0 left-0 h-1/3 w-full bg-linear-to-b from-transparent to-black"
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <div
        className={cn(
          "absolute bottom-0 left-0 flex w-full items-end justify-between p-5 transition-all duration-500 lg:p-10",
          isActive
            ? "translate-y-0 opacity-100"
            : "translate-y-0 opacity-0 lg:translate-y-full lg:opacity-100"
        )}
      >
        <div className="flex flex-col gap-2">
          <p className="font-serif text-sm leading-4 tracking-[0.36px] text-white/50 uppercase lg:text-lg lg:leading-5.5">
            {watch.brand}
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-xl leading-7 font-light tracking-[-0.12px] text-[#edeef0] lg:text-[28px] lg:leading-9">
              {watch.name}
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-none bg-white/8 text-xs font-medium text-white/70">
                {watch.ref}
              </Badge>
              <Badge className="rounded-none bg-white/8 text-xs font-medium text-white/70">
                {watch.size}
              </Badge>
            </div>
          </div>
        </div>
        <p className="font-serif text-2xl leading-none tracking-[-0.1px] text-[#edeef0] lg:text-[35px]">
          {watch.price}
        </p>
      </div>
    </div>
  )
}

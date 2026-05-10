import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { InventoryWatch } from "@/data/inventory"

interface InventoryWatchCardProps {
  watch: InventoryWatch
}

export function InventoryWatchCard({ watch }: InventoryWatchCardProps) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(!watch.image)

  return (
    <Link
      href={`/watch/${watch.id}`}
      className="relative block h-[493px] cursor-pointer overflow-hidden border-b-4 border-transparent bg-[#111113] transition-[border-color] duration-500"
      style={{ borderColor: hovered ? watch.borderColor : "transparent" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 size-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
        style={{ background: watch.glowColor }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        className={cn(
          "absolute top-0 left-1/2 size-[350px] -translate-x-1/2",
          imgError && "hidden"
        )}
        animate={{
          opacity: hovered ? 1 : 0.8,
          filter: hovered
            ? "drop-shadow(0 4px 88px rgba(0,0,0,0.64))"
            : "drop-shadow(0 0px 0px rgba(0,0,0,0))",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <img
          src={watch.image}
          alt={watch.name}
          draggable={false}
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          className={cn("size-full object-contain", watch.imageClassName ?? "")}
        />
      </motion.div>

      {imgError && (
        <div className="absolute top-0 left-1/2 flex h-[350px] w-[243px] -translate-x-1/2 items-center justify-center">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-20"
          >
            <circle cx="60" cy="60" r="50" stroke="#edeef0" strokeWidth="3" />
            <circle cx="60" cy="60" r="42" stroke="#edeef0" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="4" fill="#edeef0" />
            <line
              x1="60"
              y1="18"
              x2="60"
              y2="22"
              stroke="#edeef0"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="60"
              y1="98"
              x2="60"
              y2="102"
              stroke="#edeef0"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="18"
              y1="60"
              x2="22"
              y2="60"
              stroke="#edeef0"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="98"
              y1="60"
              x2="102"
              y2="60"
              stroke="#edeef0"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="60"
              y1="60"
              x2="60"
              y2="35"
              stroke="#edeef0"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="60"
              y1="60"
              x2="78"
              y2="60"
              stroke="#edeef0"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 h-1/3 w-full bg-linear-to-b from-transparent to-black"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <div className="absolute top-[355px] left-1/2 flex w-[243px] -translate-x-1/2 flex-col items-center gap-4">
        <div className="flex w-full flex-col items-start gap-[11px]">
          <div className="flex w-full flex-col items-start gap-1 text-center">
            <p className="w-full font-serif text-[16px] leading-[19px] tracking-[0.32px] text-[rgba(237,238,240,0.62)] uppercase">
              {watch.brand}
            </p>
            <p className="w-full text-[18px] leading-[26px] tracking-[-0.04px] text-[#edeef0]">
              {watch.name}
            </p>
          </div>
          <div className="flex w-full flex-wrap items-start justify-center gap-2">
            <Badge className="h-auto rounded-none border-0 bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[12px] leading-4 font-medium tracking-[0.04px] text-[rgba(237,238,240,0.62)]">
              {watch.ref}
            </Badge>
            {watch.size && (
              <Badge className="h-auto rounded-none border-0 bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[12px] leading-4 font-medium tracking-[0.04px] text-[rgba(237,238,240,0.62)]">
                {watch.size}
              </Badge>
            )}
          </div>
        </div>
        <p className="w-full text-center font-serif text-[26px] leading-none tracking-[-0.1px] text-[#edeef0]">
          {watch.price}
        </p>
      </div>
    </Link>
  )
}

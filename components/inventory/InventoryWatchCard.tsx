import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { InventoryWatch } from "@/data/inventory"

interface InventoryWatchCardProps {
  watch: InventoryWatch
}

export function InventoryWatchCard({ watch }: InventoryWatchCardProps) {
  return (
    <Link
      href={`/watch/${watch.id}`}
      className="group relative h-[493px] overflow-hidden bg-[#111113]"
    >
      <div className="absolute top-0 left-1/2 size-[350px] -translate-x-1/2">
        <img
          src={watch.image}
          alt={watch.name}
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="absolute top-[325px] left-1/2 flex h-[119px] w-[243px] -translate-x-1/2 flex-col items-center gap-4">
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
            <Badge className="h-auto rounded-none border-0 bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[12px] leading-4 font-medium tracking-[0.04px] text-[rgba(237,238,240,0.62)]">
              {watch.size}
            </Badge>
          </div>
        </div>
        <p className="w-full flex-[1_0_0] text-center font-serif text-[26px] leading-none tracking-[-0.1px] text-[#edeef0]">
          {watch.price}
        </p>
      </div>
    </Link>
  )
}

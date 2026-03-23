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
      className="group flex flex-col items-center overflow-hidden bg-[#111113] pt-[32px] pb-[30px]"
    >
      <div className="relative flex items-center justify-center">
        <img
          src={watch.image}
          alt={watch.name}
          loading="lazy"
          decoding="async"
          className="size-[400px] object-cover transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      <div className="flex w-[243px] flex-col items-center gap-4 pt-[24px]">
        <div className="flex w-full flex-col items-center gap-[11px]">
          <div className="flex w-full flex-col items-center gap-1 text-center">
            <p className="font-serif text-[16px] leading-[19px] tracking-[0.32px] text-[rgba(237,238,240,0.62)] uppercase">
              {watch.brand}
            </p>
            <p className="text-[18px] leading-[26px] tracking-[-0.04px] text-[#edeef0]">
              {watch.name}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className="rounded-none bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[12px] leading-4 font-medium tracking-[0.04px] text-[rgba(237,238,240,0.62)]">
              {watch.ref}
            </Badge>
            <Badge className="rounded-none bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[12px] leading-4 font-medium tracking-[0.04px] text-[rgba(237,238,240,0.62)]">
              {watch.size}
            </Badge>
          </div>
        </div>
        <p className="font-serif text-[26px] leading-none tracking-[-0.1px] text-[#edeef0]">
          {watch.price}
        </p>
      </div>
    </Link>
  )
}

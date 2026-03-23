import Link from "next/link"
import { RiArrowRightLine } from "@remixicon/react"
import type { InventoryWatch } from "@/data/inventory"

interface WatchRelatedProps {
  watches: InventoryWatch[]
}

export function WatchRelated({ watches }: WatchRelatedProps) {
  return (
    <div className="flex w-full max-w-[1120px] flex-col items-start gap-1 overflow-hidden px-4 lg:px-0">
      <div className="w-full pt-12 pb-8 pl-0 lg:pt-16 lg:pb-12 lg:pl-10">
        <h2 className="font-serif text-[36px] leading-none text-[#edeef0] sm:text-[48px] lg:text-[64px] lg:leading-[66px]">
          You Might Also Like
        </h2>
      </div>

      <div className="flex w-full gap-1 overflow-x-auto lg:overflow-x-visible">
        {watches.map((w) => (
          <Link
            key={w.id}
            href={`/watch/${w.id}`}
            className="flex h-[493px] w-[280px] shrink-0 flex-col overflow-hidden bg-[#111113] sm:w-[340px] lg:w-auto lg:min-w-[340px] lg:flex-[1_0_0] lg:shrink"
          >
            <div className="relative min-h-0 flex-1">
              <img
                src={w.image}
                alt={w.name}
                loading="lazy"
                decoding="async"
                className="pointer-events-none absolute top-1/2 left-1/2 h-full w-auto -translate-x-1/2 -translate-y-1/2 object-contain"
              />
            </div>

            <div className="flex flex-col items-center gap-3 px-4 pt-3 pb-5">
              <div className="flex w-full flex-col items-center gap-2">
                <p className="w-full text-center font-serif text-[16px] leading-[19px] tracking-[0.32px] text-[rgba(237,238,240,0.62)] uppercase">
                  {w.brand}
                </p>
                <p className="w-full text-center text-[18px] leading-[26px] tracking-[-0.04px] text-[#edeef0]">
                  {w.name}
                </p>
                <div className="flex w-full flex-wrap items-center justify-center gap-2">
                  <span className="bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[12px] leading-4 font-medium tracking-[0.04px] text-[rgba(237,238,240,0.62)]">
                    {w.ref}
                  </span>
                  <span className="bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[12px] leading-4 font-medium tracking-[0.04px] text-[rgba(237,238,240,0.62)]">
                    {w.size}
                  </span>
                </div>
              </div>
              <p className="w-full text-center font-serif text-[26px] leading-none tracking-[-0.1px] text-[#edeef0]">
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
  )
}

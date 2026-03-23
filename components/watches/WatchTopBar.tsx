import Link from "next/link"
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"
import { BrandLogo } from "@/components/layout/BrandLogo"
import type { InventoryWatch } from "@/data/inventory"

interface WatchTopBarProps {
  watchName: string
  prevWatch?: InventoryWatch
  nextWatch?: InventoryWatch
}

export function WatchTopBar({
  watchName,
  prevWatch,
  nextWatch,
}: WatchTopBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:pt-[33px]">
      <div className="shrink-0 px-4 pt-6 lg:w-[732px] lg:px-0 lg:pt-0 lg:pl-6">
        <Link href="/">
          <BrandLogo />
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-between px-4 py-3 lg:px-16 lg:py-3">
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
            {watchName}
          </span>
        </div>

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
  )
}

import Link from "next/link"
import { RiArrowRightSLine } from "@remixicon/react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface AdminBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={item.label} className="flex items-center gap-1">
            {index > 0 && (
              <RiArrowRightSLine className="size-3.5 text-[#8b8d98]" />
            )}
            {isLast || !item.href ? (
              <span className={isLast ? "text-[#edeef0]" : "text-[#8b8d98]"}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-[#8b8d98] transition-colors duration-200 hover:text-[#edeef0]"
              >
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

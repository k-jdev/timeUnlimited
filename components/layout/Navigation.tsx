"use client"

import { useState } from "react"
import { motion } from "motion/react"

interface NavItem {
  label: string
  href: string
  active?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#", active: true },
  { label: "Inventory", href: "#inventory" },
  { label: "Source a Watch", href: "#source" },
  { label: "Sell Your Piece", href: "#sell" },
  { label: "Insurance", href: "#insurance" },
  { label: "Contact", href: "#contact" },
]

export function Navigation() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const activeLabel = hoveredItem ?? NAV_ITEMS.find((i) => i.active)?.label

  return (
    <nav className="fixed top-14 right-16 z-30 flex flex-col gap-3">
      {NAV_ITEMS.map((item, i) => {
        const isActive = activeLabel === item.label
        return (
          <motion.a
            key={item.label}
            href={item.href}
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
            className="relative flex items-center text-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: 1,
              x: 0,
              color: isActive ? "#ffffff" : "#8b8d98",
            }}
            transition={{
              opacity: {
                duration: 0.5,
                delay: 0.3 + i * 0.07,
                ease: [0.23, 1, 0.32, 1],
              },
              x: {
                duration: 0.5,
                delay: 0.3 + i * 0.07,
                ease: [0.23, 1, 0.32, 1],
              },
              color: { duration: 0.4, ease: "easeOut" },
            }}
            style={{
              fontWeight: item.active ? 500 : 300,
            }}
          >
            <motion.span
              className="mr-3 block h-px w-8 origin-left bg-white"
              animate={{ scaleX: isActive ? 1 : 0 }}
              initial={false}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            />
            {item.label}
          </motion.a>
        )
      })}
    </nav>
  )
}

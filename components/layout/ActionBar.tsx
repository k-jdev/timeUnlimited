"use client"

import { RiMapPinLine, RiUploadLine, RiMailLine } from "@remixicon/react"

const ACTION_ITEMS = [
  {
    label: "Request",
    icon: RiMapPinLine,
    highlighted: true,
  },
  {
    label: "Sell",
    icon: RiUploadLine,
    highlighted: false,
  },
  {
    label: "Contact",
    icon: RiMailLine,
    highlighted: false,
  },
]

export function ActionBar() {
  return (
    <div className="fixed right-16 bottom-0 z-30 flex">
      {ACTION_ITEMS.map((item) => (
        <button
          key={item.label}
          className={`flex flex-col items-center justify-center gap-1.5 px-6 py-3 text-xs font-medium transition-colors ${
            item.highlighted
              ? "bg-[#001b3a] text-white"
              : "bg-[#0a0a14] text-[#8b8d98] hover:text-white"
          }`}
        >
          <item.icon className="size-5" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

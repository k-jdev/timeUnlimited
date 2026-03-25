"use client"

import { RiArchiveLine, RiCheckLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"

interface ProductFormActionsProps {
  onCancel: () => void
}

export function ProductFormActions({ onCancel }: ProductFormActionsProps) {
  return (
    <div className="mt-8 flex items-center justify-between pt-5">
      <button
        type="button"
        className="flex items-center gap-2 text-sm text-[#d9edff5c] transition-colors duration-200 hover:text-[#edeef0]"
      >
        <RiArchiveLine className="size-4" />
        Archive product
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-[#FF9592] transition-colors duration-200 hover:text-[#ff6b6b]"
        >
          Cancel
        </button>
        <Button
          type="submit"
          size="sm"
          className="flex items-center gap-2 rounded-none bg-[#edeef0] px-5 text-[#020208] hover:bg-white"
        >
          <RiCheckLine className="size-4" />
          Save
        </Button>
      </div>
    </div>
  )
}

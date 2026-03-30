"use client"

import { useState } from "react"
import { RiArchiveLine, RiCheckLine, RiLoader4Line } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { authFetch } from "@/lib/authFetch"

interface ProductFormActionsProps {
  onCancel: () => void
  mode?: "add" | "edit"
  productId?: string
  status?: string
  isFormValid?: boolean
}

export function ProductFormActions({
  onCancel,
  mode,
  productId,
  status,
  isFormValid = true,
}: ProductFormActionsProps) {
  const [isArchiving, setIsArchiving] = useState(false)

  const handleToggleStatus = async () => {
    if (!productId) return

    setIsArchiving(true)
    try {
      const res = await authFetch(`/api/products/${productId}/status`, {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Failed to toggle status")
      }

      window.location.reload()
    } catch (err) {
      console.error(err)
      setIsArchiving(false)
    }
  }

  return (
    <div className="mt-8 flex items-center justify-between pt-5">
      {mode == "edit" && (
        <button
          onClick={handleToggleStatus}
          type="button"
          disabled={isArchiving}
          className="flex items-center gap-2 text-sm text-[#d9edff5c] transition-colors duration-200 hover:text-[#edeef0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isArchiving ? (
            <RiLoader4Line className="size-4 animate-spin" />
          ) : (
            <RiArchiveLine className="size-4" />
          )}
          {status === "active" ? "Archive product" : "Unarchive product"}
        </button>
      )}

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
          disabled={!isFormValid}
          className="flex items-center gap-2 rounded-none bg-[#edeef0] px-5 text-[#020208] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RiCheckLine className="size-4" />
          Save
        </Button>
      </div>
    </div>
  )
}

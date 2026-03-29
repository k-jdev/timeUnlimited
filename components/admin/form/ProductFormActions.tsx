"use client"

import { RiArchiveLine, RiCheckLine } from "@remixicon/react"
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/authFetch"

interface ProductFormActionsProps {
  onCancel: () => void
  mode?: "add" | "edit"
  productId?: string
  status?: string
}



export function ProductFormActions({ onCancel, mode, productId, status }: ProductFormActionsProps) {

  const handleToggleStatus = async () => {
    if (!productId) return

    try {
      const res = await authFetch(`/api/products/${productId}/status`, {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Failed to toggle status")
      }

      const data = await res.json()
      console.log("Updated product:", data)

      // optional: refresh UI
      window.location.reload()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="mt-8 flex items-center justify-between pt-5">
      {mode == "edit" && (
        < button onClick={handleToggleStatus}
          type="button"
          className="flex items-center gap-2 text-sm text-[#d9edff5c] transition-colors duration-200 hover:text-[#edeef0]"
        >
          <RiArchiveLine className="size-4" />
          {
            status === "active" ? "Archive product" : "Unarchive product"
          }
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
          className="flex items-center gap-2 rounded-none bg-[#edeef0] px-5 text-[#020208] hover:bg-white"
        >
          <RiCheckLine className="size-4" />
          Save
        </Button>
      </div>
    </div>
  )
}

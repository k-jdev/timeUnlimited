"use client"

import { useEffect } from "react"
import { RiAlertLine, RiRefreshLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Admin Error]", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-red-500/10">
        <RiAlertLine className="size-8 text-red-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-[#edeef0]">
          Something went wrong
        </h2>
        <p className="max-w-md text-sm text-[#8b8f98]">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="text-xs text-[#8b8f98]/60">Error ID: {error.digest}</p>
        )}
      </div>

      <Button
        onClick={reset}
        variant="outline"
        className="gap-2 border-[#2e3135] bg-white/5 text-[#edeef0] hover:bg-white/10"
      >
        <RiRefreshLine className="size-4" />
        Try again
      </Button>
    </div>
  )
}

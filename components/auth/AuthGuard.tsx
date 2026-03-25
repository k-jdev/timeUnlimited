"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isLoaded, isAuthenticated, router])

  if (!isLoaded || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020208]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2e3135] border-t-[#edeef0]" />
      </div>
    )
  }

  return <>{children}</>
}

"use client"

import { useEffect, useMemo, useState } from "react"
import type { AdminRequest, RequestFilters, RequestStatus } from "@/types"
import { authFetch } from "@/lib/authFetch"

export type RequestTab = "all" | "specific" | "assisted"

export function useRequests() {
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Fetch all requests from API
  const fetchRequests = async () => {
    try {
      const res = await authFetch("/api/requests")
      const data: AdminRequest[] = await res.json()
      setRequests(data)
      setIsLoaded(true)
    } catch (err) {
      console.error("Failed to fetch requests:", err)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // Counts per tab
  const counts = useMemo(
    () => ({
      all: requests.length,
      specific: requests.filter((r) => r.type === "specific").length,
      assisted: requests.filter((r) => r.type === "assisted").length,
    }),
    [requests]
  )

  // Delete request via API
  const deleteRequest = async (id: string) => {
    try {
      const res = await authFetch(`/api/requests/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      setRequests((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  // Update status via API
  const updateStatus = async (id: string, status: RequestStatus) => {
    try {
      const res = await authFetch(`/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Update failed")
      const updated = await res.json()
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)))
    } catch (err) {
      console.error(err)
    }
  }

  // Get filtered requests
  const getFilteredRequests = (
    tab: RequestTab = "all",
    filters?: RequestFilters
  ): AdminRequest[] => {
    let result =
      tab === "all" ? requests : requests.filter((r) => r.type === tab)

    if (!filters) return result

    if (filters.budgetRange) {
      result = result.filter((r) => r.budgetRange === filters.budgetRange)
    }
    if (filters.timeframe) {
      result = result.filter((r) => r.timeframe === filters.timeframe)
    }
    if (filters.brandPreferences) {
      result = result.filter((r) =>
        r.brandPreferences
          ?.toLowerCase()
          .includes(filters.brandPreferences.toLowerCase())
      )
    }
    if (filters.material) {
      result = result.filter((r) => r.material === filters.material)
    }
    if (filters.region) {
      result = result.filter((r) =>
        r.region?.toLowerCase().includes(filters.region.toLowerCase())
      )
    }

    return result
  }

  return {
    requests,
    isLoaded,
    counts,
    deleteRequest,
    updateStatus,
    getFilteredRequests,
    fetchRequests, // optional: to refresh manually
  }
}

"use client"

import { useEffect, useMemo, useState } from "react"
import type { AdminRequest, RequestFilters, RequestStatus } from "@/types"

const STORAGE_KEY = "admin_requests"

export type RequestTab = "all" | "specific" | "assisted"

const SEED_REQUESTS: AdminRequest[] = [
  {
    id: "req-1",
    requestNumber: "000001",
    createdAt: "24.03.26",
    type: "specific",
    status: "new",
    name: "Alex Morgan",
    email: "alex.morgan@gmail.com",
    phone: "+1 (415) 726-8392",
    budgetRange: "$80,000 – $120,000",
    timeframe: "Within 1–2 weeks",
    watchReference: "Patek Philippe Nautilus 5711/1A",
  },
  {
    id: "req-2",
    requestNumber: "000002",
    createdAt: "23.03.26",
    type: "specific",
    status: "pending",
    name: "James Chen",
    email: "james.chen@email.com",
    phone: "+1 (212) 555-0100",
    budgetRange: "$40,000 – $60,000",
    timeframe: "Within 3–4 weeks",
    watchReference: "Rolex Submariner 126610LN",
  },
  {
    id: "req-3",
    requestNumber: "000003",
    createdAt: "22.03.26",
    type: "assisted",
    status: "new",
    name: "Sofia Laurent",
    email: "sofia.l@example.com",
    phone: "+33 6 12 34 56 78",
    budgetRange: "$150,000 – $250,000",
    timeframe: "Flexible",
    brandPreferences: "Patek Philippe, A. Lange & Söhne",
    purpose:
      "Looking for a statement dress watch for formal occasions. Prefer complications such as perpetual calendar or tourbillon. Open to both vintage and modern pieces with excellent provenance.",
    material: "White Gold",
    region: "France (Paris)",
  },
  {
    id: "req-4",
    requestNumber: "000004",
    createdAt: "21.03.26",
    type: "specific",
    status: "approved",
    name: "Daniel Kim",
    email: "d.kim@business.com",
    phone: "+82 10 1234 5678",
    budgetRange: "$25,000 – $35,000",
    timeframe: "Within 2–3 weeks",
    watchReference: "Audemars Piguet Royal Oak 15500ST",
  },
  {
    id: "req-5",
    requestNumber: "000005",
    createdAt: "20.03.26",
    type: "assisted",
    status: "pending",
    name: "Marcus Webb",
    email: "marcus.webb@creative.co",
    phone: "+44 20 7946 0200",
    budgetRange: "$10,000 – $20,000",
    timeframe: "No rush",
    brandPreferences: "Tudor, Longines, Oris",
    purpose:
      "First luxury watch purchase. Looking for something versatile that works both in the office and on weekends. Preferably with a date complication and a clean dial.",
    material: "Stainless Steel",
    region: "United Kingdom (London)",
  },
  {
    id: "req-6",
    requestNumber: "000006",
    createdAt: "19.03.26",
    type: "specific",
    status: "new",
    name: "Isabella Rossi",
    email: "i.rossi@luxe.it",
    phone: "+39 02 1234 5678",
    budgetRange: "$60,000 – $90,000",
    timeframe: "Within 1 month",
    watchReference: "IWC Portugieser Perpetual Calendar IW503316",
  },
  {
    id: "req-7",
    requestNumber: "000007",
    createdAt: "18.03.26",
    type: "assisted",
    status: "rejected",
    name: "Lena Hoffman",
    email: "lena.h@watchlovers.de",
    phone: "+49 89 1234 5678",
    budgetRange: "$5,000 – $10,000",
    timeframe: "Within 2 weeks",
    brandPreferences: "Grand Seiko, Nomos",
    purpose:
      "Looking for a minimalist everyday watch with excellent movement quality. Interested in both Japanese and German watchmaking traditions. Condition must be excellent.",
    material: "Titanium",
    region: "Germany (Munich)",
  },
  {
    id: "req-8",
    requestNumber: "000008",
    createdAt: "17.03.26",
    type: "specific",
    status: "pending",
    name: "Carlos Mendez",
    email: "c.mendez@finance.mx",
    phone: "+52 55 1234 5678",
    budgetRange: "$30,000 – $45,000",
    timeframe: "Within 3 weeks",
    watchReference: "Cartier Santos Large WSSA0018",
  },
]

function readFromStorage(): AdminRequest[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REQUESTS))
      return SEED_REQUESTS
    }
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function writeToStorage(requests: AdminRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
}

export function useRequests() {
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setRequests(readFromStorage())
    setIsLoaded(true)
  }, [])

  const counts = useMemo(
    () => ({
      all: requests.length,
      specific: requests.filter((r) => r.type === "specific").length,
      assisted: requests.filter((r) => r.type === "assisted").length,
    }),
    [requests]
  )

  function deleteRequest(id: string) {
    setRequests((prev) => {
      const next = prev.filter((r) => r.id !== id)
      writeToStorage(next)
      return next
    })
  }

  function updateStatus(id: string, status: RequestStatus) {
    setRequests((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, status } : r))
      writeToStorage(next)
      return next
    })
  }

  function getFilteredRequests(
    tab: RequestTab,
    filters?: RequestFilters
  ): AdminRequest[] {
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
  }
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb"
import { useRequests, type RequestTab } from "@/hooks/useRequests"
import { EMPTY_FILTERS, type RequestFilters, type RequestStatus } from "@/types"
import { cn } from "@/lib/utils"
import { RequestCard } from "./RequestCard"
import { RequestsFilterModal } from "./RequestsFilterModal"
import { RequestsToolbar } from "./RequestsToolbar"

type RequestMode = "request" | "sell"

const MODE_OPTIONS: { value: RequestMode; label: string }[] = [
  { value: "request", label: "Buy Requests" },
  { value: "sell", label: "Sell Requests" },
]

export function RequestsView() {
  const [mode, setMode] = useState<RequestMode>("request")

  const {
    isLoaded,
    requests,
    counts,
    deleteRequest,
    updateStatus,
    getFilteredRequests,
  } = useRequests(mode)

  const [activeTab, setActiveTab] = useState<RequestTab>("all")
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] =
    useState<RequestFilters>(EMPTY_FILTERS)

  // Reset tabs and expand state when mode changes
  useEffect(() => {
    setActiveTab("all")
    setExpandedIds(new Set())
    setActiveFilters(EMPTY_FILTERS)
  }, [mode])

  // Expand all requests once data loads
  useEffect(() => {
    if (isLoaded && requests.length > 0) {
      setExpandedIds(new Set(requests.map((r) => r.id)))
    }
  }, [isLoaded, requests.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredRequests = useMemo(
    () => getFilteredRequests(activeTab, activeFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTab, counts, activeFilters]
  )

  function handleTabChange(tab: RequestTab) {
    setActiveTab(tab)
  }

  function handleToggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleStatusChange(id: string, status: RequestStatus) {
    updateStatus(id, status)
  }

  function handleDelete(id: string) {
    deleteRequest(id)
  }

  return (
    <div className="mx-auto max-w-360 px-6 pt-8 pb-16 lg:px-10">
      {/* Header row */}
      <div className="mb-6 flex flex-col gap-4">
        <h1 className="font-serif text-[40px] text-[#edeef0] lg:text-[48px]">
          Requests
        </h1>

        {/* Tabs row: All/Specific/Assisted + filter on left, Buy/Sell on right */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <RequestsToolbar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onOpenFilter={() => setFilterModalOpen(true)}
          />
          <div className="flex items-center gap-1">
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMode(opt.value)}
                className={cn(
                  "h-10 px-4 text-[16px] font-medium transition-colors duration-200",
                  mode === opt.value
                    ? "bg-[#191c1e] text-[#edeef0]"
                    : "bg-[#111213] text-[#8b8d98] hover:bg-white/8 hover:text-[#edeef0]"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!isLoaded ? (
        <div className="h-100" />
      ) : filteredRequests.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-[#8b8d98]">No requests found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              isExpanded={expandedIds.has(request.id)}
              onToggleExpand={() => handleToggleExpand(request.id)}
              onStatusChange={(status) =>
                handleStatusChange(request.id, status)
              }
              onDelete={() => handleDelete(request.id)}
            />
          ))}
        </div>
      )}

      <RequestsFilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={activeFilters}
        onApply={(filters) => setActiveFilters(filters)}
      />
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb"
import { useRequests, type RequestTab } from "@/hooks/useRequests"
import { EMPTY_FILTERS, type RequestFilters, type RequestStatus } from "@/types"
import { RequestCard } from "./RequestCard"
import { RequestsFilterModal } from "./RequestsFilterModal"
import { RequestsToolbar } from "./RequestsToolbar"

export function RequestsView({ type }: { type: "sell" | "request" }) {
  const {
    isLoaded,
    requests,
    counts,
    deleteRequest,
    updateStatus,
    getFilteredRequests,
  } = useRequests(type)

  const [activeTab, setActiveTab] = useState<RequestTab>("all")
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] =
    useState<RequestFilters>(EMPTY_FILTERS)

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

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-360 px-6 pt-8 pb-16 lg:px-10">
        <div className="h-100" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-360 px-6 pt-8 pb-16 lg:px-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-[40px] text-[#edeef0] lg:text-[48px]">
          Requests
        </h1>
        <RequestsToolbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onOpenFilter={() => setFilterModalOpen(true)}
        />
      </div>

      {filteredRequests.length === 0 ? (
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

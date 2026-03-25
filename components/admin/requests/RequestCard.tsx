"use client"

import { RiDeleteBinLine } from "@remixicon/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RequestTypeBadge } from "./RequestTypeBadge"
import type { AdminRequest, RequestStatus } from "@/types"

const STATUS_OPTIONS: { value: RequestStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1.25">
      <span className="text-xs text-[#8b8d98]">{label}</span>
      <span className="text-xs font-medium text-[#edeef0]">{value || "—"}</span>
    </div>
  )
}

interface RequestCardProps {
  request: AdminRequest
  isExpanded: boolean
  onToggleExpand: () => void
  onStatusChange: (status: RequestStatus) => void
  onDelete: () => void
}

export function RequestCard({
  request,
  isExpanded,
  onToggleExpand,
  onStatusChange,
  onDelete,
}: RequestCardProps) {
  return (
    <div className="border border-[#2e3135] bg-white/2">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center justify-between p-6 select-none"
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onToggleExpand()
          }
        }}
      >
        {/* Left: request number + date */}
        <div className="flex items-end gap-2">
          <span className="text-xl text-[#edeef0]">
            Request #{request.requestNumber}
          </span>
          <span className="pb-0.75 text-xs text-[#8b8d98]">
            Created: {request.createdAt}
          </span>
        </div>

        {/* Right: badge + status + delete (stop propagation so clicks don't toggle) */}
        <div
          className="flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <RequestTypeBadge type={request.type} />

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8b8d98]">Status</span>
            <Select
              value={request.status}
              onValueChange={(v) => onStatusChange(v as RequestStatus)}
            >
              <SelectTrigger className="h-6 w-auto gap-1 rounded-none border-[#2e3135] bg-transparent px-2 text-xs text-[#edeef0] focus-visible:border-[#5eb1ef] focus-visible:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type="button"
            onClick={onDelete}
            className="flex size-8 items-center justify-center text-[#8b8d98] transition-colors duration-200 hover:text-[#e54d4d]"
            aria-label="Delete request"
          >
            <RiDeleteBinLine className="size-4" />
          </button>
        </div>
      </div>

      {/* Body — accordion */}
      {isExpanded && (
        <div className="px-6 pb-6">
          {request.type === "specific" ? (
            /* Specific: single row of 6 fields */
            <div className="flex items-start">
              {/* First field: fixed width, less left padding */}
              <div className="w-73.75 shrink-0 pr-3 pl-1">
                <Field
                  label="Watch Name / Model / Reference"
                  value={request.watchReference}
                />
              </div>
              <div className="flex flex-1 items-start">
                <div className="flex-1 px-3">
                  <Field label="Budget Range" value={request.budgetRange} />
                </div>
                <div className="flex-1 px-3">
                  <Field label="Timeframe" value={request.timeframe} />
                </div>
                <div className="flex-1 px-3">
                  <Field label="Email" value={request.email} />
                </div>
                <div className="flex-1 px-3">
                  <Field label="Name" value={request.name} />
                </div>
                <div className="flex-1 px-3">
                  <Field label="Phone" value={request.phone} />
                </div>
              </div>
            </div>
          ) : (
            /* Assisted: 3 columns of stacked fields + Purpose textarea on the right */
            <div className="flex gap-6">
              {/* Left: 3 columns */}
              <div className="flex flex-1 items-start">
                {/* Col 1 */}
                <div className="flex w-55 shrink-0 flex-col gap-6 pr-3 pl-1">
                  <Field
                    label="Brand Preferences"
                    value={request.brandPreferences}
                  />
                  <Field label="Budget Range" value={request.budgetRange} />
                  <Field label="Material" value={request.material} />
                </div>
                {/* Col 2 */}
                <div className="flex flex-1 flex-col gap-6 px-3">
                  <Field label="Timeframe" value={request.timeframe} />
                  <Field label="Name" value={request.name} />
                  <Field label="Region" value={request.region} />
                </div>
                {/* Col 3 */}
                <div className="flex flex-1 flex-col gap-6 px-3">
                  <Field label="Phone" value={request.phone} />
                  <Field label="Email" value={request.email} />
                </div>
              </div>

              {/* Right: Purpose box */}
              <div className="flex w-95 shrink-0 flex-col gap-1.25">
                <span className="text-xs text-[#8b8d98]">Purpose</span>
                <div className="min-h-30 border border-[#2e3135] p-3 text-xs leading-5 text-[#edeef0]">
                  {request.purpose || "—"}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

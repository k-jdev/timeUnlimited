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
    <div className="flex flex-col gap-[5px]">
      <span className="text-[12px] leading-4 tracking-[0.04px] text-[#43484E]">
        {label}
      </span>
      <span className="overflow-hidden text-[12px] leading-4 font-medium tracking-[0.04px] text-ellipsis whitespace-nowrap text-[#edeef0]">
        {value || "вЂ”"}
      </span>
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
  onStatusChange,
  onDelete,
}: RequestCardProps) {
  return (
    <div className="flex flex-col gap-3 border border-[#d6ebfd30] bg-[#101010] px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: request number + date */}
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-end sm:gap-2">
          <span className="text-[18px] leading-6 tracking-[-0.08px] text-[#edeef0] sm:text-[20px] sm:leading-7">
            Request #{request.requestNumber}
          </span>
          <span className="text-[12px] leading-4 tracking-[0.04px] text-[#43484E] sm:pb-[3px]">
            Created: {request.createdAt}
          </span>
        </div>

        {/* Right: badge + status + delete */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <RequestTypeBadge type={request.type} />

          <div className="flex items-center gap-2">
            <span className="text-[12px] leading-4 tracking-[0.04px] text-[#cdced6]">
              Status
            </span>
            <Select
              value={request.status}
              onValueChange={(v) => onStatusChange(v as RequestStatus)}
            >
              <SelectTrigger className="h-6 w-auto gap-1 rounded-none border-[#2e3135] bg-transparent px-2 text-[12px] font-medium text-[#edeef0] focus-visible:border-[#5eb1ef] focus-visible:ring-0">
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
            className="flex size-8 items-center justify-center text-[#cdced6] transition-colors duration-200 hover:text-[#e54d4d]"
            aria-label="Delete request"
          >
            <RiDeleteBinLine className="size-4" />
          </button>
        </div>
      </div>

      {/* Fields row */}
      {request.type === "specific" ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="sm:w-[295px] sm:shrink-0 sm:pr-3 sm:pl-1">
            <Field
              label="Watch Name / Model / Reference"
              value={request.watchReference}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:flex sm:min-w-0 sm:flex-1 sm:items-start sm:gap-0">
            <div className="sm:min-w-0 sm:flex-1 sm:px-3">
              <Field label="Budget Range" value={request.budgetRange} />
            </div>
            <div className="sm:min-w-0 sm:flex-1 sm:px-3">
              <Field label="Timeframe" value={request.timeframe} />
            </div>
            <div className="sm:min-w-0 sm:flex-1 sm:px-3">
              <Field label="Email" value={request.email} />
            </div>
            <div className="sm:min-w-0 sm:flex-1 sm:px-3">
              <Field label="Name" value={request.name} />
            </div>
            <div className="sm:min-w-0 sm:flex-1 sm:px-3">
              <Field label="Phone" value={request.phone} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start">
            <div className="grid grid-cols-2 gap-4 sm:flex sm:w-[220px] sm:shrink-0 sm:flex-col sm:gap-5 sm:pr-3 sm:pl-1">
              <Field
                label="Brand Preferences"
                value={request.brandPreferences}
              />
              <Field label="Budget Range" value={request.budgetRange} />
              <Field label="Material" value={request.material} />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:flex sm:min-w-0 sm:flex-1 sm:flex-col sm:gap-5 sm:px-3">
              <Field label="Timeframe" value={request.timeframe} />
              <Field label="Name" value={request.name} />
              <Field label="Region" value={request.region} />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:flex sm:min-w-0 sm:flex-1 sm:flex-col sm:gap-5 sm:px-3">
              <Field label="Phone" value={request.phone} />
              <Field label="Email" value={request.email} />
            </div>
          </div>
          <div className="flex flex-col gap-[5px] lg:w-[380px] lg:shrink-0">
            <span className="text-[12px] leading-4 tracking-[0.04px] text-[#cdced6]">
              Purpose
            </span>
            <div className="min-h-[120px] border border-[#2e3135] p-3 text-[12px] leading-5 text-[#edeef0]">
              {request.purpose || "вЂ”"}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

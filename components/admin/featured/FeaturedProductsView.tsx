"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { RiAddLine, RiDraggable, RiCloseLine } from "@remixicon/react"
import { authFetch } from "@/lib/authFetch"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductPickerModal } from "./ProductPickerModal"
import type { AdminProduct } from "@/types"

const MAX_FEATURED = 4

function SortableCard({
  product,
  onRemove,
}: {
  product: AdminProduct
  onRemove: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const thumb =
    (
      product.images as
        | Array<{ image_url: string; is_main: boolean }>
        | undefined
    )?.find((img) => img.is_main)?.image_url ??
    (product.images as Array<{ image_url: string }> | undefined)?.[0]?.image_url

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 border border-[#2e3135] bg-[#111213] px-3 py-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab text-[#60646c] transition-colors hover:text-[#edeef0] active:cursor-grabbing"
        style={{ touchAction: "none" }}
        aria-label="Drag to reorder"
      >
        <RiDraggable className="size-5" />
      </button>

      <div className="size-12 shrink-0 bg-[#1a1b1f]">
        {thumb && (
          <img
            src={thumb}
            alt={product.name}
            className="size-full object-contain"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium text-[#edeef0]">
          {product.brand} {product.name || product.model}
        </span>
        <span className="text-xs text-[#60646c]">
          {product.ref || product.reference_number}
        </span>
      </div>

      <span className="ml-auto shrink-0 text-sm text-[#edeef0]">
        {product.price}
      </span>

      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 text-[#60646c] transition-colors hover:text-red-400"
        aria-label="Remove"
      >
        <RiCloseLine className="size-5" />
      </button>
    </div>
  )
}

export function FeaturedProductsView() {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const [featured, setFeatured] = useState<AdminProduct[]>([])
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  )
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    authFetch("/api/products?status=active&limit=100")
      .then((res) => res.json())
      .then((data: { products?: AdminProduct[] }) => {
        const all = data.products ?? []
        const onMain = all
          .filter((p) => p.show_on_main)
          .sort((a, b) => (a.show_order ?? 0) - (b.show_order ?? 0))
        setFeatured(onMain)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setFeatured((items) => {
      const oldIndex = items.findIndex((p) => p.id === active.id)
      const newIndex = items.findIndex((p) => p.id === over.id)
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  function handleAdd(product: AdminProduct) {
    if (featured.length >= MAX_FEATURED) return
    setFeatured((prev) => [...prev, product])
    setRemovedIds((prev) => prev.filter((id) => id !== product.id))
    setPickerOpen(false)
  }

  async function handleRemove(id: string) {
    const product = featured.find((p) => p.id === id)
    setFeatured((prev) => prev.filter((p) => p.id !== id))
    if (!product) return
    try {
      await authFetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: product.brand,
          model: product.model || product.name,
          price: product.price,
          referenceNumber: product.reference_number || product.ref,
          description: product.description ?? "",
          condition: product.condition,
          caseMaterial: product.case_material || product.caseMaterial,
          caseSize: product.case_size || product.size,
          dial: product.dial,
          hoverColor: product.hover_color || product.hoverColor,
          show_on_main: false,
          show_order: 0,
        }),
      })
    } catch (err) {
      console.error("Failed to remove featured product:", err)
    }
  }

  async function handleSave() {
    setSaving(true)
    setSaveStatus("idle")
    try {
      const requests: Promise<Response>[] = []

      featured.forEach((product, index) => {
        requests.push(
          authFetch(`/api/products/${product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              brand: product.brand,
              model: product.model || product.name,
              price: product.price,
              referenceNumber: product.reference_number || product.ref,
              description: product.description ?? "",
              condition: product.condition,
              caseMaterial: product.case_material || product.caseMaterial,
              caseSize: product.case_size || product.size,
              dial: product.dial,
              hoverColor: product.hover_color || product.hoverColor,
              show_on_main: true,
              show_order: index,
            }),
          })
        )
      })

      removedIds.forEach((id) => {
        requests.push(
          authFetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ show_on_main: false, show_order: 0 }),
          })
        )
      })

      await Promise.all(requests)
      setRemovedIds([])
      setSaveStatus("success")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch {
      setSaveStatus("error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-4">
      <p className="mb-4 text-sm text-[#60646c]">
        Select up to {MAX_FEATURED} products to feature on the home page.
      </p>

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-18 w-full rounded-none bg-[#1a1b1f]"
            />
          ))}
        </div>
      ) : (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={featured.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                {featured.map((product) => (
                  <SortableCard
                    key={product.id}
                    product={product}
                    onRemove={() => handleRemove(product.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {featured.length === 0 && (
            <p className="py-12 text-center text-sm text-[#60646c]">
              No featured products yet. Add up to {MAX_FEATURED}.
            </p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              disabled={featured.length >= MAX_FEATURED}
              className="flex items-center gap-2 border border-[#2e3135] px-4 py-2 text-sm text-[#edeef0] transition-colors hover:bg-[#1a1b1f] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RiAddLine className="size-4" />
              Add product
              {featured.length >= MAX_FEATURED && " (max reached)"}
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-[#edeef0] px-6 py-2 text-sm font-medium text-[#020208] transition-colors hover:bg-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            {saveStatus === "success" && (
              <span className="text-sm text-green-400">Saved!</span>
            )}
            {saveStatus === "error" && (
              <span className="text-sm text-red-400">
                Failed to save. Try again.
              </span>
            )}
          </div>
        </>
      )}

      {pickerOpen && (
        <ProductPickerModal
          excludeIds={featured.map((p) => p.id)}
          onSelect={handleAdd}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { RiCloseLine, RiSearchLine } from "@remixicon/react"
import { authFetch } from "@/lib/authFetch"
import { Skeleton } from "@/components/ui/skeleton"
import type { AdminProduct } from "@/types"

interface ProductPickerModalProps {
  excludeIds: string[]
  onSelect: (product: AdminProduct) => void
  onClose: () => void
}

export function ProductPickerModal({
  excludeIds,
  onSelect,
  onClose,
}: ProductPickerModalProps) {
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const res = await authFetch(
        `/api/products?status=active&search=${encodeURIComponent(q)}&limit=50`
      )
      const data = await res.json()
      setProducts(data.products ?? [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts("")
  }, [fetchProducts])

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(search), 300)
    return () => clearTimeout(timer)
  }, [search, fetchProducts])

  const available = products.filter((p) => !excludeIds.includes(p.id))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative flex w-full max-w-lg flex-col gap-4 bg-[#111213] p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#edeef0]">Choose product</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#60646c] transition-colors hover:text-[#edeef0]"
          >
            <RiCloseLine className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 border border-[#2e3135] px-3">
          <RiSearchLine className="size-4 shrink-0 text-[#60646c]" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by brand or model..."
            className="w-full bg-transparent py-2.5 text-sm text-[#edeef0] placeholder:text-[#60646c] focus:outline-none"
          />
        </div>

        <div className="flex max-h-96 flex-col gap-1 overflow-y-auto">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-14 w-full rounded-none bg-[#1a1b1f]"
              />
            ))
          ) : available.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#60646c]">
              {search
                ? "No products match your search."
                : "No available products."}
            </p>
          ) : (
            available.map((product) => {
              const thumb =
                (
                  product.images as
                    | Array<{ image_url: string; is_main: boolean }>
                    | undefined
                )?.find((img) => img.is_main)?.image_url ??
                (
                  product.images as Array<{ image_url: string }> | undefined
                )?.[0]?.image_url

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onSelect(product)}
                  className="flex items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-[#1a1b1f]"
                >
                  <div className="size-10 shrink-0 bg-[#1a1b1f]">
                    {thumb && (
                      <img
                        src={thumb}
                        alt={product.name}
                        className="size-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#edeef0]">
                      {product.brand} {product.name || product.model}
                    </span>
                    <span className="text-xs text-[#60646c]">
                      {product.ref || product.reference_number}
                    </span>
                  </div>
                  <span className="ml-auto text-sm text-[#edeef0]">
                    {product.price}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

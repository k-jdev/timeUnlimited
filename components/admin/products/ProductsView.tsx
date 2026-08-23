"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { RiAddLine } from "@remixicon/react"
import { authFetch } from "@/lib/authFetch"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductsToolbar } from "./ProductsToolbar"
import { ProductsTable } from "./ProductsTable"
import { ProductsPagination } from "./ProductsPagination"
import { ProductsSelectionBar } from "./ProductsSelectionBar"
import type { AdminProduct } from "@/types"
import type { ProductTab } from "@/hooks/useProducts"
import { FeaturedProductsView } from "@/components/admin/featured/FeaturedProductsView"

export type { ProductTab }

export function ProductsView() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [total, setTotal] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [activeTab, setActiveTab] = useState<ProductTab>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(15)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  // --- Fetch products from API ---
  useEffect(() => {
    if (activeTab === "featured") return

    const fetchProducts = async () => {
      setIsFetching(true)
      try {
        const res = await authFetch(
          `/api/products?search=${searchQuery}&status=${activeTab}&page=${currentPage}&limit=${itemsPerPage}`
        )
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const data = await res.json()

        setProducts(data.products ?? [])
        setTotal(data.total ?? 0)
      } catch (err) {
        console.error("Error fetching products:", err)
        setProducts([])
        setTotal(0)
      }
      setIsLoaded(true)
      setIsFetching(false)
    }

    fetchProducts()
  }, [activeTab, searchQuery, currentPage, itemsPerPage])

  // --- Handlers ---
  function handleTabChange(tab: ProductTab) {
    setActiveTab(tab)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  function handleSearchChange(query: string) {
    setSearchQuery(query)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  function handleItemsPerPageChange(count: number) {
    setItemsPerPage(count)
    setCurrentPage(1)
    setSelectedIds(new Set())
  }

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleToggleSelectAll() {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)))
    }
  }

  async function handleDeleteSelected() {
    const ids = Array.from(selectedIds)
    try {
      await Promise.all(
        ids.map((id) => authFetch(`/api/products/${id}`, { method: "DELETE" }))
      )
      setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)))
      setTotal((prev) => prev - ids.length)
      setSelectedIds(new Set())
      setCurrentPage(1)
    } catch (err) {
      console.error("Failed to delete products:", err)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-360 px-6 pt-8 pb-16 lg:px-10">
        <div className="h-100" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-360 px-6 pt-8 pb-16 lg:px-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-[40px] text-[#edeef0] lg:text-[48px]">
          Products
        </h1>
        <Link
          href="/admin/inventory/add"
          className="flex items-center gap-2 bg-[#edeef0] px-5 py-2 text-sm font-medium text-[#020208] transition-colors duration-200 hover:bg-white"
        >
          <RiAddLine className="size-4" />
          Add product
        </Link>
      </div>

      <ProductsToolbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {activeTab === "featured" ? (
        <FeaturedProductsView />
      ) : (
        <>
          <ProductsSelectionBar
            selectedCount={selectedIds.size}
            onDelete={handleDeleteSelected}
            onClear={() => setSelectedIds(new Set())}
          />

          {isFetching ? (
            <div className="flex flex-col">
              {Array.from({ length: itemsPerPage > 8 ? 8 : itemsPerPage }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border-b border-[#d6ebfd15] px-4 py-3"
                  >
                    <Skeleton className="size-5 rounded-none bg-[#1a1b1f]" />
                    <Skeleton className="size-10 rounded-none bg-[#1a1b1f]" />
                    <Skeleton className="h-4 w-48 rounded-none bg-[#1a1b1f]" />
                    <Skeleton className="ml-auto h-5 w-16 rounded-none bg-[#1a1b1f]" />
                  </div>
                )
              )}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <p className="text-[#8b8d98]">
                {total === 0
                  ? "No products yet."
                  : "No products match your search."}
              </p>
              {total === 0 && (
                <Link
                  href="/admin/inventory/add"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Add your first product
                </Link>
              )}
            </div>
          ) : (
            <ProductsTable
              products={products}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
            />
          )}

          {total > 0 && (
            <ProductsPagination
              totalItems={total}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

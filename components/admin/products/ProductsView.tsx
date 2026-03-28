"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { RiAddLine } from "@remixicon/react"
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb"
import { authFetch } from "@/lib/authFetch"
import { ProductsToolbar } from "./ProductsToolbar"
import { ProductsTable } from "./ProductsTable"
import { ProductsPagination } from "./ProductsPagination"
import { ProductsSelectionBar } from "./ProductsSelectionBar"
import type { AdminProduct } from "@/types"
import type { ProductTab } from "@/hooks/useProducts"

export type { ProductTab }

export function ProductsView() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [total, setTotal] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<ProductTab>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(15)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [counts, setCounts] = useState<{ [key in ProductTab]: number }>({
    all: 0,
    active: 0,
    archived: 0,
  })

  // --- Fetch products from API ---
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoaded(false)
      try {
        const res = await authFetch(
          `/api/products?search=${searchQuery}&status=${activeTab}&page=${currentPage}&limit=${itemsPerPage}`
        )
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const data: { products: AdminProduct[]; total: number } =
          await res.json()

        const products = data.products ?? []
        const total = data.total ?? 0

        setProducts(products)
        setTotal(total)

        setCounts({
          all: total,
          active: products.filter((p) => p.status === "active").length,
          archived: products.filter((p) => p.status === "archived").length,
        })
      } catch (err) {
        console.error("Error fetching products:", err)
        setProducts([])
        setTotal(0)
      }
      setIsLoaded(true)
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

  function handleDeleteSelected() {
    // Можно добавить вызов DELETE API для каждого id
    const remaining = products.filter((p) => !selectedIds.has(p.id))
    setProducts(remaining)
    setSelectedIds(new Set())
    setCurrentPage(1)
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

      <ProductsSelectionBar
        selectedCount={selectedIds.size}
        onDelete={handleDeleteSelected}
        onClear={() => setSelectedIds(new Set())}
      />

      {products.length === 0 ? (
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
    </div>
  )
}

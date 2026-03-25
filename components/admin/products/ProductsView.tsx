"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { RiAddLine } from "@remixicon/react"
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb"
import { useProducts, type ProductTab } from "@/hooks/useProducts"
import { ProductsToolbar } from "./ProductsToolbar"
import { ProductsTable } from "./ProductsTable"
import { ProductsPagination } from "./ProductsPagination"

export function ProductsView() {
  const { isLoaded, counts, deleteProducts, getFilteredProducts } =
    useProducts()

  const [activeTab, setActiveTab] = useState<ProductTab>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(15)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filteredProducts = useMemo(
    () => getFilteredProducts(activeTab, searchQuery),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTab, searchQuery, counts]
  )

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage)
  )
  const safePage = Math.min(currentPage, totalPages)

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage
    return filteredProducts.slice(start, start + itemsPerPage)
  }, [filteredProducts, safePage, itemsPerPage])

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
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleToggleSelectAll() {
    if (selectedIds.size === paginatedProducts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedProducts.map((p) => p.id)))
    }
  }

  function handleDeleteSelected() {
    deleteProducts(Array.from(selectedIds))
    setSelectedIds(new Set())
    setCurrentPage(1)
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
      <div className="mb-8">
        <AdminBreadcrumb items={[{ label: "All products" }]} />
      </div>

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
        selectedCount={selectedIds.size}
        onDeleteSelected={handleDeleteSelected}
      />

      {paginatedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="text-[#8b8d98]">
            {filteredProducts.length === 0 && counts.all === 0
              ? "No products yet."
              : "No products match your search."}
          </p>
          {counts.all === 0 && (
            <Link
              href="/admin/inventory/add"
              className="text-sm text-[#5eb1ef] underline-offset-4 hover:underline"
            >
              Add your first product
            </Link>
          )}
        </div>
      ) : (
        <ProductsTable
          products={paginatedProducts}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
        />
      )}

      {filteredProducts.length > 0 && (
        <ProductsPagination
          totalItems={filteredProducts.length}
          currentPage={safePage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  )
}

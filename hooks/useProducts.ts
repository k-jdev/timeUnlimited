import { useEffect, useState } from "react"

export type ProductTab = "all" | "active" | "archived"

export interface Product {
  id: string
  brand: string
  model: string
  price: string
  status: string
  [key: string]: any
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  async function fetchProducts(
    search = "",
    status: ProductTab = "all",
    page = 1,
    limit = 15
  ) {
    const params = new URLSearchParams()
    params.set("search", search)
    params.set("status", status)
    params.set("page", page.toString())
    params.set("limit", limit.toString())

    const res = await fetch(`/api/products?${params.toString()}`)
    const data = await res.json()
    setProducts(data)
    setIsLoaded(true)
  }

  const deleteProducts = (ids: string[]) => {
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)))
    // Можно добавить DELETE API
  }

  const getFilteredProducts = (tab: ProductTab, search: string) => {
    return products.filter((p) => {
      const matchesTab = tab === "all" || p.status === tab
      const matchesSearch =
        !search ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.model.toLowerCase().includes(search.toLowerCase())
      return matchesTab && matchesSearch
    })
  }

  const counts = {
    all: products.length,
    active: products.filter((p) => p.status === "active").length,
    archived: products.filter((p) => p.status === "archived").length,
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    isLoaded,
    products,
    counts,
    fetchProducts,
    deleteProducts,
    getFilteredProducts,
  }
}

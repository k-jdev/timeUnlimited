"use client"

import { useEffect, useMemo, useState } from "react"
import type { AdminProduct, ProductStatus } from "@/types"

const STORAGE_KEY = "admin_products"

export type ProductTab = "all" | "active" | "archived"

const SEED_PRODUCTS: AdminProduct[] = [
  {
    id: "seed-1",
    brand: "Patek Philippe",
    name: "Nautilus Perpetual",
    ref: "5740/1G-001",
    size: "41mm",
    price: "5926.32",
    image: "/images/watches/patek-nautilus.webp",
    status: "archived",
    caseMaterial: "Stainless Steel",
    dialColor: "White",
    condition: "Pre-owned",
  },
  {
    id: "seed-2",
    brand: "Patek Philippe",
    name: "Nautilus Perpetual",
    ref: "5740/1G-001",
    size: "41mm",
    price: "5926.32",
    image: "/images/watches/patek-nautilus.webp",
    status: "archived",
    caseMaterial: "Stainless Steel",
    dialColor: "White",
    condition: "Pre-owned",
  },
  {
    id: "seed-3",
    brand: "Patek Philippe",
    name: "Nautilus Perpetual",
    ref: "5740/1G-001",
    size: "41mm",
    price: "510.71",
    image: "/images/watches/patek-nautilus.webp",
    status: "active",
    caseMaterial: "Stainless Steel",
    dialColor: "White",
    condition: "New",
  },
  {
    id: "seed-4",
    brand: "Patek Philippe",
    name: "Nautilus Perpetual",
    ref: "5740/1G-001",
    size: "41mm",
    price: "7086.72",
    image: "/images/watches/patek-nautilus.webp",
    status: "archived",
    caseMaterial: "Stainless Steel",
    dialColor: "White",
    condition: "Pre-owned",
  },
  {
    id: "seed-5",
    brand: "Patek Philippe",
    name: "Nautilus Perpetual",
    ref: "5740/1G-001",
    size: "41mm",
    price: "7239.72",
    image: "/images/watches/patek-nautilus.webp",
    status: "archived",
    caseMaterial: "Stainless Steel",
    dialColor: "White",
    condition: "Pre-owned",
  },
  {
    id: "seed-6",
    brand: "Patek Philippe",
    name: "Nautilus Perpetual",
    ref: "5740/1G-001",
    size: "41mm",
    price: "9963.17",
    image: "/images/watches/patek-nautilus.webp",
    status: "active",
    caseMaterial: "Stainless Steel",
    dialColor: "White",
    condition: "New",
  },
  {
    id: "seed-7",
    brand: "Patek Philippe",
    name: "Nautilus Perpetual",
    ref: "5740/1G-001",
    size: "41mm",
    price: "1460.19",
    image: "/images/watches/patek-nautilus.webp",
    status: "active",
    caseMaterial: "Stainless Steel",
    dialColor: "White",
    condition: "New",
  },
  {
    id: "seed-8",
    brand: "Patek Philippe",
    name: "Nautilus Perpetual",
    ref: "5740/1G-001",
    size: "41mm",
    price: "5218.82",
    image: "/images/watches/patek-nautilus.webp",
    status: "active",
    caseMaterial: "Stainless Steel",
    dialColor: "White",
    condition: "New",
  },
  {
    id: "seed-9",
    brand: "Audemars Piguet",
    name: "Royal Oak",
    ref: "15500ST.OO.1256ST.03",
    size: "41mm",
    price: "38500.00",
    image: "/images/watches/ap-royal-oak.webp",
    status: "active",
    caseMaterial: "Stainless Steel",
    dialColor: "Blue",
    condition: "Pre-owned",
  },
  {
    id: "seed-10",
    brand: "Audemars Piguet",
    name: "Royal Oak Perpetual",
    ref: "26579CE.OO.1225CE.01",
    size: "41mm",
    price: "95000.00",
    image: "/images/watches/ap-perpetual.webp",
    status: "archived",
    caseMaterial: "Ceramic",
    dialColor: "Black",
    condition: "New",
  },
  {
    id: "seed-11",
    brand: "Patek Philippe",
    name: "Aquanaut Travel Time",
    ref: "5164A-001",
    size: "40mm",
    price: "45000.00",
    image: "/images/watches/patek-aquanaut.webp",
    status: "active",
    caseMaterial: "Stainless Steel",
    dialColor: "Brown",
    condition: "Pre-owned",
  },
  {
    id: "seed-12",
    brand: "Rolex",
    name: "Daytona",
    ref: "116500LN",
    size: "40mm",
    price: "28900.00",
    image: "",
    status: "active",
    caseMaterial: "Stainless Steel",
    dialColor: "Black",
    condition: "Pre-owned",
  },
  {
    id: "seed-13",
    brand: "Rolex",
    name: "Submariner Date",
    ref: "126610LN",
    size: "41mm",
    price: "14200.00",
    image: "",
    status: "archived",
    caseMaterial: "Stainless Steel",
    dialColor: "Black",
    condition: "Pre-owned",
  },
  {
    id: "seed-14",
    brand: "IWC",
    name: "Portugieser Chronograph",
    ref: "IW371601",
    size: "41mm",
    price: "7800.00",
    image: "",
    status: "active",
    caseMaterial: "Stainless Steel",
    dialColor: "Silver",
    condition: "New",
  },
  {
    id: "seed-15",
    brand: "Cartier",
    name: "Santos de Cartier",
    ref: "WSSA0018",
    size: "39mm",
    price: "9500.00",
    image: "",
    status: "active",
    caseMaterial: "Stainless Steel",
    dialColor: "Silver",
    condition: "New",
  },
]

function readFromStorage(): AdminProduct[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PRODUCTS))
      return SEED_PRODUCTS
    }
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function writeToStorage(products: AdminProduct[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export function useProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setProducts(readFromStorage())
    setIsLoaded(true)
  }, [])

  const counts = useMemo(
    () => ({
      all: products.length,
      active: products.filter((p) => p.status === "active").length,
      archived: products.filter((p) => p.status === "archived").length,
    }),
    [products]
  )

  function deleteProducts(ids: string[]) {
    const idSet = new Set(ids)
    setProducts((prev) => {
      const next = prev.filter((p) => !idSet.has(p.id))
      writeToStorage(next)
      return next
    })
  }

  function updateStatus(ids: string[], status: ProductStatus) {
    const idSet = new Set(ids)
    setProducts((prev) => {
      const next = prev.map((p) => (idSet.has(p.id) ? { ...p, status } : p))
      writeToStorage(next)
      return next
    })
  }

  function getFilteredProducts(tab: ProductTab, query: string): AdminProduct[] {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchesTab = tab === "all" || p.status === (tab as ProductStatus)
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.ref ?? "").toLowerCase().includes(q)
      return matchesTab && matchesQuery
    })
  }

  return {
    products,
    isLoaded,
    counts,
    deleteProducts,
    updateStatus,
    getFilteredProducts,
  }
}

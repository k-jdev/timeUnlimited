"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb"
import {
  ProductForm,
  type ProductFormData,
} from "@/components/admin/ProductForm"
import type { AdminProduct } from "@/types"
import { authFetch } from "@/lib/authFetch"

export default function EditProductPage() {
  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<AdminProduct | null>(null)

  useEffect(() => {
    authFetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(() => setProduct(null))
  }, [id])

  const initialData: Partial<ProductFormData> | undefined = product
    ? {
        id: product.id,
        brand: product.brand,
        model: product.model ?? "",
        price: product.price,
        referenceNumber: product.reference_number ?? "",
        description: product.description ?? "",
        condition: product.condition ?? "",
        caseMaterial: product.case_material ?? "",
        caseSize: product.case_size ?? "",
        dial: product.dial ?? "",
        completeSet: String(product.complete_set ?? ""),
        hoverColor: product.hover_color ?? "",
      }
    : undefined

  return (
    <div className="mx-auto max-w-360 px-6 pt-8 pb-16 lg:px-10">
      <div className="mb-6">
        <AdminBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Inventory", href: "/admin/inventory" },
            { label: product?.name ?? "Edit product" },
          ]}
        />
      </div>

      {initialData && <ProductForm initialData={initialData} mode="edit" />}
    </div>
  )
}

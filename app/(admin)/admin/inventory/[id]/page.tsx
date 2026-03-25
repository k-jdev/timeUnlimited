"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb"
import { ImageUploadSection } from "@/components/admin/ImageUploadSection"
import {
  ProductForm,
  type ProductFormData,
} from "@/components/admin/ProductForm"
import type { AdminProduct } from "@/types"

const STORAGE_KEY = "admin_products"

function readFromStorage(): AdminProduct[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [product, setProduct] = useState<AdminProduct | null>(null)
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [additionalImages, setAdditionalImages] = useState<File[]>([])

  useEffect(() => {
    const products = readFromStorage()
    const found = products.find((p) => p.id === id)
    setProduct(found ?? null)
  }, [id])

  function handleSave(data: ProductFormData) {
    const products = readFromStorage()
    const updated = products.map((p) =>
      p.id === id
        ? {
            ...p,
            brand: data.brand,
            name: data.model,
            price: data.price,
            referenceNumber: data.referenceNumber,
            description: data.description,
            condition: data.condition,
            caseMaterial: data.caseMaterial,
            size: data.caseSize,
            dialColor: data.dial,
            ref: data.referenceNumber ?? "",
            hoverColor: data.hoverColor,
          }
        : p
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    router.push("/admin/inventory")
  }

  const initialData: Partial<ProductFormData> | undefined = product
    ? {
        brand: product.brand,
        model: product.name,
        price: product.price,
        referenceNumber: product.ref,
        description: product.description ?? "",
        condition: product.condition,
        caseMaterial: product.caseMaterial,
        caseSize: product.size,
        dial: product.dialColor,
        hoverColor: product.hoverColor ?? "",
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

      <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-6">
        <div className="w-full lg:w-95 lg:shrink-0">
          <ImageUploadSection
            mainImage={mainImage}
            additionalImages={additionalImages}
            onMainImageChange={setMainImage}
            onAdditionalImagesChange={setAdditionalImages}
            existingImage={product?.image}
            initialHoverColor={product?.hoverColor}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {initialData !== undefined && (
            <ProductForm
              initialData={initialData}
              onSave={handleSave}
              mode="edit"
            />
          )}
        </div>
      </div>
    </div>
  )
}

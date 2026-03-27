"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb"
import { ImageUploadSection } from "@/components/admin/ImageUploadSection"
import {
  ProductForm,
  type ProductFormData,
} from "@/components/admin/ProductForm"
import type { AdminProduct } from "@/types";
import UploadImage from "@/components/admin/form/UploadImage"

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
  console.log(id)

  const [product, setProduct] = useState<AdminProduct | null>(null)
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [additionalImages, setAdditionalImages] = useState<File[]>([])

  useEffect(() => {
  fetch(`/api/products/${id}`)
    .then((res) => res.json())
    .then((data) => setProduct(data))
    .catch(() => setProduct(null))
}, [id])

  function handleSave(data: ProductFormData) {
    fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed")
        return res.json()
      })
      .then(() => {
        router.push("/admin/inventory")
      })
      .catch((err) => {
        console.error(err)
        alert("Failed to update product")
      })
  }

  const initialData: Partial<ProductFormData> | undefined = product
  ? {
      id: product.id,
      brand: product.brand,
      model: product.model,
      price: product.price,
      referenceNumber: product.reference_number, 
      description: product.description ?? "",
      condition: product.condition,
      caseMaterial: product.case_material,      
      caseSize: product.case_size,             
      dial: product.dial,                       
      completeSet: product.complete_set,        
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

      <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-6">
        <div className="w-full lg:w-95 lg:shrink-0">

          {
            product && <UploadImage productId={product.id} />
          }
          {/* <ImageUploadSection
            mainImage={mainImage}
            additionalImages={additionalImages}
            onMainImageChange={setMainImage}
            onAdditionalImagesChange={setAdditionalImages}
            existingImage={product?.image}
            initialHoverColor={product?.hoverColor}
          /> */}
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

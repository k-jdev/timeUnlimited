"use client"

import { useState } from "react"
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb"
import { ImageUploadSection } from "@/components/admin/ImageUploadSection"
import { ProductForm } from "@/components/admin/ProductForm"

export default function AddProductPage() {
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [additionalImages, setAdditionalImages] = useState<File[]>([])

  const productName =
    mainImage || additionalImages.length > 0 ? "New Product" : "Add product"

  return (
    <div className="mx-auto max-w-[1440px] px-6 pt-8 pb-16 lg:px-10">
      <div className="mb-6">
        <AdminBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Inventory", href: "/admin/inventory" },
            { label: productName },
          ]}
        />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-6">
        <div className="w-full lg:w-[380px] lg:shrink-0">
          {/* <ImageUploadSection
            mainImage={mainImage}
            additionalImages={additionalImages}
            onMainImageChange={setMainImage}
            onAdditionalImagesChange={setAdditionalImages}
          /> */}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <ProductForm />
        </div>
      </div>
    </div>
  )
}

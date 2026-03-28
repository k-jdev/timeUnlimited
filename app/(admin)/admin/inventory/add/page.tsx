"use client"

import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb"
import { ProductForm } from "@/components/admin/ProductForm"

export default function AddProductPage() {
  return (
    <div className="mx-auto max-w-360 px-6 pt-8 pb-16 lg:px-10">
      <div className="mb-6">
        <AdminBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Inventory", href: "/admin/inventory" },
            { label: "Add product" },
          ]}
        />
      </div>

      <ProductForm />
    </div>
  )
}

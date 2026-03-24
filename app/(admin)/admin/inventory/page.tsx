import Link from "next/link"
import { RiAddLine } from "@remixicon/react"
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb"

export default function AdminInventoryPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 pt-8 pb-16 lg:px-10">
      <div className="mb-8">
        <AdminBreadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Inventory" }]}
        />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-[40px] text-[#edeef0] lg:text-[48px]">
          Inventory
        </h1>
        <Link
          href="/admin/inventory/add"
          className="flex items-center gap-2 bg-[#edeef0] px-5 py-2 text-sm font-medium text-[#020208] transition-colors duration-200 hover:bg-white"
        >
          <RiAddLine className="size-4" />
          Add product
        </Link>
      </div>

      <div className="mt-12 flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-[#8b8d98]">No products yet.</p>
        <Link
          href="/admin/inventory/add"
          className="text-sm text-[#5eb1ef] underline-offset-4 hover:underline"
        >
          Add your first product
        </Link>
      </div>
    </div>
  )
}

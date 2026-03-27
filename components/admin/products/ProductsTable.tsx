import Image from "next/image"
import Link from "next/link"
import { RiPencilLine } from "@remixicon/react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProductStatusBadge } from "./ProductStatusBadge"
import type { AdminProduct } from "@/types"

function formatPrice(price: string): string {
  const num = parseFloat(price)
  if (isNaN(num)) return price
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

interface ProductsTableProps {
  products: AdminProduct[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
}

export function ProductsTable({
  products,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: ProductsTableProps) {
  const allSelected =
    products.length > 0 && selectedIds.size === products.length
  const someSelected =
    selectedIds.size > 0 && selectedIds.size < products.length

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border border-[#d6ebfd30] bg-[#171818] hover:bg-[#171818]/90">
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                data-state={
                  someSelected
                    ? "indeterminate"
                    : allSelected
                      ? "checked"
                      : "unchecked"
                }
                onCheckedChange={onToggleSelectAll}
                aria-label="Select all"
                className={someSelected ? "opacity-60" : ""}
              />
            </TableHead>
            <TableHead className="text-sm font-medium text-[#edeef0]">
              Model
            </TableHead>
            <TableHead className="text-sm font-medium text-[#edeef0]">
              Status
            </TableHead>
            <TableHead className="text-sm font-medium text-[#edeef0]">
              Serial number
            </TableHead>
            <TableHead className="text-sm font-medium text-[#edeef0]">
              Price
            </TableHead>
            <TableHead className="text-sm font-medium text-[#edeef0]">
              Case material
            </TableHead>
            <TableHead className="text-sm font-medium text-[#edeef0]">
              Dial
            </TableHead>
            <TableHead className="text-sm font-medium text-[#edeef0]">
              Case Size
            </TableHead>
            <TableHead className="w-12 text-sm font-medium text-[#edeef0]">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
  {products.map((product) => (
    <TableRow
      key={product.id}
      className="border border-[#d6ebfd30] bg-[#101010] hover:bg-[#101010]/90"
      data-selected={selectedIds.has(product.id)}
    >
      <TableCell className="py-3">
        <Checkbox
          checked={selectedIds.has(product.id)}
          onCheckedChange={() => onToggleSelect(product.id)}
          aria-label={`Select ${product.brand} ${product.model}`}
        />
      </TableCell>

      {/* Model / Image */}
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden bg-[#0d0f16]">
            {product.images && product.images[0] ? (
              <Image
                src={(product.images[0] as any)?.image_url || "/placeholder.png"}
                alt={`${product.brand} ${product.model}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="size-full bg-[#202020]" />
            )}
          </div>
          <span className="text-sm text-[#b0b4ba]">{`${product.brand} ${product.model}`}</span>
        </div>
      </TableCell>

      {/* Status */}
      <TableCell className="py-3">
        <ProductStatusBadge status={product.status} />
      </TableCell>

      {/* Serial Number (если есть) */}
      <TableCell className="py-3 text-xs font-medium text-[#b0b4ba]">
        {product.serial_number || "—"}
      </TableCell>

      {/* Price */}
      <TableCell className="py-3 text-sm font-medium text-[#30a46c]">
        {product.price ? formatPrice(product.price) : "—"}
      </TableCell>

      {/* Case Material */}
      <TableCell className="py-3 text-sm text-[#b0b4ba]">
        {product.case_material || "—"}
      </TableCell>

      {/* Dial */}
      <TableCell className="py-3 text-sm text-[#b0b4ba]">
        {product.dial_color || "—"}
      </TableCell>

      {/* Case Size */}
      <TableCell className="py-3 text-sm text-[#b0b4ba]">
        {product.case_size || "—"}
      </TableCell>

      {/* Edit */}
      <TableCell className="py-3">
        <Link
          href={`/admin/inventory/${product.id}`}
          className="inline-flex p-1 text-[#b0b4ba] transition-colors duration-200 hover:text-[#edeef0]"
          aria-label={`Edit ${product.brand} ${product.model}`}
        >
          <RiPencilLine className="size-4" />
        </Link>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
      </Table>
    </div>
  )
}

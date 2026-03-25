import Image from "next/image"
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
                  aria-label={`Select ${product.name}`}
                />
              </TableCell>
              <TableCell className="py-3">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden bg-[#0d0f16]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="size-full" />
                    )}
                  </div>
                  <span className="text-sm text-[#b0b4ba]">{product.name}</span>
                </div>
              </TableCell>
              <TableCell className="py-3">
                <ProductStatusBadge status={product.status} />
              </TableCell>
              <TableCell className="py-3 text-xs font-medium text-[#b0b4ba]">
                {product.ref || "—"}
              </TableCell>
              <TableCell className="py-3 text-sm font-medium text-[#30a46c]">
                {formatPrice(product.price)}
              </TableCell>
              <TableCell className="py-3 text-sm text-[#b0b4ba]">
                {product.caseMaterial || "—"}
              </TableCell>
              <TableCell className="py-3 text-sm text-[#b0b4ba]">
                {product.dialColor || "—"}
              </TableCell>
              <TableCell className="py-3 text-sm text-[#b0b4ba]">
                {product.size || "—"}
              </TableCell>
              <TableCell className="py-3">
                <button
                  type="button"
                  className="p-1 text-[#b0b4ba] transition-colors duration-200 hover:text-[#edeef0]"
                  aria-label={`Edit ${product.name}`}
                >
                  <RiPencilLine className="size-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

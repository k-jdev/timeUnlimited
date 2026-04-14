import type { InventoryWatch } from "@/data/inventory"

export interface DBProduct {
  id: string
  brand: string
  model: string
  price: number | string | null
  reference_number: string | null
  description: string | null
  condition: string | null
  case_material: string | null
  case_size: string | null
  dial: string | null
  hover_color: string | null
  complete_set: boolean | null
  dial_color: string | null
  created_at: string
  images?: Array<{
    id: string
    product_id: string
    image_url: string
    file_path: string
    is_main: boolean
    created_at: string
  }>
}

function formatPrice(price: number | string | null): string {
  if (!price) return "Price on request"
  const cleaned =
    typeof price === "string" ? price.replace(/[^0-9.]/g, "") : price
  const num = Number(cleaned)
  if (isNaN(num) || num === 0) return "Price on request"
  return `$${Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}

const FALLBACK_COLOR = "#60646c"

export function mapProductToWatch(p: DBProduct): InventoryWatch {
  const mainImage = p.images?.find((img) => img.is_main) ?? p.images?.[0]

  return {
    id: p.id,
    brand: p.brand ?? "",
    name: p.model ?? "",
    ref: p.reference_number ? `Ref. ${p.reference_number}` : "",
    size: p.case_size ?? "",
    price: formatPrice(p.price),
    image: mainImage?.image_url ?? "",
    glowColor: p.hover_color ?? FALLBACK_COLOR,
    borderColor: p.hover_color ?? FALLBACK_COLOR,
    condition: p.condition ?? "",
    braceletMaterial: p.case_material ?? "",
    dialColor: p.dial_color ?? "",
    caseMaterial: p.case_material ?? "",
    dateAdded: p.created_at,
    hoverColor: p.hover_color ?? undefined,
    referenceNumber: p.reference_number ?? undefined,
    dial: p.dial ?? p.dial_color ?? undefined,
    completeSet: p.complete_set ? "Box & Papers" : undefined,
    description: p.description ?? undefined,
    galleryImages: p.images?.map((img) => img.image_url),
  }
}

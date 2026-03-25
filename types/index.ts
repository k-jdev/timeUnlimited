export interface Watch {
  id: string
  brand: string
  name: string
  ref: string
  size: string
  price: string
  image: string
  featured?: boolean
  imageClassName?: string
  glowColor: string
  borderColor: string
}

export type ProductStatus = "active" | "archived"

export interface AdminProduct {
  id: string
  brand: string
  name: string
  ref: string
  size: string
  price: string
  image: string
  status: ProductStatus
  caseMaterial: string
  dialColor: string
  condition: string
  referenceNumber?: string
  description?: string
  galleryImages?: string[]
}

export interface NavItem {
  label: string
  href: string
}

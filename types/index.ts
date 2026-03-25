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
  hoverColor?: string
}

export interface NavItem {
  label: string
  href: string
}

export type RequestType = "specific" | "assisted"

export type RequestStatus = "new" | "pending" | "approved" | "rejected"

export interface AdminRequest {
  id: string
  requestNumber: string
  createdAt: string
  type: RequestType
  status: RequestStatus
  name: string
  email: string
  phone: string
  budgetRange: string
  timeframe: string
  // Specific only
  watchReference?: string
  // Assisted only
  brandPreferences?: string
  purpose?: string
  material?: string
  region?: string
}

export interface RequestFilters {
  budgetRange: string
  timeframe: string
  brandPreferences: string
  material: string
  region: string
}

export const EMPTY_FILTERS: RequestFilters = {
  budgetRange: "",
  timeframe: "",
  brandPreferences: "",
  material: "",
  region: "",
}

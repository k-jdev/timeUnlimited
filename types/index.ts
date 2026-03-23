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

export interface NavItem {
  label: string
  href: string
}

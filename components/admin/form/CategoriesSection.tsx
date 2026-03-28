"use client"

import { useEffect, useState } from "react"
import { authFetch } from "@/lib/authFetch"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Category {
  id: string
  name: string
}

interface Props {
  productId?: string
}

export function ProductCategoriesSection({ productId }: Props) {
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [selected, setSelected] = useState<string[]>([])

  // загрузка всех категорий
  const fetchCategories = async () => {
    const res = await authFetch("/api/categories")
    const data = await res.json()
    setAllCategories(data)
  }

  // загрузка категорий продукта
  const fetchProductCategories = async () => {
    if (!productId) return
    const res = await authFetch(`/api/products/${productId}/categories`)
    const data: Category[] = await res.json()
    setSelected(data.map((c) => c.id))
  }

  useEffect(() => {
    fetchCategories()
    fetchProductCategories()
  }, [productId])

  const toggleCategory = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  // отправка на сервер
  const save = async () => {
    if (!productId) return

    await authFetch(`/api/products/${productId}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryIds: selected }),
    })
  }

  return (
    <div className="flex flex-col gap-3 border border-[#2e3135] p-4 md:col-span-3">
      <h2 className="text-sm text-[#edeef0]">Categories</h2>

      <div className="flex flex-col gap-3">
        {allCategories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3">
            <Checkbox
              id={cat.id}
              checked={selected.includes(cat.id)}
              onCheckedChange={() => toggleCategory(cat.id)}
              className="rounded-none border-[#3a3d42] data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-[#020208]"
            />
            <Label
              htmlFor={cat.id}
              className="cursor-pointer text-sm text-[#cdced6] hover:text-[#edeef0]"
            >
              {cat.name}
            </Label>
          </div>
        ))}
      </div>

      {productId && (
        <button
          type="button"
          onClick={save}
          className="mt-1 w-full border border-[#2e3135] bg-transparent py-2 text-xs text-[#cdced6] transition-colors duration-200 hover:border-[#5eb1ef] hover:text-[#edeef0]"
        >
          Save categories
        </button>
      )}
    </div>
  )
}

export default ProductCategoriesSection

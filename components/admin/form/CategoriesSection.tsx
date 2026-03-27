"use client"

import { useEffect, useState } from "react"

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
    const res = await fetch("/api/categories")
    const data = await res.json()
    setAllCategories(data)
  }

  // загрузка категорий продукта
  const fetchProductCategories = async () => {
    if (!productId) return
    const res = await fetch(`/api/products/${productId}/categories`)
    const data: Category[] = await res.json()
    setSelected(data.map((c) => c.id))
  }

  useEffect(() => {
    fetchCategories()
    fetchProductCategories()
  }, [productId])

  const toggleCategory = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
    )
  }

  // отправка на сервер
  const save = async () => {
    if (!productId) return

    await fetch(`/api/products/${productId}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryIds: selected }),
    })
  }

  return (
    <div className="flex flex-col gap-3 md:col-span-3 border border-[#2e3135] p-4">
      <h2 className="text-[#edeef0] text-sm">Categories</h2>

      <div className="flex flex-col gap-2">
        {allCategories.map((cat) => (
          <label
            key={cat.id}
            className="flex items-center gap-2 text-[#edeef0] text-sm"
          >
            <input
              type="checkbox"
              checked={selected.includes(cat.id)}
              onChange={() => toggleCategory(cat.id)}
            />
            {cat.name}
          </label>
        ))}
      </div>

      {productId && (
        <button
          type="button"
          onClick={save}
          className="mt-2 text-xs bg-[#5eb1ef] text-black px-3 py-1"
        >
          Save categories
        </button>
      )}
    </div>
  )
}

export default ProductCategoriesSection
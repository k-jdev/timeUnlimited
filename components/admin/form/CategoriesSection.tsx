"use client"

import { useEffect, useState } from "react"
import { authFetch } from "@/lib/authFetch"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RiAddLine, RiCloseLine } from "@remixicon/react"

interface Category {
  id: string
  name: string
}

interface Props {
  productId?: string
  onSelectionChange?: (ids: string[]) => void
}

export function ProductCategoriesSection({
  productId,
  onSelectionChange,
}: Props) {
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState("")

  const fetchCategories = async () => {
    const res = await authFetch("/api/categories")
    const data = await res.json()
    setAllCategories(data)
  }

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
    const next = selected.includes(id)
      ? selected.filter((c) => c !== id)
      : [...selected, id]
    setSelected(next)
    onSelectionChange?.(next)
  }

  const addCategory = async () => {
    if (!newCategory.trim()) return
    try {
      const res = await authFetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      })
      const created: Category = await res.json()
      setAllCategories((prev) => [...prev, created])
      setNewCategory("")
    } catch (err) {
      console.error(err)
    }
  }

  const removeCategory = async (catId: string) => {
    try {
      await authFetch(`/api/categories/${catId}`, { method: "DELETE" })
      setAllCategories((prev) => prev.filter((c) => c.id !== catId))
      setSelected((prev) => {
        const next = prev.filter((id) => id !== catId)
        onSelectionChange?.(next)
        return next
      })
    } catch (err) {
      console.error(err)
    }
  }

  const save = async () => {
    if (!productId) return
    await authFetch(`/api/products/${productId}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryIds: selected }),
    })
  }

  return (
    <div className="flex flex-col gap-3 md:col-span-3">
      <h2 className="text-sm text-[#edeef0]">Categories</h2>

      <div className="flex flex-col gap-3 border border-[#2e3135] p-4">
        <div className="flex flex-col gap-3">
          {allCategories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
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
              <button
                type="button"
                onClick={() => removeCategory(cat.id)}
                className="text-[#8b8d98] hover:text-[#edeef0]"
              >
                <RiCloseLine className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <Input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addCategory())
            }
            placeholder="New category"
            className="flex-1 rounded-none border-[#2e3135] bg-transparent text-[#edeef0] placeholder:text-[#8b8d98] focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
          />
          <button
            type="button"
            onClick={addCategory}
            className="flex items-center gap-1 bg-[#edeef0] px-3 text-sm text-[#020208] hover:bg-white"
          >
            <RiAddLine className="size-4" />
            Add
          </button>
        </div>
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

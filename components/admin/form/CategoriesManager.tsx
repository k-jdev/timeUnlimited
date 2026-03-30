"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RiAddLine, RiCloseLine } from "@remixicon/react"
import { authFetch } from "@/lib/authFetch"

interface Category {
  id: string
  name: string
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await authFetch("/api/categories")
      const data: Category[] = await res.json()
      setCategories(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const addCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const res = await authFetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      })
      const created: Category = await res.json()
      setCategories([...categories, created])
      setNewCategory("")
    } catch (err) {
      console.error(err)
    }
  }

  const removeCategory = async (catId: string) => {
    try {
      await authFetch(`/api/categories/${catId}`, { method: "DELETE" })
      setCategories(categories.filter((c) => c.id !== catId))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Label className="text-sm text-[#edeef0]">Categories</Label>

      {loading ? (
        <p className="text-[#8b8d98]">Loading...</p>
      ) : (
        categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between border-b border-[#2e3135] py-1"
          >
            <span className="text-[#edeef0]">{cat.name}</span>
            <button
              type="button"
              onClick={() => removeCategory(cat.id)}
              className="text-[#8b8d98] hover:text-[#edeef0]"
            >
              <RiCloseLine className="size-4" />
            </button>
          </div>
        ))
      )}

      <div className="flex gap-2">
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
  )
}

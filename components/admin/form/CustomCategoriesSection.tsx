"use client"

import { Fragment, useState } from "react"
import { RiAddLine, RiCheckLine, RiCloseLine } from "@remixicon/react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface CustomParam {
  id: string
  key: string
}

interface CustomCategory {
  id: string
  name: string
  params: CustomParam[]
  saved: boolean
}

function makeId() {
  return Math.random().toString(36).slice(2)
}

export function CustomCategoriesSection() {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([])

  const addCategory = () =>
    setCustomCategories((prev) => [
      ...prev,
      {
        id: makeId(),
        name: "",
        params: [{ id: makeId(), key: "" }],
        saved: false,
      },
    ])

  const removeCategory = (catId: string) =>
    setCustomCategories((prev) => prev.filter((c) => c.id !== catId))

  const updateCategoryName = (catId: string, name: string) =>
    setCustomCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, name } : c))
    )

  const saveCategory = (catId: string) =>
    setCustomCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, saved: true } : c))
    )

  const editCategory = (catId: string) =>
    setCustomCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, saved: false } : c))
    )

  const addParam = (catId: string) =>
    setCustomCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, params: [...c.params, { id: makeId(), key: "" }] }
          : c
      )
    )

  const removeParam = (catId: string, paramId: string) =>
    setCustomCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, params: c.params.filter((p) => p.id !== paramId) }
          : c
      )
    )

  const updateParam = (catId: string, paramId: string, val: string) =>
    setCustomCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? {
              ...c,
              params: c.params.map((p) =>
                p.id === paramId ? { ...p, key: val } : p
              ),
            }
          : c
      )
    )

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-[#edeef0] opacity-0 select-none">
          &nbsp;
        </Label>
        <button
          type="button"
          onClick={addCategory}
          className="flex h-9 w-full items-center gap-2 border-[#2e3135] bg-transparent px-3 text-sm text-[#dfebfd6e] transition-colors duration-200 hover:border-[#5eb1ef] hover:text-[#edeef0]"
        >
          <RiAddLine className="size-4 shrink-0" />
          <span>Add category</span>
        </button>
      </div>

      {customCategories.map((cat) =>
        cat.saved ? (
          <Fragment key={cat.id}>
            {cat.params
              .filter((p) => p.key)
              .map((param, i) => (
                <div key={param.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-[#edeef0]">
                      {param.key}
                    </Label>
                    {i === 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => editCategory(cat.id)}
                          className="text-xs text-[#8b8d98] transition-colors hover:text-[#edeef0]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCategory(cat.id)}
                          className="text-[#8b8d98] transition-colors hover:text-[#edeef0]"
                        >
                          <RiCloseLine className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <Input
                    name={`custom_${cat.id}_${param.id}`}
                    placeholder={param.key}
                    className="rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
                  />
                </div>
              ))}
          </Fragment>
        ) : (
          <div
            key={cat.id}
            className="flex flex-col gap-3 border border-[#2e3135] p-4 md:col-span-3"
          >
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                value={cat.name}
                onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                placeholder="Category name"
                autoFocus
                className="flex-1 border-b border-[#2e3135] bg-transparent text-sm font-medium text-[#edeef0] outline-none placeholder:text-[#dfebfd6e] focus:border-[#5eb1ef]"
              />
              <button
                type="button"
                onClick={() => removeCategory(cat.id)}
                className="text-[#8b8d98] transition-colors hover:text-[#edeef0]"
              >
                <RiCloseLine className="size-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {cat.params.map((param) => (
                <div key={param.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) =>
                      updateParam(cat.id, param.id, e.target.value)
                    }
                    placeholder="Parameter name"
                    className="h-8 flex-1 border-b border-[#2e3135] bg-transparent text-sm text-[#edeef0] outline-none placeholder:text-[#dfebfd6e] focus:border-[#5eb1ef]"
                  />
                  <button
                    type="button"
                    onClick={() => removeParam(cat.id, param.id)}
                    className="shrink-0 text-[#8b8d98] transition-colors hover:text-[#edeef0]"
                  >
                    <RiCloseLine className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => addParam(cat.id)}
                className="flex items-center gap-1.5 text-xs text-[#8b8d98] transition-colors hover:text-[#edeef0]"
              >
                <RiAddLine className="size-3.5" />
                Add parameter
              </button>
              <button
                type="button"
                onClick={() => saveCategory(cat.id)}
                className="flex items-center gap-1.5 text-xs text-[#edeef0] transition-colors hover:text-white"
              >
                <RiCheckLine className="size-3.5" />
                Save category
              </button>
            </div>
          </div>
        )
      )}
    </>
  )
}

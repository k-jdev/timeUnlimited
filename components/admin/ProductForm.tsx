"use client"

import { useRouter } from "next/navigation"
import { Fragment, useState } from "react"
import {
  RiArchiveLine,
  RiAddLine,
  RiCheckLine,
  RiCloseLine,
} from "@remixicon/react"
import {
  BRANDS,
  CONDITIONS,
  CASE_MATERIALS,
  DIAL_COLORS,
  SIZES,
} from "@/data/inventory"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface ProductFormData {
  brand: string
  model: string
  price: string
  referenceNumber: string
  description: string
  condition: string
  caseMaterial: string
  caseSize: string
  dial: string
  completeSet: string
}

const EMPTY_FORM: ProductFormData = {
  brand: "",
  model: "",
  price: "",
  referenceNumber: "",
  description: "",
  condition: "",
  caseMaterial: "",
  caseSize: "",
  dial: "",
  completeSet: "",
}

const COMPLETE_SET_OPTIONS = ["Yes", "No", "Box only", "Papers only"]

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  onSave?: (data: ProductFormData) => void
}

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

export function ProductForm({ initialData, onSave }: ProductFormProps) {
  const router = useRouter()
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([])

  const addCategory = () => {
    setCustomCategories((prev) => [
      ...prev,
      {
        id: makeId(),
        name: "",
        params: [{ id: makeId(), key: "" }],
        saved: false,
      },
    ])
  }

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: ProductFormData = {
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      price: formData.get("price") as string,
      referenceNumber: formData.get("referenceNumber") as string,
      description: formData.get("description") as string,
      condition: formData.get("condition") as string,
      caseMaterial: formData.get("caseMaterial") as string,
      caseSize: formData.get("caseSize") as string,
      dial: formData.get("dial") as string,
      completeSet: formData.get("completeSet") as string,
    }
    if (onSave) {
      onSave(data)
    } else {
      // Temporary: save to localStorage
      const existing = JSON.parse(
        localStorage.getItem("admin_products") ?? "[]"
      )
      existing.push({ ...data, id: Date.now().toString() })
      localStorage.setItem("admin_products", JSON.stringify(existing))
      router.push("/admin/inventory")
    }
  }

  const defaultValues = { ...EMPTY_FORM, ...initialData }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <h1 className="mb-8 font-serif text-[40px] leading-tight text-[#edeef0] lg:text-[48px]">
        Add product
      </h1>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3">
        {/* Row 1 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="brand" className="text-sm text-[#edeef0]">
            Brand
          </Label>
          <Select name="brand" defaultValue={defaultValues.brand}>
            <SelectTrigger
              id="brand"
              className="w-full rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
            >
              <SelectValue placeholder="e.g. Patek Philippe" />
            </SelectTrigger>
            <SelectContent>
              {BRANDS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="condition" className="text-sm text-[#edeef0]">
            Condition
          </Label>
          <Select name="condition" defaultValue={defaultValues.condition}>
            <SelectTrigger
              id="condition"
              className="w-full rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {CONDITIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="caseMaterial" className="text-sm text-[#edeef0]">
            Case material
          </Label>
          <Select name="caseMaterial" defaultValue={defaultValues.caseMaterial}>
            <SelectTrigger
              id="caseMaterial"
              className="w-full rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {CASE_MATERIALS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="model" className="text-sm text-[#edeef0]">
            Model
          </Label>
          <Input
            id="model"
            name="model"
            placeholder="e.g. Nautilus Perpetual"
            defaultValue={defaultValues.model}
            className="rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="caseSize" className="text-sm text-[#edeef0]">
            Case Size
          </Label>
          <Select name="caseSize" defaultValue={defaultValues.caseSize}>
            <SelectTrigger
              id="caseSize"
              className="w-full rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {SIZES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dial" className="text-sm text-[#edeef0]">
            Dial
          </Label>
          <Select name="dial" defaultValue={defaultValues.dial}>
            <SelectTrigger
              id="dial"
              className="w-full rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {DIAL_COLORS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price" className="text-sm text-[#edeef0]">
            Price
          </Label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-sm text-[#8b8d98]">$</span>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              defaultValue={defaultValues.price}
              className="rounded-none border-[#2e3135] bg-transparent pl-7 focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="completeSet" className="text-sm text-[#edeef0]">
            Complete Set
          </Label>
          <Select name="completeSet" defaultValue={defaultValues.completeSet}>
            <SelectTrigger
              id="completeSet"
              className="w-full rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {COMPLETE_SET_OPTIONS.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={addCategory}
            className="flex items-center gap-1.5 text-sm text-[#8b8d98] transition-colors duration-200 hover:text-[#edeef0]"
          >
            <span className="text-base leading-none">+</span>
            Add category
          </button>
        </div>

        {/* Custom categories — full-width rows */}
        {customCategories.map((cat) =>
          cat.saved ? (
            // Saved — each param becomes a standard Label + Input field
            <Fragment key={cat.id}>
              {/* Category name separator */}
              <div className="flex items-center justify-between md:col-span-3">
                <span className="text-xs tracking-wider text-[#8b8d98] uppercase">
                  {cat.name || "Custom category"}
                </span>
                <div className="flex items-center gap-3">
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
                    <RiCloseLine className="size-4" />
                  </button>
                </div>
              </div>
              {/* One field per parameter */}
              {cat.params
                .filter((p) => p.key)
                .map((param) => (
                  <div key={param.id} className="flex flex-col gap-2">
                    <Label className="text-sm text-[#edeef0]">
                      {param.key}
                    </Label>
                    <Input
                      name={`custom_${cat.id}_${param.id}`}
                      placeholder={param.key}
                      className="rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
                    />
                  </div>
                ))}
            </Fragment>
          ) : (
            // Editing view
            <div
              key={cat.id}
              className="flex flex-col gap-3 border border-[#2e3135] p-4 md:col-span-3"
            >
              {/* Category header */}
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                  placeholder="Category name"
                  autoFocus
                  className="flex-1 border-b border-[#2e3135] bg-transparent text-sm font-medium text-[#edeef0] outline-none placeholder:text-[#8b8d98] focus:border-[#5eb1ef]"
                />
                <button
                  type="button"
                  onClick={() => removeCategory(cat.id)}
                  className="text-[#8b8d98] transition-colors hover:text-[#edeef0]"
                >
                  <RiCloseLine className="size-4" />
                </button>
              </div>

              {/* Parameters — key only */}
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
                      className="h-8 flex-1 border-b border-[#2e3135] bg-transparent text-sm text-[#edeef0] outline-none placeholder:text-[#8b8d98] focus:border-[#5eb1ef]"
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

              {/* Footer: add param + save */}
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

        {/* Row 4: Reference Number */}
        <div className="flex flex-col gap-2 md:col-span-1">
          <Label htmlFor="referenceNumber" className="text-sm text-[#edeef0]">
            Reference Number
          </Label>
          <Input
            id="referenceNumber"
            name="referenceNumber"
            placeholder="Enter reference"
            defaultValue={defaultValues.referenceNumber}
            className="rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
          />
        </div>

        {/* Row 5: Description spanning all columns */}
        <div className="flex flex-col gap-2 md:col-span-3">
          <Label htmlFor="description" className="text-sm text-[#edeef0]">
            Product description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Placeholder"
            defaultValue={defaultValues.description}
            rows={5}
            className="resize-none rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
          />
        </div>
      </div>

      {/* Actions footer */}
      <div className="mt-8 flex items-center justify-between pt-5">
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-[#8b8d98] transition-colors duration-200 hover:text-[#edeef0]"
        >
          <RiArchiveLine className="size-4" />
          Archive product
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-[#e54d4d] transition-colors duration-200 hover:text-[#ff6b6b]"
          >
            Cancel
          </button>
          <Button
            type="submit"
            size="sm"
            className="flex items-center gap-2 rounded-none bg-[#edeef0] px-5 text-[#020208] hover:bg-white"
          >
            <RiCheckLine className="size-4" />
            Save
          </Button>
        </div>
      </div>
    </form>
  )
}

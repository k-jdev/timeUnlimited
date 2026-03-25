"use client"

import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ProductFormFields } from "./form/ProductFormFields"
import { CustomCategoriesSection } from "./form/CustomCategoriesSection"
import { ProductFormActions } from "./form/ProductFormActions"

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

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  onSave?: (data: ProductFormData) => void
}

export function ProductForm({ initialData, onSave }: ProductFormProps) {
  const router = useRouter()

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
      const existing = JSON.parse(
        localStorage.getItem("admin_products") ?? "[]"
      )
      const newProduct = {
        ...data,
        id: Date.now().toString(),
        status: "active",
        image: "",
        dialColor: data.dial,
        ref: data.referenceNumber ?? "",
        glowColor: "",
        borderColor: "",
      }
      existing.push(newProduct)
      localStorage.setItem("admin_products", JSON.stringify(existing))
      router.push("/admin/inventory")
    }
  }

  const defaultValues = { ...EMPTY_FORM, ...initialData }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <h1 className="mb-8 font-serif text-[40px] leading-tight text-[#edeef0] lg:text-[48px]">
        Add product
      </h1>

      <div className="grid flex-1 grid-cols-1 content-start gap-x-6 gap-y-5 md:grid-cols-3">
        <ProductFormFields defaultValues={defaultValues} />
        <CustomCategoriesSection />

        <div className="flex flex-col gap-2 md:col-span-1">
          <Label htmlFor="referenceNumber" className="text-sm text-[#edeef0]">
            Reference Number
          </Label>
          <Input
            id="referenceNumber"
            name="referenceNumber"
            placeholder="Enter reference"
            defaultValue={defaultValues.referenceNumber}
            className="rounded-none border-[#2e3135] bg-transparent placeholder:text-[#dfebfd6e] focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-3">
          <Label htmlFor="description" className="text-sm text-[#edeef0]">
            Product description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Placeholder"
            defaultValue={defaultValues.description}
            rows={8}
            className="resize-none rounded-none border-[#2e3135] bg-transparent placeholder:text-[#dfebfd6e] focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
          />
        </div>
      </div>

      <ProductFormActions onCancel={() => router.back()} />
    </form>
  )
}

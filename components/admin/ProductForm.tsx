"use client"

import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ProductFormFields } from "./form/ProductFormFields"
import { ProductCategoriesSection } from "./form/CategoriesSection"
import { ProductFormActions } from "./form/ProductFormActions"

export interface ProductFormData {
  id: string
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
  hoverColor: string
}

const EMPTY_FORM: ProductFormData = {
  id: "",
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
  hoverColor: "",
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  onSave?: (data: ProductFormData) => void
  mode?: "add" | "edit"
}

export function ProductForm({
  initialData,
  onSave,
  mode = "add",
}: ProductFormProps) {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const data: ProductFormData = {
      id: formData.get("id") as string,
      model: formData.get("model") as string,
      price: formData.get("price") as string,
      referenceNumber: formData.get("referenceNumber") as string,
      description: formData.get("description") as string,
      condition: formData.get("condition") as string,
      caseMaterial: formData.get("caseMaterial") as string,
      caseSize: formData.get("caseSize") as string,
      dial: formData.get("dial") as string,
      completeSet: formData.get("completeSet") as string,
      hoverColor: formData.get("hoverColor") as string,
    }

    await fetch("/api/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    router.push("/admin/inventory")
  }

  const defaultValues = { ...EMPTY_FORM, ...initialData }

  return (
    <form
      id="product-form"
      onSubmit={handleSubmit}
      className="flex h-full flex-col"
    >
      <h1 className="mb-8 font-serif text-[40px] leading-tight text-[#edeef0] lg:text-[48px]">
        {mode === "edit" ? "Edit product" : "Add product"}
      </h1>

      <div className="grid flex-1 grid-cols-1 content-start gap-x-6 gap-y-5 md:grid-cols-3">
        <ProductFormFields defaultValues={defaultValues} />
        {
          initialData && initialData.id && (
           <ProductCategoriesSection productId={initialData?.id} />
          )
        }
        

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

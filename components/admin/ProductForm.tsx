"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ProductFormFields,
  type ProductFieldValues,
} from "./form/ProductFormFields"
import { ProductCategoriesSection } from "./form/CategoriesSection"
import { ProductFormActions } from "./form/ProductFormActions"
import { ImageUploadSection } from "./ImageUploadSection"
import { authFetch } from "@/lib/authFetch"

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
  status: string
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
  status: "",
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
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])

  const [fieldValues, setFieldValues] = useState<
    ProductFieldValues & { description: string }
  >(() => ({
    brand: initialData?.brand ?? "",
    model: initialData?.model ?? "",
    condition: initialData?.condition ?? "",
    caseMaterial: initialData?.caseMaterial ?? "",
    caseSize: initialData?.caseSize ?? "",
    dial: initialData?.dial ?? "",
    price: initialData?.price ?? "",
    completeSet: initialData?.completeSet ?? "",
    description: initialData?.description ?? "",
  }))

  const handleFieldChange = (
    field: keyof typeof fieldValues,
    value: string
  ) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = Object.values(fieldValues).every(
    (v) => String(v).trim() !== ""
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState("")
  const animFrameRef = useRef<number | null>(null)

  const animateTo = (target: number) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    const step = () => {
      setProgress((prev) => {
        if (prev >= target) return target
        const next = Math.min(prev + 1.5, target)
        if (next < target) animFrameRef.current = requestAnimationFrame(step)
        return next
      })
    }
    animFrameRef.current = requestAnimationFrame(step)
  }
  const [existingImages, setExistingImages] = useState<
    { id: string; image_url: string }[]
  >([])
  const [pendingDeletes, setPendingDeletes] = useState<string[]>([])

  const existingMainImage = existingImages[0]?.image_url
  const existingAdditionalImages = existingImages
    .slice(1)
    .map((i) => i.image_url)

  const markImageForDelete = async (imageUrl: string) => {
    const img = existingImages.find((i) => i.image_url === imageUrl)
    if (!img) return
    setPendingDeletes((prev) => [...prev, img.id])
    setExistingImages((prev) => prev.filter((i) => i.id !== img.id))
  }

  useEffect(() => {
    if (mode === "edit" && initialData?.id) {
      authFetch(`/api/images?productId=${initialData.id}`)
        .then((res) => res.json())
        .then((imgs: { id: string; image_url: string }[]) => {
          if (!Array.isArray(imgs)) return
          setExistingImages(imgs)
        })
        .catch(() => {})
    }
  }, [mode, initialData?.id])

  const uploadImages = async (
    productId: string,
    onStep: (done: number, total: number) => void
  ) => {
    const files = [mainImage, ...additionalImages].filter(Boolean) as File[]
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData()
      fd.append("file", files[i])
      fd.append("productId", productId)
      await authFetch("/api/images", { method: "POST", body: fd })
      onStep(i + 1, files.length)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setProgress(0)

    const formData = new FormData(e.currentTarget)
    const data: ProductFormData = {
      id: formData.get("id") as string,
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
      hoverColor: formData.get("hoverColor") as string,
      status: formData.get("status") as string,
    }

    if (mode === "edit" && initialData?.id) {
      const numNewImages = [mainImage, ...additionalImages].filter(
        Boolean
      ).length
      const totalSteps = 1 + (pendingDeletes.length > 0 ? 1 : 0) + numNewImages

      setProgressLabel("Saving product...")
      animateTo(Math.round((1 / totalSteps) * 85))

      // delete pending images
      if (pendingDeletes.length > 0) {
        await Promise.all(
          pendingDeletes.map((imgId) =>
            authFetch(`/api/images/${imgId}`, { method: "DELETE" }).catch(
              console.error
            )
          )
        )
      }

      await authFetch(`/api/products/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (numNewImages > 0) {
        await uploadImages(initialData.id, (done, total) => {
          const step = (2 + done) / totalSteps
          setProgressLabel(`Uploading image ${done} of ${total}...`)
          animateTo(Math.round(step * 85))
        })
      }

      animateTo(100)
      setTimeout(() => router.push("/admin/inventory"), 400)
      return
    }

    const numImages = [mainImage, ...additionalImages].filter(Boolean).length
    const totalSteps = 1 + numImages

    setProgressLabel("Creating product...")
    animateTo(Math.round((1 / totalSteps) * 85))

    const res = await authFetch("/api/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error("Failed to add product:", err)
      setIsSubmitting(false)
      return
    }

    const { id } = await res.json()

    if (id && numImages > 0) {
      await uploadImages(id, (done, total) => {
        const step = (1 + done) / totalSteps
        setProgressLabel(`Uploading image ${done} of ${total}...`)
        animateTo(Math.round(step * 85))
      })
    }

    if (id && selectedCategoryIds.length > 0) {
      await authFetch(`/api/products/${id}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryIds: selectedCategoryIds }),
      })
    }

    animateTo(100)
    setTimeout(() => router.push("/admin/inventory"), 400)
  }

  const defaultValues = { ...EMPTY_FORM, ...initialData }

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020208]/80 backdrop-blur-sm">
          <div className="flex w-80 flex-col gap-4 bg-[#111213] px-8 py-7">
            <p className="text-sm font-medium text-[#edeef0]">
              {progressLabel}
            </p>
            <div className="h-1 w-full overflow-hidden bg-[#2e3135]">
              <div
                className="h-full bg-[#5eb1ef] transition-none"
                style={{ width: `${Math.round(progress)}%` }}
              />
            </div>
            <p className="text-right text-xs text-[#8b8d98]">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      )}
      <form
        id="product-form"
        onSubmit={handleSubmit}
        className="flex h-full flex-col"
      >
        <h1 className="mb-8 font-serif text-[40px] leading-tight text-[#edeef0] lg:text-[48px]">
          {mode === "edit" ? "Edit product" : "Add product"}
        </h1>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-6">
          <div className="w-full lg:w-90 lg:shrink-0">
            <ImageUploadSection
              mainImage={mainImage}
              additionalImages={additionalImages}
              onMainImageChange={setMainImage}
              onAdditionalImagesChange={setAdditionalImages}
              existingImage={existingMainImage}
              existingAdditionalImages={existingAdditionalImages}
              onExistingMainImageRemove={() =>
                markImageForDelete(existingMainImage!)
              }
              onExistingAdditionalImagesChange={(urls) => {
                const removed = existingAdditionalImages.find(
                  (u) => !urls.includes(u)
                )
                if (removed) return markImageForDelete(removed)
              }}
              initialHoverColor={initialData?.hoverColor}
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between gap-y-5">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3">
              <ProductFormFields
                values={fieldValues}
                onChange={handleFieldChange}
              />

              <div className="flex flex-col gap-2 md:col-span-1">
                <Label
                  htmlFor="referenceNumber"
                  className="text-sm text-[#edeef0]"
                >
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
                  value={fieldValues.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  rows={8}
                  className="resize-none rounded-none border-[#2e3135] bg-transparent placeholder:text-[#dfebfd6e] focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
                />
              </div>

              <ProductCategoriesSection
                productId={initialData?.id}
                onSelectionChange={
                  mode === "add" ? setSelectedCategoryIds : undefined
                }
              />
            </div>

            <ProductFormActions
              onCancel={() => router.back()}
              mode={mode}
              productId={initialData?.id}
              status={initialData?.status}
              isFormValid={isFormValid}
            />
          </div>
        </div>
      </form>
    </>
  )
}

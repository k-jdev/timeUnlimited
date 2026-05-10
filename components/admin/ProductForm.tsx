"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { RiLoaderLine } from "@remixicon/react"
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

// --- Reference number search result type ---
interface RefSearchResult {
  id: string
  brand: string
  model: string
  reference_number: string | null
  condition: string | null
  case_material: string | null
  case_size: string | null
  dial_color: string | null
  price: string | null
  description: string | null
  images?: Array<{ image_url: string; is_main: boolean }>
}

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
  show_on_main?: boolean
  show_order?: number
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

function generateReferenceNumber() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const part1 = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("")
  const part2 = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("")
  return `TU-${part1}-${part2}`
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
  const [referenceNumber, setReferenceNumber] = useState<string>(
    () =>
      initialData?.referenceNumber ??
      (mode === "add" ? generateReferenceNumber() : "")
  )

  // --- Reference number search state ---
  const [refResults, setRefResults] = useState<RefSearchResult[]>([])
  const [refLoading, setRefLoading] = useState(false)
  const [refDropdownOpen, setRefDropdownOpen] = useState(false)
  const refDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const refWrapperRef = useRef<HTMLDivElement>(null)

  const searchByRef = useCallback(async (q: string) => {
    if (!q.trim()) {
      setRefResults([])
      setRefDropdownOpen(false)
      return
    }
    setRefLoading(true)
    try {
      const res = await authFetch(
        `/api/products?search=${encodeURIComponent(q)}&limit=6`
      )
      if (!res.ok) throw new Error()
      const json = await res.json()
      const items: RefSearchResult[] = json.products ?? []
      setRefResults(items)
      setRefDropdownOpen(items.length > 0)
    } catch {
      setRefResults([])
      setRefDropdownOpen(false)
    } finally {
      setRefLoading(false)
    }
  }, [])

  function handleRefInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setReferenceNumber(q)
    if (refDebounceRef.current) clearTimeout(refDebounceRef.current)
    refDebounceRef.current = setTimeout(() => searchByRef(q), 300)
  }

  function handleRefSelect(p: RefSearchResult) {
    setReferenceNumber(p.reference_number ?? referenceNumber)
    setFieldValues((prev) => ({
      ...prev,
      brand: p.brand ?? prev.brand,
      model: p.model ?? prev.model,
      condition: p.condition ?? prev.condition,
      caseMaterial: p.case_material ?? prev.caseMaterial,
      caseSize: p.case_size ?? prev.caseSize,
      dial: p.dial_color ?? prev.dial,
      price: p.price ?? prev.price,
      description: p.description ?? prev.description,
    }))
    if (p.images && p.images.length > 0) {
      const sorted = [...p.images].sort((a, b) => (b.is_main ? 1 : -1))
      setExistingImages(
        sorted.map((img, i) => ({
          id: `ref-${p.id}-${i}`,
          image_url: img.image_url,
        }))
      )
    }
    setRefResults([])
    setRefDropdownOpen(false)
  }

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        refWrapperRef.current &&
        !refWrapperRef.current.contains(e.target as Node)
      ) {
        setRefDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

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
    priceOnRequest: !initialData?.price || Number(initialData?.price) === 0,
    completeSet: initialData?.completeSet ?? "",
    description: initialData?.description ?? "",
    show_on_main: initialData?.show_on_main ?? false,
    show_order: initialData?.show_order ?? 0,
  }))

  const handleFieldChange = (
    field: keyof typeof fieldValues,
    value: string | boolean
  ) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = Object.values(fieldValues).every(
    (v) => String(v).trim() !== ""
  )

  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    let fileToAnalyze: File | null = mainImage

    if (!fileToAnalyze && existingMainImage) {
      try {
        const blobRes = await fetch(existingMainImage)
        const blob = await blobRes.blob()
        fileToAnalyze = new File([blob], "watch.jpg", {
          type: blob.type || "image/jpeg",
        })
      } catch {
        console.error("Failed to fetch existing image for analysis")
        return
      }
    }

    if (!fileToAnalyze) return

    setIsAnalyzing(true)
    try {
      const fd = new FormData()
      fd.append("file", fileToAnalyze)
      const res = await authFetch("/api/analyze-watch", {
        method: "POST",
        body: fd,
      })
      if (!res.ok) throw new Error("Analysis failed")
      const data = await res.json()

      const analyzeFields = [
        "brand",
        "model",
        "condition",
        "caseMaterial",
        "caseSize",
        "dial",
      ] as const
      let updatedValues: Partial<typeof fieldValues> = {}
      setFieldValues((prev) => {
        const updates: Partial<typeof prev> = {}
        for (const field of analyzeFields) {
          if (data[field]) updates[field] = data[field]
        }
        updatedValues = updates
        return { ...prev, ...updates }
      })

      // auto-generate description with analyzed fields
      const merged = { ...fieldValues, ...updatedValues }
      const descRes = await authFetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: merged.brand,
          model: merged.model,
          condition: merged.condition,
          caseMaterial: merged.caseMaterial,
          caseSize: merged.caseSize,
          dial: merged.dial,
          completeSet: merged.completeSet,
        }),
      })
      if (descRes.ok) {
        const descData = await descRes.json()
        if (descData.description) {
          handleFieldChange("description", descData.description)
        }
      }
    } catch (err) {
      console.error("[handleAnalyze]", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false)

  const handleGenerateDescription = async () => {
    setIsGeneratingDesc(true)
    try {
      const res = await authFetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: fieldValues.brand,
          model: fieldValues.model,
          condition: fieldValues.condition,
          caseMaterial: fieldValues.caseMaterial,
          caseSize: fieldValues.caseSize,
          dial: fieldValues.dial,
          completeSet: fieldValues.completeSet,
        }),
      })
      if (!res.ok) throw new Error("Generation failed")
      const data = await res.json()
      if (data.description) {
        handleFieldChange("description", data.description)
      }
    } catch (err) {
      console.error("[handleGenerateDescription]", err)
    } finally {
      setIsGeneratingDesc(false)
    }
  }

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
      show_on_main: formData.get("show_on_main") === "on",
      show_order: Number(formData.get("show_order") || 0),
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

      await authFetch(`/api/products/${initialData.id}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryIds: selectedCategoryIds }),
      })

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
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between gap-y-5">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3">
              <ProductFormFields
                values={fieldValues}
                onChange={handleFieldChange}
                onSelectProduct={handleRefSelect}
              />

              <div
                className="flex flex-col gap-2 md:col-span-1"
                ref={refWrapperRef}
              >
                <Label
                  htmlFor="referenceNumber"
                  className="text-sm text-[#edeef0]"
                >
                  Reference Number
                </Label>
                <div className="relative">
                  <Input
                    id="referenceNumber"
                    name="referenceNumber"
                    placeholder="Enter reference"
                    value={referenceNumber}
                    onChange={handleRefInput}
                    onFocus={() => {
                      if (refResults.length > 0) setRefDropdownOpen(true)
                    }}
                    autoComplete="off"
                    className="rounded-none border-[#2e3135] bg-transparent placeholder:text-[#dfebfd6e] focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
                  />
                  {refLoading && (
                    <RiLoaderLine className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-[#8b8d98]" />
                  )}
                  {refDropdownOpen && refResults.length > 0 && (
                    <div className="absolute top-full right-0 left-0 z-20 mt-0.5 border border-[#2e3135] bg-[#111113]">
                      {refResults.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onMouseDown={() => handleRefSelect(p)}
                          className="flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm transition-colors hover:bg-white/5"
                        >
                          <span className="text-[#edeef0]">
                            {p.brand} {p.model}
                          </span>
                          {p.reference_number && (
                            <span className="text-xs text-[#5eb1ef]">
                              {p.reference_number}
                            </span>
                          )}
                          {(p.condition || p.case_material) && (
                            <span className="text-xs text-[#8b8d98]">
                              {[p.condition, p.case_material]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <ProductCategoriesSection
                productId={initialData?.id}
                onSelectionChange={setSelectedCategoryIds}
              />

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

"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import {
  RiUploadLine,
  RiAddLine,
  RiCloseLine,
  RiContrastDropLine,
} from "@remixicon/react"

interface ImageUploadSectionProps {
  mainImage: File | null
  additionalImages: File[]
  onMainImageChange: (file: File | null) => void
  onAdditionalImagesChange: (files: File[]) => void
  existingImage?: string
  initialHoverColor?: string
}

function UploadZone({
  onFile,
  preview,
  onRemove,
  className,
}: {
  onFile: (file: File) => void
  preview?: string
  onRemove?: () => void
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        onFile(file)
      }
    },
    [onFile]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    e.target.value = ""
  }

  if (preview) {
    return (
      <div className={`relative overflow-hidden bg-[#111113] ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          alt="Upload preview"
          className="h-full w-full object-cover"
        />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 flex size-6 items-center justify-center bg-black/60 text-white hover:bg-black/80"
          >
            <RiCloseLine className="size-4" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      className={`relative cursor-pointer bg-[#111113] transition-colors duration-200 ${dragging ? "bg-[#1a1a22]" : "hover:bg-[#16161e]"} ${className}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
      />
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex size-10 items-center justify-center border border-dashed border-[#3a3d42]">
          <RiUploadLine className="size-4 text-[#8b8d98]" />
        </div>
      </div>
    </div>
  )
}

export function ImageUploadSection({
  mainImage,
  additionalImages,
  onMainImageChange,
  onAdditionalImagesChange,
  existingImage,
  initialHoverColor,
}: ImageUploadSectionProps) {
  const colorPickerRef = useRef<HTMLInputElement>(null)
  const colorButtonRef = useRef<HTMLButtonElement>(null)
  const hiddenInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const color = initialHoverColor || ""
    if (colorButtonRef.current)
      colorButtonRef.current.style.backgroundColor = color || "#111113"
    if (hiddenInputRef.current) hiddenInputRef.current.value = color
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value

      if (colorButtonRef.current)
        colorButtonRef.current.style.backgroundColor = color
      if (hiddenInputRef.current) hiddenInputRef.current.value = color
    },
    []
  )
  const mainPreview = mainImage
    ? URL.createObjectURL(mainImage)
    : existingImage || undefined

  const addAdditional = (file: File) => {
    onAdditionalImagesChange([...additionalImages, file])
  }

  const removeAdditional = (index: number) => {
    onAdditionalImagesChange(additionalImages.filter((_, i) => i !== index))
  }

  const addMoreInputRef = useRef<HTMLInputElement>(null)

  const handleAddMore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) {
      onAdditionalImagesChange([...additionalImages, ...files])
    }
    e.target.value = ""
  }

  const filledSlots = additionalImages.map((f, i) => ({
    key: i,
    file: f as File | null,
  }))
  const emptyCount = filledSlots.length % 2 === 0 ? 2 : 1
  const slots = [
    ...filledSlots,
    ...Array.from({ length: emptyCount }, (_, i) => ({
      key: additionalImages.length + i,
      file: null as File | null,
    })),
  ]

  return (
    <div className="flex flex-col">
      <div className="relative">
        <UploadZone
          onFile={onMainImageChange}
          preview={mainPreview}
          onRemove={mainImage ? () => onMainImageChange(null) : undefined}
          className="h-75 lg:h-112.5"
        />
        {
          <button
            ref={colorButtonRef}
            type="button"
            onClick={() => colorPickerRef.current?.click()}
            className="absolute right-3 bottom-3 flex size-8 items-center justify-center border-2 border-white/20 transition-all hover:scale-110 hover:border-white/50"
            style={{ backgroundColor: initialHoverColor || "#111113" }}
            title="Card hover color"
          >
            <RiContrastDropLine
              className="size-3.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
              style={{ color: "rgba(255,255,255,0.7)" }}
            />
            <input
              ref={colorPickerRef}
              type="color"
              defaultValue={initialHoverColor || "#111113"}
              onChange={handleColorChange}
              className="sr-only"
            />
          </button>
        }
        <input
          ref={hiddenInputRef}
          type="hidden"
          name="hoverColor"
          defaultValue={initialHoverColor || ""}
          form="product-form"
        />
      </div>

      <div className="mt-0.5 grid grid-cols-2 gap-0.5">
        {slots.map(({ key, file }) => {
          const preview = file ? URL.createObjectURL(file) : undefined
          return (
            <UploadZone
              key={key}
              onFile={addAdditional}
              preview={preview}
              onRemove={file ? () => removeAdditional(key) : undefined}
              className="h-37.5 lg:h-45"
            />
          )
        })}
      </div>

      <button
        type="button"
        className="mt-0.5 flex h-12 w-full items-center justify-center gap-2 bg-[#111113] text-sm text-[#8b8d98] transition-colors duration-200 hover:bg-[#16161e] hover:text-[#edeef0]"
        onClick={() => addMoreInputRef.current?.click()}
      >
        Add more
        <RiAddLine className="size-4" />
      </button>
      <input
        ref={addMoreInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handleAddMore}
      />
    </div>
  )
}

"use client"

import { useRef, useState, useCallback } from "react"
import { RiUploadLine, RiAddLine, RiCloseLine } from "@remixicon/react"

interface ImageUploadSectionProps {
  mainImage: File | null
  additionalImages: File[]
  onMainImageChange: (file: File | null) => void
  onAdditionalImagesChange: (files: File[]) => void
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
}: ImageUploadSectionProps) {
  const mainPreview = mainImage ? URL.createObjectURL(mainImage) : undefined

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

  // Build display slots: existing images + empty slots to fill complete rows of 2
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
      <UploadZone
        onFile={onMainImageChange}
        preview={mainPreview}
        onRemove={mainImage ? () => onMainImageChange(null) : undefined}
        className="h-[300px] lg:h-[450px]"
      />

      <div className="mt-0.5 grid grid-cols-2 gap-0.5">
        {slots.map(({ key, file }) => {
          const preview = file ? URL.createObjectURL(file) : undefined
          return (
            <UploadZone
              key={key}
              onFile={addAdditional}
              preview={preview}
              onRemove={file ? () => removeAdditional(key) : undefined}
              className="h-[150px] lg:h-[180px]"
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

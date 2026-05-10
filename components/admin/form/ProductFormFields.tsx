"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RiLoaderLine, RiArrowRightLine } from "@remixicon/react"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { authFetch } from "@/lib/authFetch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CONDITIONS } from "@/data/inventory"

interface ProductSearchResult {
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

const COMPLETE_SET_OPTIONS = ["Yes", "No", "Box only", "Papers only"]

export interface ProductFieldValues {
  brand: string
  model: string
  condition: string
  caseMaterial: string
  caseSize: string
  dial: string
  price: string
  priceOnRequest: boolean
  completeSet: string
  show_on_main: boolean
  show_order: number
}

interface ProductFormFieldsProps {
  values: ProductFieldValues
  onChange: (field: keyof ProductFieldValues, value: string | boolean) => void
  onSelectProduct?: (p: ProductSearchResult) => void
}

export function ProductFormFields({
  values,
  onChange,
  onSelectProduct,
}: ProductFormFieldsProps) {
  // Brand search state
  const [brandInput, setBrandInput] = useState(values.brand)
  const [brandResults, setBrandResults] = useState<ProductSearchResult[]>([])
  const [brandLoading, setBrandLoading] = useState(false)
  const [brandOpen, setBrandOpen] = useState(false)
  const brandDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Model search state
  const [modelInput, setModelInput] = useState(values.model)
  const [modelResults, setModelResults] = useState<ProductSearchResult[]>([])
  const [modelLoading, setModelLoading] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const modelDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setBrandInput(values.brand)
  }, [values.brand])
  useEffect(() => {
    setModelInput(values.model)
  }, [values.model])

  const searchProducts = useCallback(
    async (q: string): Promise<ProductSearchResult[]> => {
      if (!q.trim()) return []
      const res = await authFetch(
        `/api/products?search=${encodeURIComponent(q)}&limit=8`
      )
      if (!res.ok) return []
      const json = await res.json()
      return json.products ?? []
    },
    []
  )

  function handleBrandInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setBrandInput(q)
    onChange("brand", q)
    onChange("model", "")
    setModelInput("")
    setBrandOpen(false)
    if (brandDebounceRef.current) clearTimeout(brandDebounceRef.current)
    if (q.trim()) {
      brandDebounceRef.current = setTimeout(async () => {
        setBrandLoading(true)
        try {
          const items = await searchProducts(q)
          setBrandResults(items)
          setBrandOpen(items.length > 0)
        } finally {
          setBrandLoading(false)
        }
      }, 300)
    } else {
      setBrandResults([])
    }
  }

  function handleBrandSelect(p: ProductSearchResult) {
    setBrandInput(p.brand)
    setModelInput(p.model)
    onChange("brand", p.brand)
    onChange("model", p.model)
    if (p.condition) onChange("condition", p.condition)
    if (p.case_material) onChange("caseMaterial", p.case_material)
    if (p.case_size) onChange("caseSize", p.case_size)
    if (p.dial_color) onChange("dial", p.dial_color)
    if (p.price) onChange("price", p.price)
    onSelectProduct?.(p)
    setBrandResults([])
    setBrandOpen(false)
  }

  function handleModelInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setModelInput(q)
    onChange("model", q)
    setModelOpen(false)
    if (modelDebounceRef.current) clearTimeout(modelDebounceRef.current)
    if (q.trim()) {
      modelDebounceRef.current = setTimeout(async () => {
        setModelLoading(true)
        try {
          const searchQ = values.brand ? `${values.brand} ${q}` : q
          const items = await searchProducts(searchQ)
          setModelResults(items)
          setModelOpen(items.length > 0)
        } finally {
          setModelLoading(false)
        }
      }, 300)
    } else {
      setModelResults([])
    }
  }

  function handleModelSelect(p: ProductSearchResult) {
    setBrandInput(p.brand)
    setModelInput(p.model)
    onChange("brand", p.brand)
    onChange("model", p.model)
    if (p.condition) onChange("condition", p.condition)
    if (p.case_material) onChange("caseMaterial", p.case_material)
    if (p.case_size) onChange("caseSize", p.case_size)
    if (p.dial_color) onChange("dial", p.dial_color)
    if (p.price) onChange("price", p.price)
    onSelectProduct?.(p)
    setModelResults([])
    setModelOpen(false)
  }

  return (
    <>
      {/* Brand */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="brand" className="text-sm text-[#edeef0]">
          Brand
        </Label>
        <div className="relative">
          <div className="flex items-center border border-[#2e3135]">
            <input
              id="brand"
              name="brand"
              type="text"
              autoComplete="off"
              placeholder="e.g. Patek Philippe"
              value={brandInput}
              onChange={handleBrandInput}
              onFocus={() => {
                if (brandResults.length > 0) setBrandOpen(true)
              }}
              onBlur={() => setTimeout(() => setBrandOpen(false), 150)}
              className="h-9 flex-1 bg-transparent px-3 text-sm text-[#edeef0] outline-none placeholder:text-[#dfebfd6e]"
            />
            {brandLoading && (
              <RiLoaderLine className="mr-2 size-4 shrink-0 animate-spin text-[#8b8d98]" />
            )}
          </div>
          {brandOpen && brandResults.length > 0 && (
            <div className="absolute top-full right-0 left-0 z-20 mt-0.5 border border-[#2e3135] bg-[#111113]">
              <ScrollArea className="h-64">
                {brandResults.map((p, i) => {
                  const imageUrl =
                    p.images?.find((img) => img.is_main)?.image_url ??
                    p.images?.[0]?.image_url ??
                    null
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onMouseDown={() => handleBrandSelect(p)}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-white/5 ${
                        i % 2 === 1 ? "bg-white/2" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={p.model}
                            className="size-12 shrink-0 object-cover"
                          />
                        ) : (
                          <div className="size-12 shrink-0 bg-[#1a1a1c]" />
                        )}
                        <div className="flex flex-col">
                          <span className="text-[13px] leading-4 text-[#8b8d98]">
                            {p.brand}
                          </span>
                          <span className="text-[14px] leading-5 text-[#edeef0]">
                            {p.model}
                          </span>
                          {p.reference_number && (
                            <span className="text-[11px] leading-4 text-[#8b8d98]">
                              {p.reference_number}
                            </span>
                          )}
                        </div>
                      </div>
                      <RiArrowRightLine className="size-4 shrink-0 text-[#8b8d98]" />
                    </button>
                  )
                })}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="condition" className="text-sm text-[#edeef0]">
          Condition
        </Label>
        <Select
          name="condition"
          value={values.condition}
          onValueChange={(v) => onChange("condition", v)}
        >
          <SelectTrigger
            id="condition"
            className="w-full rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20 data-placeholder:text-[#dfebfd6e]"
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
        <Input
          id="caseMaterial"
          name="caseMaterial"
          type="text"
          placeholder="e.g. Stainless Steel"
          value={values.caseMaterial}
          onChange={(e) => onChange("caseMaterial", e.target.value)}
          className="rounded-none border-[#2e3135] bg-transparent placeholder:text-[#dfebfd6e] focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
        />
      </div>

      {/* Model */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="model" className="text-sm text-[#edeef0]">
          Model
        </Label>
        <div className="relative">
          <div className="flex items-center border border-[#2e3135]">
            <input
              id="model"
              name="model"
              type="text"
              autoComplete="off"
              placeholder="e.g. Royal Oak"
              value={modelInput}
              onChange={handleModelInput}
              onFocus={() => {
                if (modelResults.length > 0) setModelOpen(true)
              }}
              onBlur={() => setTimeout(() => setModelOpen(false), 150)}
              className="h-9 flex-1 bg-transparent px-3 text-sm text-[#edeef0] outline-none placeholder:text-[#dfebfd6e]"
            />
            {modelLoading && (
              <RiLoaderLine className="mr-2 size-4 shrink-0 animate-spin text-[#8b8d98]" />
            )}
          </div>
          {modelOpen && modelResults.length > 0 && (
            <div className="absolute top-full right-0 left-0 z-20 mt-0.5 border border-[#2e3135] bg-[#111113]">
              <ScrollArea className="h-64">
                {modelResults.map((p, i) => {
                  const imageUrl =
                    p.images?.find((img) => img.is_main)?.image_url ??
                    p.images?.[0]?.image_url ??
                    null
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onMouseDown={() => handleModelSelect(p)}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-white/5 ${
                        i % 2 === 1 ? "bg-white/2" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={p.model}
                            className="size-12 shrink-0 object-cover"
                          />
                        ) : (
                          <div className="size-12 shrink-0 bg-[#1a1a1c]" />
                        )}
                        <div className="flex flex-col">
                          <span className="text-[13px] leading-4 text-[#8b8d98]">
                            {p.brand}
                          </span>
                          <span className="text-[14px] leading-5 text-[#edeef0]">
                            {p.model}
                          </span>
                          {p.reference_number && (
                            <span className="text-[11px] leading-4 text-[#8b8d98]">
                              {p.reference_number}
                            </span>
                          )}
                        </div>
                      </div>
                      <RiArrowRightLine className="size-4 shrink-0 text-[#8b8d98]" />
                    </button>
                  )
                })}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="caseSize" className="text-sm text-[#edeef0]">
          Case Size
        </Label>
        <Input
          id="caseSize"
          name="caseSize"
          type="text"
          placeholder="e.g. 40mm"
          value={values.caseSize}
          onChange={(e) => onChange("caseSize", e.target.value)}
          className="rounded-none border-[#2e3135] bg-transparent placeholder:text-[#dfebfd6e] focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="dial" className="text-sm text-[#edeef0]">
          Dial
        </Label>
        <Input
          id="dial"
          name="dial"
          type="text"
          placeholder="e.g. Black"
          value={values.dial}
          onChange={(e) => onChange("dial", e.target.value)}
          className="rounded-none border-[#2e3135] bg-transparent placeholder:text-[#dfebfd6e] focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#edeef0]">Price</span>
          <div className="flex items-center gap-2">
            <span style={{ color: "#ffffff", fontSize: "12px" }}>
              Price on request
            </span>
            <Switch
              checked={values.priceOnRequest}
              onCheckedChange={(checked: boolean) => {
                onChange("priceOnRequest", checked)
                if (checked) onChange("price", "0")
              }}
              className="scale-90"
            />
          </div>
        </div>
        {!values.priceOnRequest && (
          <div className="relative flex items-center">
            <span className="absolute left-3 text-sm text-[#8b8d98]">$</span>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={values.price}
              onChange={(e) => onChange("price", e.target.value)}
              className="rounded-none border-[#2e3135] bg-transparent pl-7 placeholder:text-[#dfebfd6e] focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
            />
          </div>
        )}
        {values.priceOnRequest && (
          <>
            <input type="hidden" name="price" value="0" />
            <div className="flex h-9 items-center justify-center border border-[#2e3135]">
              <span className="text-sm text-[#edeef0]">Price on request</span>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="completeSet" className="text-sm text-[#edeef0]">
          Complete Set
        </Label>
        <Select
          name="completeSet"
          value={values.completeSet}
          onValueChange={(v) => onChange("completeSet", v)}
        >
          <SelectTrigger
            id="completeSet"
            className="w-full rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20 data-placeholder:text-[#dfebfd6e]"
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
    </>
  )
}

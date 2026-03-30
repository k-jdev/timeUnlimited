"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BRANDS,
  CONDITIONS,
  CASE_MATERIALS,
  DIAL_COLORS,
  SIZES,
} from "@/data/inventory"

const COMPLETE_SET_OPTIONS = ["Yes", "No", "Box only", "Papers only"]

export interface ProductFieldValues {
  brand: string
  model: string
  condition: string
  caseMaterial: string
  caseSize: string
  dial: string
  price: string
  completeSet: string
}

interface ProductFormFieldsProps {
  values: ProductFieldValues
  onChange: (field: keyof ProductFieldValues, value: string) => void
}

export function ProductFormFields({
  values,
  onChange,
}: ProductFormFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="brand" className="text-sm text-[#edeef0]">
          Brand
        </Label>
        <Select
          name="brand"
          value={values.brand}
          onValueChange={(v) => onChange("brand", v)}
        >
          <SelectTrigger
            id="brand"
            className="w-full rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20 data-placeholder:text-[#dfebfd6e]"
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
        <Select
          name="caseMaterial"
          value={values.caseMaterial}
          onValueChange={(v) => onChange("caseMaterial", v)}
        >
          <SelectTrigger
            id="caseMaterial"
            className="w-full rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20 data-placeholder:text-[#dfebfd6e]"
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
          value={values.model}
          onChange={(e) => onChange("model", e.target.value)}
          className="rounded-none border-[#2e3135] bg-transparent placeholder:text-[#dfebfd6e] focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="caseSize" className="text-sm text-[#edeef0]">
          Case Size
        </Label>
        <Select
          name="caseSize"
          value={values.caseSize}
          onValueChange={(v) => onChange("caseSize", v)}
        >
          <SelectTrigger
            id="caseSize"
            className="w-full rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20 data-placeholder:text-[#dfebfd6e]"
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
        <Select
          name="dial"
          value={values.dial}
          onValueChange={(v) => onChange("dial", v)}
        >
          <SelectTrigger
            id="dial"
            className="w-full rounded-none border-[#2e3135] bg-transparent focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20 data-placeholder:text-[#dfebfd6e]"
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
            value={values.price}
            onChange={(e) => onChange("price", e.target.value)}
            className="rounded-none border-[#2e3135] bg-transparent pl-7 placeholder:text-[#dfebfd6e] focus-visible:border-[#5eb1ef] focus-visible:ring-[#5eb1ef]/20"
          />
        </div>
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

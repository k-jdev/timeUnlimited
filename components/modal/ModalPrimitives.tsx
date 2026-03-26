import { RiArrowRightLine } from "@remixicon/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ModalHeader({
  step,
  title,
  subtitle,
  totalSteps = 3,
}: {
  step: number
  title: string
  subtitle: string
  totalSteps?: number
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-[38px] leading-none text-[#edeef0]">
          {title}
        </h2>
        <p className="text-[14px] leading-5 font-light text-[#8b8d98]">
          {subtitle}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1 pt-1 text-[12px] tracking-[0.04px]">
        <span className="text-[#edeef0]">Step {step}</span>
        <span className="text-[#8b8d98]">of {totalSteps}</span>
      </div>
    </div>
  )
}

export function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] leading-5 font-medium text-[#edeef0]">
        {label}
      </span>
      {children}
    </div>
  )
}

export function ModalSelect({
  placeholder,
  options,
  value,
  onChange,
}: {
  placeholder: string
  options: readonly string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-full rounded-none border-[#2e3135] bg-[#111113] text-[14px] text-[#edeef0] data-placeholder:text-[#8b8d98]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="border-[#2e3135] bg-[#111214]">
        {options.map((opt) => (
          <SelectItem
            key={opt}
            value={opt}
            className="text-[#edeef0] focus:bg-white/10 focus:text-[#edeef0]"
          >
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function ModalInput(props: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className="h-8 rounded-none border-[#2e3135] bg-[#111113] text-[14px] text-[#edeef0] placeholder:text-[#8b8d98] focus-visible:border-white/30 focus-visible:ring-0"
    />
  )
}

export function ModalTextarea(props: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      {...props}
      className="min-h-24 resize-none rounded-none border-[#2e3135] bg-[#0d0d0e] text-[14px] text-[#edeef0] placeholder:text-[#8b8d98] focus-visible:border-white/30 focus-visible:ring-0"
    />
  )
}

export function FooterButtons({
  onBack,
  onNext,
  nextLabel = "Next",
  nextIcon = <RiArrowRightLine className="size-4" />,
  showBack = true,
  note,
}: {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  nextIcon?: React.ReactNode
  showBack?: boolean
  note?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      {note ? (
        <span className="text-[12px] leading-5 font-light text-[#B0B4BA]">
          {note}
        </span>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-3">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-8 items-center justify-center bg-white/6 px-3 text-[14px] font-medium text-[#edeef0] transition-colors hover:bg-white/10"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          className="flex h-8 items-center justify-center gap-2 bg-[#edeef0] px-3 text-[14px] font-medium text-[#020208] transition-colors hover:bg-white"
        >
          {nextLabel}
          {nextIcon}
        </button>
      </div>
    </div>
  )
}

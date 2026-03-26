"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import {
  RiSearchLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiUploadLine,
  RiMailLine,
  RiCloseLine,
} from "@remixicon/react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BrandLogo } from "@/components/layout/BrandLogo"
import { RequestWatchModal } from "@/components/home/RequestWatchModal"
import { SellWatchModal } from "@/components/home/SellWatchModal"
import {
  BRANDS,
  CONDITIONS,
  CASE_MATERIALS,
  BRACELET_MATERIALS,
  DIAL_COLORS,
  SIZES,
  SPECIAL_FEATURES,
} from "@/data/inventory"

function WatchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="6" />
      <polyline points="12 10 12 12 13 13" />
      <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
      <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
    </svg>
  )
}

const ACTION_ITEMS = [
  { label: "Request", icon: WatchIcon, highlighted: true },
  { label: "Sell", icon: RiUploadLine, highlighted: false },
  { label: "Contact", icon: RiMailLine, highlighted: false },
]

const PRICE_MIN = 0
const PRICE_MAX = 200000

function formatPrice(v: number) {
  if (v >= PRICE_MAX) return "$200 000+"
  return "$" + v.toLocaleString("en-US")
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-[#2E3135]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3"
      >
        <span className="text-[16px] leading-6 font-medium text-[#edeef0]">
          {title}
        </span>
        {open ? (
          <RiArrowUpSLine className="size-4 text-[#edeef0]" />
        ) : (
          <RiArrowDownSLine className="size-4 text-[#edeef0]" />
        )}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  )
}

function CheckboxList({
  items,
  selected,
  onToggle,
}: {
  items: readonly string[]
  selected: string[]
  onToggle: (item: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <label key={item} className="flex cursor-pointer items-center gap-2">
          <Checkbox
            checked={selected.includes(item)}
            onCheckedChange={() => onToggle(item)}
          />
          <span className="flex-1 text-[14px] leading-5 text-[#edeef0]">
            {item}
          </span>
        </label>
      ))}
    </div>
  )
}

export interface InventoryFilterSidebarProps {
  selectedBrands: string[]
  onBrandsChange: (brands: string[]) => void
  selectedConditions: string[]
  onConditionsChange: (conditions: string[]) => void
  selectedCaseMaterials: string[]
  onCaseMaterialsChange: (materials: string[]) => void
  selectedBraceletMaterials: string[]
  onBraceletMaterialsChange: (materials: string[]) => void
  selectedDialColors: string[]
  onDialColorsChange: (colors: string[]) => void
  selectedSizes: string[]
  onSizesChange: (sizes: string[]) => void
  selectedSpecials: string[]
  onSpecialsChange: (specials: string[]) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function InventoryFilterSidebar({
  selectedBrands,
  onBrandsChange,
  selectedConditions,
  onConditionsChange,
  selectedCaseMaterials,
  onCaseMaterialsChange,
  selectedBraceletMaterials,
  onBraceletMaterialsChange,
  selectedDialColors,
  onDialColorsChange,
  selectedSizes,
  onSizesChange,
  selectedSpecials,
  onSpecialsChange,
  priceRange,
  onPriceRangeChange,
  mobileOpen = false,
  onMobileClose,
}: InventoryFilterSidebarProps) {
  const [brandSearch, setBrandSearch] = useState("")
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Brand: true,
    Condition: true,
    "Price range": true,
    "Case material": false,
    "Bracelet Material": false,
    "Dial Color": false,
    Size: false,
    Special: false,
  })

  const toggle = (name: string) =>
    setOpenSections((prev) => ({ ...prev, [name]: !prev[name] }))

  const toggleItem = (
    list: string[],
    item: string,
    onChange: (v: string[]) => void
  ) => {
    onChange(
      list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
    )
  }

  const filteredBrands = BRANDS.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  )

  const filterContent = (
    <>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col px-6 pt-6 pb-8 lg:pt-16 lg:pr-10 lg:pl-8">
          {/* Brand */}
          <div className="border-b border-[#2E3135]">
            <button
              onClick={() => toggle("Brand")}
              className="flex w-full items-center justify-between py-3"
            >
              <span className="text-[16px] leading-6 font-medium text-[#edeef0]">
                Brand
              </span>
              {openSections.Brand ? (
                <RiArrowUpSLine className="size-4 text-[#edeef0]" />
              ) : (
                <RiArrowDownSLine className="size-4 text-[#edeef0]" />
              )}
            </button>
            {openSections.Brand && (
              <div className="flex flex-col gap-3 pb-3">
                <div className="flex h-8 items-center gap-2 bg-[rgba(255,255,255,0.06)] px-3">
                  <RiSearchLine className="size-4 text-[#edeef0]/50" />
                  <input
                    type="text"
                    placeholder="Select..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] leading-5 text-[#edeef0] placeholder:text-[#edeef0]/50 focus:outline-none"
                  />
                </div>
                <CheckboxList
                  items={filteredBrands}
                  selected={selectedBrands}
                  onToggle={(item) =>
                    toggleItem(selectedBrands, item, onBrandsChange)
                  }
                />
              </div>
            )}
          </div>

          {/* Condition */}
          <FilterSection
            title="Condition"
            open={openSections.Condition}
            onToggle={() => toggle("Condition")}
          >
            <CheckboxList
              items={CONDITIONS}
              selected={selectedConditions}
              onToggle={(item) =>
                toggleItem(selectedConditions, item, onConditionsChange)
              }
            />
          </FilterSection>

          {/* Price range */}
          <FilterSection
            title="Price range"
            open={openSections["Price range"]}
            onToggle={() => toggle("Price range")}
          >
            <div className="flex flex-col gap-3">
              <Slider
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={1000}
                value={priceRange}
                onValueChange={(v) => onPriceRangeChange(v as [number, number])}
                className="**:data-[slot=slider-range]:bg-[#70b8ff] **:data-[slot=slider-track]:border-0 **:data-[slot=slider-track]:bg-[#2E3135] **:data-[slot=slider-track]:shadow-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#80838d]">
                  {formatPrice(priceRange[0])}
                </span>
                <span className="text-[13px] text-[#80838d]">
                  {formatPrice(priceRange[1])}
                </span>
              </div>
            </div>
          </FilterSection>

          {/* Case material */}
          <FilterSection
            title="Case material"
            open={openSections["Case material"]}
            onToggle={() => toggle("Case material")}
          >
            <CheckboxList
              items={CASE_MATERIALS}
              selected={selectedCaseMaterials}
              onToggle={(item) =>
                toggleItem(selectedCaseMaterials, item, onCaseMaterialsChange)
              }
            />
          </FilterSection>

          {/* Bracelet Material */}
          <FilterSection
            title="Bracelet Material"
            open={openSections["Bracelet Material"]}
            onToggle={() => toggle("Bracelet Material")}
          >
            <CheckboxList
              items={BRACELET_MATERIALS}
              selected={selectedBraceletMaterials}
              onToggle={(item) =>
                toggleItem(
                  selectedBraceletMaterials,
                  item,
                  onBraceletMaterialsChange
                )
              }
            />
          </FilterSection>

          {/* Dial Color */}
          <FilterSection
            title="Dial Color"
            open={openSections["Dial Color"]}
            onToggle={() => toggle("Dial Color")}
          >
            <CheckboxList
              items={DIAL_COLORS}
              selected={selectedDialColors}
              onToggle={(item) =>
                toggleItem(selectedDialColors, item, onDialColorsChange)
              }
            />
          </FilterSection>

          {/* Size */}
          <FilterSection
            title="Size"
            open={openSections.Size}
            onToggle={() => toggle("Size")}
          >
            <CheckboxList
              items={SIZES}
              selected={selectedSizes}
              onToggle={(item) =>
                toggleItem(selectedSizes, item, onSizesChange)
              }
            />
          </FilterSection>

          {/* Special */}
          <FilterSection
            title="Special"
            open={openSections.Special}
            onToggle={() => toggle("Special")}
          >
            <CheckboxList
              items={SPECIAL_FEATURES}
              selected={selectedSpecials}
              onToggle={(item) =>
                toggleItem(selectedSpecials, item, onSpecialsChange)
              }
            />
          </FilterSection>
        </div>
      </ScrollArea>

      <div className="px-3 pb-8 lg:px-8">
        <svg
          width="104"
          height="26"
          viewBox="0 0 104 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M55.1445 7.06064H52.316V6.10987H59.1021V7.06064H56.2736V14.5955H55.1445V7.06064ZM60.9468 7.34587H59.9366V6.10987H60.9468V7.34587ZM59.9366 8.45114H60.9468V14.5955H59.9366V8.45114ZM62.5118 8.45114H63.4626V9.35437H63.4863C63.9459 8.65714 64.6075 8.30852 65.4711 8.30852C65.8514 8.30852 66.196 8.38775 66.505 8.54621C66.814 8.70467 67.0319 8.97406 67.1587 9.35437C67.3647 9.0216 67.6341 8.7641 67.9668 8.58187C68.3075 8.39964 68.6799 8.30852 69.084 8.30852C69.393 8.30852 69.6703 8.34417 69.9159 8.41548C70.1695 8.47887 70.3834 8.58187 70.5577 8.72448C70.7399 8.8671 70.8786 9.05329 70.9736 9.28306C71.0766 9.5049 71.1281 9.77429 71.1281 10.0912V14.5955H70.118V10.5666C70.118 10.3764 70.1021 10.1982 70.0704 10.0318C70.0387 9.8654 69.9793 9.72279 69.8921 9.60394C69.805 9.47717 69.6822 9.37814 69.5237 9.30683C69.3732 9.23552 69.1751 9.19987 68.9295 9.19987C68.4303 9.19987 68.0381 9.34248 67.7529 9.62771C67.4677 9.91294 67.3251 10.2933 67.3251 10.7686V14.5955H66.3149V10.5666C66.3149 10.3685 66.2951 10.1863 66.2555 10.0199C66.2238 9.85352 66.1643 9.7109 66.0772 9.59206C65.99 9.46529 65.8712 9.37021 65.7206 9.30683C65.578 9.23552 65.3918 9.19987 65.1621 9.19987C64.8689 9.19987 64.6154 9.25929 64.4015 9.37814C64.1955 9.49698 64.0251 9.6396 63.8904 9.80598C63.7636 9.97237 63.6686 10.1467 63.6052 10.3289C63.5497 10.5032 63.522 10.6498 63.522 10.7686V14.5955H62.5118V8.45114ZM76.9105 10.935C76.8946 10.6973 76.8392 10.4715 76.7441 10.2576C76.6569 10.0437 76.5341 9.86144 76.3757 9.7109C76.2251 9.55244 76.0429 9.42964 75.829 9.34248C75.623 9.2474 75.3932 9.19987 75.1397 9.19987C74.8782 9.19987 74.6405 9.2474 74.4266 9.34248C74.2206 9.42964 74.0423 9.55244 73.8918 9.7109C73.7412 9.86937 73.6224 10.0556 73.5352 10.2695C73.4481 10.4755 73.3966 10.6973 73.3807 10.935H76.9105ZM77.885 12.6464C77.7503 13.3357 77.4532 13.8547 76.9937 14.2033C76.5341 14.5519 75.9557 14.7262 75.2585 14.7262C74.7673 14.7262 74.3394 14.647 73.975 14.4885C73.6184 14.3301 73.3174 14.1082 73.0717 13.823C72.8261 13.5378 72.6399 13.1971 72.5132 12.8009C72.3943 12.4048 72.327 11.9729 72.3111 11.5055C72.3111 11.038 72.3824 10.6102 72.5251 10.2219C72.6677 9.83371 72.8657 9.49698 73.1193 9.21175C73.3807 8.92652 73.6858 8.70467 74.0344 8.54621C74.3909 8.38775 74.7792 8.30852 75.1991 8.30852C75.7458 8.30852 76.1974 8.4234 76.5539 8.65317C76.9184 8.87502 77.2076 9.16025 77.4215 9.50887C77.6434 9.85748 77.7939 10.2378 77.8731 10.6498C77.9603 11.0618 77.9959 11.454 77.9801 11.8264H73.3807C73.3728 12.0958 73.4045 12.3533 73.4758 12.5989C73.5471 12.8366 73.662 13.0505 73.8205 13.2406C73.9789 13.4229 74.181 13.5694 74.4266 13.6804C74.6722 13.7913 74.9614 13.8468 75.2942 13.8468C75.722 13.8468 76.0706 13.7477 76.34 13.5496C76.6173 13.3516 76.7996 13.0505 76.8867 12.6464H77.885ZM59.9935 21.5293C59.9935 22.6147 59.7043 23.4308 59.1259 23.9775C58.5475 24.5163 57.7235 24.7856 56.6539 24.7856C55.5605 24.7856 54.7048 24.5281 54.0868 24.0131C53.4767 23.4902 53.1717 22.6623 53.1717 21.5293V16.1099H54.3007V21.5293C54.3007 22.2899 54.5028 22.8683 54.9069 23.2644C55.3109 23.6526 55.8933 23.8468 56.6539 23.8468C57.3749 23.8468 57.9216 23.6526 58.294 23.2644C58.6743 22.8683 58.8644 22.2899 58.8644 21.5293V16.1099H59.9935V21.5293ZM61.6297 18.4511H62.5805V19.4257H62.6043C63.0242 18.6809 63.6897 18.3085 64.6009 18.3085C65.005 18.3085 65.3417 18.364 65.6111 18.4749C65.8805 18.5858 66.0984 18.7403 66.2647 18.9384C66.4311 19.1365 66.546 19.3742 66.6094 19.6515C66.6807 19.9209 66.7164 20.2219 66.7164 20.5547V24.5955H65.7062V20.4359C65.7062 20.0556 65.5952 19.7545 65.3734 19.5326C65.1515 19.3108 64.8465 19.1999 64.4583 19.1999C64.1493 19.1999 63.8799 19.2474 63.6501 19.3425C63.4283 19.4376 63.2421 19.5723 63.0915 19.7466C62.941 19.9209 62.8261 20.1269 62.7469 20.3646C62.6756 20.5943 62.6399 20.8479 62.6399 21.1252V24.5955H61.6297V18.4511ZM68.293 16.1099H69.3032V24.5955H68.293V16.1099ZM71.9378 17.3459H70.9276V16.1099H71.9378V17.3459ZM70.9276 18.4511H71.9378V24.5955H70.9276V18.4511ZM73.5027 18.4511H74.4535V19.3544H74.4773C74.9368 18.6571 75.5984 18.3085 76.462 18.3085C76.8423 18.3085 77.187 18.3878 77.496 18.5462C77.805 18.7047 78.0229 18.9741 78.1496 19.3544C78.3556 19.0216 78.625 18.7641 78.9578 18.5819C79.2985 18.3996 79.6709 18.3085 80.0749 18.3085C80.3839 18.3085 80.6612 18.3442 80.9069 18.4155C81.1604 18.4789 81.3743 18.5819 81.5486 18.7245C81.7309 18.8671 81.8695 19.0533 81.9646 19.2831C82.0676 19.5049 82.1191 19.7743 82.1191 20.0912V24.5955H81.1089V20.5666C81.1089 20.3764 81.0931 20.1982 81.0614 20.0318C81.0297 19.8654 80.9702 19.7228 80.8831 19.6039C80.7959 19.4772 80.6731 19.3781 80.5147 19.3068C80.3641 19.2355 80.1661 19.1999 79.9204 19.1999C79.4213 19.1999 79.0291 19.3425 78.7439 19.6277C78.4586 19.9129 78.316 20.2933 78.316 20.7686V24.5955H77.3058V20.5666C77.3058 20.3685 77.286 20.1863 77.2464 20.0199C77.2147 19.8535 77.1553 19.7109 77.0681 19.5921C76.981 19.4653 76.8621 19.3702 76.7116 19.3068C76.569 19.2355 76.3828 19.1999 76.153 19.1999C75.8599 19.1999 75.6063 19.2593 75.3924 19.3781C75.1864 19.497 75.0161 19.6396 74.8814 19.806C74.7546 19.9724 74.6595 20.1467 74.5961 20.3289C74.5407 20.5032 74.5129 20.6498 74.5129 20.7686V24.5955H73.5027V18.4511ZM84.7045 17.3459H83.6943V16.1099H84.7045V17.3459ZM83.6943 18.4511H84.7045V24.5955H83.6943V18.4511ZM87.6718 18.4511H88.8959V19.3425H87.6718V23.1574C87.6718 23.2763 87.6797 23.3714 87.6956 23.4427C87.7193 23.514 87.759 23.5694 87.8144 23.6091C87.8699 23.6487 87.9452 23.6764 88.0402 23.6923C88.1432 23.7002 88.274 23.7041 88.4324 23.7041H88.8959V24.5955H88.1234C87.862 24.5955 87.6362 24.5796 87.446 24.5479C87.2638 24.5083 87.1132 24.441 86.9944 24.3459C86.8835 24.2508 86.8003 24.1161 86.7448 23.9418C86.6893 23.7675 86.6616 23.5378 86.6616 23.2525V19.3425H85.6158V18.4511H86.6616V16.609H87.6718V18.4511ZM94.2848 20.935C94.2689 20.6973 94.2135 20.4715 94.1184 20.2576C94.0312 20.0437 93.9084 19.8614 93.75 19.7109C93.5994 19.5524 93.4172 19.4296 93.2033 19.3425C92.9973 19.2474 92.7675 19.1999 92.514 19.1999C92.2525 19.1999 92.0148 19.2474 91.8009 19.3425C91.5949 19.4296 91.4166 19.5524 91.2661 19.7109C91.1155 19.8694 90.9967 20.0556 90.9095 20.2695C90.8224 20.4755 90.7709 20.6973 90.755 20.935H94.2848ZM95.2593 22.6464C95.1246 23.3357 94.8275 23.8547 94.368 24.2033C93.9084 24.5519 93.33 24.7262 92.6328 24.7262C92.1416 24.7262 91.7137 24.647 91.3493 24.4885C90.9927 24.3301 90.6916 24.1082 90.446 23.823C90.2004 23.5378 90.0142 23.1971 89.8875 22.8009C89.7686 22.4048 89.7013 21.9729 89.6854 21.5055C89.6854 21.038 89.7567 20.6102 89.8993 20.2219C90.042 19.8337 90.24 19.497 90.4936 19.2118C90.755 18.9265 91.0601 18.7047 91.4087 18.5462C91.7652 18.3878 92.1535 18.3085 92.5734 18.3085C93.1201 18.3085 93.5717 18.4234 93.9282 18.6532C94.2927 18.875 94.5819 19.1603 94.7958 19.5089C95.0176 19.8575 95.1682 20.2378 95.2474 20.6498C95.3346 21.0618 95.3702 21.454 95.3544 21.8264H90.755C90.7471 22.0958 90.7788 22.3533 90.8501 22.5989C90.9214 22.8366 91.0363 23.0505 91.1948 23.2406C91.3532 23.4229 91.5553 23.5694 91.8009 23.6804C92.0465 23.7913 92.3357 23.8468 92.6685 23.8468C93.0963 23.8468 93.4449 23.7477 93.7143 23.5496C93.9916 23.3516 94.1738 23.0505 94.261 22.6464H95.2593ZM97.1384 21.5768C97.1384 21.862 97.174 22.1433 97.2453 22.4206C97.3246 22.69 97.4394 22.9316 97.59 23.1456C97.7484 23.3595 97.9465 23.5298 98.1842 23.6566C98.4298 23.7834 98.7151 23.8468 99.0399 23.8468C99.3806 23.8468 99.6698 23.7794 99.9075 23.6447C100.145 23.51 100.339 23.3357 100.49 23.1218C100.64 22.8999 100.747 22.6504 100.811 22.3731C100.882 22.0958 100.918 21.8145 100.918 21.5293C100.918 21.2282 100.882 20.939 100.811 20.6617C100.739 20.3764 100.625 20.1269 100.466 19.9129C100.316 19.699 100.117 19.5287 99.8718 19.4019C99.6262 19.2672 99.3291 19.1999 98.9805 19.1999C98.6398 19.1999 98.3506 19.2672 98.1129 19.4019C97.8752 19.5366 97.6851 19.7149 97.5424 19.9367C97.3998 20.1586 97.2968 20.4121 97.2334 20.6973C97.1701 20.9826 97.1384 21.2757 97.1384 21.5768ZM101.892 24.5955H100.882V23.7636H100.858C100.692 24.1043 100.43 24.3499 100.074 24.5004C99.7173 24.6509 99.3251 24.7262 98.8973 24.7262C98.4219 24.7262 98.0059 24.6391 97.6494 24.4648C97.3008 24.2904 97.0076 24.0567 96.7699 23.7636C96.5402 23.4704 96.3659 23.1297 96.247 22.7415C96.1282 22.3533 96.0687 21.9413 96.0687 21.5055C96.0687 21.0697 96.1242 20.6577 96.2351 20.2695C96.354 19.8813 96.5283 19.5445 96.7581 19.2593C96.9957 18.9661 97.2889 18.7364 97.6375 18.57C97.9941 18.3957 98.4061 18.3085 98.8735 18.3085C99.032 18.3085 99.2023 18.3244 99.3846 18.3561C99.5668 18.3878 99.749 18.4432 99.9312 18.5224C100.113 18.5938 100.284 18.6928 100.442 18.8196C100.609 18.9384 100.747 19.0889 100.858 19.2712H100.882V16.1099H101.892V24.5955Z"
            fill="#EDEEF0"
          />
          <path
            d="M15.7425 17.7939H20.0893L17.0455 12.5981L22.2517 3.71008H32.6635L37.8691 12.5981L32.6635 21.4854H25.8507L28.0238 25.1954H34.0091C34.521 25.1954 34.9947 24.9258 35.2506 24.4887L41.8018 13.3042C42.0578 12.867 42.0578 12.3285 41.8018 11.8913L35.2506 0.70682C34.9947 0.269656 34.521 6.10352e-05 34.0091 6.10352e-05H20.9061C20.3942 6.10352e-05 19.9205 0.269656 19.6646 0.70682L13.1134 11.8919C12.8574 12.3291 12.8574 12.8677 13.1134 13.3048L15.7425 17.7939Z"
            fill="#EDEEF0"
          />
          <path
            d="M26.2507 7.40156H21.9039L24.9477 12.5974L19.7415 21.4854H9.32967L4.12408 12.5974L9.32967 3.71008H15.2642L13.0918 6.10352e-05H7.98467C7.47277 6.10352e-05 6.99914 0.269656 6.74318 0.70682L0.191963 11.8907C-0.0639878 12.3278 -0.0639878 12.8664 0.191963 13.3036L6.74318 24.4887C6.99914 24.9258 7.47277 25.1954 7.98467 25.1954H21.0877C21.5996 25.1954 22.0733 24.9258 22.3292 24.4887L28.8805 13.3036C29.1364 12.8664 29.1364 12.3278 28.8805 11.8907L26.2513 7.40156H26.2507Z"
            fill="#EDEEF0"
          />
        </svg>
      </div>

      <div className="flex gap-2 bg-black px-3 pb-3 lg:px-6 lg:pr-10 lg:pl-8">
        {ACTION_ITEMS.map((item) => {
          const isHighlighted = hoveredAction
            ? hoveredAction === item.label
            : item.highlighted
          return (
            <button
              key={item.label}
              className={`flex h-16 flex-1 flex-col items-center justify-center gap-2 text-[12px] leading-4 tracking-[0.04px] transition-colors duration-200 ${
                isHighlighted
                  ? "bg-[#0c2746] text-[#70b8ff]"
                  : "bg-[#111113] text-[#edeef0]"
              }`}
              onMouseEnter={() => setHoveredAction(item.label)}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={() => {
                if (item.label === "Request") setIsRequestModalOpen(true)
                if (item.label === "Sell") setIsSellModalOpen(true)
                if (item.label === "Contact")
                  window.open("https://wa.me/12633843821", "_blank")
              }}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </>
  )

  return (
    <>
      <RequestWatchModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
      <SellWatchModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
      />
      {/* Desktop sidebar */}
      <aside className="fixed top-0 right-0 z-30 hidden h-screen w-[320px] flex-col lg:flex">
        {filterContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onMobileClose}
          />
          <aside className="absolute top-0 right-0 flex h-full w-[320px] max-w-[85vw] flex-col bg-[#020208]">
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
              <span className="text-[18px] font-medium text-[#edeef0]">
                Filters
              </span>
              <button onClick={onMobileClose}>
                <RiCloseLine className="size-6 text-[#edeef0]" />
              </button>
            </div>
            {filterContent}
          </aside>
        </div>
      )}
    </>
  )
}

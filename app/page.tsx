import { HeroSection } from "@/components/sections/HeroSection"
import { InventorySection } from "@/components/sections/InventorySection"
import { BrandsSection } from "@/components/sections/BrandsSection"
import { SourceSection } from "@/components/sections/SourceSection"
import { SellSection } from "@/components/sections/SellSection"
import { InsuredSection } from "@/components/sections/InsuredSection"
import { CtaSection } from "@/components/sections/CtaSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { WatchGrid } from "@/components/watches/WatchGrid"
import { Sidebar } from "@/components/layout/Sidebar"
import { Footer } from "@/components/layout/Footer"

export default function Page() {
  return (
    <div className="dark min-h-screen bg-[#020208]">
      <Sidebar />
      <HeroSection />
      <div className="relative mx-auto max-w-[1440px] overflow-x-hidden">
        <main>
          <div className="pb-14 lg:pr-80 lg:pb-0">
            <InventorySection />
            <WatchGrid />
            <BrandsSection />
            <SourceSection />
            <SellSection />
            <InsuredSection />
            <ContactSection />
            <CtaSection />
            <Footer />
          </div>
        </main>
      </div>
    </div>
  )
}

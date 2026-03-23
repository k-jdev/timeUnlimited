import { HeroSection } from "@/components/home/HeroSection"
import { InventorySection } from "@/components/home/InventorySection"
import { BrandsSection } from "@/components/home/BrandsSection"
import { SourceSection } from "@/components/home/SourceSection"
import { SellSection } from "@/components/home/SellSection"
import { InsuredSection } from "@/components/home/InsuredSection"
import { CtaSection } from "@/components/home/CtaSection"
import { ContactSection } from "@/components/home/ContactSection"
import { WatchGrid } from "@/components/watches/WatchGrid"
import { Footer } from "@/components/layout/Footer"

export default function HomePage() {
  return (
    <>
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
    </>
  )
}

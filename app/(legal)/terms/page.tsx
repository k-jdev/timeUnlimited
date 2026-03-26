import Link from "next/link"
import { BrandLogo } from "@/components/layout/BrandLogo"
import { Footer } from "@/components/layout/Footer"

export const metadata = {
  title: "Terms & Conditions — Time Unlimited",
}

export default function TermsPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col overflow-x-hidden lg:pr-80">
      {/* Logo */}
      <div className="px-4 pt-8 pb-6 lg:px-10 lg:pt-10 lg:pb-8">
        <Link href="/" aria-label="Home">
          <BrandLogo />
        </Link>
      </div>

      <div className="px-4 pb-8 lg:px-10 lg:pb-10">
        <h1 className="font-serif text-[48px] leading-none text-[#edeef0] lg:text-[64px]">
          Terms &amp; Conditions
        </h1>
      </div>

      <div className="flex-1 px-4 pb-16 lg:px-10 lg:pb-20">
        <div className="flex flex-col text-base leading-6 font-light text-[#B0B4BA]">
          <p>Effective Date: March 26, 2026</p>
          <p>
            By accessing and using the Time Unlimited website, you agree to the
            following terms.
          </p>
          <p>
            All content on this website is provided for general information
            purposes only and may be updated or changed at any time without
            notice.
          </p>
          <p>
            We make reasonable efforts to ensure accuracy, but we do not
            guarantee that all information is complete or up to date.
          </p>
          <p>
            All purchases, sales, and consignment agreements are subject to
            individual terms agreed directly with our team.
          </p>
          <p>We reserve the right to refuse service at our discretion.</p>
          <p>
            Time Unlimited is not liable for any direct or indirect damages
            resulting from the use of this website.
          </p>
          <p>
            By continuing to use this site, you accept these Terms &amp;
            Conditions.
          </p>
          <p>
            For inquiries, please contact:{" "}
            <Link
              href="mailto:contact@timeunlimited.co"
              className="underline underline-offset-2 transition-colors hover:text-[#edeef0]"
            >
              contact@timeunlimited.co
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

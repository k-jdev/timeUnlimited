import Link from "next/link"
import { BrandLogo } from "@/components/layout/BrandLogo"
import { Footer } from "@/components/layout/Footer"

export const metadata = {
  title: "Privacy Notice — Time Unlimited",
}

export default function PrivacyNoticePage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col overflow-x-hidden lg:pr-80">
      <div className="px-4 pt-8 pb-6 lg:px-10 lg:pt-10 lg:pb-8">
        <Link href="/" aria-label="Home">
          <BrandLogo />
        </Link>
      </div>

      <div className="px-4 pb-8 lg:px-10 lg:pb-10">
        <h1 className="font-serif text-[48px] leading-none text-[#edeef0] lg:text-[64px]">
          Privacy Notice
        </h1>
      </div>

      <div className="flex-1 px-4 pb-16 lg:px-10 lg:pb-20">
        <div className="flex flex-col text-base leading-6 font-light text-[#B0B4BA]">
          <p>Effective Date: March 26, 2026</p>
          <p>
            At Time Unlimited, we respect your privacy and are committed to
            protecting your personal information.
          </p>
          <p>
            We collect only the information necessary to provide our services,
            including your name, contact details, and any information you choose
            to share when making an inquiry or transaction.
          </p>
          <div className="flex flex-col gap-1">
            <p>Your information is used solely to:</p>
            <ul className="flex list-disc flex-col gap-1 pl-6">
              <li>Process requests and transactions</li>
              <li>Communicate with you</li>
              <li>Improve our services</li>
            </ul>
          </div>
          <p>
            We do not sell or share your personal information with third
            parties, except where required by law or necessary to provide our
            services.
          </p>
          <p>
            We take reasonable measures to protect your information, however no
            system is completely secure.
          </p>
          <p>By using our website, you agree to this Privacy Notice.</p>
          <p>
            For any questions, please contact us at:{" "}
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

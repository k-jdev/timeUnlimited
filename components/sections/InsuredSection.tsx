"use client"

import {
  RiStoreLine,
  RiFlightTakeoffLine,
  RiShieldCheckLine,
} from "@remixicon/react"
import { motion } from "motion/react"

function WatchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={className}
    >
      <path
        d="M9.00003 7.40049V9.16054L10.2801 9.96057M12.3041 5.52843L11.6561 2.28833C11.583 1.92001 11.3826 1.58914 11.0901 1.35367C10.7975 1.11819 10.4315 0.993099 10.0561 1.00029H7.912C7.53654 0.993099 7.17052 1.11819 6.878 1.35367C6.58548 1.58914 6.3851 1.92001 6.31195 2.28833L5.68793 5.52843M5.70393 12.4886L6.34395 15.6887C6.41711 16.0571 6.61748 16.3879 6.91 16.6234C7.20252 16.8589 7.56854 16.984 7.944 16.9768H10.1201C10.4955 16.984 10.8615 16.8589 11.1541 16.6234C11.4466 16.3879 11.647 16.0571 11.7201 15.6887L12.3681 12.4486"
        stroke="currentColor"
        strokeWidth="1.28004"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.99998 13.801C11.651 13.801 13.8001 11.6519 13.8001 9.00083C13.8001 6.34978 11.651 4.20068 8.99998 4.20068C6.34893 4.20068 4.19983 6.34978 4.19983 9.00083C4.19983 11.6519 6.34893 13.801 8.99998 13.801Z"
        stroke="currentColor"
        strokeWidth="1.28004"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const FEATURES = [
  { icon: RiStoreLine, label: "Store", accent: false },
  { icon: RiFlightTakeoffLine, label: "Shipping", accent: false },
  { icon: WatchIcon, label: "Watch", accent: false },
  { icon: RiShieldCheckLine, label: "Insured", accent: true },
]

export function InsuredSection() {
  return (
    <section
      id="insurance"
      className="flex flex-col gap-10 px-4 pb-20 lg:flex-row lg:items-center lg:justify-end lg:gap-12 lg:px-0 lg:pb-48"
    >
      <motion.h2
        className="text-center font-serif text-[48px] leading-none text-[#edeef0] lg:hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      >
        Insured From
        <br />
        Our Hands
        <br />
        <span className="italic">
          <span className="mb-2 inline-block h-0.5 w-16 bg-[rgba(237,238,240,0.18)] align-middle not-italic" />
          <span className="text-[rgba(237,238,240,0.18)]"> </span>
          {" to Yours"}
        </span>
      </motion.h2>

      <motion.div
        className="relative aspect-square w-full overflow-hidden lg:h-140 lg:max-w-200 lg:flex-1 lg:pl-[clamp(0px,4vw,128px)]"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img
          src="/images/insured/watch-box.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      </motion.div>

      <div className="flex flex-col gap-4 lg:h-140 lg:w-95 lg:justify-between lg:gap-0 lg:self-stretch">
        {/* Desktop heading - hidden on mobile */}
        <motion.h2
          className="hidden font-serif text-[64px] leading-16.5 text-[#edeef0] lg:block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          Insured From
          <br />
          Our Hands
          <br />
          <span className="italic">
            <span className="mb-2 inline-block h-0.5 w-16 bg-[rgba(237,238,240,0.18)] align-middle not-italic" />
            <span className="text-[rgba(237,238,240,0.18)]"> </span>
            {" to Yours"}
          </span>
        </motion.h2>

        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <div className="group/row flex gap-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.label}
                className={`group/icon flex size-10 cursor-pointer items-center justify-center transition-all duration-200 ${
                  feature.accent
                    ? "bg-[#001a39] text-[#70B8FF] group-hover/row:bg-[#111213] group-hover/row:text-[#b0b4ba] hover:bg-[#001a39]! hover:text-[#70B8FF]!"
                    : "bg-[#111213] text-[#b0b4ba] hover:bg-[#001a39] hover:text-[#70B8FF]"
                }`}
              >
                <feature.icon className="size-4.5 transition-transform duration-200 group-hover/icon:scale-110" />
              </div>
            ))}
          </div>
          <p className="text-base leading-6 font-light text-[#60646c]">
            Every watch that moves through us is fully insured from the moment
            it enters our possession to the moment it reaches your wrist. No
            gaps, no grey areas, no risk on your end.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

// import { useState } from "react"
import { RiArrowRightLine } from "@remixicon/react"
import { motion, useAnimationControls } from "motion/react"
import { Button } from "@/components/ui/button"
import { SITE } from "@/constants/site"
// import { RequestWatchModal } from "./RequestWatchModal"

export function CtaSection() {
  const fillControls = useAnimationControls()
  const textControls = useAnimationControls()
  // const [isModalOpen, setIsModalOpen] = useState(false)

  const handleHoverStart = () => {
    fillControls.start({
      scaleX: 1,
      transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
    })
    textControls.start({ color: "#020208", transition: { duration: 0 } })
  }

  const handleHoverEnd = () => {
    fillControls.start({
      scaleX: 0,
      transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] },
    })
    textControls.start({ color: "#edeef0", transition: { duration: 0.25 } })
  }

  return (
    <>
      <section className="flex flex-col gap-10 px-4 py-10 lg:flex-row lg:items-end lg:justify-between lg:py-16 lg:pl-10">
        <motion.h2
          className="font-serif text-[48px] leading-none text-[#edeef0] lg:text-[64px] lg:leading-16.5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Anything Watches
          <br />
          <span className="mb-2 inline-block h-0.5 w-24 bg-[rgba(237,238,240,0.18)] align-middle not-italic" />
          <span className="text-[#edeef0]">&nbsp; We&apos;re Here.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <Button
            size="lg"
            className="group relative h-12 cursor-pointer overflow-hidden bg-[#111213] px-6 text-[18px] leading-6.5 font-medium tracking-[-0.04px]"
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            onClick={() => window.open(SITE.whatsappUrl, "_blank")}
          >
            <motion.span
              className="pointer-events-none absolute inset-0 origin-left bg-[#edeef0]"
              initial={{ scaleX: 0 }}
              animate={fillControls}
            />
            <motion.span
              className="relative z-10 flex items-center gap-3"
              initial={{ color: "#edeef0" }}
              animate={textControls}
            >
              <RiArrowRightLine className="size-5 shrink-0" />
              Contact Sales
            </motion.span>
          </Button>
        </motion.div>
      </section>

      {/* <RequestWatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
    </>
  )
}

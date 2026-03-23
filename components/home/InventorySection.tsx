"use client"

import { RiArrowRightLine } from "@remixicon/react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"

export function InventorySection() {
  return (
    <section
      id="inventory"
      className="bg-[#020208] px-4 py-8 lg:px-0 lg:py-16 lg:pl-16"
    >
      <div className="flex flex-col gap-4 lg:gap-6">
        <motion.h2
          className="font-serif text-[32px] leading-9 text-[#edeef0] lg:text-[64px] lg:leading-16.5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          What We&apos;re Holding
        </motion.h2>
        <motion.div
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <p className="max-w-126 text-sm leading-5 font-light text-[#60646c] lg:text-base lg:leading-6">
            Pieces come and go quickly. If something catches your eye, move on
            it — and if it&apos;s not here, we&apos;ll find it.
          </p>
          <Button
            size="lg"
            className="bg-[#edeef0] text-[#020208] hover:bg-[#edeef0]/90"
          >
            <RiArrowRightLine data-icon="inline-start" />
            Our Inventory
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

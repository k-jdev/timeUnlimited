"use client"

import { RiArrowRightUpLine } from "@remixicon/react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"

export function SellSection() {
  return (
    <section
      id="sell"
      className="mb-20 border-t border-b border-[#60646c]/25 lg:mb-48"
    >
      <div className="flex flex-col-reverse lg:min-h-0 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex shrink-0 flex-col gap-6 px-4 py-10 lg:w-110 lg:px-0 lg:py-0 lg:pl-16">
          <motion.h2
            className="font-serif text-[48px] leading-none text-[#edeef0] lg:text-[64px] lg:leading-16.5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Ready to Let One Go?
          </motion.h2>
          <motion.p
            className="max-w-110 text-base leading-6 font-light text-[#60646c]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            Two ways to sell. One prioritizes speed, the other maximizes return.
            You pick what works for you.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            <Button
              size="lg"
              className="w-full cursor-pointer bg-[#edeef0] text-[#020208] hover:bg-[#edeef0]/90 lg:w-auto"
            >
              <RiArrowRightUpLine data-icon="inline-start" />
              Sell Your Piece
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="relative aspect-square w-full overflow-hidden bg-[#111113] lg:aspect-auto lg:h-140 lg:max-w-140 lg:min-w-0 lg:flex-1"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src="/images/sell/rolex.png"
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  )
}

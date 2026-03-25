"use client"

import { RiSearchLine } from "@remixicon/react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"

export function SourceSection() {
  return (
    <section
      id="source"
      className="mb-20 border-t border-b border-[#60646c]/25 lg:mb-48"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
        <motion.div
          className="relative aspect-square w-full overflow-hidden lg:aspect-auto lg:h-140 lg:max-w-162 lg:min-w-0 lg:flex-1"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src="/images/source/watch.png"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        </motion.div>

        <div className="flex shrink-0 flex-col gap-6 px-4 py-10 lg:w-110 lg:px-12 lg:py-0">
          <motion.h2
            className="font-serif text-[48px] leading-none text-[#edeef0] lg:text-[64px] lg:leading-16.5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            Don&apos;t See
            <br />
            <span className="ml-10 italic lg:ml-16">Your</span> Watch?
          </motion.h2>
          <motion.p
            className="max-w-110 text-base leading-6 font-light text-[#60646c]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            We source pieces most buyers can&apos;t reach on their own. Drop us
            the ref, and we&apos;ll come back with options, pricing, and a
            timeline.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
          >
            <Button
              size="lg"
              className="w-full cursor-pointer bg-[#edeef0] text-[#020208] hover:bg-[#edeef0]/90 lg:w-auto"
            >
              <RiSearchLine data-icon="inline-start" />
              Source a Watch
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

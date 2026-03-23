"use client"

import { RiSearchLine } from "@remixicon/react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative mb-40 flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#020208] lg:block"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
        src="/video.webm"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-[#020208]" />

      <div className="relative z-10 px-4 pt-18 lg:absolute lg:top-16 lg:left-15 lg:w-165 lg:px-0 lg:pt-0">
        <motion.h1
          className="font-serif text-[64px] leading-[0.9] text-[#edeef0] lg:text-[clamp(56px,10vw,120px)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            className="block"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            {"\u00A0\u00A0\u00A0\u00A0\u00A0"}You want it.
          </motion.span>
          <motion.span
            className="block"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          >
            We find it.
          </motion.span>
          <motion.span
            className="block italic"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          >
            <span className="mb-2 inline-block h-0.5 w-28 bg-[rgba(214,235,253,0.19)] align-middle tracking-[-11.52px] not-italic lg:w-52 lg:bg-[rgba(237,238,240,0.18)] lg:tracking-normal" />{" "}
            You get it.
          </motion.span>
        </motion.h1>
      </div>

      {/* Mobile + Desktop bottom content */}
      <motion.div
        className="relative z-10 flex flex-col gap-6 px-4 pb-4 lg:absolute lg:bottom-16 lg:left-16 lg:px-0 lg:pb-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
      >
        <p className="text-sm leading-5 font-light text-[#60646c] lg:max-w-120 lg:text-base lg:leading-6">
          You know what you want. We know where to find it.{" "}
          <span className="lg:hidden">
            The pieces worth owning don&apos;t sit on shelves — they sit in
            networks inaccessible to most.
          </span>
          <span className="hidden lg:inline">
            <br />
            The pieces worth owning don&apos;t sit on shelves — they sit in
            networks inaccessible to most.
          </span>
        </p>

        <div className="flex w-full items-center gap-3 lg:w-auto">
          <Button
            size="lg"
            className="flex-1 cursor-pointer bg-[#edeef0] text-[#020208] hover:bg-[#edeef0]/90 lg:flex-none"
          >
            <RiSearchLine data-icon="inline-start" />
            Source a Watch
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 cursor-pointer border-[#edeef0]/20 text-[#edeef0] hover:bg-[#edeef0]/10 hover:text-[#edeef0] lg:flex-none"
          >
            Browse Inventory
          </Button>
        </div>
      </motion.div>
    </section>
  )
}

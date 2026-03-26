"use client"

import { motion } from "motion/react"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="flex flex-col-reverse gap-30 border-t border-[#2E3135] px-4 pt-10 pb-16 lg:flex-row lg:items-start lg:justify-between lg:gap-0 lg:px-10 lg:pb-16">
      <motion.div
        className="flex flex-col gap-6 lg:w-97 lg:justify-between lg:self-stretch"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="font-serif text-[36px] leading-10 tracking-[-1.5px] text-[#edeef0] lg:text-[42px] lg:leading-11 lg:tracking-[-1.7px]">
          Time Unlimited
          <span className="align-top font-sans text-[6px] leading-none font-light tracking-[-0.23px]">
            ©
          </span>
        </p>

        <div className="flex flex-col gap-2">
          <p className="text-base leading-6 font-light text-[#B0B4BA]">
            Buying, selling, sourcing, questions — whatever it is, don&apos;t
            hesitate. Reach out and let&apos;s talk watches.
          </p>
          <p className="text-sm leading-5 font-light text-[#696E77]">
            © COPYRIGHT 2026
          </p>
        </div>
      </motion.div>

      <div className="flex gap-3">
        <motion.div
          className="flex w-30 flex-col gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        >
          <p className="text-xs leading-4 font-light tracking-[0.04px] text-[#696E77]">
            SOCIALS
          </p>
          <div className="flex flex-col gap-3 text-base leading-6 font-light text-[#B0B4BA]">
            <Link
              href="https://wa.me/12633843821"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer transition-colors hover:text-[#edeef0]"
            >
              WhatsApp
            </Link>
            <p className="cursor-pointer transition-colors hover:text-[#edeef0]">
              Instagram
            </p>
            <Link
              href="https://x.com/timeunlimitedco"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer transition-colors hover:text-[#edeef0]"
            >
              X (Twitter)
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="flex w-30 flex-col gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        >
          <p className="text-xs leading-4 font-light tracking-[0.04px] text-[#696E77]">
            LEGAL
          </p>
          <div className="flex flex-col gap-3 text-base leading-6 font-light text-[#B0B4BA]">
            <Link
              href="/privacy-notice"
              className="cursor-pointer transition-colors hover:text-[#edeef0]"
            >
              Privacy Notice
            </Link>
            {/* <p className="cursor-pointer transition-colors hover:text-[#edeef0]">
              Cookie Policy
            </p> */}
            <Link
              href="/terms"
              className="cursor-pointer transition-colors hover:text-[#edeef0]"
            >
              Terms
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

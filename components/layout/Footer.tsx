"use client"

import { motion } from "motion/react"

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
          <p className="text-base leading-6 font-light text-[#60646c]">
            Buying, selling, sourcing, questions — whatever it is, don&apos;t
            hesitate. Reach out and let&apos;s talk watches.
          </p>
          <p className="text-sm leading-5 font-light text-[#8b8d98]">
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
          <p className="text-xs leading-4 font-light tracking-[0.04px] text-[#8b8d98]">
            SOCIALS
          </p>
          <div className="flex flex-col gap-3 text-base leading-6 font-light text-[#60646c]">
            <p className="cursor-pointer transition-colors hover:text-[#edeef0]">
              Linkedin
            </p>
            <p className="cursor-pointer transition-colors hover:text-[#edeef0]">
              Instagram
            </p>
            <p className="cursor-pointer transition-colors hover:text-[#edeef0]">
              Twitter
            </p>
            <p className="cursor-pointer transition-colors hover:text-[#edeef0]">
              Youtube
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex w-30 flex-col gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
        >
          <p className="text-xs leading-4 font-light tracking-[0.04px] text-[#8b8d98]">
            LEGAL
          </p>
          <div className="flex flex-col gap-3 text-base leading-6 font-light text-[#60646c]">
            <p className="cursor-pointer transition-colors hover:text-[#edeef0]">
              Privacy Notice
            </p>
            <p className="cursor-pointer transition-colors hover:text-[#edeef0]">
              Cookie Policy
            </p>
            <p className="cursor-pointer transition-colors hover:text-[#edeef0]">
              Terms
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

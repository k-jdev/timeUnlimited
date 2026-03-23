"use client"

import { motion } from "motion/react"

const CONTACTS = [
  {
    label: "Email Address",
    value: "contact@timeunlimited.co",
  },
  {
    label: (
      <span className="flex items-center gap-2">
        <span className="text-white">X</span>
        <span className="text-[#43484E]">Twitter</span>
      </span>
    ),
    value: "@timeunlimitedco",
  },
  {
    label: "WhatsApp",
    value: "+1 (263) 384-3821",
  },
  {
    label: "Office Location",
    value: "Miami, FL",
  },
]

export function ContactSection() {
  return (
    <section
      id="contact"
      className="flex flex-col gap-8 px-4 pt-12 pb-20 lg:items-center lg:gap-16 lg:px-16 lg:pt-28 lg:pb-40"
    >
      <motion.h2
        className="pl-5 font-serif text-[48px] leading-none text-[#edeef0] lg:pl-0 lg:text-[64px] lg:leading-16.5"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Contact
      </motion.h2>

      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4 md:gap-0">
        {CONTACTS.map((contact, i) => (
          <motion.div
            key={i}
            className="flex min-w-0 flex-col gap-2 border-l border-solid border-[#2E3135] px-5 lg:gap-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              delay: 0.15 + i * 0.1,
              ease: "easeOut",
            }}
          >
            <div className="text-lg leading-6.5 tracking-[-0.04px] text-white lg:text-xl lg:leading-7 lg:tracking-[-0.08px]">
              {contact.label}
            </div>
            <p className="truncate text-base leading-6 font-light text-[#80838d] lg:text-lg lg:leading-6.5 lg:tracking-[-0.04px]">
              {contact.value}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

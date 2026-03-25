"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"

const BRAND_ROWS = [
  [{ name: "Rolex" }, { name: "Audemars Piguet" }, { name: "Patek Philippe" }],
  [
    { name: "Richard Mille" },
    { name: "Omega" },
    { name: "Cartier" },
    { name: "F.P. Journe" },
  ],
  [{ name: "A. Lange & Söhne" }],
]

export function BrandsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="px-4 pt-12 pb-32 lg:px-10 lg:pt-28 lg:pb-72">
      <div
        ref={ref}
        className="flex origin-top-left scale-[0.75] flex-col gap-2 font-serif text-[32px] leading-none text-[#edeef0] sm:scale-[0.8] md:scale-100 lg:text-[clamp(32px,4.5vw,64px)] lg:leading-[1.15]"
      >
        {BRAND_ROWS.map((row, rowIndex) => (
          <motion.div
            key={rowIndex}
            className="flex flex-nowrap items-center gap-2 lg:gap-4"
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: rowIndex * 0.1,
              ease: "easeOut",
            }}
          >
            {row.map((brand, i) => (
              <span
                key={brand.name}
                className="flex items-center gap-2 whitespace-nowrap lg:gap-4"
              >
                {i > 0 && <span className="select-none">·</span>}
                <motion.span
                  className="relative cursor-pointer pb-1"
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  {brand.name}
                  <motion.span
                    className="absolute bottom-0 left-0 h-px w-full bg-[#edeef0]"
                    variants={{
                      rest: { scaleX: 0 },
                      hover: { scaleX: 1 },
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ transformOrigin: "left" }}
                  />
                </motion.span>
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

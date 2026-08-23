"use client"

import { useState, useEffect } from "react"
import { RequestWatchModal } from "@/components/home/RequestWatchModal"
import { SellWatchModal } from "@/components/home/SellWatchModal"
import {
  RiMailLine,
  RiMenuFill,
  RiCloseFill,
  RiTwitterXLine,
  RiWhatsappLine,
} from "@remixicon/react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/data/navigation"
import { BrandLogo } from "./BrandLogo"
import { ACTION_ITEMS } from "@/data/action-items"
import { SITE } from "@/constants/site"

const MOBILE_SOCIAL_ITEMS = [
  { label: "Twitter", icon: RiTwitterXLine },
  { label: "WhatsApp", icon: RiWhatsappLine },
  { label: "Copy Email", icon: RiMailLine },
]

export function Sidebar() {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.replace("#", ""))
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    const id = href.replace("#", "")
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
      setMenuOpen(false)
    }
  }

  const activeAction = hoveredAction ?? "Request"

  return (
    <>
      <aside
        className="fixed top-0 right-0 z-30 hidden h-screen w-[320px] flex-col lg:flex"
        style={{
          background:
            "linear-gradient(270deg, #020208 17.78%, rgba(2, 2, 8, 0.00) 100%)",
        }}
      >
        <div className="flex flex-1 flex-col justify-between px-16 pt-16 pb-8">
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace("#", "")
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={cn(
                    "group flex items-center text-base leading-6 transition-all duration-300",
                    isActive
                      ? "gap-2 font-normal text-[#edeef0]"
                      : "font-light text-[#80838d] hover:text-[#edeef0]"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-px bg-[#edeef0] transition-all duration-300",
                      isActive
                        ? "mr-0 w-8"
                        : "mr-0 w-0 group-hover:mr-2 group-hover:w-4"
                    )}
                  />
                  {item.label}
                </a>
              )
            })}
          </nav>
          <BrandLogo />
        </div>

        <div className="flex gap-2 px-3 pb-3 pl-14">
          {ACTION_ITEMS.map((item) => (
            <button
              key={item.label}
              onMouseEnter={() => setHoveredAction(item.label)}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={() => {
                if (item.label === "Request") setIsModalOpen(true)
                if (item.label === "Sell") setIsSellModalOpen(true)
                if (item.label === "Contact")
                  window.open(SITE.whatsappUrl, "_blank")
              }}
              className={cn(
                "flex flex-1 cursor-pointer flex-col items-center justify-center gap-2 py-3 text-xs transition-all duration-200",
                activeAction === item.label
                  ? "bg-[#001b3a] text-[#70B8FF]"
                  : "bg-[#1c2024] text-[#edeef0]"
              )}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed top-0 left-0 z-40 flex w-full items-center justify-between p-4 lg:hidden">
        <BrandLogo variant="icon" />
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex size-10 items-center justify-center text-[#edeef0]"
        >
          {menuOpen ? (
            <RiCloseFill className="size-4.5" />
          ) : (
            <RiMenuFill className="size-4.5" />
          )}
        </button>
      </header>

      {/* Mobile bottom action bar */}
      <div
        className={cn(
          "fixed right-0 bottom-0 left-0 z-40 flex flex-col transition-transform duration-500 ease-out lg:hidden",
          (menuOpen || activeSection === "home") && "translate-y-full"
        )}
      >
        <div className="flex">
          {ACTION_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "Request") setIsModalOpen(true)
                if (item.label === "Sell") setIsSellModalOpen(true)
                if (item.label === "Contact")
                  window.open(SITE.whatsappUrl, "_blank")
              }}
              className={cn(
                "flex h-13.5 flex-1 items-center justify-center gap-2 text-xs tracking-[0.04px]",
                item.highlighted
                  ? "bg-[#0c2748] text-[#70B8FF]"
                  : "bg-[#111113] text-[#edeef0]"
              )}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div
          className="bg-[#111113]"
          style={{ height: "env(safe-area-inset-bottom, 0px)" }}
        />
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-30 flex flex-col bg-black lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-1 flex-col pt-18 pl-4">
              <nav className="flex flex-col gap-2 font-serif text-[48px] leading-none text-[#edeef0]">
                {NAV_ITEMS.map((item, i) => {
                  const isActive = activeSection === item.href.replace("#", "")
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.1 + i * 0.05,
                      }}
                    >
                      {isActive && (
                        <span className="inline-block h-0.5 w-16 bg-[rgba(237,238,240,0.18)]" />
                      )}
                      {item.label}
                    </motion.a>
                  )
                })}
              </nav>
            </div>

            <motion.div
              className="flex flex-col gap-4 px-4 pb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex flex-col gap-1">
                <p className="font-serif text-[34px] leading-9 tracking-[-1.36px] text-[#edeef0]">
                  Time Unlimited
                  <span className="align-top font-sans text-[6px] leading-none font-light tracking-[-0.23px]">
                    ©
                  </span>
                </p>
                <p className="max-w-65.75 text-sm leading-5 font-light text-[#60646c]">
                  Buying, selling, sourcing, questions — whatever it is,
                  don&apos;t hesitate. Reach out and let&apos;s talk watches.
                </p>
              </div>

              <div className="flex gap-2">
                {MOBILE_SOCIAL_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    className="flex flex-1 flex-col items-center justify-center gap-2 bg-[#1c2024] py-4 text-xs text-[#edeef0]"
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <RequestWatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <SellWatchModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
      />
    </>
  )
}

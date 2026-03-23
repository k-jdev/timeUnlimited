import { Sidebar } from "@/components/layout/Sidebar"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dark min-h-screen bg-[#020208]">
      <Sidebar />
      {children}
    </div>
  )
}

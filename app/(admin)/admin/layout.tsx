import { AdminHeader } from "@/components/admin/AdminHeader"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dark min-h-screen bg-[#020208] text-[#edeef0]">
      <AdminHeader />
      <main>{children}</main>
    </div>
  )
}

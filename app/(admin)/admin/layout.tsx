import { AdminHeader } from "@/components/admin/AdminHeader"
import { AuthGuard } from "@/components/auth/AuthGuard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="dark min-h-screen bg-[#020208] text-[#edeef0]">
        <AdminHeader />
        <main>{children}</main>
      </div>
    </AuthGuard>
  )
}

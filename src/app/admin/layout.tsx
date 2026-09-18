import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  let pendingOrdersCount = 0;
  let unreadMessagesCount = 0;

  if (session) {
    try {
      const [pendingOrders, unreadMessages] = await Promise.all([
        prisma.subscriptionRequest.count({
          where: { status: "PENDING" },
        }),
        prisma.contactMessage.count({
          where: { isRead: false },
        }),
      ]);
      pendingOrdersCount = pendingOrders;
      unreadMessagesCount = unreadMessages;
    } catch (err) {
      console.error("Error fetching admin counts:", err);
    }
  }

  // If no session (e.g. on /admin/login), don't wrap with sidebar
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
        <Toaster position="top-right" richColors theme="dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col lg:flex-row">
      <AdminSidebar
        userEmail={session.email}
        pendingOrdersCount={pendingOrdersCount}
        unreadMessagesCount={unreadMessagesCount}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <Toaster position="top-right" richColors theme="dark" />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { ShoppingCart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.subscriptionRequest.findMany({
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <ShoppingCart className="w-7 h-7 text-indigo-400" />
          Commandes clients ({orders.length})
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Gérez l&apos;ensemble des demandes d&apos;abonnement, contactez vos clients sur WhatsApp et suivez l&apos;état des activations.
        </p>
      </div>

      <OrdersTable initialOrders={orders} />
    </div>
  );
}

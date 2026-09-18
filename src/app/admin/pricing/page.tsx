import { prisma } from "@/lib/prisma";
import { PricingManager } from "@/components/admin/PricingManager";
import { CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const plans = await prisma.pricingPlan.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <CreditCard className="w-7 h-7 text-indigo-400" />
          Tarifs & Abonnements ({plans.length})
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Gérez vos plans IPTV, leurs tarifs, devises, fonctionnalités incluses et mettez en avant les meilleures offres.
        </p>
      </div>

      <PricingManager initialPlans={plans} />
    </div>
  );
}

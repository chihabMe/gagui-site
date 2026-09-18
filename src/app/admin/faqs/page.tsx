import { prisma } from "@/lib/prisma";
import { FaqManager } from "@/components/admin/FaqManager";
import { HelpCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <HelpCircle className="w-7 h-7 text-indigo-400" />
          Foire aux Questions ({faqs.length})
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Ajoutez, modifiez ou réorganisez les questions fréquemment posées affichées sur la page d&apos;accueil.
        </p>
      </div>

      <FaqManager initialFaqs={faqs} />
    </div>
  );
}

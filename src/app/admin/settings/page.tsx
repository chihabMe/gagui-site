import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-indigo-400" />
          Configuration du site
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Mettez à jour le titre du site, la méta-description, ainsi que le numéro de téléphone et le lien WhatsApp pour les commandes.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}

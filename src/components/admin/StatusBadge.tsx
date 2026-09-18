import { SubscriptionStatus } from "@prisma/client";

export function StatusBadge({ status }: { status: SubscriptionStatus | string }) {
  switch (status) {
    case "PENDING":
    case "pending":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          En attente
        </span>
      );
    case "CONTACTED":
    case "contacted":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Contacté
        </span>
      );
    case "ACTIVE":
    case "active":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Actif
        </span>
      );
    case "EXPIRED":
    case "expired":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
          Expiré
        </span>
      );
    case "CANCELLED":
    case "cancelled":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Annulé
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
          {status}
        </span>
      );
  }
}

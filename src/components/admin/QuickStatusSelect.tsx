"use client";

import { useState } from "react";
import { SubscriptionStatus } from "@prisma/client";
import { updateOrderStatus } from "@/actions/admin";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface QuickStatusSelectProps {
  orderId: string;
  initialStatus: SubscriptionStatus;
}

export function QuickStatusSelect({
  orderId,
  initialStatus,
}: QuickStatusSelectProps) {
  const [status, setStatus] = useState<SubscriptionStatus>(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: SubscriptionStatus) => {
    if (newStatus === status) return;
    setLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setStatus(newStatus);
      toast.success("Statut de la commande mis à jour");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la mise à jour";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={status}
        disabled={loading}
        onChange={(e) => handleChange(e.target.value as SubscriptionStatus)}
        className={`text-xs rounded-lg px-2.5 py-1.5 font-medium border appearance-none pr-7 cursor-pointer focus:outline-none transition-colors ${
          status === "PENDING"
            ? "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
            : status === "CONTACTED"
            ? "bg-blue-500/10 text-blue-300 border-blue-500/30 hover:bg-blue-500/20"
            : status === "ACTIVE"
            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
            : status === "EXPIRED"
            ? "bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20"
            : "bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20"
        }`}
      >
        <option value="PENDING" className="bg-slate-900 text-amber-300">
          En attente
        </option>
        <option value="CONTACTED" className="bg-slate-900 text-blue-300">
          Contacté
        </option>
        <option value="ACTIVE" className="bg-slate-900 text-emerald-300">
          Actif
        </option>
        <option value="EXPIRED" className="bg-slate-900 text-purple-300">
          Expiré
        </option>
        <option value="CANCELLED" className="bg-slate-900 text-rose-300">
          Annulé
        </option>
      </select>

      <div className="pointer-events-none absolute right-2 text-slate-400">
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin text-slate-300" />
        ) : (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { SubscriptionStatus } from "@prisma/client";
import {
  Search,
  Download,
  Trash2,
  FileText,
  Clock,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuickStatusSelect } from "./QuickStatusSelect";
import { WhatsAppButton } from "./WhatsAppButton";
import { deleteOrder, updateOrderStatus } from "@/actions/admin";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PlanPriceData {
  amount?: number;
  currency?: string;
  period?: string;
}

interface OrderItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  planName: string;
  planPrice: PlanPriceData | unknown;
  status: SubscriptionStatus;
  notes: string | null;
  submittedAt: Date | string;
}

interface OrdersTableProps {
  initialOrders: OrderItem[];
}

export function OrdersTable({ initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [activeNotesOrder, setActiveNotesOrder] = useState<OrderItem | null>(null);
  const [notesText, setNotesText] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter !== "ALL" && order.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        order.name.toLowerCase().includes(q) ||
        order.email.toLowerCase().includes(q) ||
        order.phone.toLowerCase().includes(q) ||
        order.planName.toLowerCase().includes(q)
      );
    });
  }, [orders, search, statusFilter]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      ALL: orders.length,
      PENDING: orders.filter((o) => o.status === "PENDING").length,
      CONTACTED: orders.filter((o) => o.status === "CONTACTED").length,
      ACTIVE: orders.filter((o) => o.status === "ACTIVE").length,
      CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
    };
  }, [orders]);

  const handleDelete = async (orderId: string, clientName: string) => {
    if (!window.confirm(`Supprimer la commande de "${clientName}" ?`)) return;

    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success("Commande supprimée avec succès");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la suppression";
      toast.error(msg);
    }
  };

  const handleOpenNotes = (order: OrderItem) => {
    setActiveNotesOrder(order);
    setNotesText(order.notes || "");
  };

  const handleSaveNotes = async () => {
    if (!activeNotesOrder) return;
    setSavingNotes(true);
    try {
      await updateOrderStatus(
        activeNotesOrder.id,
        activeNotesOrder.status,
        notesText
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === activeNotesOrder.id ? { ...o, notes: notesText } : o
        )
      );
      toast.success("Note enregistrée avec succès");
      setActiveNotesOrder(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la sauvegarde";
      toast.error(msg);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Date",
      "Nom",
      "Email",
      "Téléphone",
      "Plan",
      "Prix",
      "Statut",
      "Notes",
    ];

    const rows = filteredOrders.map((o) => {
      const p = o.planPrice as PlanPriceData | null;
      const priceStr = p?.amount !== undefined ? `${p.amount} ${p.currency || "EUR"}` : "";
      const dateStr = format(new Date(o.submittedAt), "yyyy-MM-dd HH:mm");
      return [
        `"${o.id}"`,
        `"${dateStr}"`,
        `"${o.name.replace(/"/g, '""')}"`,
        `"${o.email.replace(/"/g, '""')}"`,
        `"${o.phone.replace(/"/g, '""')}"`,
        `"${o.planName.replace(/"/g, '""')}"`,
        `"${priceStr}"`,
        `"${o.status}"`,
        `"${(o.notes || "").replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `commandes-mondeiptv-${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Fichier CSV téléchargé avec succès");
  };

  return (
    <div className="space-y-5">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Rechercher par nom, email, tél, plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 rounded-xl h-10"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs gap-2 h-10 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Exporter CSV ({filteredOrders.length})
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { label: "Tout", value: "ALL", count: counts.ALL },
          { label: "En attente", value: "PENDING", count: counts.PENDING, color: "text-amber-400" },
          { label: "Contacté", value: "CONTACTED", count: counts.CONTACTED, color: "text-blue-400" },
          { label: "Actif", value: "ACTIVE", count: counts.ACTIVE, color: "text-emerald-400" },
          { label: "Annulé", value: "CANCELLED", count: counts.CANCELLED, color: "text-rose-400" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              statusFilter === tab.value
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono ${
                statusFilter === tab.value
                  ? "bg-white/20 text-white"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List / Table */}
      <Card className="bg-slate-900/80 border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-medium text-slate-400">
              Aucune commande trouvée
            </p>
            <p className="text-xs text-slate-500">
              Essayez de modifier votre recherche ou filtre.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const priceObj = order.planPrice as PlanPriceData | null;
            const priceDisplay = priceObj?.amount !== undefined
              ? `${priceObj.amount} ${priceObj.currency || "€"}`
              : "N/A";

            return (
              <div
                key={order.id}
                className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-850/40 transition"
              >
                {/* Customer & Order info */}
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-semibold text-white text-base">
                      {order.name}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                      {order.planName}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {priceDisplay}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 text-slate-300 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {order.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {order.email}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {format(new Date(order.submittedAt), "dd MMMM yyyy HH:mm", {
                        locale: fr,
                      })}
                    </span>
                  </div>

                  {order.notes && (
                    <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 mt-1 max-w-xl">
                      <span className="text-indigo-400 font-medium mr-1.5">Note:</span>
                      {order.notes}
                    </div>
                  )}
                </div>

                {/* Status & Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <WhatsAppButton
                    phone={order.phone}
                    name={order.name}
                    planName={order.planName}
                  />

                  <QuickStatusSelect
                    orderId={order.id}
                    initialStatus={order.status}
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenNotes(order)}
                    className="h-8 px-2.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 gap-1 cursor-pointer"
                    title="Ajouter ou modifier une note"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Note</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(order.id, order.name)}
                    className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    title="Supprimer la commande"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </Card>

      {/* Notes Modal */}
      {activeNotesOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 p-6 rounded-2xl space-y-4 shadow-2xl">
            <div>
              <h3 className="text-base font-bold text-white">
                Note interne pour {activeNotesOrder.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ces notes sont uniquement visibles dans votre espace admin.
              </p>
            </div>

            <textarea
              rows={4}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Ex: Identifiants envoyés sur WhatsApp, paiement reçu par PayPal..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setActiveNotesOrder(null)}
                className="text-xs text-slate-400 hover:text-white rounded-xl"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl"
              >
                {savingNotes ? "Enregistrement..." : "Enregistrer la note"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

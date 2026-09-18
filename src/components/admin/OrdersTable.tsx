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
  Copy,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  CheckSquare,
  Square,
  Eye,
  ArrowUpDown,
  Calendar,
  CheckCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuickStatusSelect } from "./QuickStatusSelect";
import { WhatsAppButton } from "./WhatsAppButton";
import { deleteOrder, updateOrderStatus } from "@/actions/admin";
import { toast } from "sonner";
import { format, isToday, subDays } from "date-fns";
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
  const [planFilter, setPlanFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Selected for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  // Modals
  const [detailOrder, setDetailOrder] = useState<OrderItem | null>(null);
  const [activeNotesOrder, setActiveNotesOrder] = useState<OrderItem | null>(null);
  const [notesText, setNotesText] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Unique plan names for filter dropdown
  const uniquePlans = useMemo(() => {
    const plans = new Set<string>();
    orders.forEach((o) => {
      if (o.planName) plans.add(o.planName);
    });
    return Array.from(plans);
  }, [orders]);

  // Filtered & Sorted orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Status filter
        if (statusFilter !== "ALL" && order.status !== statusFilter) {
          return false;
        }

        // Plan filter
        if (planFilter !== "ALL" && order.planName !== planFilter) {
          return false;
        }

        // Date filter
        if (dateFilter !== "ALL") {
          const orderDate = new Date(order.submittedAt);
          if (dateFilter === "today" && !isToday(orderDate)) {
            return false;
          }
          if (dateFilter === "week" && orderDate < subDays(new Date(), 7)) {
            return false;
          }
          if (dateFilter === "month" && orderDate < subDays(new Date(), 30)) {
            return false;
          }
        }

        // Search query
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          order.name.toLowerCase().includes(q) ||
          order.email.toLowerCase().includes(q) ||
          order.phone.toLowerCase().includes(q) ||
          order.planName.toLowerCase().includes(q) ||
          (order.notes && order.notes.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        }
        if (sortBy === "name-asc") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "price-desc") {
          const pa = (a.planPrice as PlanPriceData)?.amount || 0;
          const pb = (b.planPrice as PlanPriceData)?.amount || 0;
          return pb - pa;
        }
        return 0;
      });
  }, [orders, search, statusFilter, planFilter, dateFilter, sortBy]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Status counts
  const counts = useMemo(() => {
    return {
      ALL: orders.length,
      PENDING: orders.filter((o) => o.status === "PENDING").length,
      CONTACTED: orders.filter((o) => o.status === "CONTACTED").length,
      ACTIVE: orders.filter((o) => o.status === "ACTIVE").length,
      EXPIRED: orders.filter((o) => o.status === "EXPIRED").length,
      CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
    };
  }, [orders]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papier !`);
  };

  const handleSelectAllOnPage = () => {
    const pageIds = paginatedOrders.map((o) => o.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusUpdate = async (status: SubscriptionStatus) => {
    if (selectedIds.length === 0) return;
    setBulkUpdating(true);
    try {
      await Promise.all(selectedIds.map((id) => updateOrderStatus(id, status)));
      setOrders((prev) =>
        prev.map((o) =>
          selectedIds.includes(o.id) ? { ...o, status } : o
        )
      );
      toast.success(`${selectedIds.length} commandes passées en "${status}"`);
      setSelectedIds([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la mise à jour";
      toast.error(msg);
    } finally {
      setBulkUpdating(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Supprimer définitivement ${selectedIds.length} commandes sélectionnées ?`)) {
      return;
    }
    setBulkUpdating(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteOrder(id)));
      setOrders((prev) => prev.filter((o) => !selectedIds.includes(o.id)));
      toast.success(`${selectedIds.length} commandes supprimées`);
      setSelectedIds([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la suppression";
      toast.error(msg);
    } finally {
      setBulkUpdating(false);
    }
  };

  const handleDelete = async (orderId: string, clientName: string) => {
    if (!window.confirm(`Supprimer la commande de "${clientName}" ?`)) return;

    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (detailOrder?.id === orderId) setDetailOrder(null);
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
      if (detailOrder?.id === activeNotesOrder.id) {
        setDetailOrder({ ...detailOrder, notes: notesText });
      }
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
    const listToExport =
      selectedIds.length > 0
        ? orders.filter((o) => selectedIds.includes(o.id))
        : filteredOrders;

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

    const rows = listToExport.map((o) => {
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
    link.setAttribute("download", `commandes-mondeiptv-${format(new Date(), "yyyyMMdd-HHmm")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${listToExport.length} commandes exportées avec succès`);
  };

  const hasActiveFilters =
    planFilter !== "ALL" || dateFilter !== "ALL" || search.trim() !== "";

  return (
    <div className="space-y-5">
      {/* Top Search & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Rechercher par nom, email, tél, plan, note..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 pr-9 bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500 rounded-xl h-11 focus:border-indigo-500"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-xl text-xs gap-1.5 h-11 px-3.5 border transition cursor-pointer ${
              showFilters || hasActiveFilters
                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtres avancés</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs gap-1.5 h-11 px-3.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Exporter ({selectedIds.length > 0 ? selectedIds.length : filteredOrders.length})
            </span>
          </Button>
        </div>
      </div>

      {/* Advanced Filter drawer/bar */}
      {showFilters && (
        <Card className="p-4 bg-slate-900/95 border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Plan Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Offre / Plan
            </label>
            <select
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-3 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Toutes les offres ({orders.length})</option>
              {uniquePlans.map((p) => {
                const count = orders.filter((o) => o.planName === p).length;
                return (
                  <option key={p} value={p}>
                    {p} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Date Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Période
            </label>
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-3 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Toutes les dates</option>
              <option value="today">Aujourd&apos;hui</option>
              <option value="week">7 derniers jours</option>
              <option value="month">30 derniers jours</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Trier par
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-3 focus:outline-none focus:border-indigo-500"
            >
              <option value="newest">Date: Plus récentes d&apos;abord</option>
              <option value="oldest">Date: Plus anciennes d&apos;abord</option>
              <option value="name-asc">Nom client (A à Z)</option>
              <option value="price-desc">Prix: Plus élevé d&apos;abord</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <div className="sm:col-span-3 flex justify-end pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setPlanFilter("ALL");
                  setDateFilter("ALL");
                  setSortBy("newest");
                  setPage(1);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-8 rounded-lg cursor-pointer"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { label: "Tout", value: "ALL", count: counts.ALL },
          { label: "En attente", value: "PENDING", count: counts.PENDING, dot: "bg-amber-400" },
          { label: "Contacté", value: "CONTACTED", count: counts.CONTACTED, dot: "bg-blue-400" },
          { label: "Actif", value: "ACTIVE", count: counts.ACTIVE, dot: "bg-emerald-400" },
          { label: "Expiré", value: "EXPIRED", count: counts.EXPIRED, dot: "bg-purple-400" },
          { label: "Annulé", value: "CANCELLED", count: counts.CANCELLED, dot: "bg-rose-400" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              statusFilter === tab.value
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-semibold"
                : "bg-slate-900/80 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800"
            }`}
          >
            {tab.dot && (
              <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />
            )}
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
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

      {/* Bulk Action Bar when items selected */}
      {selectedIds.length > 0 && (
        <div className="p-3 px-4 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-indigo-200 font-medium">
            <CheckCheck className="w-4 h-4 text-indigo-400" />
            <span>{selectedIds.length} commande(s) sélectionnée(s)</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 text-[11px] hidden sm:inline">Passer en :</span>
            <Button
              size="sm"
              variant="outline"
              disabled={bulkUpdating}
              onClick={() => handleBulkStatusUpdate("CONTACTED")}
              className="bg-blue-500/10 text-blue-300 border-blue-500/30 hover:bg-blue-500/20 text-xs h-7 px-2 rounded-lg cursor-pointer"
            >
              Contacté
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={bulkUpdating}
              onClick={() => handleBulkStatusUpdate("ACTIVE")}
              className="bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20 text-xs h-7 px-2 rounded-lg cursor-pointer"
            >
              Actif
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={bulkUpdating}
              onClick={() => handleBulkStatusUpdate("CANCELLED")}
              className="bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20 text-xs h-7 px-2 rounded-lg cursor-pointer"
            >
              Annulé
            </Button>

            <Button
              size="sm"
              variant="ghost"
              disabled={bulkUpdating}
              onClick={handleBulkDelete}
              className="text-rose-400 hover:bg-rose-500/10 text-xs h-7 px-2 rounded-lg cursor-pointer ml-1"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Supprimer
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}
              className="text-slate-400 hover:text-white text-xs h-7 px-2 rounded-lg cursor-pointer"
            >
              Désélectionner
            </Button>
          </div>
        </div>
      )}

      {/* Select All on Page Header row */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-400">
        <button
          onClick={handleSelectAllOnPage}
          className="flex items-center gap-2 hover:text-white transition cursor-pointer"
        >
          {paginatedOrders.length > 0 &&
          paginatedOrders.every((o) => selectedIds.includes(o.id)) ? (
            <CheckSquare className="w-4 h-4 text-indigo-400" />
          ) : (
            <Square className="w-4 h-4 text-slate-500" />
          )}
          <span>Sélectionner la page ({paginatedOrders.length})</span>
        </button>

        <span>
          Affichage de{" "}
          <span className="font-semibold text-white">
            {filteredOrders.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}
            -
            {Math.min(currentPage * pageSize, filteredOrders.length)}
          </span>{" "}
          sur <span className="font-semibold text-white">{filteredOrders.length}</span>
        </span>
      </div>

      {/* Orders List */}
      <Card className="bg-slate-900/80 border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60 shadow-xl">
        {paginatedOrders.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-medium text-slate-300">
              Aucune commande trouvée
            </p>
            <p className="text-xs text-slate-500">
              Essayez de modifier votre recherche ou vos critères de filtre.
            </p>
          </div>
        ) : (
          paginatedOrders.map((order) => {
            const priceObj = order.planPrice as PlanPriceData | null;
            const priceDisplay =
              priceObj?.amount !== undefined
                ? `${priceObj.amount} ${priceObj.currency || "€"}`
                : "N/A";

            const isSelected = selectedIds.includes(order.id);

            return (
              <div
                key={order.id}
                className={`p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition ${
                  isSelected
                    ? "bg-indigo-950/20"
                    : "hover:bg-slate-850/50"
                }`}
              >
                {/* Checkbox + Info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleSelect(order.id)}
                    className="mt-1 text-slate-500 hover:text-white transition cursor-pointer shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-white text-base tracking-tight">
                        {order.name}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                        {order.planName}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800/90 text-slate-200 font-mono font-medium">
                        {priceDisplay}
                      </span>
                    </div>

                    <div className="flex items-center gap-x-4 gap-y-1 text-xs text-slate-400 flex-wrap">
                      <button
                        onClick={() => copyToClipboard(order.phone, "Téléphone")}
                        className="flex items-center gap-1 text-slate-300 hover:text-white font-mono transition cursor-pointer"
                        title="Cliquer pour copier le numéro"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{order.phone}</span>
                        <Copy className="w-3 h-3 text-slate-600 hover:text-slate-400 ml-0.5" />
                      </button>

                      <button
                        onClick={() => copyToClipboard(order.email, "Email")}
                        className="flex items-center gap-1 hover:text-white transition cursor-pointer truncate max-w-xs"
                        title="Cliquer pour copier l'email"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate">{order.email}</span>
                      </button>

                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {format(new Date(order.submittedAt), "dd MMM yyyy HH:mm", {
                          locale: fr,
                        })}
                      </span>
                    </div>

                    {order.notes && (
                      <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 mt-1 max-w-xl">
                        <span className="text-indigo-400 font-medium mr-1.5">Note:</span>
                        {order.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-2 flex-wrap self-start lg:self-center pl-7 lg:pl-0 shrink-0">
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
                    onClick={() => setDetailOrder(order)}
                    className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                    title="Voir les détails complets"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenNotes(order)}
                    className="h-8 px-2.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 gap-1 cursor-pointer"
                    title="Ajouter ou modifier une note interne"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Note</span>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Afficher :</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-800 text-white rounded-lg text-xs px-2 py-1"
            >
              <option value="10">10 / page</option>
              <option value="15">15 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
              <option value="100">100 / page</option>
            </select>
          </div>

          <div className="flex items-center gap-2 self-center">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5 bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs gap-1 cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Précédent</span>
            </Button>

            <span className="text-xs text-slate-400 font-mono px-2">
              Page <span className="text-white font-bold">{currentPage}</span> sur{" "}
              <span className="text-white font-bold">{totalPages}</span>
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2.5 bg-slate-900 border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs gap-1 cursor-pointer disabled:opacity-40"
            >
              <span>Suivant</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Full Order Details Modal */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-lg bg-slate-900 border-slate-800 p-6 rounded-2xl space-y-5 shadow-2xl my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                    {detailOrder.planName}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    ID: {detailOrder.id.slice(0, 10)}...
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {detailOrder.name}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDetailOrder(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block mb-0.5">Téléphone :</span>
                  <span className="text-white font-mono font-medium flex items-center gap-1.5">
                    {detailOrder.phone}
                    <button
                      onClick={() => copyToClipboard(detailOrder.phone, "Téléphone")}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Email :</span>
                  <span className="text-white font-medium truncate block">
                    {detailOrder.email}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Date de demande :</span>
                  <span className="text-white">
                    {format(new Date(detailOrder.submittedAt), "dd MMMM yyyy à HH:mm", {
                      locale: fr,
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Statut actuel :</span>
                  <QuickStatusSelect
                    orderId={detailOrder.id}
                    initialStatus={detailOrder.status}
                  />
                </div>
              </div>

              {/* WhatsApp Action directly from modal */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-emerald-300 text-xs">Contacter le client</p>
                  <p className="text-[11px] text-slate-400">Ouvre WhatsApp avec message de bienvenue pré-rempli.</p>
                </div>
                <WhatsAppButton
                  phone={detailOrder.phone}
                  name={detailOrder.name}
                  planName={detailOrder.planName}
                />
              </div>

              {/* Internal Notes */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400 font-medium">Note interne :</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenNotes(detailOrder)}
                    className="h-6 text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    Modifier la note
                  </Button>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 min-h-[48px] whitespace-pre-wrap">
                  {detailOrder.notes || "Aucune note interne pour cette commande."}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(detailOrder.id, detailOrder.name)}
                className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Supprimer
              </Button>
              <Button
                size="sm"
                onClick={() => setDetailOrder(null)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl px-4"
              >
                Fermer
              </Button>
            </div>
          </Card>
        </div>
      )}

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
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl cursor-pointer"
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

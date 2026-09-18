import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ShoppingCart,
  Clock,
  MessageSquare,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuickStatusSelect } from "@/components/admin/QuickStatusSelect";
import { WhatsAppButton } from "@/components/admin/WhatsAppButton";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export const dynamic = "force-dynamic";

interface PlanPriceData {
  amount?: number;
  currency?: string;
  period?: string;
}

export default async function AdminDashboardPage() {
  const [
    totalOrders,
    pendingOrders,
    contactedOrders,
    activeOrders,
    cancelledOrders,
    totalMessages,
    unreadMessages,
    plansCount,
    recentOrders,
    recentMessages,
    allOrdersForStats,
  ] = await Promise.all([
    prisma.subscriptionRequest.count(),
    prisma.subscriptionRequest.count({ where: { status: "PENDING" } }),
    prisma.subscriptionRequest.count({ where: { status: "CONTACTED" } }),
    prisma.subscriptionRequest.count({ where: { status: "ACTIVE" } }),
    prisma.subscriptionRequest.count({ where: { status: "CANCELLED" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.pricingPlan.count({ where: { isActive: true } }),
    prisma.subscriptionRequest.findMany({
      orderBy: { submittedAt: "desc" },
      take: 8,
    }),
    prisma.contactMessage.findMany({
      orderBy: { submittedAt: "desc" },
      take: 5,
    }),
    prisma.subscriptionRequest.findMany({
      select: { planName: true },
    }),
  ]);

  // Calculate plan distribution
  const planCounts: Record<string, number> = {};
  allOrdersForStats.forEach((o) => {
    planCounts[o.planName] = (planCounts[o.planName] || 0) + 1;
  });
  const topPlans = Object.entries(planCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Status percentages
  const pendingPct = totalOrders > 0 ? Math.round((pendingOrders / totalOrders) * 100) : 0;
  const contactedPct = totalOrders > 0 ? Math.round((contactedOrders / totalOrders) * 100) : 0;
  const activePct = totalOrders > 0 ? Math.round((activeOrders / totalOrders) * 100) : 0;
  const otherPct = Math.max(0, 100 - pendingPct - contactedPct - activePct);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Tableau de bord
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Neon Live
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Vue d&apos;ensemble et gestion de votre plateforme Monde IPTV.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            variant="outline"
            className="bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs h-10 cursor-pointer"
          >
            <Link href="/admin/messages">
              <MessageSquare className="w-4 h-4 mr-1.5 text-indigo-400" />
              Messages ({unreadMessages})
            </Link>
          </Button>

          <Button
            asChild
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 rounded-xl text-xs h-10 cursor-pointer font-medium"
          >
            <Link href="/admin/orders">
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              Commandes ({totalOrders})
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Orders */}
        <Card className="p-5 bg-slate-900/90 border-slate-800 rounded-2xl relative overflow-hidden shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Commandes
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {totalOrders}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              <strong className="text-emerald-400">{contactedOrders + activeOrders}</strong> traitées
            </span>
          </div>
        </Card>

        {/* Pending Orders */}
        <Card className="p-5 bg-slate-900/90 border-slate-800 rounded-2xl relative overflow-hidden shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              En attente
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {pendingOrders}
            </span>
            {pendingOrders > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                Action requise
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {pendingPct}% des demandes à contacter
          </p>
        </Card>

        {/* Contact Messages */}
        <Card className="p-5 bg-slate-900/90 border-slate-800 rounded-2xl relative overflow-hidden shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Messages Reçus
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {totalMessages}
            </span>
            {unreadMessages > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {unreadMessages} non lus
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Formulaire de support contact
          </p>
        </Card>

        {/* Active Plans */}
        <Card className="p-5 bg-slate-900/90 border-slate-800 rounded-2xl relative overflow-hidden shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Offres Actives
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {plansCount}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Plans en ligne sur le site public
          </p>
        </Card>
      </div>

      {/* Status Progress & Popular Plans row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Distribution */}
        <Card className="p-5 sm:p-6 bg-slate-900/90 border-slate-800 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Répartition des commandes ({totalOrders})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Statut global des souscriptions clients
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Voir détails &rarr;
            </Link>
          </div>

          {/* Multi-segment progress bar */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${pendingPct}%` }}
                className="bg-amber-400 transition-all duration-500"
                title={`En attente: ${pendingOrders} (${pendingPct}%)`}
              />
              <div
                style={{ width: `${contactedPct}%` }}
                className="bg-blue-400 transition-all duration-500"
                title={`Contacté: ${contactedOrders} (${contactedPct}%)`}
              />
              <div
                style={{ width: `${activePct}%` }}
                className="bg-emerald-400 transition-all duration-500"
                title={`Actif: ${activeOrders} (${activePct}%)`}
              />
              <div
                style={{ width: `${otherPct}%` }}
                className="bg-slate-700 transition-all duration-500"
                title={`Autre / Annulé: ${cancelledOrders}`}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>En attente ({pendingOrders})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Contacté ({contactedOrders})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Actif ({activeOrders})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-700" />
                <span>Annulé ({cancelledOrders})</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Plans Breakdown */}
        <Card className="p-5 sm:p-6 bg-slate-900/90 border-slate-800 rounded-2xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Offres les plus demandées
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Classement par nombre de commandes
            </p>
          </div>

          <div className="space-y-2.5">
            {topPlans.map(([name, count], idx) => (
              <div
                key={name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-600/20 text-indigo-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-white truncate">{name}</span>
                </div>
                <span className="font-mono text-indigo-300 font-bold shrink-0">
                  {count} <span className="text-slate-500 font-normal text-[11px]">cdes</span>
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Content Grid: Recent Orders & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-indigo-400" />
              Dernières commandes reçues
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition font-medium"
            >
              Gérer toutes les commandes ({totalOrders})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="bg-slate-900/80 border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60 shadow-xl">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Aucune commande pour le moment.
              </div>
            ) : (
              recentOrders.map((order) => {
                const priceObj = order.planPrice as PlanPriceData | null;
                const priceDisplay = priceObj?.amount !== undefined
                  ? `${priceObj.amount} €`
                  : "Gratuit";

                return (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-850/50 transition"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">
                          {order.name}
                        </span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs text-indigo-300 font-medium px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                          {order.planName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {priceDisplay}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                        <span>{order.email}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-300">{order.phone}</span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(order.submittedAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      <WhatsAppButton
                        phone={order.phone}
                        name={order.name}
                        planName={order.planName}
                      />
                      <QuickStatusSelect
                        orderId={order.id}
                        initialStatus={order.status}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </Card>
        </div>

        {/* Recent Messages (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              Messages récents
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition font-medium"
            >
              Voir tout ({totalMessages})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="bg-slate-900/80 border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60 shadow-xl">
            {recentMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Aucun message reçu.
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 space-y-1.5 hover:bg-slate-850/50 transition ${
                    !msg.isRead ? "bg-indigo-950/25" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-white truncate">
                      {msg.name}
                    </span>
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-300 truncate">
                    {msg.subject}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {msg.message}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{msg.email}</span>
                    <span>
                      {formatDistanceToNow(new Date(msg.submittedAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </Card>

          {/* Quick Actions Shortcuts */}
          <Card className="p-5 bg-gradient-to-br from-indigo-950/30 to-slate-900 border-indigo-900/30 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Raccourcis rapides
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/admin/pricing"
                className="p-3 rounded-xl bg-slate-900/90 hover:bg-indigo-950/70 border border-slate-800 hover:border-indigo-700/50 text-slate-300 hover:text-white transition text-center font-medium"
              >
                Gérer les tarifs
              </Link>
              <Link
                href="/admin/settings"
                className="p-3 rounded-xl bg-slate-900/90 hover:bg-indigo-950/70 border border-slate-800 hover:border-indigo-700/50 text-slate-300 hover:text-white transition text-center font-medium"
              >
                Infos du site
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuickStatusSelect } from "@/components/admin/QuickStatusSelect";
import { WhatsAppButton } from "@/components/admin/WhatsAppButton";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalOrders,
    pendingOrders,
    activeOrders,
    totalMessages,
    unreadMessages,
    plansCount,
    recentOrders,
    recentMessages,
  ] = await Promise.all([
    prisma.subscriptionRequest.count(),
    prisma.subscriptionRequest.count({ where: { status: "PENDING" } }),
    prisma.subscriptionRequest.count({ where: { status: "ACTIVE" } }),
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
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            Tableau de bord
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Live Neon DB
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Aperçu en temps réel de votre activité IPTV Monde IPTV.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 rounded-xl cursor-pointer"
          >
            <Link href="/admin/orders">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Gérer les commandes
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Orders */}
        <Card className="p-5 bg-slate-900/90 border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Commandes
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white tracking-tight">
              {totalOrders}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">{activeOrders}</span> actives confirmées
          </p>
        </Card>

        {/* Pending Orders */}
        <Card className="p-5 bg-slate-900/90 border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              En attente
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {pendingOrders}
            </span>
            {pendingOrders > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                À traiter
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Commandes nécessitant un contact WhatsApp
          </p>
        </Card>

        {/* Contact Messages */}
        <Card className="p-5 bg-slate-900/90 border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Messages Reçus
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {totalMessages}
            </span>
            {unreadMessages > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {unreadMessages} non lus
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Messages du formulaire de contact
          </p>
        </Card>

        {/* Active Plans */}
        <Card className="p-5 bg-slate-900/90 border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Offres Actives
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-white tracking-tight">
              {plansCount}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Plans tarifaires affichés sur le site
          </p>
        </Card>
      </div>

      {/* Main Content Grid: Recent Orders & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-indigo-400" />
              Dernières commandes
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
            >
              Voir tout ({totalOrders})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="bg-slate-900/80 border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Aucune commande pour le moment.
              </div>
            ) : (
              recentOrders.map((order) => {
                const priceObj = order.planPrice as { amount?: number; currency?: string } | null;
                const priceDisplay = priceObj?.amount
                  ? `${priceObj.amount} €`
                  : "Gratuit";

                return (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white text-sm">
                          {order.name}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-indigo-400 font-medium">
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
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              Messages récents
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
            >
              Voir tout ({totalMessages})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="bg-slate-900/80 border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
            {recentMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Aucun message reçu.
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 space-y-1.5 hover:bg-slate-800/40 transition ${
                    !msg.isRead ? "bg-indigo-950/20" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm text-white truncate">
                      {msg.name}
                    </span>
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
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

          {/* Quick links banner */}
          <Card className="p-5 bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-900/40 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              Actions rapides
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/admin/pricing"
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-700/50 text-slate-300 hover:text-white transition text-center font-medium"
              >
                Modifier les tarifs
              </Link>
              <Link
                href="/admin/settings"
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-700/50 text-slate-300 hover:text-white transition text-center font-medium"
              >
                Infos du site & Contact
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

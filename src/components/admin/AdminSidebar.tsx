"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  MessageSquare,
  CreditCard,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
  Radio,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  userEmail: string;
  pendingOrdersCount: number;
  unreadMessagesCount: number;
}

export function AdminSidebar({
  userEmail,
  pendingOrdersCount,
  unreadMessagesCount,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // If on login page, don't show sidebar
  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      setLoggingOut(false);
    }
  };

  const navItems = [
    {
      name: "Tableau de bord",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Commandes",
      href: "/admin/orders",
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      badgeColor: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
    },
    {
      name: "Tarifs & Offres",
      href: "/admin/pricing",
      icon: CreditCard,
    },
    {
      name: "Questions FAQ",
      href: "/admin/faqs",
      icon: HelpCircle,
    },
    {
      name: "Configuration",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 text-white sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            M
          </div>
          <span className="font-semibold text-slate-100">Monde IPTV Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base tracking-tight leading-none">
                Monde IPTV
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Panneau d&apos;administration</span>
            </div>
          </div>
        </div>

        {/* Database status pill */}
        <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              Neon PostgreSQL
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connecté
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      item.badgeColor || "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Actions Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs font-medium text-slate-200 truncate">
                {userEmail}
              </p>
              <p className="text-[11px] text-slate-400">Administrateur</p>
            </div>
            <Link
              href="/"
              target="_blank"
              title="Voir le site public"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full justify-start text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-9 px-3 rounded-lg cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {loggingOut ? "Déconnexion..." : "Déconnexion"}
          </Button>
        </div>
      </aside>
    </>
  );
}

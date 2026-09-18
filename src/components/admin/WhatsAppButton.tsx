"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  phone: string;
  name: string;
  planName?: string;
  size?: "sm" | "default";
}

export function WhatsAppButton({
  phone,
  name,
  planName,
  size = "sm",
}: WhatsAppButtonProps) {
  const cleanPhone = phone.replace(/[\s+-]/g, "");

  const message = planName
    ? `Bonjour ${name}, merci pour votre commande du plan "${planName}" sur Monde IPTV ! Nous sommes à votre disposition pour activer vos identifiants.`
    : `Bonjour ${name}, nous vous contactons concernant votre message sur Monde IPTV.`;

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <Button
      variant="outline"
      size={size}
      onClick={() => window.open(url, "_blank")}
      className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50 text-xs gap-1.5 h-8 px-2.5 rounded-lg font-medium cursor-pointer"
      title={`Contacter ${name} sur WhatsApp`}
    >
      <MessageCircle className="w-3.5 h-3.5 fill-emerald-400/20" />
      <span>WhatsApp</span>
    </Button>
  );
}

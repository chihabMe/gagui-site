"use client";

import { useState } from "react";
import { Save, Globe, Phone, Mail, MessageCircle, MapPin, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSiteSettings } from "@/actions/admin";
import { toast } from "sonner";

interface SettingsFormProps {
  initialSettings: {
    title: string;
    description: string | null;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    address: string | null;
  } | null;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [title, setTitle] = useState(initialSettings?.title || "Monde streaming vip");
  const [description, setDescription] = useState(initialSettings?.description || "");
  const [email, setEmail] = useState(initialSettings?.email || "");
  const [phone, setPhone] = useState(initialSettings?.phone || "");
  const [whatsapp, setWhatsapp] = useState(initialSettings?.whatsapp || "");
  const [address, setAddress] = useState(initialSettings?.address || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSiteSettings({
        title,
        description,
        email,
        phone,
        whatsapp,
        address,
      });
      toast.success("Paramètres du site enregistrés avec succès !");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'enregistrement";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      {/* General info */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          Informations générales du site
        </h3>

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-300">Titre du site</Label>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Monde streaming vip"
            className="bg-slate-950 border-slate-800 text-white rounded-xl h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-300">Description SEO (Méta description)</Label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description affichée dans les moteurs de recherche et réseaux sociaux..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </Card>

      {/* Contact & Support */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-400" />
          Coordonnées de contact & WhatsApp
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Numéro de téléphone
            </Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="213562337936"
              className="bg-slate-950 border-slate-800 text-white rounded-xl h-10 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Utilisé pour les redirections d&apos;abonnement WhatsApp.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
              Lien direct WhatsApp
            </Label>
            <Input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="https://wa.me/213562337936"
              className="bg-slate-950 border-slate-800 text-white rounded-xl h-10 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email de contact
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="montetvsat@gmail.com"
              className="bg-slate-950 border-slate-800 text-white rounded-xl h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Adresse physique (optionnel)
            </Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Paris, France"
              className="bg-slate-950 border-slate-800 text-white rounded-xl h-10"
            />
          </div>
        </div>
      </Card>

      {/* Database connection badge info */}
      <Card className="p-5 bg-slate-950/60 border-slate-800/80 rounded-2xl flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Stockage en direct sur Neon PostgreSQL Database (mondeiptv)</span>
        </div>
        <span className="text-emerald-400 font-mono">Prisma ORM v6</span>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs gap-2 h-11 px-6 shadow-lg shadow-indigo-600/25 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
}

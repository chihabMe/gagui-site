"use client";

import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { savePricingPlan, deletePricingPlan } from "@/actions/admin";
import { toast } from "sonner";

interface FeatureItem {
  feature: string;
  included: boolean;
}

interface PlanItem {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  period: string;
  isPopular: boolean;
  isActive: boolean;
  order: number;
  ctaText: string | null;
  ctaUrl: string | null;
  features: FeatureItem[] | unknown;
}

interface PricingManagerProps {
  initialPlans: PlanItem[];
}

export function PricingManager({ initialPlans }: PricingManagerProps) {
  const [plans, setPlans] = useState<PlanItem[]>(initialPlans);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [isNewPlan, setIsNewPlan] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState("EUR");
  const [period, setPeriod] = useState("yearly");
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(1);
  const [ctaText, setCtaText] = useState("S'abonner");
  const [ctaUrl, setCtaUrl] = useState("");
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [newFeatureText, setNewFeatureText] = useState("");

  const handleOpenEdit = (plan: PlanItem) => {
    setIsNewPlan(false);
    setEditingPlan(plan);
    setName(plan.name);
    setDescription(plan.description || "");
    setAmount(plan.amount);
    setCurrency(plan.currency);
    setPeriod(plan.period);
    setIsPopular(plan.isPopular);
    setIsActive(plan.isActive);
    setOrder(plan.order);
    setCtaText(plan.ctaText || "S'abonner");
    setCtaUrl(plan.ctaUrl || "");
    setFeatures(Array.isArray(plan.features) ? plan.features : []);
  };

  const handleOpenNew = () => {
    setIsNewPlan(true);
    setEditingPlan({} as PlanItem);
    setName("");
    setDescription("");
    setAmount(49.99);
    setCurrency("EUR");
    setPeriod("yearly");
    setIsPopular(false);
    setIsActive(true);
    setOrder(plans.length + 1);
    setCtaText("S'abonner");
    setCtaUrl("");
    setFeatures([
      { feature: "+5000 Chaînes TV", included: true },
      { feature: "+15000 Films & Séries", included: true },
      { feature: "Qualité 4K / Ultra HD", included: true },
      { feature: "Assistance technique 24/7", included: true },
    ]);
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, { feature: newFeatureText.trim(), included: true }]);
    setNewFeatureText("");
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleToggleFeatureIncluded = (idx: number) => {
    setFeatures(
      features.map((f, i) => (i === idx ? { ...f, included: !f.included } : f))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await savePricingPlan({
        id: isNewPlan ? undefined : editingPlan?.id,
        name,
        description,
        amount: Number(amount),
        currency,
        period,
        isPopular,
        isActive,
        order: Number(order),
        ctaText,
        ctaUrl: ctaUrl || undefined,
        features,
      });

      toast.success(isNewPlan ? "Plan créé avec succès" : "Plan mis à jour");
      setEditingPlan(null);
      // Refresh local list
      window.location.reload();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'enregistrement";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, planName: string) => {
    if (!window.confirm(`Supprimer définitivement l'offre "${planName}" ?`)) return;
    try {
      await deletePricingPlan(id);
      setPlans(plans.filter((p) => p.id !== id));
      toast.success("Offre supprimée");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la suppression";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex justify-end">
        <Button
          onClick={handleOpenNew}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs gap-1.5 h-10 shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Ajouter une nouvelle offre
        </Button>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const planFeatures: FeatureItem[] = Array.isArray(plan.features)
            ? plan.features
            : [];

          return (
            <Card
              key={plan.id}
              className={`p-6 bg-slate-900/90 border rounded-2xl flex flex-col justify-between relative transition-all ${
                plan.isPopular
                  ? "border-indigo-500/50 shadow-xl shadow-indigo-500/10"
                  : "border-slate-800"
              } ${!plan.isActive ? "opacity-60" : ""}`}
            >
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                    Ordre: {plan.order}
                  </span>
                  {plan.isPopular && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-medium">
                      <Star className="w-3 h-3 fill-amber-400" />
                      Populaire
                    </span>
                  )}
                </div>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    plan.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {plan.isActive ? "Actif" : "Désactivé"}
                </span>
              </div>

              {/* Title & Price */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 min-h-[32px] line-clamp-2">
                  {plan.description || "Aucune description"}
                </p>

                <div className="pt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {plan.amount === 0 ? "GRATUIT" : `${plan.amount} ${plan.currency}`}
                  </span>
                  <span className="text-xs text-slate-400">/{plan.period}</span>
                </div>
              </div>

              {/* Features list preview */}
              <div className="my-5 pt-4 border-t border-slate-800/80 space-y-2 flex-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Caractéristiques ({planFeatures.length})
                </span>
                {planFeatures.slice(0, 5).map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-slate-300"
                  >
                    {f.included ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className="truncate">{f.feature}</span>
                  </div>
                ))}
                {planFeatures.length > 5 && (
                  <p className="text-[11px] text-slate-500 pt-1">
                    +{planFeatures.length - 5} autres fonctionnalités
                  </p>
                )}
              </div>

              {/* Actions footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(plan)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border-slate-700 rounded-xl text-xs gap-1.5 h-9 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Modifier
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(plan.id, plan.name)}
                  className="h-9 w-9 p-0 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer"
                  title="Supprimer cette offre"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit / Create Modal */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl bg-slate-900 border-slate-800 p-6 sm:p-7 rounded-2xl space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isNewPlan ? "Créer un nouveau plan" : `Modifier "${name}"`}
                </h3>
                <p className="text-xs text-slate-400">
                  Les modifications seront immédiatement visibles sur le site public.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingPlan(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Nom de l&apos;offre</Label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: VIP +"
                    className="bg-slate-950 border-slate-800 text-white rounded-xl h-10"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs text-slate-300">Prix</Label>
                    <Input
                      type="number"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      className="bg-slate-950 border-slate-800 text-white rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">Devise</Label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-2"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="MAD">MAD (DH)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Description</Label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brève description de l'offre..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Période</Label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-2"
                  >
                    <option value="monthly">Mensuel (mois)</option>
                    <option value="quarterly">Trimestriel (3 mois)</option>
                    <option value="yearly">Annuel (an)</option>
                    <option value="lifetime">À vie</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Ordre d&apos;affichage</Label>
                  <Input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                    className="bg-slate-950 border-slate-800 text-white rounded-xl h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Texte du bouton</Label>
                  <Input
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="S'abonner"
                    className="bg-slate-950 border-slate-800 text-white rounded-xl h-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
                  />
                  <span>Badge &quot;Populaire&quot; (Mis en avant)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
                  />
                  <span>Actif (Visible sur le site)</span>
                </label>
              </div>

              {/* Features Builder */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <Label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Liste des fonctionnalités ({features.length})
                </Label>

                <div className="flex items-center gap-2">
                  <Input
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Ajouter une caractéristique (ex: 4K Ultra HD, Anti-freeze...)"
                    className="bg-slate-950 border-slate-800 text-white rounded-xl h-9 text-xs"
                  />
                  <Button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl h-9 px-3 shrink-0"
                  >
                    Ajouter
                  </Button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pt-1">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleFeatureIncluded(idx)}
                        className={`flex items-center gap-2 text-left flex-1 ${
                          feat.included ? "text-slate-200" : "text-slate-500 line-through"
                        }`}
                      >
                        {feat.included ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        )}
                        <span>{feat.feature}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingPlan(null)}
                  className="text-xs text-slate-400 hover:text-white rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl px-5 shadow-md shadow-indigo-600/20"
                >
                  {saving ? "Enregistrement..." : "Enregistrer l'offre"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

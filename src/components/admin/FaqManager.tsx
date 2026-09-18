"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveFaq, deleteFaq } from "@/actions/admin";
import { toast } from "sonner";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

interface FaqManagerProps {
  initialFaqs: FaqItem[];
}

export function FaqManager({ initialFaqs }: FaqManagerProps) {
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("general");
  const [order, setOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const handleOpenEdit = (faq: FaqItem) => {
    setIsNew(false);
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setOrder(faq.order);
    setIsActive(faq.isActive);
  };

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingFaq({} as FaqItem);
    setQuestion("");
    setAnswer("");
    setCategory("general");
    setOrder(faqs.length + 1);
    setIsActive(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveFaq({
        id: isNew ? undefined : editingFaq?.id,
        question,
        answer,
        category,
        order: Number(order),
        isActive,
      });

      toast.success(isNew ? "Question ajoutée" : "Question mise à jour");
      setEditingFaq(null);
      window.location.reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur d'enregistrement";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, qText: string) => {
    if (!window.confirm(`Supprimer la question "${qText}" ?`)) return;
    try {
      await deleteFaq(id);
      setFaqs(faqs.filter((f) => f.id !== id));
      toast.success("Question supprimée");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={handleOpenNew}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs gap-1.5 h-10 shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Ajouter une question FAQ
        </Button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <Card
            key={faq.id}
            className={`p-5 bg-slate-900/90 border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all ${
              !faq.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  #{faq.order}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize font-medium">
                  {faq.category}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    faq.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {faq.isActive ? "Active" : "Masquée"}
                </span>
              </div>

              <h3 className="font-semibold text-white text-base">
                {faq.question}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(faq)}
                className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700 rounded-xl text-xs gap-1.5 h-8 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Modifier
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(faq.id, faq.question)}
                className="h-8 w-8 p-0 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit / New Modal */}
      {editingFaq && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-xl bg-slate-900 border-slate-800 p-6 rounded-2xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {isNew ? "Nouvelle question FAQ" : "Modifier la question"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingFaq(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Question</Label>
                <Input
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ex: Sur quels appareils puis-je utiliser le service ?"
                  className="bg-slate-950 border-slate-800 text-white rounded-xl h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Réponse</Label>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Explications claires pour vos clients..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-300">Catégorie</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs px-2"
                  >
                    <option value="general">Général</option>
                    <option value="technical">Technique</option>
                    <option value="billing">Paiement / Facturation</option>
                    <option value="installation">Installation</option>
                    <option value="troubleshooting">Dépannage</option>
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
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800"
                  />
                  <span>Active (Visible dans la FAQ du site)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingFaq(null)}
                  className="text-xs text-slate-400 hover:text-white rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl px-5"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

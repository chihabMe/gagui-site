"use client";

import { useState, useMemo } from "react";
import {
  Trash2,
  CheckCircle2,
  Search,
  Reply,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  MailCheck,
  CheckSquare,
  Square,
  Copy,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toggleMessageRead, deleteMessage } from "@/actions/admin";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  status: string;
  submittedAt: Date | string;
}

interface MessagesManagerProps {
  initialMessages: MessageItem[];
}

export function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  // Filtered & Sorted
  const filtered = useMemo(() => {
    return messages
      .filter((m) => {
        if (filter === "UNREAD" && m.isRead) return false;
        if (filter === "READ" && !m.isRead) return false;

        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        }
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      });
  }, [messages, search, filter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const counts = useMemo(() => {
    return {
      ALL: messages.length,
      UNREAD: messages.filter((m) => !m.isRead).length,
      READ: messages.filter((m) => m.isRead).length,
    };
  }, [messages]);

  const handleToggleRead = async (message: MessageItem) => {
    const newStatus = !message.isRead;
    try {
      await toggleMessageRead(message.id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, isRead: newStatus } : m))
      );
      if (selectedMessage?.id === message.id) {
        setSelectedMessage({ ...selectedMessage, isRead: newStatus });
      }
      toast.success(newStatus ? "Marqué comme lu" : "Marqué comme non-lu");
    } catch (err: unknown) {
      const msgText = err instanceof Error ? err.message : "Erreur de mise à jour";
      toast.error(msgText);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!window.confirm("Supprimer définitivement ce message ?")) return;
    try {
      await deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      setSelectedIds((prev) => prev.filter((id) => id !== messageId));
      toast.success("Message supprimé");
    } catch (err: unknown) {
      const msgText = err instanceof Error ? err.message : "Erreur lors de la suppression";
      toast.error(msgText);
    }
  };

  const handleOpenMessage = async (msg: MessageItem) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      try {
        await toggleMessageRead(msg.id, true);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
        );
      } catch {
        // silent fail
      }
    }
  };

  const handleBulkMarkRead = async () => {
    if (selectedIds.length === 0) return;
    setBulkUpdating(true);
    try {
      await Promise.all(selectedIds.map((id) => toggleMessageRead(id, true)));
      setMessages((prev) =>
        prev.map((m) => (selectedIds.includes(m.id) ? { ...m, isRead: true } : m))
      );
      toast.success(`${selectedIds.length} message(s) marqué(s) comme lu(s)`);
      setSelectedIds([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      toast.error(msg);
    } finally {
      setBulkUpdating(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Supprimer définitivement les ${selectedIds.length} messages sélectionnés ?`)) {
      return;
    }
    setBulkUpdating(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteMessage(id)));
      setMessages((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
      toast.success(`${selectedIds.length} message(s) supprimé(s)`);
      setSelectedIds([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      toast.error(msg);
    } finally {
      setBulkUpdating(false);
    }
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copié dans le presse-papier !");
  };

  return (
    <div className="space-y-5">
      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Rechercher par nom, email, sujet..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 pr-9 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 rounded-xl h-11 focus:border-indigo-500"
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

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
            className="h-11 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs px-3 focus:outline-none"
          >
            <option value="newest">Plus récents d&apos;abord</option>
            <option value="oldest">Plus anciens d&apos;abord</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { label: "Tous les messages", value: "ALL" as const, count: counts.ALL },
          {
            label: "Non lus",
            value: "UNREAD" as const,
            count: counts.UNREAD,
            dot: "bg-indigo-400",
          },
          { label: "Lus", value: "READ" as const, count: counts.READ },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setFilter(tab.value);
              setPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              filter === tab.value
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
                filter === tab.value
                  ? "bg-white/20 text-white"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 px-4 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-between gap-3 text-xs animate-in fade-in">
          <span className="text-indigo-200 font-medium">
            {selectedIds.length} message(s) sélectionné(s)
          </span>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={bulkUpdating}
              onClick={handleBulkMarkRead}
              className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-600/30 text-xs h-7 px-2.5 rounded-lg cursor-pointer gap-1"
            >
              <MailCheck className="w-3.5 h-3.5" />
              Marquer comme lu
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={bulkUpdating}
              onClick={handleBulkDelete}
              className="text-rose-400 hover:bg-rose-500/10 text-xs h-7 px-2.5 rounded-lg cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Supprimer
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}
              className="text-slate-400 hover:text-white text-xs h-7 px-2"
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Messages list */}
      <Card className="bg-slate-900/80 border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60 shadow-xl">
        {paginatedMessages.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-medium text-slate-300">
              Aucun message trouvé
            </p>
          </div>
        ) : (
          paginatedMessages.map((msg) => {
            const isSelected = selectedIds.includes(msg.id);

            return (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition ${
                  !msg.isRead
                    ? "bg-indigo-950/25 hover:bg-indigo-950/40"
                    : "hover:bg-slate-850/50"
                } ${isSelected ? "ring-1 ring-indigo-500/40" : ""}`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIds((prev) =>
                        prev.includes(msg.id)
                          ? prev.filter((i) => i !== msg.id)
                          : [...prev, msg.id]
                      );
                    }}
                    className="mt-1 text-slate-500 hover:text-white shrink-0 cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {!msg.isRead ? (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                      <span
                        className={`text-sm tracking-tight ${
                          !msg.isRead
                            ? "font-bold text-white"
                            : "font-medium text-slate-300"
                        }`}
                      >
                        {msg.name}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs font-medium text-indigo-300">
                        {msg.subject}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {msg.message}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyEmail(msg.email);
                        }}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition"
                      >
                        <span>{msg.email}</span>
                        <Copy className="w-2.5 h-2.5" />
                      </button>
                      <span>•</span>
                      <span>
                        {format(new Date(msg.submittedAt), "dd MMMM yyyy HH:mm", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="flex items-center gap-1.5 self-start sm:self-center shrink-0 pl-7 sm:pl-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 px-2.5 rounded-lg text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 gap-1 cursor-pointer"
                  >
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                        msg.subject
                      )}`}
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Répondre</span>
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleRead(msg)}
                    className="h-8 px-2.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  >
                    {msg.isRead ? "Non-lu" : "Lu"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(msg.id)}
                    className="h-8 w-8 p-0 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            Page {currentPage} sur {totalPages} ({filtered.length} messages)
          </span>

          <div className="flex items-center gap-2">
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

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-slate-900 border-slate-800 p-6 rounded-2xl space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {selectedMessage.subject}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">
                  {selectedMessage.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400">{selectedMessage.email}</span>
                  <button
                    onClick={() => copyEmail(selectedMessage.email)}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Reçu le{" "}
                  {format(
                    new Date(selectedMessage.submittedAt),
                    "dd MMMM yyyy à HH:mm",
                    { locale: fr }
                  )}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMessage(null)}
                className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {selectedMessage.message}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleRead(selectedMessage)}
                className="text-xs border-slate-800 text-slate-300 hover:text-white rounded-xl cursor-pointer"
              >
                {selectedMessage.isRead ? "Marquer non-lu" : "Marquer comme lu"}
              </Button>

              <Button
                size="sm"
                asChild
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl gap-1.5 cursor-pointer"
              >
                <a
                  href={`mailto:${
                    selectedMessage.email
                  }?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                >
                  <Reply className="w-3.5 h-3.5" />
                  Répondre par Email
                </a>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

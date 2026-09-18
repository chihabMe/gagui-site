"use client";

import { useState } from "react";
import {
  Trash2,
  CheckCircle2,
  Search,
  Reply,
  AlertCircle,
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
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);

  const filtered = messages.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

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
      toast.success("Message supprimé");
    } catch (err: unknown) {
      const msgText = err instanceof Error ? err.message : "Erreur lors de la suppression";
      toast.error(msgText);
    }
  };

  const handleOpenMessage = async (msg: MessageItem) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      // Auto mark as read on open
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

  return (
    <div className="space-y-5">
      {/* Search & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Rechercher dans les messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 rounded-xl h-10"
          />
        </div>

        <div className="text-xs text-slate-400">
          Total: <span className="font-semibold text-white">{messages.length}</span> • Non lus:{" "}
          <span className="font-semibold text-indigo-400">
            {messages.filter((m) => !m.isRead).length}
          </span>
        </div>
      </div>

      {/* Messages list */}
      <Card className="bg-slate-900/80 border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-medium text-slate-400">
              Aucun message trouvé
            </p>
          </div>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-850/60 transition ${
                !msg.isRead ? "bg-indigo-950/20" : ""
              }`}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {!msg.isRead ? (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      !msg.isRead
                        ? "font-bold text-white"
                        : "font-medium text-slate-300"
                    }`}
                  >
                    {msg.name}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-medium text-indigo-300">
                    {msg.subject}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-1">
                  {msg.message}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>{msg.email}</span>
                  <span>•</span>
                  <span>
                    {format(new Date(msg.submittedAt), "dd MMMM yyyy HH:mm", {
                      locale: fr,
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="flex items-center gap-2 self-start sm:self-center shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 px-2.5 rounded-lg text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 gap-1.5 cursor-pointer"
                >
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                      msg.subject
                    )}`}
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Répondre</span>
                  </a>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleRead(msg)}
                  className="h-8 px-2.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  {msg.isRead ? "Marquer non-lu" : "Marquer lu"}
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
          ))
        )}
      </Card>

      {/* Message View Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-slate-900 border-slate-800 p-6 rounded-2xl space-y-4 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {selectedMessage.subject}
                </span>
                <h3 className="text-lg font-bold text-white mt-2">
                  {selectedMessage.name}
                </h3>
                <p className="text-xs text-slate-400">{selectedMessage.email}</p>
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
                className="text-xs border-slate-800 text-slate-300 hover:text-white rounded-xl"
              >
                {selectedMessage.isRead ? "Marquer non-lu" : "Marquer comme lu"}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  asChild
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl gap-1.5"
                >
                  <a
                    href={`mailto:${
                      selectedMessage.email
                    }?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject
                    )}`}
                  >
                    <Reply className="w-3.5 h-3.5" />
                    Répondre par Email
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

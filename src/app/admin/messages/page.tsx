import { prisma } from "@/lib/prisma";
import { MessagesManager } from "@/components/admin/MessagesManager";
import { MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <MessageSquare className="w-7 h-7 text-indigo-400" />
          Messages de contact ({messages.length})
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Consultez et répondez directement aux messages envoyés depuis le formulaire de contact du site.
        </p>
      </div>

      <MessagesManager initialMessages={messages} />
    </div>
  );
}

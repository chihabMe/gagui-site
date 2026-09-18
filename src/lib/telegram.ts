/**
 * Telegram Notification Service
 * Sends notifications for new subscription orders and contact form messages.
 */

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export interface PlanPrice {
  amount: number;
  currency: string;
  period: string;
}

export interface OrderNotificationPayload {
  id?: string;
  name: string;
  email: string;
  phone: string;
  planName: string;
  planPrice?: PlanPrice;
  submittedAt?: string;
}

export interface ContactNotificationPayload {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt?: string;
}

/**
 * Resolves destination chat IDs from process.env or falls back to querying Telegram getUpdates.
 */
async function resolveChatIds(botToken: string): Promise<string[]> {
  const envChatId = process.env.TELEGRAM_CHAT_ID;
  if (envChatId && envChatId.trim()) {
    return envChatId
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }

  // Fallback: If no TELEGRAM_CHAT_ID is set, attempt to discover chat ID from recent getUpdates
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?limit=10`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
      const discoveredIds = new Set<string>();
      for (const update of data.result) {
        const chat =
          update.message?.chat ||
          update.channel_post?.chat ||
          update.my_chat_member?.chat;
        if (chat?.id) {
          discoveredIds.add(String(chat.id));
        }
      }
      return Array.from(discoveredIds);
    }
  } catch (error) {
    console.warn("[Telegram] Could not fetch chat IDs from getUpdates:", error);
  }

  return [];
}

/**
 * Sends a raw HTML-formatted message to configured Telegram chat(s).
 */
export async function sendTelegramMessage(htmlMessage: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.warn("[Telegram] Notification skipped: TELEGRAM_BOT_TOKEN is not configured.");
    return false;
  }

  try {
    const chatIds = await resolveChatIds(botToken);

    if (chatIds.length === 0) {
      console.warn(
        "[Telegram] Notification skipped: No TELEGRAM_CHAT_ID provided and no recent messages found in bot updates. Please send /start to your bot or set TELEGRAM_CHAT_ID."
      );
      return false;
    }

    const sendPromises = chatIds.map(async (chatId) => {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: htmlMessage,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });

      if (!response.ok) {
        const errData = await response.text();
        console.error(`[Telegram] Failed to send message to ${chatId}:`, errData);
        return false;
      }
      return true;
    });

    const results = await Promise.all(sendPromises);
    return results.some(Boolean);
  } catch (error) {
    console.error("[Telegram] Error while sending notification:", error);
    return false;
  }
}

/**
 * Sends a formatted order/subscription notification to Telegram.
 */
export async function sendOrderTelegramNotification(
  payload: OrderNotificationPayload
): Promise<boolean> {
  const formatPrice = (price?: PlanPrice) => {
    if (!price) return "Non spécifié";
    if (price.amount === 0) return "GRATUIT";

    const currencySymbol: Record<string, string> = {
      EUR: "€",
      USD: "$",
      MAD: "DH",
      GBP: "£",
    };

    const periodText: Record<string, string> = {
      monthly: "mois",
      quarterly: "3 mois",
      yearly: "an",
      lifetime: "à vie",
    };

    return `${price.amount} ${currencySymbol[price.currency] || price.currency} / ${
      periodText[price.period] || price.period
    }`;
  };

  const timestamp = payload.submittedAt
    ? new Date(payload.submittedAt).toLocaleString("fr-FR", { timeZone: "UTC" })
    : new Date().toLocaleString("fr-FR", { timeZone: "UTC" });

  const message = [
    "🔥 <b>NOUVELLE DEMANDE D&#039;ABONNEMENT</b> 🔥",
    "",
    `👤 <b>Nom :</b> ${escapeHtml(payload.name)}`,
    `📧 <b>Email :</b> <code>${escapeHtml(payload.email)}</code>`,
    `📱 <b>Téléphone :</b> <a href="tel:${escapeHtml(payload.phone)}">${escapeHtml(payload.phone)}</a>`,
    `💬 <b>WhatsApp direct :</b> <a href="https://wa.me/${escapeHtml(payload.phone.replace(/[\s+-]/g, ""))}">Ouvrir WhatsApp</a>`,
    "",
    `📺 <b>Plan choisi :</b> <b>${escapeHtml(payload.planName)}</b>`,
    `💰 <b>Prix :</b> ${escapeHtml(formatPrice(payload.planPrice))}`,
    "",
    `🕒 <b>Date :</b> ${timestamp} UTC`,
    payload.id ? `🆔 <b>ID Sanity :</b> <code>${escapeHtml(payload.id)}</code>` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return sendTelegramMessage(message);
}

/**
 * Sends a formatted contact form notification to Telegram.
 */
export async function sendContactTelegramNotification(
  payload: ContactNotificationPayload
): Promise<boolean> {
  const timestamp = payload.submittedAt
    ? new Date(payload.submittedAt).toLocaleString("fr-FR", { timeZone: "UTC" })
    : new Date().toLocaleString("fr-FR", { timeZone: "UTC" });

  const message = [
    "📩 <b>NOUVEAU MESSAGE DE CONTACT</b>",
    "",
    `👤 <b>Nom :</b> ${escapeHtml(payload.name)}`,
    `📧 <b>Email :</b> <code>${escapeHtml(payload.email)}</code>`,
    `🏷️ <b>Sujet :</b> ${escapeHtml(payload.subject)}`,
    "",
    "💬 <b>Message :</b>",
    `<blockquote>${escapeHtml(payload.message)}</blockquote>`,
    "",
    `🕒 <b>Date :</b> ${timestamp} UTC`,
    payload.id ? `🆔 <b>ID Sanity :</b> <code>${escapeHtml(payload.id)}</code>` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return sendTelegramMessage(message);
}

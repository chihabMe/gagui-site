"use server";

import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/sanity";
import { sendOrderTelegramNotification } from "@/lib/telegram";
import { redirect } from "next/navigation";
import { z } from "zod";

// Validation schema
const subscriptionSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide").max(20),
  planId: z.string().optional(),
  planName: z.string().min(1, "Nom du plan requis"),
  planPrice: z.object({
    amount: z.number(),
    currency: z.string(),
    period: z.string(),
  }),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export interface ActionResult {
  success: boolean;
  error?: string;
  whatsappUrl?: string;
}

export async function submitSubscription(
  formData: SubscriptionFormData
): Promise<ActionResult> {
  try {
    // Validate the form data
    const validatedData = subscriptionSchema.parse(formData);

    // Resolve matching pricing plan in database if ID is provided
    let matchedPlan = null;
    if (validatedData.planId) {
      matchedPlan = await prisma.pricingPlan.findFirst({
        where: {
          OR: [
            { id: validatedData.planId },
            { sanityId: validatedData.planId },
          ],
        },
      });
    }

    // Create subscription request in Neon DB
    const subscriptionRequest = await prisma.subscriptionRequest.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        planName: validatedData.planName,
        planPrice: validatedData.planPrice,
        status: "PENDING",
        selectedPlanId: matchedPlan ? matchedPlan.id : null,
      },
    });

    if (!subscriptionRequest) {
      throw new Error("Erreur lors de la création de la demande d'abonnement");
    }

    // Send Telegram notification (asynchronously, catches errors so flow isn't interrupted)
    try {
      await sendOrderTelegramNotification({
        id: subscriptionRequest.id,
        name: subscriptionRequest.name,
        email: subscriptionRequest.email,
        phone: subscriptionRequest.phone,
        planName: subscriptionRequest.planName,
        planPrice: validatedData.planPrice,
        submittedAt: subscriptionRequest.submittedAt.toISOString(),
      });
    } catch (telegramErr) {
      console.error("[Telegram] Order notification error:", telegramErr);
    }

    // Format price for WhatsApp message
    const formatPrice = (price: typeof validatedData.planPrice) => {
      const currencySymbol: { [key: string]: string } = {
        EUR: "€",
        USD: "$",
        MAD: "DH",
        GBP: "£",
      };

      const periodText: { [key: string]: string } = {
        monthly: "mois",
        quarterly: "3 mois",
        yearly: "an",
        lifetime: "à vie",
      };

      if (price.amount === 0) return "GRATUIT";

      return `${price.amount}${
        currencySymbol[price.currency] || price.currency
      }/${periodText[price.period] || price.period}`;
    };

    // Create WhatsApp message
    const whatsappMessage = `🔥 Nouvelle demande d'abonnement mondeTV 🔥

👤 *Nom:* ${validatedData.name}
📧 *Email:* ${validatedData.email}
📱 *Téléphone:* ${validatedData.phone}

📺 *Plan choisi:* ${validatedData.planName}
💰 *Prix:* ${formatPrice(validatedData.planPrice)}

🚀 Bonjour ! Je souhaite souscrire à l'abonnement "${
      validatedData.planName
    }". Pouvez-vous me contacter pour finaliser mon inscription ?

Merci ! 😊`;

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Get WhatsApp number from siteSettings
    const siteSettings = await getSiteSettings();
    const whatsappNumber =
      siteSettings?.contactInfo?.phone ||
      process.env.WHATSAPP_BUSINESS_NUMBER ||
      "+212123456789";

    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(
      /[\s+-]/g,
      ""
    )}?text=${encodedMessage}`;

    return {
      success: true,
      whatsappUrl,
    };
  } catch (error) {
    console.error("Error submitting subscription:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Données invalides",
      };
    }

    return {
      success: false,
      error:
        "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
    };
  }
}

export async function redirectToWhatsApp(url: string) {
  redirect(url);
}

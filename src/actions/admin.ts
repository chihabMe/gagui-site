"use server";

import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { SubscriptionStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Action non autorisée: session admin requise.");
  }
  return session;
}

// ============================================================================
// Orders / Subscription Requests Actions
// ============================================================================

export async function updateOrderStatus(
  orderId: string,
  status: SubscriptionStatus,
  notes?: string
) {
  await requireAdmin();

  const data: { status: SubscriptionStatus; notes?: string } = { status };
  if (notes !== undefined) {
    data.notes = notes;
  }

  const updated = await prisma.subscriptionRequest.update({
    where: { id: orderId },
    data,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return { success: true, order: updated };
}

export async function deleteOrder(orderId: string) {
  await requireAdmin();

  await prisma.subscriptionRequest.delete({
    where: { id: orderId },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return { success: true };
}

// ============================================================================
// Contact Messages Actions
// ============================================================================

export async function toggleMessageRead(messageId: string, isRead: boolean) {
  await requireAdmin();

  const updated = await prisma.contactMessage.update({
    where: { id: messageId },
    data: { isRead },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  return { success: true, message: updated };
}

export async function deleteMessage(messageId: string) {
  await requireAdmin();

  await prisma.contactMessage.delete({
    where: { id: messageId },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  return { success: true };
}

// ============================================================================
// Pricing Plans Actions
// ============================================================================

export interface PricingPlanInput {
  id?: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  period: string;
  isPopular: boolean;
  isActive: boolean;
  order: number;
  ctaText?: string;
  ctaUrl?: string;
  features: { feature: string; included: boolean }[];
}

export async function savePricingPlan(data: PricingPlanInput) {
  await requireAdmin();

  if (data.id) {
    await prisma.pricingPlan.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description || null,
        amount: data.amount,
        currency: data.currency,
        period: data.period,
        isPopular: data.isPopular,
        isActive: data.isActive,
        order: data.order,
        ctaText: data.ctaText || "S'abonner",
        ctaUrl: data.ctaUrl || null,
        features: data.features,
      },
    });
  } else {
    await prisma.pricingPlan.create({
      data: {
        name: data.name,
        description: data.description || null,
        amount: data.amount,
        currency: data.currency,
        period: data.period,
        isPopular: data.isPopular,
        isActive: data.isActive,
        order: data.order,
        ctaText: data.ctaText || "S'abonner",
        ctaUrl: data.ctaUrl || null,
        features: data.features,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/channels");
  revalidatePath("/admin");
  revalidatePath("/admin/pricing");
  return { success: true };
}

export async function deletePricingPlan(id: string) {
  await requireAdmin();

  await prisma.pricingPlan.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/pricing");
  return { success: true };
}

// ============================================================================
// FAQs Actions
// ============================================================================

export interface FaqInput {
  id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export async function saveFaq(data: FaqInput) {
  await requireAdmin();

  if (data.id) {
    await prisma.faq.update({
      where: { id: data.id },
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        order: data.order,
        isActive: data.isActive,
      },
    });
  } else {
    await prisma.faq.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        order: data.order,
        isActive: data.isActive,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/faqs");
  return { success: true };
}

export async function deleteFaq(id: string) {
  await requireAdmin();

  await prisma.faq.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/faqs");
  return { success: true };
}

// ============================================================================
// Site Settings Actions
// ============================================================================

export interface SiteSettingsInput {
  title: string;
  description?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
}

export async function saveSiteSettings(data: SiteSettingsInput) {
  await requireAdmin();

  await prisma.siteSettings.upsert({
    where: { id: "siteSettings" },
    update: {
      title: data.title,
      description: data.description || null,
      email: data.email || null,
      phone: data.phone || null,
      whatsapp: data.whatsapp || null,
      address: data.address || null,
    },
    create: {
      id: "siteSettings",
      title: data.title,
      description: data.description || null,
      email: data.email || null,
      phone: data.phone || null,
      whatsapp: data.whatsapp || null,
      address: data.address || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
  return { success: true };
}

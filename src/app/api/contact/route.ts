import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactTelegramNotification } from "@/lib/telegram";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    const trimmedName = body.name.trim();
    const trimmedEmail = body.email.trim().toLowerCase();
    const trimmedSubject = body.subject.trim();
    const trimmedMessage = body.message.trim();

    // Save contact message to Neon DB via Prisma
    const messageRecord = await prisma.contactMessage.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
        isRead: false,
        status: "new",
      },
    });

    // Send Telegram notification (non-blocking, won't break the submission response if it fails)
    try {
      await sendContactTelegramNotification({
        id: messageRecord.id,
        name: messageRecord.name,
        email: messageRecord.email,
        subject: messageRecord.subject,
        message: messageRecord.message,
        submittedAt: messageRecord.submittedAt.toISOString(),
      });
    } catch (telegramErr) {
      console.error("[Telegram] Contact notification error:", telegramErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message envoyé avec succès",
        id: messageRecord.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact form:", error);

    return NextResponse.json(
      { error: "Erreur interne du serveur. Veuillez réessayer plus tard." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";

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

    // Create contact document in Sanity
    const contactDoc = {
      _type: "contact",
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      subject: body.subject.trim(),
      message: body.message.trim(),
      isRead: false,
      submittedAt: new Date().toISOString(),
      status: "new",
    };

    // Save to Sanity
    const result = await client.create(contactDoc);

    return NextResponse.json(
      {
        success: true,
        message: "Message envoyé avec succès",
        id: result._id,
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

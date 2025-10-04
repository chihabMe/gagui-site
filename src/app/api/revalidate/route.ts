import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET endpoint to revalidate all content tags
 * Usage: GET /api/revalidate?token=YOUR_SECRET_TOKEN
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from query parameters or headers
    const url = new URL(request.url);
    const token =
      url.searchParams.get("token") ||
      request.headers.get("authorization")?.replace("Bearer ", "");
    const secret = process.env.SANITY_REVALIDATE_SECRET;

    // Verify the token
    if (!secret || !token || token !== secret) {
      return NextResponse.json(
        {
          message: "Unauthorized - Invalid or missing token",
        },
        { status: 401 }
      );
    }

    // Revalidate all content tags
    const tags = [
      "posts",
      "testimonials",
      "faq",
      "pricing",
      "site-settings",
      "categories",
      "authors",
      "newsletter",
      "contact",
    ];

    // Revalidate each tag
    tags.forEach((tag) => {
      revalidateTag(tag);
    });

    return NextResponse.json({
      revalidated: true,
      tags,
      timestamp: Date.now(),
      message: "All content tags revalidated successfully",
    });
  } catch (error) {
    console.error("Error revalidating:", error);
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

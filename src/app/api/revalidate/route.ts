import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get content type and slug from query parameters
    const _type = url.searchParams.get("type");
    const slug = url.searchParams.get("slug");

    // Revalidate specific paths based on content type
    switch (_type) {
      case "post":
        revalidatePath("/");
        revalidateTag("posts");
        if (slug) {
          revalidatePath(`/posts/${slug}`);
        }
        break;
      case "testimonial":
        revalidatePath("/");
        revalidateTag("testimonials");
        break;
      case "faq":
        revalidatePath("/");
        revalidateTag("faq");
        break;
      case "pricing":
        revalidatePath("/");
        revalidateTag("pricing");
        break;
      case "subscriptionRequest":
        // No need to revalidate public pages for subscription requests
        revalidateTag("subscription-requests");
        break;
      case "siteSettings":
        revalidatePath("/");
        revalidateTag("site-settings");
        break;
      case "all":
        // Revalidate everything
        revalidatePath("/");
        revalidateTag("posts");
        revalidateTag("testimonials");
        revalidateTag("faq");
        revalidateTag("pricing");
        revalidateTag("site-settings");
        break;
      default:
        // Revalidate homepage for any other content type
        revalidatePath("/");
        break;
    }

    return NextResponse.json({
      revalidated: true,
      type: _type || "default",
      slug: slug || null,
      timestamp: Date.now(),
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { _type, slug } = body;

    // Verify the request is from Sanity (add your webhook secret)
    const authHeader = request.headers.get("authorization");
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Revalidate specific paths based on content type
    switch (_type) {
      case "post":
        revalidatePath("/");
        revalidateTag("posts");
        if (slug?.current) {
          revalidatePath(`/posts/${slug.current}`);
        }
        break;
      case "testimonial":
        revalidatePath("/");
        revalidateTag("testimonials");
        break;
      case "faq":
        revalidatePath("/");
        revalidateTag("faq");
        break;
      case "pricing":
        revalidatePath("/");
        revalidateTag("pricing");
        break;
      case "subscriptionRequest":
        // No need to revalidate public pages for subscription requests
        revalidateTag("subscription-requests");
        break;
      case "siteSettings":
        revalidatePath("/");
        revalidateTag("site-settings");
        break;
      default:
        // Revalidate homepage for any other content type
        revalidatePath("/");
        break;
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
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

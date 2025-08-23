import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { _type, slug } = body;

    // Verify the request is from Sanity (add your webhook secret)
    const authHeader = request.headers.get('authorization');
    const secret = process.env.SANITY_WEBHOOK_SECRET;
    
    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Revalidate specific paths based on content type
    switch (_type) {
      case 'post':
        revalidatePath('/');
        revalidateTag('posts');
        if (slug?.current) {
          revalidatePath(`/posts/${slug.current}`);
        }
        break;
      case 'testimonial':
        revalidatePath('/');
        revalidateTag('testimonials');
        break;
      case 'faq':
        revalidatePath('/');
        revalidateTag('faq');
        break;
      case 'pricing':
        revalidatePath('/');
        revalidateTag('pricing');
        break;
      case 'siteSettings':
        revalidatePath('/');
        revalidateTag('site-settings');
        break;
      default:
        // Revalidate homepage for any other content type
        revalidatePath('/');
        break;
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

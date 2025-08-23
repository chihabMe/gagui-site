import { Header } from "@/components/Header";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { getSiteSettings } from "@/sanity";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();

  return (
    <div className="min-h-screen container max-w-screen-2xl mx-auto px-4 sm:px-1 md:px-4 lg:px-8">
      <Header />
      <main>
        <ContactSection />
      </main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}

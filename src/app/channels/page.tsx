import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Metadata } from "next";
import { ChannelsSection } from "@/components/ChannelsSection";
import { getSiteSettings } from "@/sanity";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Chaînes mondeTV - Plus de 50,000 chaînes en HD/4K",
  description:
    "Découvrez notre sélection complète de chaînes françaises et internationales. Films, séries, sport, documentaires et plus encore en haute qualité.",
  keywords:
    "chaînes TV, télévision française, chaînes sport, chaînes cinéma, France",
};

export default async function ChannelsPage() {
  const siteSettings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ChannelsSection />
      </main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}

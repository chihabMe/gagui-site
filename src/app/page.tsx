import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PopularChannels } from "@/components/PopularChannels";
import { ContentLibrarySection } from "@/components/ContentLibrarySection";
import { PricingSection } from "@/components/PricingSection";
import { HowItWorks } from "@/components/HowItWorks";
import { DeviceCompatibility } from "@/components/DeviceCompatibility";
import { IPTVPlayersSection } from "@/components/IPTVPlayersSection";
import { Testimonials } from "@/components/Testimonials";
// import { BlogSection } from "@/components/BlogSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import {
  getSiteSettings,
  getPricingPlans,
  getFAQ,
  getFeaturedTestimonials,
  getRecentPosts,
} from "@/sanity";

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch dynamic data
  const [siteSettings, pricingPlans, faqs, testimonials, recentPosts] =
    await Promise.all([
      getSiteSettings(),
      getPricingPlans(),
      getFAQ(),
      getFeaturedTestimonials(),
      getRecentPosts(4),
    ]);
  console.log("siteSettings:", siteSettings);
  console.log("pricingPlans:", pricingPlans);
  console.log("faqs:", faqs);
  console.log("testimonials:", testimonials);
  console.log("recentPosts:", recentPosts);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <PricingSection pricingPlans={pricingPlans} />
        <PopularChannels />
        {/* <QualitySection /> */}
        <ContentLibrarySection />
        {/* <WhyChooseUs /> */}
        <HowItWorks />
        <DeviceCompatibility />
        <IPTVPlayersSection />
        <Testimonials testimonials={testimonials} />
        <FAQSection faqs={faqs} />
        {/* <BlogSection posts={recentPosts} /> */}
        {/* <ContactSection /> */}
      </main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
}

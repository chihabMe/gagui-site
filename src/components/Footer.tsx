import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { type SiteSettings } from "@/sanity";

const quickLinks = [
  { name: "Accueil", href: "#" },
  { name: "Tarifs", href: "#tarifs" },
  { name: "Chaînes", href: "#chaines" },
  { name: "Support", href: "#support" },
];

const legalLinks = [
  { name: "Mentions légales", href: "#" },
  { name: "Politique de confidentialité", href: "#" },
  { name: "Conditions d'utilisation", href: "#" },
  { name: "CGV", href: "#" },
];

interface FooterProps {
  siteSettings?: SiteSettings | null;
}

export function Footer({ siteSettings }: FooterProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return Facebook;
      case "twitter":
        return Twitter;
      case "instagram":
        return Instagram;
      case "youtube":
        return Youtube;
      default:
        return Mail;
    }
  };
  return (
    <footer className="bg-gradient-to-t from-card via-background to-card border-t border-primary/20 container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      <div className="container px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <Image
                src="/logo.png"
                alt="Media StreamTV Logo"
                width={240}
                height={68}
                className="h-20 w-auto"
              />
            </div>
            <p className="text-muted-foreground mb-8 text-lg">
              {siteSettings?.description ||
                "Votre portail vers l'univers infini du streaming avec 25 000+ chaînes et expérience premium."}
            </p>

            {/* Dynamic Contact Info */}
            <div className="space-y-2 text-sm">
              {siteSettings?.contactInfo?.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  <span>{siteSettings.contactInfo.email}</span>
                </div>
              )}
              {siteSettings?.contactInfo?.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <a
                    href={`https://wa.me/${siteSettings.contactInfo.phone.replace(
                      /\s+/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {siteSettings.contactInfo.phone}
                  </a>
                </div>
              )}
              {siteSettings?.contactInfo?.address && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span>{siteSettings.contactInfo.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Informations légales</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="font-bold text-lg mb-4">Restez connecté</h3>
            <p className="text-background/70 mb-4">
              Abonnez-vous à notre newsletter pour les dernières nouveautés.
            </p>
            <div className="flex space-x-2 mb-6">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-3 py-2 bg-background/10 border border-background/20 rounded text-background placeholder:text-background/50"
              />
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                OK
              </Button>
            </div>

            {/* Dynamic Social Links */}
            <div className="flex space-x-3">
              {siteSettings?.contactInfo?.socialLinks &&
                Object.entries(siteSettings.contactInfo.socialLinks).map(
                  ([platform, url]) => {
                    if (!url) return null;
                    const IconComponent = getSocialIcon(platform);
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                      >
                        <IconComponent className="h-5 w-5" />
                      </a>
                    );
                  }
                )}
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-background/70 text-sm mb-4 md:mb-0">
              © 2024 {siteSettings?.title || "StreamTV Pro"}. Tous droits
              réservés.
            </p>
            <div className="flex items-center space-x-4 text-sm text-background/70">
              <span>🇫🇷 Français</span>
              <span>|</span>
              <span>Service client 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

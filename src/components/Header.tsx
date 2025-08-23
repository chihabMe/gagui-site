"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react"; // IGNORE
const navigation = [
  { name: "Accueil", href: "/", isRoute: true },
  { name: "Chaînes", href: "/channels", isRoute: true },
  { name: "Tarifs", href: "/#tarifs", isRoute: false },
  { name: "Avis clients", href: "/#avis", isRoute: false },
  { name: "Fonctionnement", href: "/#fonctionnement", isRoute: false },
  { name: "FAQ", href: "/#faq", isRoute: false },
  { name: "Blog", href: "/blogs", isRoute: true },
  { name: "Contact", href: "/contact", isRoute: true },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile, mobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="glass-effect backdrop-blur-lg sticky top-0 z-50 w-full border-b border-primary/20">
      <div className="container mx-auto">
        <nav
          className="flex items-center justify-between p-3 md:p-4 lg:px-8"
          aria-label="Global"
        >
          {/* Logo Section */}
          <div className="flex lg:flex-1">
            <Link
              href="/"
              className="-m-1.5 p-1.5 flex items-center group transition-all duration-300"
            >
              <div className="relative flex items-center">
                <span className="text-2xl xl:text-3xl 2xl:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(0,255,255,0.3)]">
                  Media
                </span>
                <span className="text-2xl xl:text-3xl 2xl:text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent ml-1 drop-shadow-[0_0_8px_rgba(255,0,255,0.3)]">
                  IPTV
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 shadow-[0_0_20px_rgba(0,255,255,0.3)]"></div>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-label="Ouvrir le menu principal"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </motion.button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-6 xl:gap-x-8 2xl:gap-x-12">
            {navigation.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm xl:text-base font-semibold leading-6 text-foreground hover:text-primary transition-colors whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm xl:text-base font-semibold leading-6 text-foreground hover:text-primary transition-colors whitespace-nowrap"
                >
                  {item.name}
                </a>
              )
            )}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link href="/#tarifs">
              <Button className="bg-gradient-primary hover:opacity-90 transition-all text-sm xl:text-base px-6 xl:px-8 py-3 shadow-cyber pulse-glow relative overflow-hidden">
                <span className="relative z-10">Accéder à l&apos;Univers</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>
              </Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/80"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile menu panel - Full screen */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: 0.4,
              }}
              className="fixed inset-0 h-[100vh] z-50 overflow-y-auto bg-white transform"
            >
              {/* Mobile menu header - Only close button */}
              <div className="flex items-center justify-end px-6 pt-6 md:pt-8 pb-2 md:pb-4">
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fermer le menu"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </motion.button>
              </div>

              {/* Mobile menu content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="flex  flex-col justify-center h-[calc(100vh-120px)] px-6"
              >
                <div className="space-y-1  max-w-sm mx-auto w-full">
                  {/* Navigation Links */}
                  {navigation.map((item, index) => {
                    const Component = item.isRoute ? Link : "a";
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.2 + index * 0.05,
                          duration: 0.3,
                        }}
                      >
                        <Component
                          href={item.href}
                          className="block hover:underline  transition-all duration-200 px-4 py-3 md:py-6 text-xl font-medium text-foreground text-center hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Component>
                      </motion.div>
                    );
                  })}

                  {/* Mobile CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.2 + navigation.length * 0.05 + 0.1,
                      duration: 0.3,
                    }}
                    className="py-2 md:pt-12 mt-6"
                  >
                    <Link href="/#tarifs">
                      <Button
                        className="bg-gradient-to-r cursor-pointer transition-all duration-200 from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-semibold px-8 py-6 text-lg shadow-lg w-full h-12 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        S&apos;abonner
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

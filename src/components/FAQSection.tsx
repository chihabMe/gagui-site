"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  MessageCircle,
  Tv,
  Wifi,
  Shield,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { type FAQ } from "@/sanity";

interface FAQSectionProps {
  faqs?: FAQ[];
}

export function FAQSection({ faqs = [] }: FAQSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical":
        return Wifi;
      case "billing":
        return CreditCard;
      case "installation":
        return Smartphone;
      case "troubleshooting":
        return Shield;
      case "general":
      default:
        return Tv;
    }
  };

  // Fallback FAQ data if no dynamic data is available
  const fallbackFaqs: FAQ[] = [
    {
      _id: "fallback-1",
      _type: "faq",
      question: "Comment fonctionne notre service ?",
      answer:
        "Notre service utilise une technologie qui permet de diffuser des chaînes de télévision via Internet. Contrairement à la télévision traditionnelle, notre service utilise votre connexion Internet pour vous offrir des milliers de chaînes en haute qualité, accessible sur tous vos appareils.",
      category: "general",
      order: 1,
      isActive: true,
    },
    {
      _id: "fallback-2",
      _type: "faq",
      question: "Quelle vitesse Internet est nécessaire ?",
      answer:
        "Pour une expérience optimale, nous recommandons une connexion Internet d'au moins 10 Mbps pour la HD et 25 Mbps pour la 4K. Une connexion stable est plus importante que la vitesse pure. La plupart des connexions ADSL, fibre ou 4G conviennent parfaitement.",
      category: "technical",
      order: 2,
      isActive: true,
    },
    {
      _id: "fallback-3",
      _type: "faq",
      question: "Sur quels appareils puis-je regarder mondeTV ?",
      answer:
        "mondeTV est compatible avec tous les appareils modernes : Smart TV (Samsung, LG, Android TV), box Android, iPhone, iPad, smartphones Android, PC, Mac, tablettes, Amazon Fire Stick, Roku, et bien d'autres. Une seule souscription pour tous vos appareils.",
      category: "installation",
      order: 3,
      isActive: true,
    },
    {
      _id: "fallback-4",
      _type: "faq",
      question: "Est-ce légal d'utiliser ce service ?",
      answer:
        "Oui, l'utilisation de notre service est parfaitement légale lorsque vous utilisez des services autorisés comme mondeTV. Nous proposons uniquement du contenu légal et respectons tous les droits de diffusion. Nos serveurs sont conformes aux réglementations européennes.",
      category: "general",
      order: 4,
      isActive: true,
    },
    {
      _id: "fallback-5",
      _type: "faq",
      question: "Comment installer mondeTV ?",
      answer:
        "L'installation est très simple ! Après votre abonnement, vous recevrez un lien M3U et des codes d'accès. Il suffit de télécharger une application compatible (VLC, Smarters, etc.), d'entrer vos codes, et c'est prêt ! Un guide détaillé vous sera fourni.",
      category: "installation",
      order: 5,
      isActive: true,
    },
    {
      _id: "fallback-6",
      _type: "faq",
      question: "Puis-je regarder sur plusieurs appareils en même temps ?",
      answer:
        "Cela dépend de votre plan d'abonnement. Le plan Basic permet 1 connexion simultanée, le Premium permet 3 connexions, et le VIP permet 5 connexions simultanées. Vous pouvez installer l'application sur autant d'appareils que vous voulez.",
      category: "general",
      order: 6,
      isActive: true,
    },
  ];

  // Use dynamic FAQs if available, otherwise use fallback
  const faqsToShow = faqs.length > 0 ? faqs : fallbackFaqs;

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(faqsToShow.map((faq) => faq.category))),
  ];

  // Filter FAQs based on selected category
  const filteredFaqs =
    selectedCategory === "all"
      ? faqsToShow
      : faqsToShow.filter((faq) => faq.category === selectedCategory);

  // Get category display name
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case "general":
        return "Général";
      case "technical":
        return "Technique";
      case "billing":
        return "Facturation";
      case "installation":
        return "Installation";
      case "troubleshooting":
        return "Dépannage";
      case "all":
        return "Toutes";
      default:
        return category;
    }
  };

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur notre service
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-300"
            >
              {getCategoryDisplayName(category)}
            </Button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const IconComponent = getCategoryIcon(faq.category);
              return (
                <motion.div
                  key={faq._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem
                    value={faq._id}
                    className="border rounded-lg px-6 py-2 hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left hover:no-underline group">
                      <div className="flex items-start space-x-4">
                        <div className="mt-1 p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {faq.question}
                          </h3>
                          <span className="text-sm text-muted-foreground capitalize">
                            {getCategoryDisplayName(faq.category)}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-2">
                      <div className="ml-16">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                        {faq.tags && faq.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {faq.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </motion.div>

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="p-8 text-center bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Vous ne trouvez pas votre réponse ?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Notre équipe de support est disponible 24/7 pour vous aider.
              Contactez-nous via WhatsApp, email ou chat en direct.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contacter le Support
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <HelpCircle className="mr-2 h-5 w-5" />
                Guide d&apos;installation
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

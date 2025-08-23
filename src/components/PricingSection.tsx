"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Check,
  Star,
  X,
  Zap,
  Crown,
  Rocket,
  Brain,
  type LucideIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "motion/react";
import { type PricingPlan } from "@/sanity";
import { useState } from "react";

// Extended type for fallback plans with additional UI properties
interface ExtendedPricingPlan extends Omit<PricingPlan, "specifications"> {
  planIcon?: LucideIcon;
  planColor?: string;
  specifications?: {
    channels?: string;
    quality?: string; // More flexible than the strict union
    devices?: string;
    support?: string;
  };
}

// Union type for both Sanity and fallback plans
type PlanType = PricingPlan | ExtendedPricingPlan;

interface PricingSectionProps {
  pricingPlans?: PricingPlan[];
}

export function PricingSection({ pricingPlans = [] }: PricingSectionProps) {
  const { toast } = useToast();
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const formatPrice = (plan: PlanType) => {
    const { amount, currency, period } = plan.price;

    const currencySymbol: { [key: string]: string } = {
      EUR: "€",
      USD: "$",
      MAD: "DH",
      GBP: "£",
    };

    const periodText: { [key: string]: string } = {
      monthly: "mois",
      quarterly: "3 mois",
      yearly: "an",
      lifetime: "à vie",
    };

    return {
      amount,
      symbol: currencySymbol[currency] || currency,
      period: periodText[period] || period,
    };
  };

  const handleSubscribe = (plan: PlanType) => {
    if (plan.ctaUrl) {
      window.open(plan.ctaUrl, "_blank");
    } else {
      toast({
        title: "Connexion Quantique Établie",
        description: `Vous avez choisi le plan ${plan.name} - Initialisation du flux neural...`,
      });
    }
  };

  // Enhanced quantum-themed fallback plans
  const fallbackPlans = [
    {
      _id: "quantum-trial",
      _type: "pricing" as const,
      name: "Flux Neural Test",
      description: "Découvrez notre réseau quantique",
      price: {
        amount: 0,
        currency: "EUR" as const,
        period: "monthly" as const,
      },
      isPopular: false,
      isActive: true,
      order: 1,
      ctaText: "Activer le Test",
      planIcon: Zap,
      planColor: "from-cyan-500 to-blue-500",
      features: [
        { feature: "5000+ Flux Neuraux", included: true },
        { feature: "Vision HD Quantique", included: true },
        { feature: "1 Nœud de Connexion", included: true },
        { feature: "Accès Temporel 24h", included: true },
        { feature: "Bibliothèque Restreinte", included: true },
        { feature: "Support IA Basique", included: true },
      ],
      specifications: {
        channels: "5000+",
        quality: "HD",
        devices: "1",
        support: "email",
      },
    },
    {
      _id: "quantum-basic",
      _type: "pricing" as const,
      name: "Neural Basic",
      description: "Connexion standard au réseau",
      price: {
        amount: 45,
        currency: "EUR" as const,
        period: "yearly" as const,
      },
      isPopular: false,
      isActive: true,
      order: 2,
      ctaText: "Connecter",
      planIcon: Crown,
      planColor: "from-green-500 to-emerald-500",
      features: [
        { feature: "15K+ Flux Neuraux", included: true },
        { feature: "Vision 4K Quantique", included: true },
        { feature: "2 Nœuds Simultanés", included: true },
        { feature: "Support Neural 24/7", included: true },
        { feature: "Bibliothèque Étendue", included: true },
        { feature: "Cryptage Militaire", included: true },
      ],
      specifications: {
        channels: "15000+",
        quality: "4K",
        devices: "2",
        support: "email",
      },
    },
    {
      _id: "quantum-premium",
      _type: "pricing" as const,
      name: "Neural Premium",
      description: "Réseau quantique populaire",
      price: {
        amount: 55,
        currency: "EUR" as const,
        period: "yearly" as const,
      },
      isPopular: true,
      isActive: true,
      order: 3,
      ctaText: "Synchroniser",
      planIcon: Rocket,
      planColor: "from-purple-500 to-pink-500",
      features: [
        { feature: "25K+ Flux Quantiques", included: true },
        { feature: "Vision 8K Neural", included: true },
        { feature: "5 Nœuds Parallèles", included: true },
        { feature: "Support IA Avancé", included: true },
        { feature: "Bibliothèque Infinie", included: true },
        { feature: "Flux Premium Exclusifs", included: true },
        { feature: "Stockage Quantique", included: true },
      ],
      specifications: {
        channels: "25000+",
        quality: "8K",
        devices: "5",
        support: "24_7",
      },
    },
    {
      _id: "quantum-ultimate",
      _type: "pricing" as const,
      name: "Neural Ultimate",
      description: "Expérience transcendante",
      price: {
        amount: 75,
        currency: "EUR" as const,
        period: "yearly" as const,
      },
      isPopular: false,
      isActive: true,
      order: 4,
      ctaText: "Transcender",
      planIcon: Brain,
      planColor: "from-orange-500 to-red-500",
      features: [
        { feature: "∞ Flux Omniversels", included: true },
        { feature: "Vision 16K Holistique", included: true },
        { feature: "Nœuds Illimités", included: true },
        { feature: "Support Conscience IA", included: true },
        { feature: "Multivers Complet", included: true },
        { feature: "Événements Temporels", included: true },
        { feature: "Réalité Augmentée", included: true },
        { feature: "Mémoire Éternelle", included: true },
      ],
      specifications: {
        channels: "∞",
        quality: "16K",
        devices: "∞",
        support: "consciousness",
      },
    },
  ];

  // Use dynamic plans if available, otherwise use fallback
  const plansToShow: PlanType[] =
    pricingPlans.length > 0 ? pricingPlans : fallbackPlans;

  return (
    <section
      id="tarifs"
      className="py-32 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden"
    >
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl floating-animation"></div>
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl floating-animation"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 overflow-visible">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 glass-effect rounded-full px-6 py-3 mb-8 backdrop-blur-sm border border-primary/30">
            <Star className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Plans Quantiques
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
            Connexions Neurales
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Choisissez votre niveau d&apos;accès au réseau quantique et
            découvrez des expériences de streaming révolutionnaires
          </p>
        </motion.div>

        {/* Responsive Grid - Adapts to number of plans */}
        <div
          className={`grid gap-6 lg:gap-8 max-w-7xl mx-auto ${
            plansToShow.length === 3
              ? "grid-cols-1 lg:grid-cols-3" // 3 items: single column on mobile, 3 columns on large screens
              : plansToShow.length === 4
              ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4" // 4 items: 1 column on mobile, 2 on medium, 4 on xl
              : plansToShow.length <= 2
              ? "grid-cols-1 lg:grid-cols-2 place-items-center" // 1-2 items: centered layout
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" // 5+ items: flexible grid
          }`}
        >
          {plansToShow.map((plan: PlanType, index: number) => {
            const priceInfo = formatPrice(plan);
            const extendedPlan = plan as ExtendedPricingPlan;
            const PlanIcon = extendedPlan.planIcon || Star;
            const planColor =
              extendedPlan.planColor || "from-primary to-accent";

            return (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                className={`w-full ${
                  plansToShow.length === 3
                    ? "max-w-sm mx-auto"
                    : plansToShow.length <= 2
                    ? "max-w-md mx-auto"
                    : "max-w-sm mx-auto"
                }`}
                onHoverStart={() => setHoveredPlan(plan._id)}
                onHoverEnd={() => setHoveredPlan(null)}
              >
                <Card
                  className={`p-6 lg:p-8 w-full h-full flex flex-col relative transition-all duration-500 glass-effect border overflow-hidden group min-h-[650px] ${
                    plan.isPopular
                      ? "border-2 border-accent/60 shadow-glow scale-[1.02] lg:scale-105"
                      : "border-primary/20 hover:border-accent/40"
                  } ${
                    hoveredPlan === plan._id
                      ? "shadow-cyber"
                      : "hover:shadow-glow"
                  }`}
                >
                  {/* Quantum Background Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${planColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <motion.div
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                      animate={{
                        y: [0, -5, 0],
                        rotateZ: [0, 2, -2, 0],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="bg-gradient-primary text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-glow">
                        <Star className="h-4 w-4 animate-pulse" />
                        <span>NEURAL POPULAIRE</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-6 relative z-10 flex-shrink-0">
                    <motion.div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${planColor} flex items-center justify-center shadow-lg`}
                      animate={
                        hoveredPlan === plan._id
                          ? {
                              rotate: [0, 360],
                              scale: [1, 1.1, 1],
                            }
                          : {}
                      }
                      transition={{ duration: 2, ease: "easeInOut" }}
                    >
                      <PlanIcon className="h-8 w-8 text-white" />
                    </motion.div>

                    <h3
                      className={`text-2xl font-bold mb-2 transition-colors ${
                        hoveredPlan === plan._id
                          ? "text-primary text-glow"
                          : "text-foreground"
                      }`}
                    >
                      {plan.name}
                    </h3>

                    {plan.description && (
                      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                        {plan.description}
                      </p>
                    )}

                    <div className="mb-4">
                      <motion.div
                        className="relative inline-block"
                        animate={
                          hoveredPlan === plan._id
                            ? { scale: [1, 1.05, 1] }
                            : {}
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span
                          className={`text-3xl lg:text-4xl font-black ${
                            priceInfo.amount === 0
                              ? "text-accent"
                              : "text-primary"
                          }`}
                        >
                          {priceInfo.amount === 0
                            ? "GRATUIT"
                            : priceInfo.amount}
                        </span>
                        {priceInfo.amount > 0 && (
                          <>
                            <span className="text-xl lg:text-2xl text-primary font-bold">
                              {priceInfo.symbol}
                            </span>
                            <span className="text-sm lg:text-base text-muted-foreground font-medium">
                              /{priceInfo.period}
                            </span>
                          </>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  {/* Quantum Specs */}
                  <div className="flex-1 relative z-10 flex flex-col">
                    {plan.specifications && (
                      <div className="mb-6 glass-effect p-4 rounded-2xl border border-primary/20 relative overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
                        <div className="relative z-10">
                          <h4 className="font-bold mb-4 text-sm text-primary uppercase tracking-wider flex items-center">
                            <Zap className="h-4 w-4 mr-2" />
                            Spécifications Quantiques
                          </h4>
                          <div className="space-y-3 text-sm">
                            {plan.specifications.channels && (
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">
                                  Flux Neuraux:
                                </span>
                                <span className="font-bold text-primary">
                                  {plan.specifications.channels}
                                </span>
                              </div>
                            )}
                            {plan.specifications.quality && (
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">
                                  Résolution:
                                </span>
                                <span className="font-bold text-accent">
                                  {plan.specifications.quality}
                                </span>
                              </div>
                            )}
                            {plan.specifications.devices && (
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">
                                  Nœuds:
                                </span>
                                <span className="font-bold text-cyan-400">
                                  {plan.specifications.devices}
                                </span>
                              </div>
                            )}
                            {plan.specifications.support && (
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">
                                  Support:
                                </span>
                                <span className="font-bold text-green-400">
                                  {plan.specifications.support === "24_7"
                                    ? "24/7 Neural"
                                    : plan.specifications.support ===
                                      "consciousness"
                                    ? "Conscience IA"
                                    : plan.specifications.support === "business"
                                    ? "Heures Quantum"
                                    : "Email Basique"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quantum Features */}
                    {plan.features && plan.features.length > 0 && (
                      <ul className="space-y-3 mb-6 flex-1 overflow-hidden">
                        {plan.features
                          .slice(0, 6)
                          .map(
                            (
                              feature: { feature: string; included: boolean },
                              featureIndex: number
                            ) => (
                              <motion.li
                                key={featureIndex}
                                className="flex items-start space-x-3 group"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 0.5,
                                  delay: index * 0.1 + featureIndex * 0.05,
                                }}
                              >
                                {feature.included ? (
                                  <motion.div
                                    className="w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mt-0.5 flex-shrink-0 shadow-sm"
                                    whileHover={{ scale: 1.2, rotate: 180 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Check className="h-3 w-3 text-white" />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    className="w-5 h-5 rounded-full bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center mt-0.5 flex-shrink-0 shadow-sm"
                                    whileHover={{ scale: 1.2, rotate: 180 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <X className="h-3 w-3 text-white" />
                                  </motion.div>
                                )}
                                <span
                                  className={`text-sm leading-relaxed transition-colors group-hover:text-primary ${
                                    feature.included
                                      ? "text-foreground"
                                      : "text-muted-foreground line-through"
                                  }`}
                                >
                                  {feature.feature}
                                </span>
                              </motion.li>
                            )
                          )}
                        {plan.features.length > 6 && (
                          <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-xs">+</span>
                            </div>
                            <span>
                              Et {plan.features.length - 6} autres
                              fonctionnalités
                            </span>
                          </li>
                        )}
                      </ul>
                    )}

                    {/* Quantum Action Button */}
                    <div className="mt-auto">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => handleSubscribe(plan)}
                          className={`w-full py-3 lg:py-4 text-base lg:text-lg font-bold transition-all duration-300 relative overflow-hidden group ${
                            plan.isPopular
                              ? "bg-gradient-primary hover:shadow-glow text-white"
                              : "bg-gradient-to-r from-primary/80 to-accent/80 hover:from-primary hover:to-accent text-white hover:shadow-glow"
                          }`}
                          size="lg"
                        >
                          <span className="relative z-10 flex items-center justify-center">
                            {plan.ctaText}
                            <motion.div
                              className="ml-2"
                              animate={
                                hoveredPlan === plan._id ? { x: [0, 5, 0] } : {}
                              }
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <Zap className="h-5 w-5" />
                            </motion.div>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Neural Network Lines */}
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent to-transparent"></div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quantum Guarantee Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="glass-effect rounded-3xl p-12 border border-primary/20 relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5"></div>

            {/* Floating Particles */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-accent/40 rounded-full"
                  style={{
                    left: `${15 + i * 12}%`,
                    top: `${20 + (i % 2) * 60}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.7,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <motion.h3
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Garantie Quantique 30 Jours
              </motion.h3>
              <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                Testez notre réseau neural sans risque. Satisfaction garantie ou
                remboursement intégral dans les 30 jours suivant votre connexion
                quantique.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Aucun engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Support 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Installation instantanée</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

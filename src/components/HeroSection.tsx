"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Zap, Shield, Globe, Star, Tv, Eye, Wifi } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

const streamingFeatures = [
  {
    title: "Streaming 4K",
    icon: Eye,
    value: "Ultra HD",
    description: "Qualité exceptionnelle",
  },
  {
    title: "Serveurs Rapides",
    icon: Zap,
    value: "24/7",
    description: "Disponibilité garantie",
  },
  {
    title: "Connexion Sécurisée",
    icon: Shield,
    value: "SSL",
    description: "Protection avancée",
  },
  {
    title: "Couverture Mondiale",
    icon: Globe,
    value: "180+",
    description: "Pays disponibles",
  },
];

const channelData = [
  {
    category: "Sport Premium",
    count: "5,000+",
    color: "from-red-500 to-orange-500",
  },
  {
    category: "Cinéma & Séries",
    count: "50,000+",
    color: "from-purple-500 to-pink-500",
  },
  {
    category: "Actualités",
    count: "3,000+",
    color: "from-blue-500 to-cyan-500",
  },
  {
    category: "Enfants",
    count: "2,000+",
    color: "from-green-500 to-emerald-500",
  },
  {
    category: "Documentaires",
    count: "4,000+",
    color: "from-yellow-500 to-amber-500",
  },
];

export function HeroSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % streamingFeatures.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background dark:from-background dark:via-card dark:to-background">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 dark:opacity-30"></div>
        <div className="absolute inset-0 cyber-grid opacity-20 dark:opacity-15"></div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 px-4 py-16 min-h-screen flex items-center">
        {/* Central Hub Layout */}
        <div className="w-full max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="inline-flex items-center gap-3 glass-effect rounded-full px-8 py-4 mb-8 border border-primary/30"
            >
              <Tv className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold uppercase tracking-wider">
                IPTV VIP+
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none"
            >
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))",
                }}
              >
                Monde
              </motion.span>
              <motion.span className="block text-transparent relative">
                {"IPTV".split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      textShadow: [
                        "0 0 3px #3b82f6, 0 0 5px #3b82f6",
                        "0 0 3px #8b5cf6, 0 0 5px #8b5cf6",
                        "0 0 3px #3b82f6, 0 0 5px #3b82f6",
                      ],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      type: "spring",
                      stiffness: 100,
                      textShadow: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                    className="inline-block text-blue-400"
                    style={{
                      filter: "drop-shadow(0 0 5px #3b82f6)",
                      color: "#60a5fa",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12"
            >
              Découvrez l'excellence du streaming avec nos abonnements IPTV
              vip+. Plus de 70000 chaînes, films et séries qualité 4K et service
              client 24/7
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-primary text-white font-bold px-12 py-6 text-xl shadow-cyber pulse-glow relative overflow-hidden group"
                >
                  <a href="#tarifs">
                    <span className="relative z-10 flex items-center gap-3">
                      <Tv className="h-6 w-6" />
                      Choisir mon Abonnement
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </a>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary/50 text-primary hover:bg-primary/10 font-semibold px-12 py-6 text-xl glass-effect"
                >
                  <a href="#tarifs">
                    <Play className="mr-3 h-6 w-6" />
                    Test Gratuit
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Interactive Feature Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
            {streamingFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 1.2 + index * 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                onHoverStart={() => setActiveFeature(index)}
                className={`group cursor-pointer ${
                  activeFeature === index ? "scale-105" : ""
                } transition-transform duration-300`}
              >
                <Card
                  className={`glass-effect p-8 text-center border-2 transition-all duration-500 ${
                    activeFeature === index
                      ? "border-primary/60 shadow-cyber"
                      : "border-border/30 hover:border-primary/40"
                  }`}
                >
                  <motion.div
                    animate={
                      activeFeature === index
                        ? {
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                          }
                        : {}
                    }
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                      activeFeature === index
                        ? "bg-gradient-primary text-white shadow-glow"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </motion.div>

                  <motion.div
                    animate={
                      activeFeature === index ? { scale: [1, 1.05, 1] } : {}
                    }
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`text-4xl font-black mb-2 ${
                      activeFeature === index
                        ? "text-primary text-glow"
                        : "text-foreground"
                    }`}
                  >
                    {feature.value}
                  </motion.div>

                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Channel Categories Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="glass-effect rounded-3xl p-12 border border-primary/20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Catalogue de Chaînes Complet
              </h2>
              <p className="text-xl text-muted-foreground">
                Plus de 70 000 chaînes TV et VOD dans toutes les catégories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {channelData.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 2.3 + index * 0.1,
                    type: "spring",
                    stiffness: 120,
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, 1, 0],
                    transition: { duration: 0.3 },
                  }}
                  className="group"
                >
                  <Card className="glass-effect p-6 border border-border/30 hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                    {/* Animated Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    ></div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-4 h-4 rounded-full bg-gradient-to-r ${category.color}`}
                        ></div>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-8 h-8 border-2 border-primary/20 rounded-full border-t-primary"
                        ></motion.div>
                      </div>

                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {category.category}
                      </h3>

                      <motion.div
                        animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`text-3xl font-black bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
                      >
                        {category.count}
                      </motion.div>

                      <p className="text-muted-foreground text-sm mt-2">
                        Chaînes disponibles
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Live Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.8 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-center"
          >
            {[
              { label: "Clients Satisfaits", value: "1000+", icon: Star },
              { label: "Pays Couverts", value: "180+", icon: Globe },
              { label: "Serveurs Actifs", value: "500+", icon: Zap },
              { label: "Disponibilité", value: "99.9%", icon: Wifi },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 3 + index * 0.2,
                  type: "spring",
                }}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-3 shadow-glow"
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                  className="text-3xl font-black text-primary text-glow"
                >
                  {stat.value}
                </motion.div>
                <p className="text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

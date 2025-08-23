"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Play,
  Zap,
  Shield,
  Globe,
  Star,
  Rocket,
  Eye,
  Wifi,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

const streamingFeatures = [
  {
    title: "Streaming 8K",
    icon: Eye,
    value: "Ultra HD",
    description: "Résolution révolutionnaire",
  },
  {
    title: "Serveurs Quantiques",
    icon: Zap,
    value: "0ms",
    description: "Latence impossible",
  },
  {
    title: "Sécurité Blockchain",
    icon: Shield,
    value: "256-bit",
    description: "Cryptage militaire",
  },
  {
    title: "Réseau Mondial",
    icon: Globe,
    value: "180+",
    description: "Pays connectés",
  },
];

const channelData = [
  {
    category: "Premium Sports",
    count: "5,000+",
    color: "from-red-500 to-orange-500",
  },
  {
    category: "Cinema 8K",
    count: "8,000+",
    color: "from-purple-500 to-pink-500",
  },
  {
    category: "News Global",
    count: "3,000+",
    color: "from-blue-500 to-cyan-500",
  },
  {
    category: "Kids Universe",
    count: "2,000+",
    color: "from-green-500 to-emerald-500",
  },
  {
    category: "Documentaires",
    count: "4,000+",
    color: "from-yellow-500 to-amber-500",
  },
  {
    category: "Music Live",
    count: "1,500+",
    color: "from-indigo-500 to-purple-500",
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
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40"></div>
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
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
              <Rocket className="h-6 w-6 text-primary" />
              <span className="text-primary font-semibold uppercase tracking-wider">
                Technologie Révolutionnaire
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none"
            >
              <span className="block text-foreground">QUANTUM</span>
              <motion.span
                className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-glow"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                STREAM
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12"
            >
              Révolutionnez votre expérience de streaming avec notre plateforme
              alimentée par l'intelligence artificielle et la technologie
              quantique
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
                  size="lg"
                  className="bg-gradient-primary text-white font-bold px-12 py-6 text-xl shadow-cyber pulse-glow relative overflow-hidden group"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Rocket className="h-6 w-6" />
                    Activer Quantum Mode
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary/50 text-primary hover:bg-primary/10 font-semibold px-12 py-6 text-xl glass-effect"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Voir la Démo
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
                Univers de Contenu Illimité
              </h2>
              <p className="text-xl text-muted-foreground">
                Plus de 25 000 chaînes réparties dans 6 univers thématiques
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
              { label: "Utilisateurs Actifs", value: "2.5M+", icon: Star },
              { label: "Pays Couverts", value: "180+", icon: Globe },
              { label: "Serveurs Quantiques", value: "500+", icon: Zap },
              { label: "Uptime Garanti", value: "99.9%", icon: Wifi },
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

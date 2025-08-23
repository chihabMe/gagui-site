"use client";

import { Button } from "@/components/ui/button";
import {
  Zap,
  Shield,
  Eye,
  Cpu,
  Network,
  Infinity as InfinityIcon,
} from "lucide-react";
import { motion } from "motion/react";

const quantumFeatures = [
  {
    icon: Eye,
    title: "Vision 8K Quantique",
    description: "Streaming neural ultra-haute définition",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Latence Subatomique",
    description: "Transmission instantanée 0ms",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Shield,
    title: "Cryptage Militaire",
    description: "Sécurité blockchain avancée",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: InfinityIcon,
    title: "Flux Perpétuel",
    description: "Disponibilité quantique 99.99%",
    color: "from-orange-500 to-red-500",
  },
];

export function QualitySection() {
  return (
    <section className="py-32 bg-gradient-to-b from-background via-card/50 to-background relative overflow-hidden">
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

      <div className="container px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 glass-effect rounded-full px-6 py-3 mb-8 backdrop-blur-sm border border-primary/30">
              <Cpu className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Technologie Quantique
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
              Réseau Neural Avancé
            </h2>

            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Notre plateforme quantique révolutionnaire vous connecte à plus de
              25 000 flux de données avec une technologie de streaming neural
              ultra-avancée et une architecture de serveurs décentralisée.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {quantumFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="glass-effect p-6 rounded-2xl border border-primary/20 hover:border-accent/50 transition-all duration-300 hover:shadow-glow relative overflow-hidden">
                    {/* Quantum Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    ></div>

                    <div className="relative z-10 flex items-start space-x-4">
                      <motion.div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <feature.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Neural Network Effect */}
                    <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                      <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent to-transparent"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg font-semibold px-8 py-4 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Découvrir la Technologie
                  <Network className="h-5 w-5 ml-2 group-hover:rotate-180 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </motion.div>
          </motion.div>

          {/* Visual Section */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Main Quantum Hub */}
              <motion.div
                className="glass-effect rounded-3xl p-8 border border-primary/20 shadow-cyber relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Holographic Core */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl relative overflow-hidden border border-primary/30">
                  {/* Central Quantum Core */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-32 h-32 bg-gradient-primary rounded-full shadow-glow relative"
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        rotate: {
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        scale: { duration: 4, repeat: Infinity },
                      }}
                    >
                      <div className="absolute inset-4 border-2 border-white/30 rounded-full"></div>
                      <div className="absolute inset-8 bg-white/20 rounded-full flex items-center justify-center">
                        <motion.div
                          animate={{ rotateY: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="text-4xl"
                        >
                          🌌
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Quantum Particles */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-accent rounded-full shadow-glow"
                      style={{
                        left: `${20 + (i % 4) * 20}%`,
                        top: `${20 + Math.floor(i / 4) * 20}%`,
                      }}
                      animate={{
                        scale: [0.5, 1.5, 0.5],
                        opacity: [0.3, 1, 0.3],
                        x: [0, Math.sin(i) * 20, 0],
                        y: [0, Math.cos(i) * 20, 0],
                      }}
                      transition={{
                        duration: 3 + (i % 3),
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}

                  {/* Data Streams */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`stream-${i}`}
                      className="absolute h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                      style={{
                        width: "100%",
                        top: `${15 + i * 15}%`,
                        left: 0,
                      }}
                      animate={{
                        scaleX: [0, 1, 0],
                        opacity: [0, 0.8, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>

                {/* Floating Stats */}
                <motion.div
                  className="absolute top-6 left-6 glass-effect rounded-xl p-4 border border-primary/20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="w-3 h-3 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm font-bold text-primary">
                      QUANTIQUE
                    </span>
                  </div>
                  <motion.p
                    className="text-2xl font-bold text-accent mt-1"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    25K+
                  </motion.p>
                  <p className="text-xs text-muted-foreground">Flux Actifs</p>
                </motion.div>

                <motion.div
                  className="absolute bottom-6 right-6 glass-effect rounded-xl p-4 border border-accent/20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <p className="text-sm font-bold text-accent">RÉSOLUTION</p>
                  <motion.p
                    className="text-2xl font-bold text-primary"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(139, 92, 246, 0.5)",
                        "0 0 20px rgba(139, 92, 246, 0.8)",
                        "0 0 10px rgba(139, 92, 246, 0.5)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    8K HDR
                  </motion.p>
                  <p className="text-xs text-muted-foreground">Ultra Neural</p>
                </motion.div>
              </motion.div>

              {/* Orbiting Elements */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`orbit-${i}`}
                  className="absolute w-16 h-16 glass-effect rounded-2xl p-3 border border-primary/20 shadow-cyber"
                  style={{
                    top: `${20 + i * 25}%`,
                    right: i % 2 === 0 ? "-8%" : "-12%",
                  }}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, i % 2 === 0 ? -10 : 10, 0],
                    rotateY: [0, 360],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    delay: i * 0.7,
                  }}
                >
                  <div className="w-full h-full bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {["4K", "8K", "16K"][i]}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

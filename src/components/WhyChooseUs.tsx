"use client";

import { Card } from "@/components/ui/card";
import {
  Tv,
  Headphones,
  Smartphone,
  HelpCircle,
  Zap,
  Users,
  Brain,
  Atom,
  Orbit,
  Cpu,
  Network,
  Eye,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const quantumFeatures = [
  {
    icon: Eye,
    title: "Vision Neurale 8K",
    description: "Streaming 8K avec enhancement quantique et IA upscaling",
    position: "top-left",
    color: "from-purple-500 to-pink-500",
    angle: 0,
  },
  {
    icon: Brain,
    title: "Support Neural 24/7",
    description: "Assistance instantanée par réseau neural et experts",
    position: "top-right",
    color: "from-cyan-500 to-blue-500",
    angle: 60,
  },
  {
    icon: Atom,
    title: "+25K Dimensions",
    description: "Bibliothèque quantique de contenu multidimensionnel",
    position: "middle-left",
    color: "from-green-500 to-emerald-500",
    angle: 120,
  },
  {
    icon: Orbit,
    title: "Holographie Mobile",
    description: "Expérience immersive AR sur tous vos appareils",
    position: "middle-right",
    color: "from-orange-500 to-red-500",
    angle: 180,
  },
  {
    icon: Cpu,
    title: "Install Quantique",
    description: "Configuration automatique par intelligence quantique",
    position: "bottom-left",
    color: "from-indigo-500 to-purple-500",
    angle: 240,
  },
  {
    icon: Network,
    title: "Vitesse Subatomique",
    description: "Serveurs quantiques pour transmission instantanée",
    position: "bottom-right",
    color: "from-pink-500 to-rose-500",
    angle: 300,
  },
];

export function WhyChooseUs() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <section className="py-32 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl floating-animation"></div>
        <div
          className="absolute bottom-40 right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl floating-animation"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Quantum Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="container px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 glass-effect rounded-full px-6 py-3 mb-8 backdrop-blur-sm border border-primary/30">
            <Atom className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Écosystème Quantique
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
            Réseau Neural Avancé
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Découvrez l'avenir du streaming avec notre technologie quantique et
            expérience immersive de nouvelle génération
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Central Quantum Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-80 h-80 relative hidden lg:flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {/* Rotating Outer Ring */}
              <motion.div
                className="absolute inset-0 border-2 border-primary/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />

              {/* Rotating Inner Ring */}
              <motion.div
                className="absolute inset-8 border border-accent/40 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />

              {/* Central Hub */}
              <motion.div
                className="w-48 h-48 glass-effect rounded-full flex items-center justify-center shadow-glow border border-primary/20 relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-primary opacity-20"></div>
                <div className="relative z-10 text-center text-white">
                  <motion.div
                    className="text-6xl mb-3"
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    🌌
                  </motion.div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                    Quantum Hub
                  </h3>
                  <p className="text-sm text-white/80">Neural Network Core</p>
                </div>

                {/* Pulsing Core */}
                <motion.div
                  className="absolute inset-16 bg-gradient-primary rounded-full opacity-30"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Feature cards positioned around the quantum core */}
          <div className="relative h-auto lg:h-[600px]">
            {/* Mobile grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
              {quantumFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onHoverStart={() => setActiveFeature(index)}
                  onHoverEnd={() => setActiveFeature(null)}
                >
                  <Card className="w-full p-8 glass-effect shadow-cyber hover:shadow-glow transition-all duration-500 hover:scale-105 border border-primary/20 hover:border-accent/50 relative overflow-hidden group">
                    {/* Quantum Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    ></div>

                    <div className="relative z-10 text-center">
                      <motion.div
                        className={`mb-6 w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Neural Network Lines */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                      <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent to-transparent"></div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Desktop quantum orbital layout */}
            <div className="hidden lg:block">
              {quantumFeatures.map((feature, index) => {
                const radius = 280;
                const angleRad = (feature.angle * Math.PI) / 180;
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;

                return (
                  <motion.div
                    key={feature.title}
                    className="absolute w-72"
                    style={{
                      left: `calc(50% + ${x}px - 144px)`,
                      top: `calc(50% + ${y}px - 120px)`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: 0.8 + index * 0.15,
                      type: "spring",
                      stiffness: 100,
                    }}
                    onHoverStart={() => setActiveFeature(index)}
                    onHoverEnd={() => setActiveFeature(null)}
                  >
                    <Card
                      className={`p-8 glass-effect shadow-cyber transition-all duration-500 border hover:shadow-glow relative overflow-hidden group ${
                        activeFeature === index
                          ? "scale-110 border-accent/60"
                          : "border-primary/20 hover:border-accent/40"
                      }`}
                    >
                      {/* Quantum Background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
                      ></div>

                      {/* Quantum Connection Line */}
                      <motion.div
                        className="absolute w-px bg-gradient-to-b from-primary/30 to-transparent"
                        style={{
                          height: "100px",
                          left: "50%",
                          top: y > 0 ? "-100px" : "100%",
                          transformOrigin: "center",
                        }}
                        animate={
                          activeFeature === index
                            ? {
                                scaleY: [1, 1.5, 1],
                                opacity: [0.3, 0.8, 0.3],
                              }
                            : {}
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                      />

                      <div className="relative z-10 text-center">
                        <motion.div
                          className={`mb-6 w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}
                          animate={
                            activeFeature === index
                              ? {
                                  rotate: [0, 360],
                                  scale: [1, 1.2, 1],
                                }
                              : {}
                          }
                          transition={{ duration: 2, ease: "easeInOut" }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <feature.icon className="h-8 w-8 text-white" />
                        </motion.div>

                        <h3
                          className={`text-xl font-bold mb-3 transition-colors ${
                            activeFeature === index
                              ? "text-primary text-glow"
                              : "text-foreground group-hover:text-primary"
                          }`}
                        >
                          {feature.title}
                        </h3>

                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>

                      {/* Orbiting Particle */}
                      <motion.div
                        className="absolute w-2 h-2 bg-accent rounded-full shadow-glow"
                        animate={{
                          rotate: 360,
                          scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                          rotate: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                          },
                          scale: {
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3,
                          },
                        }}
                        style={{
                          left: "50%",
                          top: "20%",
                          transformOrigin: "0 120px",
                        }}
                      />

                      {/* Neural Network Lines */}
                      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent to-transparent"></div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quantum Statistics */}
        <motion.div
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          {[
            { value: "99.99%", label: "Quantum Uptime", icon: Zap },
            { value: "0ms", label: "Latence Neural", icon: Brain },
            { value: "∞", label: "Capacité Flux", icon: Orbit },
            { value: "24/7", label: "Support IA", icon: Cpu },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 1.8 + index * 0.1,
                type: "spring",
              }}
              className="group"
            >
              <div className="glass-effect p-6 rounded-2xl border border-primary/20 hover:border-accent/50 transition-all duration-300 hover:shadow-glow">
                <motion.div
                  className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </motion.div>

                <motion.div
                  className="text-3xl font-bold text-primary mb-2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                >
                  {stat.value}
                </motion.div>

                <p className="text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import { Zap, Brain, Atom, Orbit, Cpu, Network, Eye } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const quantumFeatures = [
  {
    icon: Eye,
    title: "Vision Ultra 4K/8K",
    description:
      "Streaming haute définition avec technologie d'amélioration visuelle",
    position: "top-left",
    color: "from-purple-500 to-pink-500",
    angle: 0,
  },
  {
    icon: Brain,
    title: "Support Expert 24/7",
    description:
      "Assistance technique professionnelle disponible en permanence",
    position: "top-right",
    color: "from-cyan-500 to-blue-500",
    angle: 60,
  },
  {
    icon: Atom,
    title: "+25 000 Chaînes",
    description: "Catalogue complet de chaînes internationales et locales",
    position: "middle-left",
    color: "from-green-500 to-emerald-500",
    angle: 120,
  },
  {
    icon: Orbit,
    title: "Multi-Appareils",
    description: "Compatible avec tous vos appareils mobiles et TV",
    position: "middle-right",
    color: "from-orange-500 to-red-500",
    angle: 180,
  },
  {
    icon: Cpu,
    title: "Installation Simple",
    description: "Configuration automatique et guide d'installation intuitif",
    position: "bottom-left",
    color: "from-indigo-500 to-purple-500",
    angle: 240,
  },
  {
    icon: Network,
    title: "Serveurs Rapides",
    description: "Infrastructure réseau optimisée pour un streaming fluide",
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

      {/* Quantum Particles */}
    </section>
  );
}

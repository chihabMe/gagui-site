"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Star, Tv } from "lucide-react";

const channels = [
  { name: "beIN SPORTS", logo: "🏆", category: "Sport", popular: true },
  { name: "CANAL+", logo: "📺", category: "Premium", popular: true },
  { name: "Disney+", logo: "🏰", category: "Enfants", popular: true },
  { name: "CNN", logo: "📰", category: "Actualités", popular: false },
  { name: "FOX", logo: "🦊", category: "International", popular: false },
  { name: "TF1", logo: "1️⃣", category: "Généraliste", popular: true },
  { name: "France 2", logo: "2️⃣", category: "Généraliste", popular: true },
  { name: "M6", logo: "6️⃣", category: "Généraliste", popular: true },
  { name: "Arte", logo: "🎨", category: "Culture", popular: false },
  {
    name: "National Geographic",
    logo: "🌍",
    category: "Documentaire",
    popular: true,
  },
];

export function PopularChannels() {
  return (
    <section
      id="chaines"
      className="py-32 bg-gradient-to-b from-background via-card to-background relative overflow-hidden"
    >
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-30"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl floating-animation"></div>
        <div
          className="absolute bottom-40 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl floating-animation"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="container px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 glass-effect rounded-full px-6 py-3 mb-8 backdrop-blur-sm border border-primary/30">
            <Tv className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Contenu Exclusif
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
            Chaînes Premium
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explorez notre galaxie de contenu avec plus de 70 000 chaînes
            ultra-HD et une expérience de streaming révolutionnaire
          </p>
        </motion.div>

        {/* Channels Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-6 mb-12">
          {channels.map((channel, index) => (
            <motion.div
              key={channel.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group"
            >
              <div className="glass-effect rounded-2xl p-6 shadow-cyber hover:shadow-glow transition-all duration-500 hover:scale-110 text-center border border-primary/20 hover:border-accent/50 relative overflow-hidden group">
                {/* Holographic Background */}
                <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="h-full w-full rounded-2xl bg-card"></div>
                </div>

                <div className="relative z-10">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {channel.logo}
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {channel.name}
                  </p>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                  >
                    {channel.category}
                  </Badge>
                  {channel.popular && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 rounded-2xl p-8 border border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Plus de 70,000 chaînes vous attendent
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Sport, cinéma, séries, documentaires... Explorez notre catalogue
                complet de chaînes françaises et internationales en HD et 4K.
              </p>
              <Link href="/channels">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg font-semibold px-8 py-3 group"
                >
                  Voir toutes les chaînes
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { Check, PlayCircle } from "lucide-react";

const streamingPlayers = [
  {
    name: "Smarters Pro",
    logo: "🎯",
    platforms: ["Android", "iOS", "Smart TV"],
    featured: true,
    description: "Le lecteur le plus populaire et fiable",
  },
  {
    name: "XC Player",
    logo: "⚡",
    platforms: ["Android", "iOS", "Smart TV"],
    featured: true,
    description: "Interface moderne avec fonctionnalités avancées",
  },
  {
    name: "SmartOne Player",
    logo: "📱",
    platforms: ["Android", "iOS", "Android TV"],
    featured: true,
    description: "Lecteur rapide et intuitif",
  },
  {
    name: "IBO Player",
    logo: "📱",
    platforms: ["Android", "iOS", "Smart TV"],
    featured: true,
    description: "Lecteur simple et efficace",
  },
  {
    name: "Smart TV Player",
    logo: "📺",
    platforms: ["Samsung TV", "LG TV"],
    featured: true,
    description: "Spécialement conçu pour Smart TV",
  },
];

export function StreamingPlayersSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-4">
            <PlayCircle className="w-4 h-4 mr-2" />
            Compatibilité
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Compatible avec tous les lecteurs multimédia
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Notre service de streaming fonctionne parfaitement avec tous les
            lecteurs populaires. Choisissez votre application préférée et
            commencez à regarder instantanément.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {streamingPlayers.map((player, index) => (
            <motion.div
              key={player.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className={`p-6 h-full shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 ${
                  player.featured ? "border-primary/50 bg-primary/5" : "bg-card"
                }`}
              >
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{player.logo}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{player.name}</h3>
                    {player.featured && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Recommandé
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4">
                  {player.description}
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Plateformes supportées:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {player.platforms.map((platform) => (
                      <Badge
                        key={platform}
                        variant="secondary"
                        className="text-xs"
                      >
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center text-sm text-green-600">
                    <Check className="w-4 h-4 mr-2" />
                    100% Compatible
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center bg-gradient-primary rounded-2xl p-8 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-4">
            Installation simple en 3 étapes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold mb-2">Téléchargez l&apos;app</h4>
              <p className="text-sm opacity-90">
                Installez votre lecteur préféré depuis l&apos;App Store
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-xl">2</span>
              </div>
              <h4 className="font-semibold mb-2">Ajoutez vos identifiants</h4>
              <p className="text-sm opacity-90">
                Entrez l&apos;URL M3U et les identifiants que nous vous
                fournissons
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold mb-2">Profitez du contenu</h4>
              <p className="text-sm opacity-90">
                Regardez immédiatement plus de 25 000 chaînes et films
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

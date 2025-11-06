"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react"; // IGNORE
import { Film, Tv, Trophy, Star, Play, Globe } from "lucide-react";

const contentCategories = [
  {
    icon: Film,
    title: "Films & Cinéma",
    count: "50,000+",
    description: "Dernières sorties, classiques et films du monde entier",
    features: [
      "Nouveautés 2025",
      "Films classiques",
      "Cinéma mondial",
      "Documentaires",
    ],
    gradient: "from-red-500 to-pink-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
  },
  {
    icon: Tv,
    title: "Séries TV",
    count: "8,500+",
    description: "Séries populaires, épisodes complets et saisons entières",
    features: [
      "Séries Netflix",
      "HBO Originals",
      "Séries françaises",
      "Animes",
    ],
    gradient: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    icon: Trophy,
    title: "Sport en Direct",
    count: "500+",
    description: "Événements sportifs en direct et replays",
    features: ["Football", "Basketball", "Tennis", "Formule 1"],
    gradient: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
];

export function ContentLibrarySection() {
  return (
    <section className="py-8 md:py-14 bg-background">
      <div className="container px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-4">
            <Globe className="w-4 h-4 mr-2" />
            Contenu Illimité
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Plus de 70,000 contenus à votre disposition
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez notre vaste bibliothèque de films, séries TV et événements
            sportifs en direct. Du divertissement sans fin, disponible 24h/24 et
            7j/7.
          </p>
        </motion.div>

        {/* Main Content Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contentCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                className={`p-6 h-full ${category.bgColor} border-l-4 border-l-primary hover:shadow-glow transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`p-3 rounded-full bg-gradient-to-r ${category.gradient} text-white mr-4`}
                  >
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{category.title}</h3>
                    <p className="text-2xl font-bold text-primary">
                      {category.count}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>

                <div className="space-y-2">
                  {category.features.map((feature) => (
                    <div key={feature} className="flex items-center text-sm">
                      <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Live Events */}
        {/* <motion.div
          className="bg-gradient-primary rounded-2xl p-8 text-white mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Événements Sportifs en Direct
              </h3>
              <p className="opacity-90">
                Ne ratez plus jamais vos matchs préférés
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium">EN DIRECT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {liveEvents.map((event) => (
              <div
                key={event.name}
                className="bg-white/10 text-black rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={event.live ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {event.live ? "LIVE" : event.date}
                  </Badge>
                  <Clock className="w-4 h-4 opacity-70" />
                </div>
                <h4 className="font-semibold text-sm mb-1">{event.name}</h4>
                <p className="text-xs opacity-80">{event.time}</p>
              </div>
            ))}
          </div>
        </motion.div> */}

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-muted/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Accès instantané à tout ce contenu
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Avec un seul abonnement mondeTV VIP+, débloquez l&apos;accès à
              notre bibliothèque complète. Films récents, séries populaires et
              sports en direct, tout en qualité HD/4K.
            </p>
            <div className="flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-primary hover:opacity-90"
              >
                <a href="#tarifs">
                  <Play className="w-4 h-4 mr-2" />
                  Commencer maintenant
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

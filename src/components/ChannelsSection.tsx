"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tv,
  Search,
  Star,
  Play,
  Film,
  Trophy,
  Globe,
  Music,
  Baby,
  BookOpen,
  Zap,
  Heart,
  Users,
  Clock,
} from "lucide-react";
import Link from "next/link";
import channelsData from "@/data/channels.json";

interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  quality: "HD" | "4K" | "FHD";
  language: string;
  description: string;
  popular: boolean;
  premium: boolean;
}

// Import channels data from JSON file
const channels: Channel[] = channelsData.channels.map((c) => ({
  ...c,
  quality: (["HD", "4K", "FHD"].includes(c.quality) ? c.quality : "HD") as
    | "HD"
    | "4K"
    | "FHD",
}));

// Categories with dynamic counts
const categories = [
  { id: "all", name: "Toutes", icon: Tv, count: channels.length },
  {
    id: "popular",
    name: "Populaires",
    icon: Star,
    count: channels.filter((c) => c.popular).length,
  },
  {
    id: "generaliste",
    name: "Généralistes",
    icon: Users,
    count: channels.filter((c) => c.category === "generaliste").length,
  },
  {
    id: "sport",
    name: "Sport",
    icon: Trophy,
    count: channels.filter((c) => c.category === "sport").length,
  },
  {
    id: "cinema",
    name: "Cinéma",
    icon: Film,
    count: channels.filter((c) => c.category === "cinema").length,
  },
  {
    id: "series",
    name: "Séries",
    icon: Play,
    count: channels.filter((c) => c.category === "series").length,
  },
  {
    id: "enfants",
    name: "Enfants",
    icon: Baby,
    count: channels.filter((c) => c.category === "enfants").length,
  },
  {
    id: "documentaire",
    name: "Documentaires",
    icon: BookOpen,
    count: channels.filter((c) => c.category === "documentaire").length,
  },
  {
    id: "musique",
    name: "Musique",
    icon: Music,
    count: channels.filter((c) => c.category === "musique").length,
  },
  {
    id: "actualites",
    name: "Actualités",
    icon: Globe,
    count: channels.filter((c) => c.category === "actualites").length,
  },
  {
    id: "international",
    name: "International",
    icon: Globe,
    count: channels.filter((c) => c.category === "international").length,
  },
  {
    id: "culture",
    name: "Culture",
    icon: BookOpen,
    count: channels.filter((c) => c.category === "culture").length,
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    icon: Heart,
    count: channels.filter((c) => c.category === "lifestyle").length,
  },
];

export function ChannelsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter channels based on active category and search
  const filteredChannels = channels.filter((channel) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "popular" && channel.popular) ||
      channel.category === selectedCategory;

    const matchesSearch = channel.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-background via-muted/10 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 border border-primary/20 rounded-full px-3 py-2 mb-4 sm:mb-6">
            <Tv className="h-4 w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              Plus de 50,000 Chaînes
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent px-4">
            Toutes vos chaînes préférées
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez notre collection complète de chaînes françaises et
            internationales. Sport, cinéma, séries, documentaires et bien plus
            en HD/4K.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-12 px-4"
        >
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              type="text"
              placeholder="Rechercher une chaîne..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-base sm:text-lg bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 rounded-xl shadow-lg"
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 sm:mb-12"
        >
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-13 gap-2 h-auto p-2 bg-muted/50 backdrop-blur-sm rounded-xl overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg min-w-0 whitespace-nowrap"
                >
                  <category.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs font-medium truncate w-full text-center">
                    {category.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-xs px-1 py-0 min-w-0"
                  >
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Channels Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
        >
          {filteredChannels.map((channel, index) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 * index }}
            >
              <Card className="group h-full bg-gradient-to-br from-background to-muted/20 border-border/40 hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-4 sm:p-6">
                  {/* Channel Header */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-lg flex-shrink-0">
                        {channel.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors truncate">
                          {channel.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {channel.language}
                        </p>
                      </div>
                    </div>
                    {channel.popular && (
                      <Badge className="bg-gradient-primary text-white flex-shrink-0 ml-2">
                        <Star className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Populaire</span>
                      </Badge>
                    )}
                  </div>

                  {/* Channel Info */}
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {channel.description}
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <Badge
                          variant={
                            channel.quality === "4K" ? "default" : "secondary"
                          }
                          className={
                            channel.quality === "4K"
                              ? "bg-gradient-primary text-white text-xs"
                              : "text-xs"
                          }
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {channel.quality}
                        </Badge>
                        {channel.premium && (
                          <Badge
                            variant="outline"
                            className="border-yellow-500 text-yellow-600 text-xs"
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Premium</span>
                          </Badge>
                        )}
                      </div>
                      <Clock className="h-4 w-4 text-green-500 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredChannels.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Aucune chaîne trouvée</h3>
            <p className="text-muted-foreground mb-6">
              Essayez de modifier vos critères de recherche ou sélectionnez une
              autre catégorie.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="bg-gradient-primary hover:shadow-glow"
            >
              Réinitialiser les filtres
            </Button>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Card className="p-8 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Prêt à profiter de toutes ces chaînes ?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
                Accédez instantanément à plus de 50,000 chaînes en HD et 4K.
                Installation rapide sur tous vos appareils.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg font-semibold px-8 py-3"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Commencer maintenant
                  </Button>
                </Link>
                <Link href="/#tarifs">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 text-lg font-semibold px-8 py-3 w-full"
                  >
                    Voir les tarifs
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";

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

export function ChannelCatalogSection() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background dark:from-background dark:via-card dark:to-background">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30 dark:opacity-20"></div>
      </div>

      <div className="container relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Channel Categories Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="glass-effect rounded-3xl p-12 border border-primary/20"
          >
            <div className="text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              >
                Catalogue de Chaînes Complet
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-xl text-muted-foreground"
              >
                Plus de 70 000 chaînes TV et VOD dans toutes les catégories
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {channelData.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + index * 0.1,
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
                        animate={{ scale: [1, 1.1, 1] }}
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
        </div>
      </div>
    </section>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, User, Clock, ArrowRight, BookOpen, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import { getImageUrl, type PostPreview } from "@/sanity";

// Type for fallback articles
interface FallbackArticle {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  category: string;
  slug: string;
}

// Type for mixed articles (Sanity posts or fallback)
type ArticleType = PostPreview | FallbackArticle;

// Fallback articles for when Sanity is not configured or fails
const fallbackArticles: FallbackArticle[] = [
  {
    title: "Neural Networks in Streaming Technology",
    excerpt:
      "Découvrez comment l'IA révolutionne l'expérience de streaming IPTV avec des algorithmes quantiques avancés.",
    date: "15 Jan 2024",
    author: "Quantum Expert",
    image: "🧠",
    category: "Technologie",
    slug: "neural-networks-streaming",
  },
  {
    title: "Flux Quantiques: L'Avenir du Sport",
    excerpt:
      "Explorez les nouveaux horizons du streaming sportif avec des connexions neurales ultra-rapides.",
    date: "12 Jan 2024",
    author: "Neural Analyst",
    image: "⚡",
    category: "Sport",
    slug: "flux-quantiques-sport",
  },
  {
    title: "Cryptage Holographique Avancé",
    excerpt:
      "Plongez dans les technologies de sécurité quantique qui protègent vos flux neuraux.",
    date: "10 Jan 2024",
    author: "Cyber Security",
    image: "🛡️",
    category: "Sécurité",
    slug: "cryptage-holographique",
  },
  {
    title: "Réalité Augmentée et IPTV 5.0",
    excerpt:
      "L'évolution vers des expériences immersives avec la réalité augmentée quantique.",
    date: "8 Jan 2024",
    author: "Future Tech",
    image: "🌌",
    category: "Innovation",
    slug: "realite-augmentee-iptv",
  },
];

interface BlogSectionProps {
  posts?: PostPreview[];
}

export function BlogSection({ posts = [] }: BlogSectionProps) {
  // Use fallback articles if no Sanity posts are available
  const articlesToShow: ArticleType[] =
    posts.length > 0 ? posts : fallbackArticles;

  // Type guard to check if article is a Sanity post
  const isSanityPost = (article: ArticleType): article is PostPreview => {
    return "_id" in article && "publishedAt" in article;
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to calculate reading time
  // const getReadingTime = (content: any): number => {
  //   // Simple reading time calculation - can be improved
  //   if (!content) return 5;
  //   const words = JSON.stringify(content).split(/\s+/).length;
  //   return Math.ceil(words / 200); // Average reading speed
  // };
  return (
    <section
      id="blog"
      className="py-32 bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden"
    >
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

      <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 glass-effect rounded-full px-6 py-3 mb-8 backdrop-blur-sm border border-primary/30">
            <BookOpen className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Archives Neurales
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-cyan-400 bg-clip-text text-transparent">
            Codex Quantique
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Explorez nos archives de connaissances quantiques et découvrez les
            secrets du streaming neural de nouvelle génération
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {articlesToShow.map((article, index) => {
            // Handle both Sanity posts and fallback articles with type safety
            const isFromSanity = isSanityPost(article);

            const articleSlug = isFromSanity
              ? article.slug.current
              : article.slug;

            const imageUrl =
              isFromSanity && article.mainImage
                ? getImageUrl(article.mainImage, 400, 225)
                : null;

            const authorName =
              isFromSanity && article.author
                ? article.author.name
                : (article as FallbackArticle).author;

            const categoryName =
              isFromSanity && article.categories && article.categories[0]
                ? article.categories[0].title
                : (article as FallbackArticle).category;

            const publishDate = isFromSanity
              ? formatDate(article.publishedAt)
              : (article as FallbackArticle).date;

            const readingTime = isFromSanity
              ? 5 // Default reading time for PostPreview since it doesn't have body content
              : 5;

            return (
              <motion.div
                key={
                  isFromSanity ? article._id : (article as FallbackArticle).slug
                }
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { type: "spring", stiffness: 300, damping: 25 },
                }}
                className="group"
              >
                <Card className="h-full flex flex-col glass-effect border border-primary/20 hover:border-accent/50 overflow-hidden shadow-cyber hover:shadow-glow transition-all duration-500 relative">
                  {/* Holographic Background */}
                  <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                  {/* Neural Network Lines */}
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                    <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent to-transparent"></div>
                  </div>

                  <div className="aspect-video relative overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={article.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/20 to-primary/10"></div>
                        <motion.div
                          className="relative z-10 text-8xl"
                          animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          {(article as FallbackArticle).image || "📝"}
                        </motion.div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Quantum Particles */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-500">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-accent/60 rounded-full"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + (i % 2) * 40}%`,
                          }}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col relative z-10">
                    <div className="flex items-center justify-between text-sm mb-4">
                      <motion.span
                        className="bg-gradient-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-glow"
                        whileHover={{ scale: 1.05 }}
                      >
                        {categoryName}
                      </motion.span>

                      <div className="flex items-center space-x-3 text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="text-xs">{publishDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="text-xs">{readingTime}min</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-bold text-xl mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-300">
                      {article.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">{authorName}</span>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="group/btn hover:bg-primary/10 text-primary hover:text-primary"
                        >
                          <Link
                            href={`${process.env.NEXT_PUBLIC_BLOG_SITE}/posts/${articleSlug}`}
                            className="flex items-center"
                          >
                            Accéder
                            <motion.div
                              className="ml-1"
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </motion.div>
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="glass-effect rounded-3xl p-12 border border-primary/20 relative overflow-hidden max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5"></div>

            {/* Floating Particles */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-accent/40 rounded-full"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 2) * 60}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.7,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <motion.h3
                className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Archives Complètes
              </motion.h3>
              <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                Explorez notre base de données quantique complète avec des
                milliers d'articles sur les technologies neural-streaming.
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg font-semibold px-8 py-4 group relative overflow-hidden"
                >
                  <Link
                    href={`${process.env.NEXT_PUBLIC_BLOG_SITE}`}
                    className="flex items-center"
                  >
                    <span className="relative z-10 flex items-center">
                      Accéder aux Archives
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Zap className="h-5 w-5" />
                      </motion.div>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

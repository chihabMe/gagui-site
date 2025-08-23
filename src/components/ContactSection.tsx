"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Phone,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Globe,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    description: "Envoyez-nous un email",
    contact: "support@iptvpro.fr",
    href: "mailto:support@iptvpro.fr",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Phone,
    title: "Téléphone",
    description: "Appelez-nous directement",
    contact: "+33 1 23 45 67 89",
    href: "tel:+33123456789",
    color: "from-green-500 to-green-600",
  },
  {
    icon: MessageCircle,
    title: "Chat en direct",
    description: "Support instantané",
    contact: "Disponible 24h/7j",
    href: "#chat",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Clock,
    title: "Horaires",
    description: "Support client",
    contact: "Lun-Dim: 8h-22h",
    href: null,
    color: "from-orange-500 to-orange-600",
  },
];

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi du message");
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 lg:py-20 min-h-[80vh] bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 border border-primary/20 rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6">
            <MessageCircle className="h-4 w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              Support 24/7
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            Contactez-nous
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Une question ? Un problème ? Notre équipe est là pour vous aider
            24h/24 et 7j/7
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="xl:col-span-2"
            >
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Informations de contact
                </h3>
                <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Nous sommes disponibles pour répondre à toutes vos questions
                  concernant nos services IPTV Pro.
                </p>
              </div>

              <div className="grid gap-3 sm:gap-4 mb-6 sm:mb-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card className="p-4 sm:p-6 shadow-card hover:shadow-glow transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary bg-gradient-to-r from-background to-muted/20">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div
                          className={`w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r ${info.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <info.icon className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base sm:text-lg mb-1 group-hover:text-primary transition-colors">
                            {info.title}
                          </h4>
                          <p className="text-muted-foreground text-xs sm:text-sm mb-2">
                            {info.description}
                          </p>
                          {info.href ? (
                            <a
                              href={info.href}
                              className="text-primary font-medium hover:underline inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300 text-sm sm:text-base break-all sm:break-normal"
                            >
                              {info.contact}
                              <Globe className="h-3 w-3 opacity-60 flex-shrink-0" />
                            </a>
                          ) : (
                            <span className="text-foreground font-medium flex items-center gap-1 text-sm sm:text-base">
                              {info.contact}
                              <Clock className="h-3 w-3 opacity-60 flex-shrink-0" />
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* FAQ Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 border-primary/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
                  <div className="relative z-10">
                    <h4 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 flex items-center">
                      <MessageCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-primary flex-shrink-0" />
                      Questions fréquentes
                    </h4>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                      Consultez notre FAQ pour des réponses immédiates aux
                      questions les plus courantes.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-lg text-xs sm:text-sm w-full sm:w-auto"
                    >
                      Voir la FAQ
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="xl:col-span-3"
            >
              <Card className="p-4 sm:p-6 lg:p-8 shadow-2xl bg-gradient-to-br from-background via-background to-muted/20 border-border/50 relative overflow-hidden">
                {/* Card decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-50"></div>

                <div className="relative z-10">
                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Send className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                          Envoyez-nous un message
                        </h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      Remplissez le formulaire ci-dessous et nous vous
                      répondrons dans les plus brefs délais.
                    </p>
                  </div>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-8 sm:py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.2,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl"
                      >
                        <CheckCircle className="h-8 sm:h-10 w-8 sm:w-10 text-white" />
                      </motion.div>
                      <h4 className="text-xl sm:text-2xl font-bold text-green-600 mb-2 sm:mb-3">
                        Message envoyé !
                      </h4>
                      <p className="text-muted-foreground text-base sm:text-lg px-4">
                        Merci pour votre message. Nous vous répondrons sous 24h.
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert
                            variant="destructive"
                            className="mb-4 sm:mb-6 border-red-300 bg-red-50/50"
                          >
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="font-medium text-sm">
                              {error}
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}

                      <form
                        onSubmit={handleSubmit}
                        className="space-y-4 sm:space-y-6"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="space-y-2"
                          >
                            <Label
                              htmlFor="name"
                              className="text-sm font-semibold text-foreground"
                            >
                              Nom complet *
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Votre nom complet"
                              required
                              className="border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background/50 backdrop-blur-sm h-10 sm:h-12 text-sm sm:text-base"
                            />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-2"
                          >
                            <Label
                              htmlFor="email"
                              className="text-sm font-semibold text-foreground"
                            >
                              Email *
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="votre@email.com"
                              required
                              className="border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background/50 backdrop-blur-sm h-10 sm:h-12 text-sm sm:text-base"
                            />
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="space-y-2"
                        >
                          <Label
                            htmlFor="subject"
                            className="text-sm font-semibold text-foreground"
                          >
                            Sujet *
                          </Label>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Objet de votre message"
                            required
                            className="border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-background/50 backdrop-blur-sm h-10 sm:h-12 text-sm sm:text-base"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="space-y-2"
                        >
                          <Label
                            htmlFor="message"
                            className="text-sm font-semibold text-foreground"
                          >
                            Message *
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Décrivez votre demande en détail..."
                            required
                            rows={5}
                            className="border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all duration-300 bg-background/50 backdrop-blur-sm text-sm sm:text-base min-h-[120px] sm:min-h-[140px]"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 h-12 sm:h-14 text-base sm:text-lg font-semibold relative overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                Envoi en cours...
                              </>
                            ) : (
                              <>
                                <Send className="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                                Envoyer le message
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </form>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  Check,
  Phone,
  Mail,
  User,
  ExternalLink,
  Loader2,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePostHogCapture } from "@/hooks/use-posthog";
import {
  submitSubscription,
  type SubscriptionFormData,
  type ActionResult,
} from "@/actions/subscription";

interface PlanInfo {
  id: string;
  name: string;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  isPopular?: boolean;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanInfo | null;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  plan,
}: SubscriptionModalProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const capture = usePostHogCapture();

  // Track modal open
  useEffect(() => {
    if (isOpen && plan) {
      capture("subscription_modal_opened", {
        plan_id: plan.id,
        plan_name: plan.name,
        plan_price: plan.price.amount,
        plan_currency: plan.price.currency,
        plan_period: plan.price.period,
        is_popular_plan: plan.isPopular || false,
      });
    }
  }, [isOpen, plan, capture]);

  const formatPrice = (price: PlanInfo["price"]) => {
    const currencySymbol: { [key: string]: string } = {
      EUR: "€",
      USD: "$",
      MAD: "DH",
      GBP: "£",
    };

    const periodText: { [key: string]: string } = {
      monthly: "mois",
      quarterly: "3 mois",
      yearly: "an",
      lifetime: "à vie",
    };

    if (price.amount === 0) return "GRATUIT";

    return `${price.amount}${
      currencySymbol[price.currency] || price.currency
    }/${periodText[price.period] || price.period}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!/^[\+]?[0-9\s\-\(\)]{8,20}$/.test(formData.phone)) {
      newErrors.phone = "Format de téléphone invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!plan || !validateForm()) return;

    const submissionData: SubscriptionFormData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      planId: plan.id,
      planName: plan.name,
      planPrice: plan.price,
    };

    // Track subscription attempt
    capture("subscription_modal_submitted", {
      plan_id: plan.id,
      plan_name: plan.name,
      plan_price: plan.price.amount,
      plan_currency: plan.price.currency,
      plan_period: plan.price.period,
      is_popular_plan: plan.isPopular || false,
    });

    startTransition(async () => {
      try {
        const result: ActionResult = await submitSubscription(submissionData);

        if (result.success && result.whatsappUrl) {
          // Track successful subscription
          capture("subscription_success", {
            plan_id: plan.id,
            plan_name: plan.name,
            plan_price: plan.price.amount,
            redirect_to: "whatsapp",
          });

          toast({
            title: "Demande envoyée avec succès !",
            description:
              "Vous allez être redirigé vers WhatsApp pour finaliser votre abonnement.",
          });

          // Close modal and redirect to WhatsApp
          onClose();
          window.open(result.whatsappUrl, "_blank");

          // Reset form
          setFormData({ name: "", email: "", phone: "" });
          setErrors({});
        } else {
          // Track subscription error
          capture("subscription_error", {
            plan_id: plan.id,
            error: result.error || "Unknown error",
          });

          toast({
            title: "Erreur",
            description: result.error || "Une erreur est survenue",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Submission error:", error);

        // Track unexpected error
        capture("subscription_unexpected_error", {
          plan_id: plan.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });

        toast({
          title: "Erreur",
          description:
            "Une erreur inattendue est survenue. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleClose = () => {
    if (!isPending) {
      onClose();
      setFormData({ name: "", email: "", phone: "" });
      setErrors({});
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-auto glass-effect border border-primary/20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 opacity-50" />

          <DialogHeader className="relative z-10">
            <DialogTitle className="text-center">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center gap-2 mb-2"
              >
                {plan.isPopular && (
                  <Star className="h-5 w-5 text-primary animate-pulse" />
                )}
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Abonnement {plan.name}
                </span>
              </motion.div>
            </DialogTitle>
            <DialogDescription className="text-center">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Complétez vos informations pour souscrire à l&apos;abonnement{" "}
                <span className="font-semibold text-primary">
                  {formatPrice(plan.price)}
                </span>
              </motion.div>
            </DialogDescription>
          </DialogHeader>

          {/* Plan Summary Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative z-10"
          >
            <Card className="p-4 mb-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Plan sélectionné
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(plan.price)}
                  </div>
                  {plan.isPopular && (
                    <div className="text-xs bg-gradient-primary text-white px-2 py-1 rounded-full">
                      Populaire
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-4 relative z-10"
          >
            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4 text-primary" />
                Nom complet
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Votre nom complet"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`transition-all duration-200 ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-primary"
                }`}
                disabled={isPending}
                required
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-500"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-primary" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`transition-all duration-200 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-primary"
                }`}
                disabled={isPending}
                required
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-500"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Phone className="h-4 w-4 text-primary" />
                Téléphone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`transition-all duration-200 ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-primary"
                }`}
                disabled={isPending}
                required
              />
              <AnimatePresence>
                {errors.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-500"
                  >
                    {errors.phone}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3"
            >
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-700 dark:text-green-300">
                  <p className="font-medium mb-1">Prochaines étapes :</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Redirection automatique vers WhatsApp</li>
                    <li>• Finalisation de votre abonnement</li>
                    <li>• Réception des codes d&apos;accès</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-3"
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
                className="flex-1 transition-all duration-300"
                asChild
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Annuler
                </motion.button>
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-gradient-primary hover:shadow-glow text-white font-medium relative overflow-hidden transition-all duration-300 disabled:opacity-90"
              >
                {isPending ? (
                  <>
                    {/* Animated background shimmer */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 relative z-10"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Loader2 className="h-4 w-4" />
                      </motion.div>
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        Envoi en cours...
                      </motion.span>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      animate={{
                        x: [0, 3, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </motion.div>
                    <span>Continuer sur WhatsApp</span>
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/30 rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

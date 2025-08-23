import { Card } from "@/components/ui/card";
import { ShoppingCart, UserCheck, Play } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: ShoppingCart,
    title: "Passer une commande",
    description:
      "Choisissez votre forfait et finalisez votre commande en quelques clics",
  },
  {
    number: "2",
    icon: UserCheck,
    title: "Obtenir votre compte",
    description:
      "Recevez vos identifiants par email et configurez votre compte",
  },
  {
    number: "3",
    icon: Play,
    title: "Profiter du service",
    description:
      "Commencez à regarder vos chaînes et contenus préférés immédiatement",
  },
];

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Comment ça marche?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trois étapes simples pour profiter de votre abonnement IPTV Pro
          </p>
        </div>

        <div className="max-w-5xl mx-auto overflow-hidden">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={step.number} className="text-center relative">
                <Card className="p-8 mb-6 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 transform -translate-y-1/2 right-0 translate-x-1/2 w-8 h-8 items-center justify-center z-10">
                    <div className="text-primary text-2xl">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

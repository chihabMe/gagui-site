import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Testimonial } from "@/sanity/types";

// Fallback testimonials in case Sanity data is not available
const fallbackTestimonials: Testimonial[] = [
  {
    _id: "fallback-1",
    _type: "testimonial",
    _createdAt: "",
    _updatedAt: "",
    _rev: "",
    name: "Marie Benoît",
    rating: 5,
    testimonial:
      "Excellent service ! La qualité d'image est parfaite et le support client très réactif. Je recommande vivement mondeTV.",
    avatar: undefined,
    platform: "other",
    isFeatured: true,
    order: 1,
    submittedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    _id: "fallback-2",
    _type: "testimonial",
    _createdAt: "",
    _updatedAt: "",
    _rev: "",
    name: "David Durant",
    rating: 5,
    testimonial:
      "Plus de 13 000 chaînes, c'est incroyable ! Je trouve tout ce que je veux regarder. L'installation a été très simple.",
    avatar: undefined,
    platform: "other",
    isFeatured: true,
    order: 2,
    submittedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    _id: "fallback-3",
    _type: "testimonial",
    _createdAt: "",
    _updatedAt: "",
    _rev: "",
    name: "Sami Aouad",
    rating: 5,
    testimonial:
      "Le meilleur service que j'ai testé. Aucun problème de buffering et les chaînes sont toujours disponibles.",
    avatar: undefined,
    platform: "other",
    isFeatured: true,
    order: 3,
    submittedAt: new Date().toISOString(),
    isActive: true,
  },
];

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export function Testimonials({
  testimonials = fallbackTestimonials,
}: TestimonialsProps) {
  // Function to get avatar display
  const getAvatarDisplay = (testimonial: Testimonial) => {
    // For now, use a simple emoji based on the name's first letter
    const firstLetter = testimonial.name.charAt(0).toLowerCase();
    const avatarEmojis = {
      a: "👨",
      b: "👩",
      c: "👨‍🦱",
      d: "👨",
      e: "👩‍🦰",
      f: "👨",
      g: "👩",
      h: "👨‍🦱",
      i: "👩",
      j: "👨",
      k: "👩‍🦰",
      l: "👨",
      m: "👩",
      n: "👨‍🦱",
      o: "👩",
      p: "👨",
      q: "👩‍🦰",
      r: "👨",
      s: "👩",
      t: "👨‍🦱",
      u: "👩",
      v: "👨",
      w: "👩‍🦰",
      x: "👨",
      y: "👩",
      z: "👨‍🦱",
    };
    return avatarEmojis[firstLetter as keyof typeof avatarEmojis] || "👤";
  };

  return (
    <section id="avis" className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Ce que disent nos clients</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez les avis de nos utilisateurs satisfaits
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial._id || testimonial.name}
              className="p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">
                  {getAvatarDisplay(testimonial)}
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                &ldquo;{testimonial.testimonial}&rdquo;
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

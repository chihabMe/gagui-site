import { Card } from "@/components/ui/card";
import {
  Monitor,
  Smartphone,
  Tablet,
  Tv,
  Laptop,
  Gamepad2,
} from "lucide-react";

const devices = [
  { name: "Smart TV", icon: Tv, supported: true },
  { name: "Android", icon: Smartphone, supported: true },
  { name: "iOS", icon: Smartphone, supported: true },
  { name: "PC/Mac", icon: Monitor, supported: true },
  { name: "Laptop", icon: Laptop, supported: true },
  { name: "Tablet", icon: Tablet, supported: true },
  { name: "Console", icon: Gamepad2, supported: true },
  { name: "Apple TV", icon: Tv, supported: true },
];

export function DeviceCompatibility() {
  return (
    <section className="py-20 bg-gradient-secondary">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            IPTV Pro utilisable sur tous vos appareils
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Regardez vos contenus préférés où que vous soyez, sur n&apos;importe
            quel appareil
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 max-w-6xl mx-auto mb-12">
          {devices.map((device, index) => (
            <Card
              key={device.name}
              className="p-6 text-center shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <device.icon className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-sm">{device.name}</h3>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-primary/10 rounded-full">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium">
              Compatible avec tous les appareils populaires
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

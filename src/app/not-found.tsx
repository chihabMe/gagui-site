import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="max-w-md w-full text-center p-8">
        <div className="mb-8">
          <div className="text-8xl font-bold text-primary mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page introuvable
          </h1>
          <p className="text-gray-600">
            Désolé, la page que vous recherchez n&apos;existe pas ou a été
            déplacée.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Retour à l&apos;accueil
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/blogs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voir nos articles
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

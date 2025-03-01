import { ReactNode } from 'react';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Section gauche - Formulaire */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Image
              src="/logo.png"
              alt="ClipViral Logo"
              width={48}
              height={48}
              className="mx-auto"
            />
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Bienvenue sur ClipViral
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Créez des vidéos virales en quelques clics
            </p>
          </div>

          {children}
        </div>
      </div>

      {/* Section droite - Image décorative */}
      <div className="hidden md:block relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center space-y-8">
            <h3 className="text-3xl font-bold">
              Transformez vos textes en vidéos captivantes
            </h3>
            <p className="text-lg">
              Utilisez l'IA pour générer des vidéos professionnelles avec des voix
              naturelles et des images uniques
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-semibold">Génération rapide</h4>
                <p className="text-sm mt-2">
                  Créez des vidéos en quelques minutes seulement
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-semibold">Styles variés</h4>
                <p className="text-sm mt-2">
                  Choisissez parmi plusieurs styles visuels
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-semibold">Voix naturelles</h4>
                <p className="text-sm mt-2">
                  Des voix réalistes pour vos vidéos
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-semibold">Export facile</h4>
                <p className="text-sm mt-2">
                  Partagez directement sur les réseaux sociaux
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function Home() {
  const userId = await auth().then(auth => auth.userId);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed w-full border-b bg-white/50 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              ClipViral
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="text-sm hover:text-blue-600">
                Fonctionnalités
              </Link>
              <Link href="#pricing" className="text-sm hover:text-blue-600">
                Tarifs
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {userId ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost">Connexion</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Essayer gratuitement</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto flex min-h-screen items-center justify-center">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center gap-8">
              <h1 className="text-5xl font-bold leading-tight tracking-tighter md:text-6xl">
                Créez des vidéos virales avec l'IA
              </h1>
              <p className="text-xl text-gray-600">
                Transformez vos textes en vidéos captivantes en quelques clics grâce à l'intelligence artificielle.
              </p>
              {userId ? (
                <Button size="lg" asChild className="w-fit">
                  <Link href="/dashboard">Accéder au Dashboard</Link>
                </Button>
              ) : (
                <SignUpButton mode="modal">
                  <Button size="lg" className="w-fit">
                    Commencer gratuitement
                  </Button>
                </SignUpButton>
              )}
            </div>
            <div className="relative hidden md:block">
              {/* Placeholder pour une démo animée ou une image */}
              <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

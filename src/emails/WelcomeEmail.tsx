import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface WelcomeEmailProps {
  name: string;
  credits: number;
}

export default function WelcomeEmail({ name, credits }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenue sur ClipViral - Commencez à créer des vidéos virales !</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-8 px-4">
            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
              {/* Logo */}
              <div className="mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500" />
              </div>

              {/* Content */}
              <Heading className="mb-4 text-2xl font-bold text-gray-900">
                Bienvenue sur ClipViral, {name} ! 👋
              </Heading>

              <Text className="mb-4 text-base text-gray-600">
                Nous sommes ravis de vous accueillir dans la communauté ClipViral. Vous avez maintenant accès à notre plateforme de création de vidéos virales alimentée par l'IA.
              </Text>

              <Text className="mb-6 text-base text-gray-600">
                Pour commencer, vous disposez de <strong>{credits} crédits</strong> gratuits. Chaque crédit vous permet de générer une seconde de vidéo.
              </Text>

              {/* CTA Button */}
              <Link
                href="https://clipviral.ai/dashboard"
                className="inline-block rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-base font-medium text-white hover:from-purple-700 hover:to-pink-600"
              >
                Créer ma première vidéo
              </Link>

              {/* Help Section */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <Text className="text-sm text-gray-500">
                  Besoin d'aide ? N'hésitez pas à consulter notre{' '}
                  <Link href="https://clipviral.ai/help" className="text-purple-600 hover:text-purple-700">
                    centre d'aide
                  </Link>{' '}
                  ou à nous contacter directement à{' '}
                  <Link href="mailto:support@clipviral.ai" className="text-purple-600 hover:text-purple-700">
                    support@clipviral.ai
                  </Link>
                </Text>
              </div>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
} 
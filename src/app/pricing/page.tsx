import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { PLANS } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default async function PricingPage() {
  const { userId } = auth();

  async function createCheckoutSession(priceId: string) {
    'use server';

    if (!userId) {
      return redirect('/sign-in');
    }

    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
      }),
    });

    const { url } = await response.json();
    return redirect(url);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold leading-7 text-blue-600">Tarifs</h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Des tarifs adaptés à vos besoins
        </p>
      </div>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {Object.entries(PLANS).map(([key, plan]) => (
          <div
            key={key}
            className={`relative rounded-2xl p-8 shadow-sm ${
              key === 'PRO' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            <h3
              className={`text-2xl font-semibold leading-7 ${
                key === 'PRO' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {plan.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-4xl font-bold tracking-tight">
                {plan.price}€
              </span>
              {plan.price > 0 && (
                <span className="text-sm font-semibold">/mois</span>
              )}
            </p>
            <p
              className={`mt-6 text-base leading-7 ${
                key === 'PRO' ? 'text-blue-100' : 'text-gray-600'
              }`}
            >
              {plan.credits} crédits par mois
            </p>
            <ul
              className={`mt-8 space-y-4 text-sm leading-6 ${
                key === 'PRO' ? 'text-blue-100' : 'text-gray-600'
              }`}
            >
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <Check
                    className={`h-6 w-5 flex-none ${
                      key === 'PRO' ? 'text-blue-100' : 'text-blue-600'
                    }`}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className={`mt-8 w-full ${
                key === 'PRO'
                  ? 'bg-white text-blue-600 hover:bg-blue-50'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
              onClick={() =>
                key === 'PRO'
                  ? createCheckoutSession(plan.priceId!)
                  : redirect('/dashboard')
              }
            >
              {key === 'FREE' ? "Commencer gratuitement" : "Passer au plan Pro"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 
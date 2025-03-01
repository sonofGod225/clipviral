import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { addCredits } from '@/lib/credits';
import { PLANS } from '@/lib/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse('Missing signature or webhook secret', { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error('No user ID in session metadata');
          return new NextResponse('No user ID in session metadata', { status: 400 });
        }

        // Mettre à jour le plan de l'utilisateur
        await supabaseAdmin
          .from('users')
          .update({
            plan: 'pro',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq('id', userId);

        // Ajouter les crédits du plan Pro
        await addCredits(userId, PLANS.PRO.credits);

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription as string;

        // Trouver l'utilisateur avec cet ID d'abonnement
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('stripe_subscription_id', subscriptionId)
          .single();

        if (!user) {
          console.error('No user found with subscription ID:', subscriptionId);
          return new NextResponse('No user found', { status: 400 });
        }

        // Renouveler les crédits mensuels
        await addCredits(user.id, PLANS.PRO.credits);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        // Trouver l'utilisateur avec cet ID d'abonnement
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (!user) {
          console.error('No user found with subscription ID:', subscription.id);
          return new NextResponse('No user found', { status: 400 });
        }

        // Rétrograder l'utilisateur au plan gratuit
        await supabaseAdmin
          .from('users')
          .update({
            plan: 'free',
            stripe_subscription_id: null,
          })
          .eq('id', user.id);

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return new NextResponse('Webhook error', { status: 400 });
  }
} 
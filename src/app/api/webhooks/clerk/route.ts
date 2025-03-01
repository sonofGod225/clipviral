import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase/client';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
  // Get the headers
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const fullName = [first_name, last_name].filter(Boolean).join(' ');
    const initialCredits = 100; // Défini dans le schéma de la base de données

    try {
      // Créer l'utilisateur dans Supabase
      const { error } = await supabase
        .from('users')
        .insert([
          {
            clerk_id: id,
            email: email,
            full_name: fullName,
          }
        ]);

      if (error) throw error;

      // Envoyer l'email de bienvenue
      await sendWelcomeEmail(email, fullName || 'there', initialCredits);

      return new Response('User created successfully', { status: 201 });
    } catch (error) {
      console.error('Error in user creation process:', error);
      return new Response('Error processing user creation', { status: 400 });
    }
  }

  return new Response('', { status: 200 });
} 
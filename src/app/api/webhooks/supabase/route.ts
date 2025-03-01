import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

interface WebhookEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: any;
  old_record: any;
  schema: string;
}

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const signature = headersList.get('x-signature');

    if (!signature) {
      return new NextResponse('No signature', { status: 401 });
    }

    // TODO: Vérifier la signature du webhook avec un secret partagé

    const payload: WebhookEvent = await req.json();

    // Gérer les différents types d'événements
    switch (payload.type) {
      case 'INSERT':
        // Nouveau projet créé
        if (payload.table === 'projects') {
          // TODO: Déclencher la génération de la vidéo
        }
        break;

      case 'UPDATE':
        // Projet mis à jour
        if (payload.table === 'projects') {
          // TODO: Gérer les mises à jour de statut
        }
        break;

      case 'DELETE':
        // Projet supprimé
        if (payload.table === 'projects') {
          // TODO: Nettoyer les ressources associées
        }
        break;

      default:
        console.log('Unhandled event type:', payload.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Webhook error', { status: 500 });
  }
} 
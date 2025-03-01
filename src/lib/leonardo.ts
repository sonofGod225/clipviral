import { uploadFile, getPublicUrl } from './supabase';

const LEONARDO_API_URL = 'https://cloud.leonardo.ai/api/rest/v1';

export const AVAILABLE_STYLES = {
  'realistic': {
    id: 'style1_id',
    name: 'Réaliste',
    preview_url: '/styles/realistic-preview.jpg',
  },
  'anime': {
    id: 'style2_id',
    name: 'Anime',
    preview_url: '/styles/anime-preview.jpg',
  },
  'cinematic': {
    id: 'style3_id',
    name: 'Cinématique',
    preview_url: '/styles/cinematic-preview.jpg',
  },
  'artistic': {
    id: 'style4_id',
    name: 'Artistique',
    preview_url: '/styles/artistic-preview.jpg',
  },
} as const;

export type StyleId = keyof typeof AVAILABLE_STYLES;

interface GenerateImageOptions {
  prompt: string;
  styleId: StyleId;
  negative_prompt?: string;
  width?: number;
  height?: number;
}

export async function generateImage({
  prompt,
  styleId,
  negative_prompt = '',
  width = 1024,
  height = 576,
}: GenerateImageOptions): Promise<string> {
  if (!process.env.LEONARDO_API_KEY) {
    throw new Error('Missing Leonardo API key');
  }

  const style = AVAILABLE_STYLES[styleId];
  if (!style) {
    throw new Error('Invalid style ID');
  }

  // Créer une génération
  const generationResponse = await fetch(
    `${LEONARDO_API_URL}/generations`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        negative_prompt,
        modelId: style.id,
        width,
        height,
        num_images: 1,
        public: false,
      }),
    }
  );

  if (!generationResponse.ok) {
    const error = await generationResponse.json();
    throw new Error(`Leonardo API error: ${error.message}`);
  }

  const { generationId } = await generationResponse.json();

  // Attendre que la génération soit terminée
  let imageUrl: string | null = null;
  for (let i = 0; i < 30; i++) {
    const statusResponse = await fetch(
      `${LEONARDO_API_URL}/generations/${generationId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
        },
      }
    );

    if (!statusResponse.ok) {
      const error = await statusResponse.json();
      throw new Error(`Leonardo API error: ${error.message}`);
    }

    const { status, generated_images } = await statusResponse.json();
    
    if (status === 'complete' && generated_images?.length > 0) {
      imageUrl = generated_images[0].url;
      break;
    }

    if (status === 'failed') {
      throw new Error('Image generation failed');
    }

    // Attendre 2 secondes avant la prochaine vérification
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  if (!imageUrl) {
    throw new Error('Image generation timed out');
  }

  // Télécharger l'image
  const imageResponse = await fetch(imageUrl);
  const imageBlob = await imageResponse.blob();

  // Générer un nom de fichier unique
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

  // Upload vers Supabase Storage
  await uploadFile('images', fileName, imageBlob);

  // Retourner l'URL publique
  return getPublicUrl('images', fileName);
} 
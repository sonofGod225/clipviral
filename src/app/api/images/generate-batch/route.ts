import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const MAX_CONCURRENT_REQUESTS = 3;

async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Stable Diffusion API error: ${error.message || response.statusText}`);
    }

    const result = await response.json();
    return result.artifacts[0].base64;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

async function processBatch(prompts: string[]): Promise<string[]> {
  try {
    const results = await Promise.all(
      prompts.map(prompt => generateImage(prompt))
    );
    return results;
  } catch (error) {
    console.error('Error processing batch:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer la liste des prompts
    const { prompts } = await request.json();
    if (!prompts || !Array.isArray(prompts)) {
      return NextResponse.json(
        { error: 'Prompts array is required' },
        { status: 400 }
      );
    }

    // Diviser les prompts en lots pour le traitement parallèle
    const batches = [];
    for (let i = 0; i < prompts.length; i += MAX_CONCURRENT_REQUESTS) {
      batches.push(prompts.slice(i, i + MAX_CONCURRENT_REQUESTS));
    }

    // Traiter chaque lot séquentiellement
    const results: string[] = [];
    for (const batch of batches) {
      const batchResults = await processBatch(batch);
      results.push(...batchResults);
    }

    return NextResponse.json({ imageUrls: results });
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate images' },
      { status: 500 }
    );
  }
} 
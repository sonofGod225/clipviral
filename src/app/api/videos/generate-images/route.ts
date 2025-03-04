import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

async function generateImage(prompt: string): Promise<string> {
  const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
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
    throw new Error(`Stable Diffusion API error: ${response.statusText}`);
  }

  const result = await response.json();
  return result.artifacts[0].base64;
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scenes } = await request.json();

    // Générer les images pour chaque scène
    const scenesWithImages = await Promise.all(
      scenes.map(async (scene: { prompt: string }) => {
        const imageUrl = await generateImage(scene.prompt);
        return {
          ...scene,
          imageUrl
        };
      })
    );

    return NextResponse.json({ scenes: scenesWithImages });
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    );
  }
} 
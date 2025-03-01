// Configuration pour Eleven Labs
export const elevenLabsConfig = {
  apiKey: process.env.ELEVEN_LABS_API_KEY,
  baseUrl: 'https://api.elevenlabs.io/v1',
};

// Configuration pour Leonardo
export const leonardoConfig = {
  apiKey: process.env.LEONARDO_API_KEY,
  baseUrl: 'https://cloud.leonardo.ai/api/rest/v1',
};

// Fonction utilitaire pour la génération de voix
export async function generateVoice(text: string, voiceId: string) {
  if (!elevenLabsConfig.apiKey) {
    throw new Error('Missing Eleven Labs API key');
  }

  const response = await fetch(`${elevenLabsConfig.baseUrl}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': elevenLabsConfig.apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate voice');
  }

  return response.arrayBuffer();
}

// Fonction utilitaire pour la génération d'images
export async function generateImage(prompt: string, style: string) {
  if (!leonardoConfig.apiKey) {
    throw new Error('Missing Leonardo API key');
  }

  // Première étape : créer une génération
  const createResponse = await fetch(`${leonardoConfig.baseUrl}/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${leonardoConfig.apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      modelId: 'leonardo-creative-v2',
      num_images: 1,
      width: 1024,
      height: 576,
      promptMagic: true,
      presetStyle: style,
    }),
  });

  if (!createResponse.ok) {
    throw new Error('Failed to create image generation');
  }

  const { generationId } = await createResponse.json();

  // Deuxième étape : attendre et récupérer les résultats
  const getResults = async () => {
    const resultResponse = await fetch(`${leonardoConfig.baseUrl}/generations/${generationId}`, {
      headers: {
        'Authorization': `Bearer ${leonardoConfig.apiKey}`,
      },
    });

    if (!resultResponse.ok) {
      throw new Error('Failed to get generation results');
    }

    const data = await resultResponse.json();
    return data.generations[0]?.url;
  };

  // Attendre que l'image soit générée (avec un timeout de 30 secondes)
  let imageUrl: string | null = null;
  let attempts = 0;
  while (!imageUrl && attempts < 30) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    imageUrl = await getResults();
    attempts++;
  }

  if (!imageUrl) {
    throw new Error('Image generation timed out');
  }

  return imageUrl;
} 
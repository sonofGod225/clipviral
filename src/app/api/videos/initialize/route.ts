import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { formatGeminiPrompt, type PromptSettings, type VisualStyle } from '@/lib/utils/prompt-formatter';
import { createVideo } from '@/lib/db/services/videos';
import { getVisualStyles } from '@/lib/db/services/prompts';
// Initialiser Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Configuration Stable Diffusion
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const MAX_CONCURRENT_REQUESTS = 3;

interface ScriptScene {
  text: string;
  imagePrompt: string;
  duration: string;
}

interface ScriptResponse {
  script: string;
  scenes: ScriptScene[];
}

async function generateScript(prompt: string, settings: PromptSettings, translations: Record<string, string>, styles: VisualStyle[]): Promise<ScriptResponse> {
  // Formater le prompt pour Gemini
  const formattedPrompt = formatGeminiPrompt(prompt, settings, translations, styles);

  // Générer le script avec Gemini
  const result = await model.generateContent(formattedPrompt);
  const text = result.response.text();

  // Traiter la réponse pour extraire le script et les scènes
  try {
    const jsonString = text.substring(
      text.indexOf('```json') + 7,
      text.lastIndexOf('```')
    ).trim();
    const scriptData = JSON.parse(jsonString);

    // Vérifier la structure du script
    if (!scriptData.script || !Array.isArray(scriptData.scenes)) {
      throw new Error('Invalid script format');
    }

    // Valider chaque scène
    scriptData.scenes.forEach((scene: any) => {
      if (!scene.text || !scene.imagePrompt || !scene.duration) {
        throw new Error('Invalid scene format');
      }
    });

    return scriptData;
  } catch (parseError) {
    console.error('Error parsing Gemini response:', parseError);
    console.error('Raw response:', text);
    throw new Error('Failed to parse script');
  }
}

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
        height: 1920,
        width: 1080,
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

async function generateImagesForScenes(scenes: ScriptScene[]): Promise<string[]> {
  const imagePrompts = scenes.map(scene => scene.imagePrompt);
  const imageUrls: string[] = [];
  
  // Traiter les prompts par lots
  for (let i = 0; i < imagePrompts.length; i += MAX_CONCURRENT_REQUESTS) {
    const batch = imagePrompts.slice(i, i + MAX_CONCURRENT_REQUESTS);
    const batchResults = await Promise.all(batch.map(prompt => generateImage(prompt)));
    imageUrls.push(...batchResults);
  }
  
  return imageUrls;
}

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer les données de la requête
    const { prompt, settings, translations } = await request.json();
    
    if (!prompt || !settings) {
      return NextResponse.json(
        { error: 'Prompt and settings are required' },
        { status: 400 }
      );
    }

    // 1. Récupérer les styles visuels
    let styles: VisualStyle[] = [];
    if (settings.visualStyle) {
      const dbStyles = await getVisualStyles();
      const language = settings.language || 'en';
      const localeKey = language.startsWith('fr') ? 'fr' : 'en';
      
      styles = dbStyles.map(style => ({
        id: style.id,
        name: style.translations[localeKey].name,
        description: style.translations[localeKey].description
      }));
    }

    // 2. Générer le script
    console.log('Generating script...');
    const scriptResponse = await generateScript(prompt, settings, translations, styles);
    
    // 3. Générer les images pour chaque scène
    console.log('Generating images...');
    const imageUrls = await generateImagesForScenes(scriptResponse.scenes);
    
    // 4. Créer les scènes avec les images
    const scenesWithImages = scriptResponse.scenes.map((scene, index) => ({
      text: scene.text,
      prompt: scene.imagePrompt,
      duration: parseInt(scene.duration),
      imageUrl: imageUrls[index],
      audioUrl: undefined
    }));

    // 5. Initialiser l'entité vidéo en BDD
    console.log('Initializing video in database...');
    const videoData = {
      user_id: userId,
      title: scriptResponse.script.split('\n')[0].slice(0, 100),
      prompt: prompt,
      raw_prompt: prompt,
      settings: {
        tone: settings.tone,
        style: settings.style,
        targetAudience: settings.targetAudience,
        duration: settings.duration
      },
      scenes: scenesWithImages
    };
    
    const video = await createVideo(videoData);
    
    // 6. Renvoyer l'entité vidéo initialisée
    return NextResponse.json(video);
    
  } catch (error) {
    console.error('Error initializing video:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize video' },
      { status: 500 }
    );
  }
} 
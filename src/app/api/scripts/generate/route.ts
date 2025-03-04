import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { formatGeminiPrompt, type PromptSettings, type VisualStyle } from '@/lib/utils/prompt-formatter';
import { getVisualStyles } from '@/lib/db/services/prompts';

// Initialiser l'API Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

interface ScriptScene {
  text: string;
  imagePrompt: string;
  duration: string;
}

interface ScriptResponse {
  script: string;
  scenes: ScriptScene[];
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

    // Récupérer les styles visuels depuis la base de données si nécessaire
    let styles: VisualStyle[] = [];
    if (settings.visualStyle) {
      const dbStyles = await getVisualStyles();
      // Transformer les styles pour correspondre à l'interface VisualStyle
      const language = settings.language || 'en';
      const localeKey = language.startsWith('fr') ? 'fr' : 'en';
      
      styles = dbStyles.map(style => ({
        id: style.id,
        name: style.translations[localeKey].name,
        description: style.translations[localeKey].description
      }));
    }

    // Formater le prompt pour Gemini
    const formattedPrompt = formatGeminiPrompt(prompt, settings, translations || {}, styles);

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

      return NextResponse.json(scriptData);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Raw response:', text);
      return NextResponse.json(
        { error: 'Failed to parse script', rawResponse: text },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating script:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate script' },
      { status: 500 }
    );
  }
} 
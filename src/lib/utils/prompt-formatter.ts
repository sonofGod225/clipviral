export interface PromptSettings {
  tone: string;
  style: string;
  targetAudience: string;
  duration: number;
  language?: string;
  visualStyle?: string;
}

export interface VisualStyle {
  id: string;
  name: string;
  description: string;
}

export function formatGeminiPrompt(
  prompt: string,
  settings: PromptSettings,
  translations: Record<string, string>,
  styles: VisualStyle[] = []
): string {
  // Trouver le style visuel complet
  const visualStyle = settings.visualStyle 
    ? styles.find(style => style.id === settings.visualStyle)
    : null;
  
  // Formater la durée en minutes et secondes
  const minutes = Math.floor(settings.duration / 60);
  const seconds = settings.duration % 60;
  const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Construire le prompt pour Gemini
  return `
${translations['prompts.createScript'] || 'Create a video script'} 
${translations['prompts.forTheTopic'] || 'for the topic'}: "${prompt}"
${translations['prompts.withTone'] || 'with tone'}: ${settings.tone}
${translations['prompts.inStyle'] || 'in style'}: ${settings.style}
${translations['prompts.forAudience'] || 'for audience'}: ${settings.targetAudience}
${translations['prompts.withDuration'] || 'with duration'}: ${formattedDuration}
${settings.language ? `${translations['prompts.inLanguage'] || 'in language'}: ${settings.language}` : ''}
${visualStyle ? `${translations['prompts.withVisualStyle'] || 'with visual style'}: ${visualStyle.name} - ${visualStyle.description}` : ''}

${translations['prompts.outputFormat'] || 'Output Format'}:
${translations['prompts.jsonFormat'] || 'Format your response as a JSON object with the following structure'}:

\`\`\`json
{
  "script": "Full script text here",
  "scenes": [
    {
      "text": "Scene 1 text",
      "imagePrompt": "Detailed prompt for generating an image for this scene",
      "duration": "10"
    },
    ...
  ]
}
\`\`\`

${translations['prompts.additionalInstructions'] || 'Additional Instructions'}:
- ${translations['prompts.scriptCoherent'] || 'Make the script coherent and engaging'}
- ${translations['prompts.scenesDetailed'] || 'Make scenes detailed and visually descriptive'}
- ${translations['prompts.imagePromptDetailedVisual'] || 'The imagePrompt should be a detailed visual description optimized for image generation'}
- ${translations['prompts.durationInSeconds'] || 'Duration should be in seconds'}
`;
} 
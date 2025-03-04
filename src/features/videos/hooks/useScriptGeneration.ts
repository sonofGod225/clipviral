import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import type { PromptSettings, VisualStyle } from "@/lib/utils/prompt-formatter";

interface ScriptScene {
  text: string;
  imagePrompt: string;
  duration: string;
}

interface ScriptResponse {
  script: string;
  scenes: ScriptScene[];
}

export function useScriptGeneration() {
  const { t, i18n } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateScript = async (
    prompt: string,
    settings: PromptSettings,
    styles: VisualStyle[] = []
  ): Promise<ScriptResponse | null> => {
    try {
      setIsGenerating(true);
      
      // Récupérer les traductions nécessaires
      const translations: Record<string, string> = {
        'prompts.createScript': t('prompts.createScript'),
        'prompts.forTheTopic': t('prompts.forTheTopic'),
        'prompts.withTone': t('prompts.withTone'),
        'prompts.inStyle': t('prompts.inStyle'),
        'prompts.forAudience': t('prompts.forAudience'),
        'prompts.withDuration': t('prompts.withDuration'),
        'prompts.inLanguage': t('prompts.inLanguage'),
        'prompts.withVisualStyle': t('prompts.withVisualStyle'),
        'prompts.outputFormat': t('prompts.outputFormat'),
        'prompts.jsonFormat': t('prompts.jsonFormat'),
        'prompts.additionalInstructions': t('prompts.additionalInstructions'),
        'prompts.scriptCoherent': t('prompts.scriptCoherent'),
        'prompts.scenesDetailed': t('prompts.scenesDetailed'),
        'prompts.imagePromptDetailedVisual': t('prompts.imagePromptDetailedVisual'),
        'prompts.durationInSeconds': t('prompts.durationInSeconds')
      };

      const response = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          settings,
          translations
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate script');
      }

      return await response.json();
    } catch (error) {
      console.error('Script generation error:', error);
      toast.error(t('errors.scriptGenerationFailed'));
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateScript,
    isGenerating,
  };
} 
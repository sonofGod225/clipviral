import { VideoProject, Scene } from '@/types';
import { generateVoice } from '@/lib/ai';
import { uploadFile } from './supabase';

export async function generateVideo(project: VideoProject): Promise<string> {
  try {
    // 1. Générer les voix pour chaque scène
    const scenes = await Promise.all(
      project.scenes.map(async (scene) => {
        const audioBuffer = await generateVoice(scene.text, project.settings.voiceId);
        const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const audioFile = new File([audioBlob], `${scene.id}.mp3`, { type: 'audio/mpeg' });
        
        // Upload the audio file
        const audioUrl = await uploadFile('audio', `${project.id}/${scene.id}.mp3`, audioFile);
        
        return {
          ...scene,
          audioUrl,
        };
      })
    );

    // 2. Créer la composition Remotion
    const composition = {
      id: project.id,
      scenes,
      settings: project.settings,
    };

    // 3. Rendre la vidéo avec Remotion
    // TODO: Implémenter la logique de rendu avec Remotion
    // Cette partie nécessite la configuration de Remotion et la création des composants de rendu

    // 4. Retourner l'URL de la vidéo générée
    return 'https://example.com/video.mp4'; // Placeholder
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
}

// Cette fonction sera utilisée par Remotion pour calculer la durée de chaque scène
export function calculateSceneDuration(scene: Scene): number {
  // Par défaut, on donne 5 secondes par scène plus 1 seconde par 15 caractères
  const baseTime = 5;
  const timePerCharacter = scene.text.length / 15;
  return Math.max(baseTime, timePerCharacter);
}

// Cette fonction sera utilisée pour diviser le script en scènes
export function splitScriptIntoScenes(script: string): string[] {
  // Diviser le script en phrases en utilisant la ponctuation comme séparateur
  return script
    .split(/[.!?]+/g)
    .map(scene => scene.trim())
    .filter(scene => scene.length > 0);
} 
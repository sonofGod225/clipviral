import { uploadFile, getPublicUrl } from './supabase';

const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1';

export const AVAILABLE_VOICES = {
  'voice1': {
    id: 'voice1_id',
    name: 'Voix masculine 1',
    preview_url: '/voices/voice1-preview.mp3',
  },
  'voice2': {
    id: 'voice2_id',
    name: 'Voix masculine 2',
    preview_url: '/voices/voice2-preview.mp3',
  },
  'voice3': {
    id: 'voice3_id',
    name: 'Voix féminine 1',
    preview_url: '/voices/voice3-preview.mp3',
  },
  'voice4': {
    id: 'voice4_id',
    name: 'Voix féminine 2',
    preview_url: '/voices/voice4-preview.mp3',
  },
} as const;

export type VoiceId = keyof typeof AVAILABLE_VOICES;

interface TextToSpeechOptions {
  text: string;
  voiceId: VoiceId;
  stability?: number;
  similarity_boost?: number;
}

export async function textToSpeech({
  text,
  voiceId,
  stability = 0.5,
  similarity_boost = 0.75,
}: TextToSpeechOptions): Promise<string> {
  if (!process.env.ELEVEN_LABS_API_KEY) {
    throw new Error('Missing Eleven Labs API key');
  }

  const voice = AVAILABLE_VOICES[voiceId];
  if (!voice) {
    throw new Error('Invalid voice ID');
  }

  const response = await fetch(
    `${ELEVEN_LABS_API_URL}/text-to-speech/${voice.id}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability,
          similarity_boost,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Eleven Labs API error: ${error.message}`);
  }

  // Récupérer le fichier audio
  const audioBlob = await response.blob();

  // Générer un nom de fichier unique
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.mp3`;

  // Upload vers Supabase Storage
  await uploadFile('audio', fileName, audioBlob);

  // Retourner l'URL publique
  return getPublicUrl('audio', fileName);
} 
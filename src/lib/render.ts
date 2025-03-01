import { uploadFile, getPublicUrl } from './supabase';
import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda';

interface RenderVideoOptions {
  scenes: Array<{
    id: string;
    text: string;
    imageUrl: string;
    audioUrl: string;
    duration: number;
  }>;
  settings: {
    style: string;
    voiceId: string;
    subtitleSettings: {
      font: string;
      size: number;
      color: string;
      backgroundColor: string;
      position: 'top' | 'middle' | 'bottom';
      animation: 'fade' | 'slide' | 'none';
    };
    musicSettings?: {
      trackUrl?: string;
      volume?: number;
    };
  };
}

export async function renderVideo({
  scenes,
  settings,
}: RenderVideoOptions): Promise<string> {
  if (
    !process.env.REMOTION_AWS_ACCESS_KEY_ID ||
    !process.env.REMOTION_AWS_SECRET_ACCESS_KEY ||
    !process.env.REMOTION_AWS_REGION ||
    !process.env.REMOTION_AWS_BUCKET ||
    !process.env.NEXT_PUBLIC_APP_URL
  ) {
    throw new Error('Missing Remotion AWS configuration');
  }

  // Rendre la vidéo sur AWS Lambda
  const renderResponse = await renderMediaOnLambda({
    region: process.env.REMOTION_AWS_REGION as "us-east-1" | "eu-west-1",
    functionName: 'remotion-render',
    serveUrl: process.env.NEXT_PUBLIC_APP_URL,
    composition: 'Video',
    inputProps: {
      scenes,
      settings,
    },
    codec: 'h264',
    imageFormat: 'jpeg',
    maxRetries: 3,
    privacy: 'private',
    framesPerLambda: 60,
    chromiumOptions: {
      gl: 'angle',
    },
  });

  // Attendre que le rendu soit terminé
  const outputKey = await new Promise<string>((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const status = await getRenderProgress({
          renderId: renderResponse.renderId,
          bucketName: process.env.REMOTION_AWS_BUCKET as string,
          functionName: 'remotion-render',
          region: process.env.REMOTION_AWS_REGION as "us-east-1" | "eu-west-1",
        });
        
        if (status.done && status.outKey) {
          resolve(status.outKey);
        } else if (status.errors?.length) {
          reject(new Error(typeof status.errors[0] === 'string' ? status.errors[0] : 'Rendering failed'));
        } else {
          // Vérifier toutes les 5 secondes
          setTimeout(checkStatus, 5000);
        }
      } catch (error) {
        reject(error);
      }
    };

    checkStatus();
  });

  // Télécharger la vidéo depuis S3
  const videoResponse = await fetch(
    `https://${process.env.REMOTION_AWS_BUCKET}.s3.${process.env.REMOTION_AWS_REGION}.amazonaws.com/${outputKey}`
  );
  const videoBlob = await videoResponse.blob();

  // Générer un nom de fichier unique
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`;

  // Upload vers Supabase Storage
  await uploadFile('videos', fileName, videoBlob);

  // Retourner l'URL publique
  return getPublicUrl('videos', fileName);
} 
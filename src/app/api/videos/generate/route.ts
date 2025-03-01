import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { deductCredits } from '@/lib/credits';
import { textToSpeech } from '@/lib/elevenlabs';
import { generateImage } from '@/lib/leonardo';
import { renderVideo } from '@/lib/render';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, script, settings } = await req.json();

    // Vérifier les crédits de l'utilisateur
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (!user || user.credits < 1) {
      return new NextResponse('Insufficient credits', { status: 402 });
    }

    // Créer le projet
    const { data: project } = await supabaseAdmin
      .from('projects')
      .insert({
        user_id: userId,
        title,
        script,
        settings,
        status: 'processing',
      })
      .select()
      .single();

    if (!project) {
      throw new Error('Failed to create project');
    }

    // Déduire un crédit
    await deductCredits(userId, 1);

    // Traiter le script et créer les scènes
    const scenes = script.split('\n\n').map((text: string, index: number) => ({
      text: text.trim(),
      duration: Math.max(5, Math.ceil(text.length / 15)), // ~15 caractères par seconde
      order: index + 1,
    }));

    // Créer les scènes dans la base de données
    const { data: dbScenes } = await supabaseAdmin
      .from('scenes')
      .insert(
        scenes.map((scene: any) => ({
          project_id: project.id,
          text: scene.text,
          duration: scene.duration,
          order: scene.order,
        }))
      )
      .select();

    if (!dbScenes) {
      throw new Error('Failed to create scenes');
    }

    // Générer les ressources pour chaque scène en parallèle
    const processedScenes = await Promise.all(
      dbScenes.map(async (scene) => {
        // Générer l'audio
        const audioUrl = await textToSpeech({
          text: scene.text,
          voiceId: settings.voiceId,
        });

        // Générer l'image
        const imageUrl = await generateImage({
          prompt: scene.text,
          styleId: settings.style,
        });

        // Mettre à jour la scène avec les URLs
        const { data: updatedScene } = await supabaseAdmin
          .from('scenes')
          .update({
            audio_url: audioUrl,
            image_url: imageUrl,
          })
          .eq('id', scene.id)
          .select()
          .single();

        return updatedScene;
      })
    );

    // Générer la vidéo finale
    const videoUrl = await renderVideo({
      scenes: processedScenes,
      settings,
    });

    // Mettre à jour le projet avec l'URL de la vidéo
    await supabaseAdmin
      .from('projects')
      .update({
        status: 'completed',
        video_url: videoUrl,
      })
      .eq('id', project.id);

    return NextResponse.json({
      success: true,
      projectId: project.id,
      videoUrl,
    });
  } catch (error) {
    console.error('Error generating video:', error);
    return new NextResponse('Error generating video', { status: 500 });
  }
} 
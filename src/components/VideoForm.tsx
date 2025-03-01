'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const videoFormSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  script: z.string().min(10, 'Le script doit contenir au moins 10 caractères'),
  style: z.string().min(1, 'Le style est requis'),
  voiceId: z.string().min(1, 'La voix est requise'),
});

type VideoFormData = z.infer<typeof videoFormSchema>;

export function VideoForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<VideoFormData>({
    resolver: zodResolver(videoFormSchema),
  });

  const onSubmit = async (data: VideoFormData) => {
    try {
      setIsGenerating(true);
      // TODO: Implémenter la logique de création de vidéo
      console.log('Form data:', data);
      toast.success('Vidéo en cours de génération');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Titre de la vidéo
          </label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Entrez le titre de votre vidéo"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="script" className="block text-sm font-medium text-gray-700">
            Script
          </label>
          <textarea
            id="script"
            {...register('script')}
            rows={6}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Écrivez votre script ici..."
          />
          {errors.script && (
            <p className="mt-1 text-sm text-red-600">{errors.script.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-700">
            Style visuel
          </label>
          <select
            id="style"
            {...register('style')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Sélectionnez un style</option>
            <option value="realistic">Réaliste</option>
            <option value="anime">Anime</option>
            <option value="cinematic">Cinématique</option>
            <option value="artistic">Artistique</option>
          </select>
          {errors.style && (
            <p className="mt-1 text-sm text-red-600">{errors.style.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="voiceId" className="block text-sm font-medium text-gray-700">
            Voix
          </label>
          <select
            id="voiceId"
            {...register('voiceId')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Sélectionnez une voix</option>
            <option value="voice1">Voix masculine 1</option>
            <option value="voice2">Voix masculine 2</option>
            <option value="voice3">Voix féminine 1</option>
            <option value="voice4">Voix féminine 2</option>
          </select>
          {errors.voiceId && (
            <p className="mt-1 text-sm text-red-600">{errors.voiceId.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isGenerating}
        >
          {isGenerating ? 'Génération en cours...' : 'Générer la vidéo'}
        </Button>
      </div>
    </form>
  );
} 
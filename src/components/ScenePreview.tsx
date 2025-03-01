'use client';

import { useState } from 'react';
import { Scene, VideoSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, MoveUp, MoveDown } from 'lucide-react';

interface ScenePreviewProps {
  scene: Scene;
  settings: VideoSettings;
  onEdit: (scene: Scene) => void;
  onDelete: (sceneId: string) => void;
  onMoveUp: (sceneId: string) => void;
  onMoveDown: (sceneId: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ScenePreview({
  scene,
  settings,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: ScenePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    if (!audioElement && scene.audioUrl) {
      const audio = new Audio(scene.audioUrl);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
      audio.play();
      setIsPlaying(true);
    } else if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg border bg-white">
      {/* Image de la scène */}
      <div className="aspect-video w-full">
        {scene.imageUrl ? (
          <img
            src={scene.imageUrl}
            alt={scene.text}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <p className="text-sm text-gray-500">Image en cours de génération...</p>
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div className="absolute right-2 top-2 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(scene)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDelete(scene.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Contrôles de position */}
      <div className="absolute left-2 top-2 flex gap-2">
        {!isFirst && (
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMoveUp(scene.id)}
          >
            <MoveUp className="h-4 w-4" />
          </Button>
        )}
        {!isLast && (
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMoveDown(scene.id)}
          >
            <MoveDown className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Texte et sous-titres */}
      <div className="p-4">
        <div
          className="rounded-md p-2"
          style={{
            backgroundColor: settings.subtitleSettings.backgroundColor,
            color: settings.subtitleSettings.color,
            fontSize: `${settings.subtitleSettings.size}px`,
            fontFamily: settings.subtitleSettings.font,
          }}
        >
          {scene.text}
        </div>

        {/* Contrôles audio */}
        {scene.audioUrl && (
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={handlePlayPause}
          >
            {isPlaying ? 'Pause' : 'Écouter la voix'}
          </Button>
        )}

        {/* Durée */}
        <p className="mt-2 text-sm text-gray-500">
          Durée : {scene.duration} secondes
        </p>
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { Scene, VideoSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateImage } from '@/lib/ai';
import { toast } from 'sonner';

interface SceneEditorProps {
  scene: Scene;
  settings: VideoSettings;
  onSave: (scene: Scene) => void;
  onCancel: () => void;
}

export function SceneEditor({
  scene,
  settings,
  onSave,
  onCancel,
}: SceneEditorProps) {
  const [text, setText] = useState(scene.text);
  const [duration, setDuration] = useState(scene.duration);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = async () => {
    try {
      setIsGenerating(true);
      const imageUrl = await generateImage(text, settings.style);
      onSave({
        ...scene,
        text,
        duration,
        imageUrl,
      });
      toast.success('Image générée avec succès');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Erreur lors de la génération de l\'image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onSave({
      ...scene,
      text,
      duration,
    });
  };

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4">
      <div className="space-y-2">
        <Label htmlFor="text">Texte de la scène</Label>
        <Textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Entrez le texte de la scène..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Durée (en secondes)</Label>
        <Input
          id="duration"
          type="number"
          min={1}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button
          variant="outline"
          onClick={handleGenerateImage}
          disabled={isGenerating}
        >
          {isGenerating ? 'Génération...' : 'Générer l\'image'}
        </Button>
        <Button onClick={handleSave}>
          Enregistrer
        </Button>
      </div>

      {/* Prévisualisation */}
      {scene.imageUrl && (
        <div className="mt-4">
          <Label>Prévisualisation</Label>
          <div className="mt-2 aspect-video overflow-hidden rounded-lg">
            <img
              src={scene.imageUrl}
              alt={text}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
} 
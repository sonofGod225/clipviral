'use client';

import { useState } from 'react';
import { MusicSettings as MusicSettingsType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload, Loader2, Music2 } from 'lucide-react';

interface MusicSettingsProps {
  settings: MusicSettingsType;
  onChange: (settings: MusicSettingsType) => void;
  onUpload: (file: File) => Promise<string>;
}

export function MusicSettings({ settings, onChange, onUpload }: MusicSettingsProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await onUpload(file);
      onChange({
        ...settings,
        trackUrl: url,
      });
    } catch (error) {
      console.error('Error uploading music:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Musique de fond</Label>
        <div className="flex items-center gap-4">
          {settings.trackUrl ? (
            <div className="flex flex-1 items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
              <Music2 className="h-4 w-4" />
              <span className="text-sm">Musique sélectionnée</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange({ ...settings, trackUrl: undefined })}
              >
                Supprimer
              </Button>
            </div>
          ) : (
            <div className="flex-1">
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
                id="music-upload"
              />
              <label
                htmlFor="music-upload"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed px-4 py-3 text-sm hover:bg-muted/50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Téléchargement...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Choisir un fichier audio</span>
                  </>
                )}
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Volume</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[settings.volume]}
            onValueChange={(value) => onChange({ ...settings, volume: value[0] })}
            min={0}
            max={100}
            step={1}
          />
          <span className="w-12 text-sm">{settings.volume}%</span>
        </div>
      </div>

      <div className="pt-4">
        <Button
          variant="outline"
          onClick={() =>
            onChange({
              trackUrl: undefined,
              volume: 50,
            })
          }
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { VideoSettings as VideoSettingsType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface VideoSettingsProps {
  settings: VideoSettingsType;
  onSave: (settings: VideoSettingsType) => void;
}

export function VideoSettings({ settings, onSave }: VideoSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    toast.success('Paramètres enregistrés');
  };

  return (
    <div className="space-y-6 rounded-lg border bg-white p-6">
      <div>
        <h3 className="text-lg font-medium">Paramètres de la vidéo</h3>
        <p className="text-sm text-gray-500">
          Personnalisez l'apparence et le style de votre vidéo
        </p>
      </div>

      <div className="space-y-4">
        {/* Style visuel */}
        <div className="space-y-2">
          <Label htmlFor="style">Style visuel</Label>
          <select
            id="style"
            value={localSettings.style}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, style: e.target.value })
            }
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="realistic">Réaliste</option>
            <option value="anime">Anime</option>
            <option value="cinematic">Cinématique</option>
            <option value="artistic">Artistique</option>
          </select>
        </div>

        {/* Voix */}
        <div className="space-y-2">
          <Label htmlFor="voiceId">Voix</Label>
          <select
            id="voiceId"
            value={localSettings.voiceId}
            onChange={(e) =>
              setLocalSettings({ ...localSettings, voiceId: e.target.value })
            }
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="voice1">Voix masculine 1</option>
            <option value="voice2">Voix masculine 2</option>
            <option value="voice3">Voix féminine 1</option>
            <option value="voice4">Voix féminine 2</option>
          </select>
        </div>

        {/* Paramètres des sous-titres */}
        <div className="space-y-4">
          <h4 className="font-medium">Sous-titres</h4>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subtitleFont">Police</Label>
              <select
                id="subtitleFont"
                value={localSettings.subtitleSettings.font}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    subtitleSettings: {
                      ...localSettings.subtitleSettings,
                      font: e.target.value,
                    },
                  })
                }
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitleSize">Taille</Label>
              <Input
                id="subtitleSize"
                type="number"
                min={12}
                max={72}
                value={localSettings.subtitleSettings.size}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    subtitleSettings: {
                      ...localSettings.subtitleSettings,
                      size: Number(e.target.value),
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitleColor">Couleur du texte</Label>
              <Input
                id="subtitleColor"
                type="color"
                value={localSettings.subtitleSettings.color}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    subtitleSettings: {
                      ...localSettings.subtitleSettings,
                      color: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitleBgColor">Couleur de fond</Label>
              <Input
                id="subtitleBgColor"
                type="color"
                value={localSettings.subtitleSettings.backgroundColor}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    subtitleSettings: {
                      ...localSettings.subtitleSettings,
                      backgroundColor: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitlePosition">Position</Label>
              <select
                id="subtitlePosition"
                value={localSettings.subtitleSettings.position}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    subtitleSettings: {
                      ...localSettings.subtitleSettings,
                      position: e.target.value as 'top' | 'bottom' | 'middle',
                    },
                  })
                }
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="top">Haut</option>
                <option value="middle">Milieu</option>
                <option value="bottom">Bas</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitleAnimation">Animation</Label>
              <select
                id="subtitleAnimation"
                value={localSettings.subtitleSettings.animation}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    subtitleSettings: {
                      ...localSettings.subtitleSettings,
                      animation: e.target.value as 'fade' | 'slide' | 'none',
                    },
                  })
                }
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="none">Aucune</option>
                <option value="fade">Fondu</option>
                <option value="slide">Glissement</option>
              </select>
            </div>
          </div>
        </div>

        {/* Paramètres de la musique */}
        <div className="space-y-4">
          <h4 className="font-medium">Musique de fond</h4>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="musicTrack">Piste audio</Label>
              <select
                id="musicTrack"
                value={localSettings.musicSettings?.trackUrl || ''}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    musicSettings: {
                      ...localSettings.musicSettings,
                      trackUrl: e.target.value,
                    },
                  })
                }
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="">Aucune musique</option>
                <option value="/music/track1.mp3">Piste 1</option>
                <option value="/music/track2.mp3">Piste 2</option>
                <option value="/music/track3.mp3">Piste 3</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="musicVolume">Volume</Label>
              <Input
                id="musicVolume"
                type="range"
                min={0}
                max={100}
                value={localSettings.musicSettings?.volume || 50}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    musicSettings: {
                      ...localSettings.musicSettings,
                      volume: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleSave}>Enregistrer les paramètres</Button>
    </div>
  );
} 
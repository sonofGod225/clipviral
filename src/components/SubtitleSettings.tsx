'use client';

import { SubtitleSettings as SubtitleSettingsType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface SubtitleSettingsProps {
  settings: SubtitleSettingsType;
  onChange: (settings: SubtitleSettingsType) => void;
}

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat' },
];

const positionOptions = [
  { value: 'top', label: 'Haut' },
  { value: 'middle', label: 'Milieu' },
  { value: 'bottom', label: 'Bas' },
];

const animationOptions = [
  { value: 'none', label: 'Aucune' },
  { value: 'fade', label: 'Fondu' },
  { value: 'slide', label: 'Glissement' },
];

export function SubtitleSettings({ settings, onChange }: SubtitleSettingsProps) {
  const handleChange = (key: keyof SubtitleSettingsType, value: any) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Police</Label>
        <Select
          value={settings.font}
          onValueChange={(value) => handleChange('font', value)}
        >
          {fontOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Taille</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[settings.size]}
            onValueChange={(value) => handleChange('size', value[0])}
            min={12}
            max={48}
            step={1}
          />
          <span className="w-12 text-sm">{settings.size}px</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Couleur du texte</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={settings.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="h-10 w-20"
          />
          <Input
            type="text"
            value={settings.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="flex-1"
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Couleur de fond</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={settings.backgroundColor.replace(/[^#\d]/g, '')}
            onChange={(e) => {
              const color = e.target.value;
              const opacity = settings.backgroundColor.match(/[\d.]+\)$/)?.[0] || '0.7)';
              handleChange('backgroundColor', `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity}`);
            }}
            className="h-10 w-20"
          />
          <Input
            type="text"
            value={settings.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="flex-1"
            placeholder="rgba(0,0,0,0.7)"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Position</Label>
        <Select
          value={settings.position}
          onValueChange={(value) => handleChange('position', value)}
        >
          {positionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Animation</Label>
        <Select
          value={settings.animation}
          onValueChange={(value) => handleChange('animation', value)}
        >
          {animationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="pt-4">
        <Button
          variant="outline"
          onClick={() => onChange({
            font: 'Inter',
            size: 24,
            color: '#FFFFFF',
            backgroundColor: 'rgba(0,0,0,0.7)',
            position: 'bottom',
            animation: 'fade',
          })}
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
} 
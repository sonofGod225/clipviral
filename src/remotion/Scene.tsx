import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { VideoSettings } from '@/types';

interface SceneProps {
  text: string;
  imageUrl: string;
  duration: number;
  settings: VideoSettings;
  startFrame: number;
}

export function Scene({ text, imageUrl, duration, settings, startFrame }: SceneProps) {
  const frame = useCurrentFrame();
  const { subtitleSettings } = settings;

  // Animations
  const opacity = interpolate(
    frame - startFrame,
    [0, 15, duration * 30 - 15, duration * 30],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const translateY = subtitleSettings.animation === 'slide'
    ? interpolate(
        frame - startFrame,
        [0, 15],
        [50, 0],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }
      )
    : 0;

  return (
    <AbsoluteFill>
      {/* Image de fond */}
      <Img
        src={imageUrl}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Sous-titres */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: `translate(-50%, ${translateY}px)`,
          opacity,
          padding: '1rem',
          maxWidth: '80%',
          textAlign: 'center',
          fontFamily: subtitleSettings.font,
          fontSize: `${subtitleSettings.size}px`,
          color: subtitleSettings.color,
          backgroundColor: subtitleSettings.backgroundColor,
          borderRadius: '0.5rem',
          ...(subtitleSettings.position === 'top' && { top: '10%' }),
          ...(subtitleSettings.position === 'middle' && { top: '50%', transform: `translate(-50%, calc(-50% + ${translateY}px))` }),
          ...(subtitleSettings.position === 'bottom' && { bottom: '10%' }),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
} 
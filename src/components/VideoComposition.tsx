'use client';

import { useEffect, useRef } from 'react';
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoProject, Scene } from '@/types';

interface VideoCompositionProps {
  project: VideoProject;
}

interface SceneProps {
  scene: Scene;
  settings: VideoProject['settings'];
}

const FRAME_PER_SECOND = 30;

const SceneComponent: React.FC<SceneProps> = ({ scene, settings }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Animation des sous-titres
  const opacity = (() => {
    if (settings.subtitleSettings.animation === 'fade') {
      if (frame < 15) return frame / 15;
      if (frame > scene.duration * FRAME_PER_SECOND - 15) {
        return (scene.duration * FRAME_PER_SECOND - frame) / 15;
      }
      return 1;
    }
    return 1;
  })();

  const translateY = (() => {
    if (settings.subtitleSettings.animation === 'slide') {
      if (frame < 15) return 20 - (frame / 15) * 20;
      if (frame > scene.duration * FRAME_PER_SECOND - 15) {
        return ((frame - (scene.duration * FRAME_PER_SECOND - 15)) / 15) * 20;
      }
      return 0;
    }
    return 0;
  })();

  return (
    <AbsoluteFill>
      {/* Image de fond */}
      {scene.imageUrl && (
        <img
          src={scene.imageUrl}
          alt={scene.text}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Sous-titres */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: `translateX(-50%) translateY(${translateY}px)`,
          bottom: settings.subtitleSettings.position === 'bottom' ? '10%' : 'auto',
          top: settings.subtitleSettings.position === 'top' ? '10%' : 'auto',
          width: '80%',
          textAlign: 'center',
          padding: '1rem',
          backgroundColor: settings.subtitleSettings.backgroundColor,
          color: settings.subtitleSettings.color,
          fontSize: `${settings.subtitleSettings.size}px`,
          fontFamily: settings.subtitleSettings.font,
          borderRadius: '0.5rem',
          opacity,
          transition: 'all 0.3s ease',
        }}
      >
        {scene.text}
      </div>

      {/* Audio */}
      {scene.audioUrl && <Audio src={scene.audioUrl} />}
    </AbsoluteFill>
  );
};

export function VideoComposition({ project }: VideoCompositionProps) {
  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {project.scenes.map((scene) => {
        const startFrame = currentFrame;
        currentFrame += scene.duration * FRAME_PER_SECOND;

        return (
          <Sequence
            key={scene.id}
            from={startFrame}
            durationInFrames={scene.duration * FRAME_PER_SECOND}
          >
            <SceneComponent scene={scene} settings={project.settings} />
          </Sequence>
        );
      })}

      {/* Musique de fond */}
      {project.settings.musicSettings?.trackUrl && (
        <Audio
          src={project.settings.musicSettings.trackUrl}
          volume={project.settings.musicSettings.volume / 100}
        />
      )}
    </AbsoluteFill>
  );
} 
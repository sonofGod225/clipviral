'use client';

import { useEffect, useRef } from 'react';
import { Player } from '@remotion/player';
import { VideoProject, Scene } from '@/types';

interface VideoPreviewProps {
  project: VideoProject;
}

interface VideoCompositionProps {
  scenes: Scene[];
  settings: VideoProject['settings'];
}

const VideoComposition: React.FC<VideoCompositionProps> = ({ scenes, settings }) => {
  return (
    <div style={{ flex: 1, backgroundColor: 'black' }}>
      {scenes.map((scene, index) => (
        <div
          key={scene.id}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {scene.imageUrl && (
            <img
              src={scene.imageUrl}
              alt={`Scene ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
              }}
            />
          )}
          
          {/* Sous-titres */}
          <div
            style={{
              position: 'absolute',
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
              opacity: 0.9,
            }}
          >
            {scene.text}
          </div>

          {/* Audio */}
          {scene.audioUrl && (
            <audio
              src={scene.audioUrl}
              style={{ display: 'none' }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export function VideoPreview({ project }: VideoPreviewProps) {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Mettre à jour la prévisualisation lorsque le projet change
  }, [project]);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border bg-black">
      <Player
        ref={playerRef}
        component={VideoComposition}
        inputProps={{
          scenes: project.scenes,
          settings: project.settings,
        }}
        durationInFrames={project.scenes.reduce((acc, scene) => acc + scene.duration * 30, 0)} // 30 fps
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        style={{
          width: '100%',
          height: '100%',
        }}
        controls
      />
    </div>
  );
} 
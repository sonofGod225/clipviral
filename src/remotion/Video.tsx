import { Composition } from 'remotion';
import { Scene } from './Scene';
import { VideoSettings } from '@/types';

interface VideoProps {
  scenes: Array<{
    id: string;
    text: string;
    imageUrl: string;
    audioUrl: string;
    duration: number;
  }>;
  settings: VideoSettings;
}

export function Video({ scenes, settings }: VideoProps) {
  const totalDuration = scenes.reduce((acc, scene) => acc + scene.duration, 0);

  return (
    <>
      <Composition
        id="Video"
        component={VideoComposition as React.ComponentType<any>}
        durationInFrames={totalDuration * 30} // 30 fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          scenes,
          settings,
        }}
      />
    </>
  );
}

function VideoComposition({ scenes, settings }: VideoProps) {
  let currentFrame = 0;

  return (
    <>
      {scenes.map((scene) => {
        const startFrame = currentFrame;
        currentFrame += scene.duration * 30;

        return (
          <Scene
            key={scene.id}
            text={scene.text}
            imageUrl={scene.imageUrl}
            duration={scene.duration}
            settings={settings}
            startFrame={startFrame}
          />
        );
      })}
    </>
  );
} 
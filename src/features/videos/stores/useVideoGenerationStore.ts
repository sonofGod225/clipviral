import { create } from 'zustand'
import { VideoScene, VideoSettings } from '@/lib/db/schema/videos'

type VideoGenerationStep = 'prompt' | 'script_review' | 'images' | 'voice' | 'final'

interface VideoGenerationState {
  currentStep: VideoGenerationStep
  videoId: string | null
  settings: VideoSettings | null
  scenes: VideoScene[]
  setCurrentStep: (step: VideoGenerationStep) => void
  setVideoId: (id: string) => void
  setSettings: (settings: VideoSettings) => void
  setScenes: (scenes: VideoScene[]) => void
  reset: () => void
}

export const useVideoGenerationStore = create<VideoGenerationState>((set) => ({
  currentStep: 'prompt',
  videoId: null,
  settings: null,
  scenes: [],
  setCurrentStep: (step) => set({ currentStep: step }),
  setVideoId: (id) => set({ videoId: id }),
  setSettings: (settings) => set({ settings }),
  setScenes: (scenes) => set({ scenes }),
  reset: () => set({
    currentStep: 'prompt',
    videoId: null,
    settings: null,
    scenes: []
  })
})) 
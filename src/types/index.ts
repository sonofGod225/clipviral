export interface VideoProject {
  id: string;
  userId: string;
  title: string;
  script: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  scenes: Scene[];
  settings: VideoSettings;
}

export interface Scene {
  id: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  duration: number;
  order: number;
}

export interface VideoSettings {
  style: string;
  voiceId: string;
  subtitleSettings: SubtitleSettings;
  musicSettings?: MusicSettings;
}

export interface SubtitleSettings {
  font: string;
  size: number;
  color: string;
  backgroundColor: string;
  position: 'top' | 'bottom' | 'middle';
  animation: 'fade' | 'slide' | 'none';
}

export interface MusicSettings {
  trackUrl?: string;
  volume: number;
}

export interface User {
  id: string;
  email: string;
  plan: 'free' | 'premium';
  credits: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 
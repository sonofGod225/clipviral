export interface Video {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  settings: VideoSettings;
  status: VideoStatus;
  scenes?: VideoScene[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NewVideo extends Omit<Video, 'id' | 'createdAt' | 'updatedAt'> {}

export interface VideoSettings {
  tone?: string;
  style?: string;
  targetAudience?: string;
  duration: number;
}

export interface VideoScene {
  id: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  duration: number;
}

export type VideoStatus = "draft" | "processing" | "completed" | "failed";

export interface CreateVideoData {
  userId: string;
  title: string;
  prompt: string;
  settings: VideoSettings;
} 
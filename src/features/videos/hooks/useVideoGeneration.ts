import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { PromptSettings } from "@/lib/utils/prompt-formatter";
import type { Video } from "@/lib/db/schema/videos";

interface InitializeVideoParams {
  prompt: string;
  settings: PromptSettings;
  translations: Record<string, string>;
}

const initializeVideo = async ({ prompt, settings, translations }: InitializeVideoParams): Promise<Video> => {
  const response = await fetch('/api/videos/initialize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, settings, translations }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to initialize video');
  }

  return response.json();
};

export function useVideoGeneration() {
  const { t } = useTranslation();

  const initializeVideoMutation = useMutation<
    Video,
    Error,
    InitializeVideoParams
  >({
    mutationFn: initializeVideo,
    onMutate: () => {
      toast.info(t("info.startingVideoInitialization"));
    },
    onSuccess: () => {
      toast.success(t("success.videoInitialized"));
    },
    onError: (error) => {
      toast.error(t("errors.videoInitializationFailed"));
      console.error('Video initialization error:', error);
    },
  });

  return {
    initializeVideo: initializeVideoMutation.mutateAsync,
    isInitializing: initializeVideoMutation.isPending,
    error: initializeVideoMutation.error,
  };
} 
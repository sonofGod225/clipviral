import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getVideosByUserId, updateVideo, deleteVideo } from "@/lib/db/services/videos";
import type { Video, CreateVideoInput } from "@/lib/db/schema/videos";

const createVideoApi = async (data: CreateVideoInput): Promise<Video> => {
  const response = await fetch('/api/videos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create video');
  }

  return response.json();
};

const generateImagesApi = async ({ scenes }: { scenes: { prompt: string }[] }): Promise<{ scenes: any[] }> => {
  const response = await fetch('/api/videos/generate-images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ scenes }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate images');
  }

  return response.json();
};

export function useVideos(userId: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Video[]>({
    queryKey: ["videos", userId],
    queryFn: () => getVideosByUserId(userId),
    enabled: !!userId,
  });

  const createVideoMutation = useMutation<
    Video,
    Error,
    CreateVideoInput
  >({
    mutationFn: createVideoApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos", userId] });
      toast.success(t("success.videoCreated"));
    },
    onError: () => {
      toast.error(t("errors.videoCreationFailed"));
    },
  });

  const generateImagesMutation = useMutation<
    { scenes: any[] },
    Error,
    { scenes: { prompt: string }[] }
  >({
    mutationFn: generateImagesApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos", userId] });
      toast.success(t("success.imagesGenerated"));
    },
    onError: () => {
      toast.error(t("errors.imageGenerationFailed"));
    },
  });

  const { mutate: updateVideoMutation } = useMutation<
    Video,
    Error,
    { videoId: string; data: Partial<Video> }
  >({
    mutationFn: ({ videoId, data }) => updateVideo(videoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos", userId] });
    },
    onError: () => {
      toast.error(t("errors.updateFailed"));
    },
  });

  const { mutate: deleteVideoMutation } = useMutation<void, Error, string>({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos", userId] });
      toast.success(t("success.videoDeleted"));
    },
    onError: () => {
      toast.error(t("errors.deleteFailed"));
    },
  });

  return {
    videos: data || [],
    isLoading,
    createVideo: createVideoMutation.mutateAsync,
    isCreating: createVideoMutation.isPending,
    generateImages: generateImagesMutation.mutateAsync,
    isGeneratingImages: generateImagesMutation.isPending,
    updateVideo: updateVideoMutation,
    deleteVideo: deleteVideoMutation,
  };
} 
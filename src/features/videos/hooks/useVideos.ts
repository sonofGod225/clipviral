import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getVideosByUserId, createVideo, updateVideo, deleteVideo } from "@/lib/db/services/videos";
import type { Video, CreateVideoData, VideoStatus } from "../types";

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
    CreateVideoData
  >({
    mutationFn: (data) => createVideo({ ...data, status: "draft" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos", userId] });
      toast.success(t("success.videoCreated"));
    },
    onError: () => {
      toast.error(t("errors.videoCreationFailed"));
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
    updateVideo: updateVideoMutation,
    deleteVideo: deleteVideoMutation,
  };
} 
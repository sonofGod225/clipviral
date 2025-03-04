import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface GenerateImagesResponse {
  imageUrls: string[];
}

const generateImagesInBatch = async (prompts: string[]): Promise<GenerateImagesResponse> => {
  const response = await fetch('/api/images/generate-batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompts }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate images');
  }

  return response.json();
};

export function useImageGeneration() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const generateImagesInBatchesMutation = useMutation<
    GenerateImagesResponse,
    Error,
    string[]
  >({
    mutationFn: generateImagesInBatch,
    onMutate: (prompts) => {
      setProgress({ current: 0, total: prompts.length });
      toast.info(t("info.startingImageGeneration"));
    },
    onSuccess: () => {
      toast.success(t("success.imagesGenerated"));
      setProgress(null);
    },
    onError: (error) => {
      toast.error(t("errors.imageGenerationFailed"));
      console.error('Image generation error:', error);
      setProgress(null);
    },
  });

  return {
    generateImagesInBatches: generateImagesInBatchesMutation.mutateAsync,
    isGenerating: generateImagesInBatchesMutation.isPending,
    progress,
    error: generateImagesInBatchesMutation.error,
  };
} 
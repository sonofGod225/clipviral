import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getPromptParameters, getVisualStyles } from "@/lib/db/services/prompts";
import type { QuickPrompt, PromptParameter, VisualStyle } from "@/lib/db/schema/prompts";

async function getQuickPrompts() {
  const response = await fetch("/api/prompts");
  if (!response.ok) {
    throw new Error("Failed to fetch quick prompts");
  }
  return response.json();
}

async function createQuickPrompt(prompt: Omit<QuickPrompt, "id" | "createdAt" | "updatedAt">) {
  const response = await fetch("/api/prompts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prompt),
  });
  if (!response.ok) {
    throw new Error("Failed to create quick prompt");
  }
  return response.json();
}

async function updateQuickPrompt(
  id: string,
  prompt: Partial<Omit<QuickPrompt, "id" | "createdAt" | "updatedAt">>
) {
  const response = await fetch(`/api/prompts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prompt),
  });
  if (!response.ok) {
    throw new Error("Failed to update quick prompt");
  }
}

async function deleteQuickPrompt(id: string) {
  const response = await fetch(`/api/prompts/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete quick prompt");
  }
}

export function useQuickPrompts() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'fr' | 'en';

  const { data: quickPrompts = [], ...rest } = useQuery({
    queryKey: ["quickPrompts"],
    queryFn: getQuickPrompts,
  });

  // Transform data for current language
  const localizedPrompts = quickPrompts.map((prompt: QuickPrompt) => ({
    ...prompt,
    title: prompt.translations[currentLang].title,
    description: prompt.translations[currentLang].prompt,
  }));

  return {
    data: localizedPrompts,
    ...rest
  };
}

export function useCreateQuickPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuickPrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quickPrompts"] });
    },
  });
}

export function useUpdateQuickPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...prompt }: { id: string } & Partial<Omit<QuickPrompt, "id" | "createdAt" | "updatedAt">>) =>
      updateQuickPrompt(id, prompt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quickPrompts"] });
    },
  });
}

export function useDeleteQuickPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuickPrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quickPrompts"] });
    },
  });
}

export const usePromptParameters = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'fr' | 'en';

  const { data: parameters = [], isLoading: isLoadingParameters } = useQuery({
    queryKey: ["promptParameters"],
    queryFn: getPromptParameters,
  });

  // Transform data for current language
  const localizedParameters = parameters.map(param => ({
    id: param.id,
    name: param.translations[currentLang].name,
    description: param.translations[currentLang].description,
    options: param.options[currentLang],
    defaultValue: param.defaultValue,
  }));

  return {
    parameters: localizedParameters,
    isLoading: isLoadingParameters,
  };
};

export const useVisualStyles = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'fr' | 'en';

  const { data: styles = [], isLoading: isLoadingStyles } = useQuery({
    queryKey: ["visualStyles"],
    queryFn: getVisualStyles,
  });
  console.log('styles---  ', styles);
  // Transformer les données pour la langue actuelle
  const localizedStyles = styles.map(style => ({
    id: style.id,
    name: style.translations[currentLang].name,
    description: style.translations[currentLang].description,
    imageUrl: style.imageUrl,
    order: style.order,
  }));
  console.log('localizedStyles', localizedStyles);
  // Trier les styles par ordre
  const sortedStyles = localizedStyles.sort((a, b) => a.order - b.order);

  return {
    styles: sortedStyles,
    isLoading: isLoadingStyles,
  };
}; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VisualStyle } from "@/lib/db/schema/prompts";

async function getVisualStyles() {
  const response = await fetch("/api/styles");
  if (!response.ok) {
    throw new Error("Failed to fetch visual styles");
  }
  return response.json();
}

async function createVisualStyle(style: Omit<VisualStyle, "id" | "createdAt" | "updatedAt">) {
  const response = await fetch("/api/styles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(style),
  });
  if (!response.ok) {
    throw new Error("Failed to create visual style");
  }
  return response.json();
}

async function updateVisualStyle(
  id: string,
  style: Partial<Omit<VisualStyle, "id" | "createdAt" | "updatedAt">>
) {
  const response = await fetch(`/api/styles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(style),
  });
  if (!response.ok) {
    throw new Error("Failed to update visual style");
  }
}

async function deleteVisualStyle(id: string) {
  const response = await fetch(`/api/styles/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete visual style");
  }
}

export function useVisualStyles() {
  return useQuery<VisualStyle[]>({
    queryKey: ['visualStyles'],
    queryFn: async () => {
      const response = await fetch('/api/styles');
      if (!response.ok) {
        throw new Error('Failed to fetch visual styles');
      }
      return response.json();
    },
  });
}

export function useCreateVisualStyle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVisualStyle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visualStyles"] });
    },
  });
}

export function useUpdateVisualStyle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...style }: { id: string } & Partial<Omit<VisualStyle, "id" | "createdAt" | "updatedAt">>) =>
      updateVisualStyle(id, style),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visualStyles"] });
    },
  });
}

export function useDeleteVisualStyle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/styles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete visual style');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visualStyles'] });
    },
  });
} 
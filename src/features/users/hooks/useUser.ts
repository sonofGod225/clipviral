import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { User, UpdateUserData } from "../types";

export function useUser(userId?: string) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      return response.json();
    },
    enabled: !!userId,
  });

  const { mutate: updateUser } = useMutation({
    mutationFn: async (data: UpdateUserData) => {
      if (!userId) throw new Error("No user ID provided");
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      toast.success(t("success.profileUpdated"));
    },
    onError: () => {
      toast.error(t("errors.updateFailed"));
    },
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("No user ID provided");
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user", userId] });
      toast.success(t("success.accountDeleted"));
    },
    onError: () => {
      toast.error(t("errors.deleteFailed"));
    },
  });

  return {
    user,
    isLoading,
    updateUser,
    deleteUser,
  };
} 
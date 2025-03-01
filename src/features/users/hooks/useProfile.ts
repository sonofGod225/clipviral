import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getUserById, updateUser } from "@/lib/db/services/users";
import type { User, UpdateUserData } from "../types";
import { useClerk, useUser } from "@clerk/nextjs";

export function useProfile(userId?: string) {

  console.log("userId", userId);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user: clerkUser } = useUser();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const user = await getUserById(userId!);
      if (!user) return undefined;
      return {
        ...user,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        imageUrl: user.imageUrl ?? undefined
      };
    },
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateUserData) => {
      console.log("data", data);
      console.log("userId", userId);
      return updateUser(userId!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      toast.success(t("success.profileUpdated"));
    },
    onError: () => {
      toast.error(t("errors.updateFailed"));
    },
  });

  return {
    user,
    isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
} 
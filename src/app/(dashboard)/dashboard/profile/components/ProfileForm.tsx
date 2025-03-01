'use client';

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UserResource } from "@clerk/types";
import { User } from "@/features/users/types";
import { useProfile } from "@/features/users/hooks/useProfile";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";

interface ProfileFormProps {
  user?: User;
  clerkUser?: UserResource | null;
}

export function ProfileForm({ user, clerkUser }: ProfileFormProps) {
  console.log("user", user);
  const { t } = useTranslation();
  const { updateProfile, isUpdating } = useProfile(user?.id);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        imageUrl: user.imageUrl || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    updateProfile(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('profile.firstName')}
          </label>
          <Input
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('profile.lastName')}
          </label>
          <Input
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('profile.email')}
        </label>
        <Input
          value={clerkUser?.emailAddresses[0]?.emailAddress}
          disabled
          className="mt-1"
        />
        <p className="mt-1 text-xs text-gray-500">
          {t('profile.emailHelp')}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('profile.credits')}
        </label>
        <p className="mt-1 text-sm text-gray-900">
          {user?.credits || 0} {t('profile.creditsLabel')}
        </p>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
          isLoading={isUpdating}
          disabled={isUpdating}
        >
          {t('common.save')}
        </Button>
      </div>
    </form>
  );
} 
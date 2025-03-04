'use client';

import { useUser } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/features/users/hooks/useProfile";
import { ProfileForm } from "@/app/(dashboard)/dashboard/profile/components/ProfileForm";

export default function SuperboardProfile() {
  const { t } = useTranslation();
  const { user: clerkUser } = useUser();
  const { user, isLoading } = useProfile(clerkUser?.id);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('profile.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {t('profile.description')}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <ProfileForm user={user} clerkUser={clerkUser} />
        </div>
      </div>
    </div>
  );
} 
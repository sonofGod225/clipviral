'use client';

import { useUser } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import { useVideos } from "@/features/videos/hooks/useVideos";
import Link from "next/link";
import { LuLoader, LuPlus, LuVideo } from "react-icons/lu";
import { cn } from "@/lib/utils";

export default function VideosPage() {
  const { user } = useUser();
  const { t } = useTranslation();
  const { videos, isLoading } = useVideos(user?.id || '');

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          {t('navigation.videos')}
        </h1>
        <Link
          href="/dashboard/videos/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-pink-600"
        >
          <LuPlus className="h-4 w-4" />
          {t('videoCreation.title')}
        </Link>
      </div>

      {/* Video Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <LuLoader className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : !videos?.length ? (
          // Empty State
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12">
            <div className="rounded-full bg-purple-100 p-3">
              <LuVideo className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              {t('videos.noVideos')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{t('videos.getStarted')}</p>
          </div>
        ) : (
          // Video Cards
          videos.map((video) => (
            <Link
              key={video.id}
              href={`/dashboard/videos/${video.id}`}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-purple-200 hover:shadow-lg"
            >
              {/* Status Badge */}
              <div className={cn(
                "absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-medium",
                {
                  "bg-yellow-100 text-yellow-800": video.status === "processing",
                  "bg-green-100 text-green-800": video.status === "completed",
                  "bg-red-100 text-red-800": video.status === "failed",
                  "bg-gray-100 text-gray-800": video.status === "draft",
                }
              )}>
                {video.status}
              </div>

              {/* Video Preview */}
              <div className="aspect-video w-full bg-gray-100">
                {video.scenes?.[0]?.imageUrl && (
                  <img
                    src={video.scenes[0].imageUrl}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 group-hover:text-purple-600">
                  {video.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {video.prompt}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
} 
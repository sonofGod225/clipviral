'use client';

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import VideoCreation from "./VideoCreation";
import { useTranslation } from "react-i18next";

export default function VideosPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          {t('navigation.videos')}
        </h1>
        <button className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-pink-600">
          + {t('videoCreation.title')}
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Empty State */}
        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12">
          <div className="rounded-full bg-purple-100 p-3">
            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-900">{t('videos.noVideos')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('videos.getStarted')}</p>
        </div>

        {/* Video Cards will be mapped here when there are videos */}
      </div>
    </div>
  );
} 
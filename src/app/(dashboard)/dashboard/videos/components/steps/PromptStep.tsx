'use client';

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "@clerk/nextjs";
import { useVideos } from "@/features/videos/hooks/useVideos";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const PromptStep = () => {
  const [showAdditionalSettings, setShowAdditionalSettings] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [settings, setSettings] = useState({
    duration: 45,
    tone: "Professional",
    style: "Modern",
    targetAudience: "General",
  });

  const { t } = useTranslation();
  const { user } = useUser();
  const router = useRouter();
  const { createVideo, isCreating } = useVideos(user?.id || '');

  const handleSubmit = async () => {
    if (!prompt) {
      toast.error(t('errors.promptRequired'));
      return;
    }

    try {
      if (!user?.id) {
        toast.error(t('errors.userNotFound'));
        return;
      }

      const video = await createVideo({
        userId: user.id,
        title: prompt.split('\n')[0].slice(0, 100),
        prompt,
        settings,
      });

      toast.success(t('success.videoCreated'));
      router.push(`/dashboard/videos/${video.id}`);
    } catch (error) {
      toast.error(t('errors.videoCreationFailed'));
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            {t('videoCreation.prompt.title')}
          </label>
          <div className="mt-2">
            <textarea
              id="prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 sm:p-4"
              placeholder={t('videoCreation.prompt.placeholder')}
            />
          </div>
        </div>

        {/* Quick Prompts */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quick Prompts
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <button className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 sm:px-4 sm:py-2 sm:text-sm">
              From web link
            </button>
            <button className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 sm:px-4 sm:py-2 sm:text-sm">
              Unlocking Your True Potential
            </button>
            <button className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 sm:px-4 sm:py-2 sm:text-sm">
              Hidden Stories from History
            </button>
            <button className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 sm:px-4 sm:py-2 sm:text-sm">
              Secrets to Personal Growth
            </button>
          </div>
        </div>

        {/* Basic Settings and Additional Settings */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-6">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('videoCreation.prompt.duration')}
            </label>
            <select
              value={settings.duration}
              onChange={(e) => setSettings({ ...settings, duration: Number(e.target.value) })}
              className="mt-2 w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700"
            >
              <option value={45}>45 sec</option>
              <option value={60}>60 sec</option>
              <option value={90}>90 sec</option>
            </select>
          </div>

          {/* Additional Settings Button */}
          <div className="sm:col-span-4">
            <button
              type="button"
              onClick={() => setShowAdditionalSettings(!showAdditionalSettings)}
              className="mt-6 text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              {t('videoCreation.prompt.settings')}
            </button>
          </div>

          {/* Additional Settings */}
          {showAdditionalSettings && (
            <>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('videoCreation.prompt.tone')}
                </label>
                <select
                  value={settings.tone}
                  onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700"
                >
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Friendly</option>
                  <option>Humorous</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('videoCreation.prompt.style')}
                </label>
                <select
                  value={settings.style}
                  onChange={(e) => setSettings({ ...settings, style: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700"
                >
                  <option>Modern</option>
                  <option>Classic</option>
                  <option>Minimalist</option>
                  <option>Bold</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('videoCreation.prompt.targetAudience')}
                </label>
                <select
                  value={settings.targetAudience}
                  onChange={(e) => setSettings({ ...settings, targetAudience: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700"
                >
                  <option>General</option>
                  <option>Professional</option>
                  <option>Students</option>
                  <option>Children</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Visual Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Visual Style
          </label>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { name: "Modern Minimalist", image: "/styles/modern.jpg", selected: true },
              { name: "Corporate Professional", image: "/styles/corporate.jpg" },
              { name: "Creative Vibrant", image: "/styles/creative.jpg" },
              { name: "Tech Futuristic", image: "/styles/tech.jpg" },
            ].map((style, index) => (
              <div
                key={index}
                className={`group cursor-pointer overflow-hidden rounded-xl border ${
                  style.selected
                    ? "border-purple-200 bg-purple-50"
                    : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50"
                }`}
              >
                <div className="aspect-video w-full bg-gray-100">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-2 sm:p-3">
                  <h5 className={`text-xs font-medium sm:text-sm ${
                    style.selected ? "text-purple-600" : "text-gray-900"
                  }`}>
                    {style.name}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 
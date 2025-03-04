'use client';

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "@clerk/nextjs";
import { useVideos } from "@/features/videos/hooks/useVideos";
import { useQuickPrompts, usePromptParameters, useVisualStyles } from "@/features/prompts/hooks/usePrompts";
import { useScriptGeneration } from "@/features/videos/hooks/useScriptGeneration";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { QuickPrompt } from "@/lib/db/schema/prompts";
import Image from 'next/image';
import { uuid } from "drizzle-orm/pg-core";
import { useVideoGenerationStore } from "@/features/videos/stores/useVideoGenerationStore";
import { useImageGeneration } from "@/features/images/hooks/useImageGeneration";
import { formatGeminiPrompt } from "@/lib/utils/prompt-formatter";
import { useVideoGeneration } from "@/features/videos/hooks/useVideoGeneration";

interface PromptStepProps {
  onNext: (data: any) => void;
  onValidationChange: (isValid: boolean) => void;
  onGenerating: (isGenerating: boolean) => void;
}

interface PromptSettings {
  duration: number;
  language: 'fr' | 'en';
  tone: string;
  style: string;
  targetAudience: string;
  visualStyle: string;
}

export const PromptStep = ({ onNext, onValidationChange, onGenerating }: PromptStepProps) => {
  const [showAdditionalSettings, setShowAdditionalSettings] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [settings, setSettings] = useState<PromptSettings>({
    duration: 45,
    language: "fr",
    tone: "Professional",
    style: "Modern",
    targetAudience: "General",
    visualStyle: "",
  });

  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const router = useRouter();
  const { createVideo, isCreating, generateImages, isGeneratingImages } = useVideos(user?.id || '');
  const { data: quickPrompts = [], isLoading: isLoadingPrompts } = useQuickPrompts();
  const { parameters, isLoading: isLoadingParameters } = usePromptParameters();
  const { styles, isLoading: isLoadingStyles } = useVisualStyles();
  const { generateScript, isGenerating } = useScriptGeneration();
  const { setVideoId, setSettings: setStoreSettings, setScenes, setCurrentStep } = useVideoGenerationStore();
  const { generateImagesInBatches, isGenerating: isGeneratingImagesInBatches } = useImageGeneration();
  const { initializeVideo, isInitializing } = useVideoGeneration();

  // Filtrer les paramètres de base et supplémentaires
  const baseParameters = parameters.filter(param => ['duration', 'language'].includes(param.id));
  const additionalParameters = parameters.filter(param => ['tone', 'style', 'targetAudience'].includes(param.id));

  // Fonction de validation des champs obligatoires
  const validateStep = (): boolean => {
    return !!(
      prompt.trim() &&
      settings.duration &&
      settings.language &&
      settings.visualStyle
    );
  };

  // Mettre à jour l'état de validation chaque fois que les champs requis changent
  useEffect(() => {
    const isValid = validateStep();
    onValidationChange(isValid);
  }, [prompt, settings.duration, settings.language, settings.visualStyle]);

  // Mettre à jour l'état de génération
  useEffect(() => {
    onGenerating(isGenerating || isGeneratingImages || isGeneratingImagesInBatches || isInitializing);
  }, [isGenerating, isGeneratingImages, isGeneratingImagesInBatches, isInitializing, onGenerating]);

  const handleNext = async () => {
    if (!validateStep()) {
      // Afficher tous les messages d'erreur nécessaires
      if (!prompt.trim()) {
        toast.error(t('errors.promptRequired'));
      }
      if (!settings.duration) {
        toast.error(t('errors.durationRequired'));
      }
      if (!settings.language) {
        toast.error(t('errors.languageRequired'));
      }
      if (!settings.visualStyle) {
        toast.error(t('errors.visualStyleRequired'));
      }
      return;
    }

    try {
      // Récupérer les traductions nécessaires
      const translations: Record<string, string> = {
        'prompts.createScript': t('prompts.createScript'),
        'prompts.forTheTopic': t('prompts.forTheTopic'),
        'prompts.withTone': t('prompts.withTone'),
        'prompts.inStyle': t('prompts.inStyle'),
        'prompts.forAudience': t('prompts.forAudience'),
        'prompts.withDuration': t('prompts.withDuration'),
        'prompts.inLanguage': t('prompts.inLanguage'),
        'prompts.withVisualStyle': t('prompts.withVisualStyle'),
        'prompts.outputFormat': t('prompts.outputFormat'),
        'prompts.jsonFormat': t('prompts.jsonFormat'),
        'prompts.additionalInstructions': t('prompts.additionalInstructions'),
        'prompts.scriptCoherent': t('prompts.scriptCoherent'),
        'prompts.scenesDetailed': t('prompts.scenesDetailed'),
        'prompts.imagePromptDetailedVisual': t('prompts.imagePromptDetailedVisual'),
        'prompts.durationInSeconds': t('prompts.durationInSeconds')
      };

      // Initialiser la vidéo en une seule opération côté serveur
      const video = await initializeVideo({
        prompt,
        settings,
        translations
      });
      
      // Mettre à jour le store
      setVideoId(video.id);
      if (video.settings) {
        setStoreSettings(video.settings);
      }
      setScenes(video.scenes || []);
      setCurrentStep('script_review');

      // Passer à l'étape suivante
      onNext(video);
    } catch (error) {
      console.error('Error initializing video:', error);
      toast.error(t('errors.videoInitializationFailed'));
    }
  };

  const handleQuickPromptClick = (promptText: string) => {
    setPrompt(promptText);
  };

  const handleVisualStyleSelect = (styleId: string) => {
    setSettings(prev => ({ ...prev, visualStyle: styleId }));
  };

  console.log('styles', styles);

  return (
    <div 
      className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6"
      data-prompt-step=""
      ref={(el) => {
        if (el) {
          (el as any).handleNext = handleNext;
        }
      }}
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            {t('videoCreation.prompt.title')} <span className="text-red-500">*</span>
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
        {!isLoadingPrompts && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('videoCreation.quickPrompts.title')}
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {quickPrompts.map((quickPrompt: QuickPrompt) => (
                <button
                  key={quickPrompt?.id}
                  onClick={() => handleQuickPromptClick(quickPrompt?.translations.fr.prompt)}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 sm:px-4 sm:py-2 sm:text-sm"
                >
                  {quickPrompt?.translations.fr.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Base Parameters */}
        {!isLoadingParameters && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-6">
            {/* Duration */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('videoCreation.parameters.duration.name')} <span className="text-red-500">*</span>
              </label>
              <select
                value={settings.duration}
                onChange={(e) => setSettings({ ...settings, duration: Number(e.target.value) })}
                className="mt-2 w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700"
              >
                <option value="30">30 {t('videoCreation.parameters.duration.seconds')}</option>
                <option value="45">45 {t('videoCreation.parameters.duration.seconds')}</option>
                <option value="60">60 {t('videoCreation.parameters.duration.seconds')}</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {t('videoCreation.parameters.duration.description')}
              </p>
            </div>

            {/* Language */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('videoCreation.parameters.language.name')} <span className="text-red-500">*</span>
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value as 'fr' | 'en' })}
                className="mt-2 w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700"
              >
                <option value="fr">{t('videoCreation.parameters.language.french')}</option>
                <option value="en">{t('videoCreation.parameters.language.english')}</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {t('videoCreation.parameters.language.description')}
              </p>
            </div>

            {/* Additional Settings Toggle */}
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => setShowAdditionalSettings(!showAdditionalSettings)}
                className="mt-7 flex w-full items-center justify-between rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span>{t('videoCreation.parameters.additional.toggle')}</span>
                {showAdditionalSettings ? <LuChevronUp /> : <LuChevronDown />}
              </button>
            </div>
          </div>
        )}

        {/* Additional Parameters */}
        {!isLoadingParameters && showAdditionalSettings && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-6">
            {/* Tone */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('videoCreation.parameters.tone.name')}
              </label>
              <select
                value={settings.tone}
                onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700"
              >
                <option value="Professional">{t('videoCreation.parameters.tone.professional')}</option>
                <option value="Casual">{t('videoCreation.parameters.tone.casual')}</option>
                <option value="Friendly">{t('videoCreation.parameters.tone.friendly')}</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {t('videoCreation.parameters.tone.description')}
              </p>
            </div>

            {/* Style */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('videoCreation.parameters.style.name')}
              </label>
              <select
                value={settings.style}
                onChange={(e) => setSettings({ ...settings, style: e.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700"
              >
                <option value="Modern">{t('videoCreation.parameters.style.modern')}</option>
                <option value="Classic">{t('videoCreation.parameters.style.classic')}</option>
                <option value="Dynamic">{t('videoCreation.parameters.style.dynamic')}</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {t('videoCreation.parameters.style.description')}
              </p>
            </div>

            {/* Target Audience */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('videoCreation.parameters.targetAudience.name')}
              </label>
              <select
                value={settings.targetAudience}
                onChange={(e) => setSettings({ ...settings, targetAudience: e.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700"
              >
                <option value="General">{t('videoCreation.parameters.targetAudience.general')}</option>
                <option value="Professional">{t('videoCreation.parameters.targetAudience.professional')}</option>
                <option value="Youth">{t('videoCreation.parameters.targetAudience.youth')}</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {t('videoCreation.parameters.targetAudience.description')}
              </p>
            </div>
          </div>
        )}

        {/* Visual Styles */}
        {!isLoadingStyles && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('videoCreation.visualStyle.title')} <span className="text-red-500">*</span>
            </label>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {styles.map((style) => (
                <div
                  key={style.id}
                  onClick={() => handleVisualStyleSelect(style.id)}
                  className={`group cursor-pointer overflow-hidden rounded-xl border ${
                    settings.visualStyle === style.id
                      ? "border-purple-200 bg-purple-50"
                      : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50"
                  }`}
                >
                  <div className="aspect-video w-full bg-gray-100">
                    <Image
                      src={style.imageUrl}
                      alt={style.name}
                      width={100}
                      height={150}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-2 sm:p-3">
                    <h5 className={`text-xs font-medium sm:text-sm ${
                      settings.visualStyle === style.id ? "text-purple-600" : "text-gray-900"
                    }`}>
                      {style.name}
                    </h5>
                
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 
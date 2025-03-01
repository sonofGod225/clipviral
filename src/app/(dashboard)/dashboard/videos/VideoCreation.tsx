'use client';

import { useState } from "react";
import Link from "next/link";
import { PromptStep } from "./components/steps/PromptStep";
import { ScriptReviewStep } from "./components/steps/ScriptReviewStep";
import { NarratorStep } from "./components/steps/NarratorStep";
import { Stepper } from "./components/steps/Stepper";
import { useTranslation } from "react-i18next";

export default function VideoCreation() {
  const [currentStep, setCurrentStep] = useState(1);
  const { t } = useTranslation();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PromptStep />;
      case 2:
        return <ScriptReviewStep />;
      case 3:
        return <NarratorStep />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 overflow-y-auto pb-[100px] sm:pb-[150px]">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 p-4 text-sm text-gray-500 sm:mb-8 sm:p-8">
          <Link href="/dashboard" className="hover:text-gray-700">
            {t('videoCreation.title')}
          </Link>
          <span>/</span>
          <span>{t('videoCreation.title')}</span>
        </div>

        <div className="mx-auto w-full max-w-4xl space-y-6 px-4 sm:space-y-8 sm:px-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              {t('videoCreation.title')}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {t('videoCreation.description')}
            </p>
          </div>

          {/* Stepper */}
          <Stepper currentStep={currentStep} />

          {/* Step Content */}
          {renderStepContent()}
        </div>
      </div>

      {/* Action Buttons Container */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white sm:left-64">
        <div className="mx-auto w-full max-w-4xl px-4 py-3 sm:px-8 sm:py-4">
          <div className="flex items-center justify-between">
            <span className="hidden text-sm text-gray-500 sm:block">
              {t('videoCreation.costInfo')}
            </span>
            <div className="flex w-full items-center justify-end gap-3 sm:w-auto sm:gap-4">
              {currentStep === 1 ? (
                <>
                  <Link
                    href="/dashboard"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:px-6 sm:py-2.5"
                  >
                    {t('common.cancel')}
                  </Link>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-center text-sm font-medium text-white hover:from-purple-700 hover:to-pink-600 sm:w-auto sm:px-6 sm:py-2.5"
                  >
                    {t('common.next')}
                  </button>
                </>
              ) : currentStep === 2 ? (
                <>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:px-6 sm:py-2.5"
                  >
                    {t('common.back')}
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-center text-sm font-medium text-white hover:from-purple-700 hover:to-pink-600 sm:w-auto sm:px-6 sm:py-2.5"
                  >
                    {t('common.next')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:px-6 sm:py-2.5"
                  >
                    {t('common.back')}
                  </button>
                  <button
                    className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-center text-sm font-medium text-white hover:from-purple-700 hover:to-pink-600 sm:w-auto sm:px-6 sm:py-2.5"
                  >
                    {t('videoCreation.generateVideo')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
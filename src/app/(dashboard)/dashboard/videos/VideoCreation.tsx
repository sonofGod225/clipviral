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
  const [isStepValid, setIsStepValid] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useTranslation();

  const handleStepComplete = (data: any) => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PromptStep
            onNext={handleStepComplete}
            onValidationChange={setIsStepValid}
            onGenerating={setIsGenerating}
          />
        );
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
      <div className="flex-1 mt-8 overflow-y-auto pb-[100px] sm:pb-[100px]">
       

        <div className="mx-auto w-full max-w-4xl space-y-6 px-4 sm:space-y-8 sm:px-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              {t('videoCreation.title')}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {t('videoCreation.description')}
            </p>
          </div>

          {/* Stepper (without buttons) */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:h-8 sm:w-8 sm:text-sm ${
                currentStep >= 1 ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                1
              </div>
              <span className={`text-xs sm:text-sm ${currentStep >= 1 ? "font-medium text-gray-900" : "text-gray-500"}`}>
                {t('videoCreation.steps.prompt')}
              </span>
            </div>
            <div className="h-px flex-1 bg-gray-200" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:h-8 sm:w-8 sm:text-sm ${
                currentStep >= 2 ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                2
              </div>
              <span className={`text-xs sm:text-sm ${currentStep >= 2 ? "font-medium text-gray-900" : "text-gray-500"}`}>
                {t('videoCreation.steps.scriptReview')}
              </span>
            </div>
            <div className="h-px flex-1 bg-gray-200" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:h-8 sm:w-8 sm:text-sm ${
                currentStep >= 3 ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                3
              </div>
              <span className={`text-xs sm:text-sm ${currentStep >= 3 ? "font-medium text-gray-900" : "text-gray-500"}`}>
                {t('videoCreation.steps.narrator')}
              </span>
            </div>
          </div>

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
                    onClick={() => {
                      const promptStep = document.querySelector('[data-prompt-step]');
                      if (promptStep) {
                        (promptStep as any).handleNext();
                      }
                    }}
                    disabled={!isStepValid || isGenerating}
                    className={`w-full rounded-lg px-4 py-2 text-center text-sm font-medium sm:w-auto sm:px-6 sm:py-2.5 ${
                      isStepValid && !isGenerating
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        {t('common.generating')}
                      </div>
                    ) : (
                      t('common.next')
                    )}
                  </button>
                </>
              ) : currentStep === 2 ? (
                <>
                  <button
                    onClick={handleBack}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:px-6 sm:py-2.5"
                  >
                    {t('common.back')}
                  </button>
                  <button
                    onClick={() => {
                      const promptStep = document.querySelector('[data-prompt-step]');
                      if (promptStep) {
                        (promptStep as any).handleNext();
                      }
                    }}
                    className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-center text-sm font-medium text-white hover:from-purple-700 hover:to-pink-600 sm:w-auto sm:px-6 sm:py-2.5"
                  >
                    {t('common.next')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleBack}
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
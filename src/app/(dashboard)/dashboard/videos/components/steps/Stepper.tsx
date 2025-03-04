import { useTranslation } from 'react-i18next';

interface StepperProps {
  currentStep: number;
  isStepValid: boolean;
  onNext: () => void;
  onBack: () => void;
  isLastStep?: boolean;
}

export const Stepper = ({ currentStep, isStepValid, onNext, onBack, isLastStep = false }: StepperProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
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

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={currentStep === 1}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            currentStep === 1
              ? "cursor-not-allowed text-gray-400"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {t('common.back')}
        </button>
        <button
          onClick={onNext}
          disabled={!isStepValid}
          className={`rounded-lg bg-gradient-to-r px-4 py-2 text-sm font-medium ${
            isStepValid
              ? "from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600"
              : "from-gray-200 to-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isLastStep ? t('common.create') : t('common.next')}
        </button>
      </div>
    </div>
  );
}; 
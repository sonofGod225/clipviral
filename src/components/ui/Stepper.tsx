import { useState } from 'react';
import { LoadingButton } from './LoadingButton';
import { useTranslation } from 'react-i18next';

interface Step {
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

interface StepperProps {
  steps: Step[];
  onComplete: (data: any) => void;
}

export const Stepper = ({ steps, onComplete }: StepperProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<any[]>([]);
  const [isStepValid, setIsStepValid] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useTranslation();

  const handleNext = async (data: any) => {
    const newStepData = [...stepData, data];
    setStepData(newStepData);

    if (currentStep === steps.length - 1) {
      onComplete(newStepData);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="space-y-4">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full ${
                  index <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-400'
                } flex items-center justify-center text-sm font-medium`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-[calc(100%-2rem)] ${
                    index < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between px-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`text-sm font-medium ${
                index <= currentStep ? 'text-purple-600' : 'text-gray-400'
              }`}
            >
              {step.title}
            </div>
          ))}
        </div>
      </div>

      {/* Current step content */}
      <div className="mt-8">
        <CurrentStepComponent
          onNext={handleNext}
          onValidationChange={setIsStepValid}
          onGenerating={setIsGenerating}
        />
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 || isGenerating}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('common.back')}
        </button>
        <LoadingButton
          onClick={() => CurrentStepComponent.handleNext?.()}
          disabled={!isStepValid || (currentStep === 0 && !isGenerating)}
          isLoading={isGenerating}
          loadingText={t('common.generating')}
        >
          {currentStep === steps.length - 1 ? t('common.finish') : t('common.next')}
        </LoadingButton>
      </div>
    </div>
  );
}; 
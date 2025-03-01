interface StepperProps {
  currentStep: number;
}

export const Stepper = ({ currentStep }: StepperProps) => {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:h-8 sm:w-8 sm:text-sm ${
          currentStep >= 1 ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white" : "bg-gray-100 text-gray-500"
        }`}>
          1
        </div>
        <span className={`text-xs sm:text-sm ${currentStep >= 1 ? "font-medium text-gray-900" : "text-gray-500"}`}>
          Prompt
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
          Script Review
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
          Narrator
        </span>
      </div>
    </div>
  );
}; 
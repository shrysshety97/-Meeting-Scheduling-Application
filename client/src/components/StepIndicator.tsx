interface StepIndicatorProps {
  currentStep: 'calendar' | 'form' | 'confirmation';
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const step1Done = currentStep === 'form' || currentStep === 'confirmation';
  const step2Done = currentStep === 'confirmation';
  const step2Active = currentStep === 'form' || currentStep === 'confirmation';

  return (
    <div className="flex items-center justify-center gap-0 mb-5">
      {/* Step 1 dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full border-2 transition-colors duration-300 ${
            step1Done
              ? 'bg-orange-500 border-orange-500'
              : 'bg-orange-400 border-orange-400'
          }`}
        />
        <span className="text-[10px] text-gray-400 mt-1 tracking-wider uppercase font-medium">
          Choose Time
        </span>
      </div>

      {/* Connecting line */}
      <div className="w-24 h-px bg-gray-300 mx-1 mb-4" />

      {/* Step 2 dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-4 h-4 rounded-full border-2 transition-colors duration-300 ${
            step2Done
              ? 'bg-orange-500 border-orange-500'
              : step2Active
              ? 'border-orange-400 bg-white'
              : 'border-gray-300 bg-white'
          }`}
        />
        <span className="text-[10px] text-gray-400 mt-1 tracking-wider uppercase font-medium">
          Your Info
        </span>
      </div>
    </div>
  );
}

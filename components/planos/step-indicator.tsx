interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              index + 1 <= currentStep ? "border-primary bg-primary text-white" : "border-gray-300 text-gray-500"
            }`}
          >
            {index + 1}
          </div>

          {index < totalSteps - 1 && (
            <div
              className={`flex-1 h-1 mx-2 ${index + 1 < currentStep ? "bg-primary" : "bg-gray-300"}`}
              style={{ width: "100px" }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

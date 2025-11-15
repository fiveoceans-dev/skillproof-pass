import { CheckCircle2, Circle, Lock } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export function StepIndicator({ steps, currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between max-w-3xl mx-auto mb-12">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.number);
        const isCurrent = currentStep === step.number;
        const isLocked = step.number > currentStep && !isCompleted;

        return (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-background border-primary text-primary"
                    : "bg-muted border-muted-foreground/20 text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : isLocked ? (
                  <Lock className="h-5 w-5" />
                ) : (
                  <span className="font-bold">{step.number}</span>
                )}
              </div>
              <div className="mt-3 text-center">
                <p className={`font-semibold text-sm ${isCurrent ? "text-primary" : "text-foreground"}`}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 mt-[-48px] transition-all ${
                  completedSteps.includes(step.number) ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

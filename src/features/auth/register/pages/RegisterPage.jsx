import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StepAccount from "@/pages/auth/register/StepAccount";
import StepPersonal from "@/pages/auth/register/StepPersonal";
import StepAcademic from "@/pages/auth/register/StepAcademic";
import { useRegisterWizard } from "@/features/auth/register/hooks/useRegisterWizard";

export default function RegisterPage() {
  const { step, form, onNext, onBack, onSubmit, isLastStep } = useRegisterWizard();

  const steps = [
    <StepAccount form={form} key="step-1" />,
    <StepPersonal form={form} key="step-2" />,
    <StepAcademic form={form} key="step-3" />,
  ];

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6 items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Create Your Account
              </CardTitle>
              <CardDescription>
                Step <strong>{step + 1}</strong> of 3 — Fill out the form to continue.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {steps[step]}

              <div className="flex justify-between pt-4">
                {step > 0 ? (
                  <Button variant="outline" onClick={onBack}>
                    &larr; Back
                  </Button>
                ) : (
                  <div />
                )}

                <Button onClick={isLastStep ? onSubmit : onNext}>
                  {isLastStep ? "Submit" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

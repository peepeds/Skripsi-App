import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { register } from "@/api/authApi";
import {
  isEmail,
  isOptionalString,
  isPassword,
  isRequiredPhoneNumber,
  isRequiredString,
} from "@/helpers/validations";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const step1Schema = z
  .object({
    email: isEmail(),
    password: isPassword(),
    confirmPassword: isRequiredString(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const step2Schema = z.object({
  firstName: isRequiredString(1),
  lastName: isOptionalString(),
  phoneNumber: isRequiredPhoneNumber(),
});

const step3Schema = z.object({
  registerId: isRequiredString(5, 10),
  regionId: isRequiredString(1),
  majorId: isRequiredString(1),
});

const allSchemas = [step1Schema, step2Schema, step3Schema];

export const useRegisterWizard = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const activeSchema = useMemo(() => allSchemas[step], [step]);

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(activeSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      registerId: "",
      regionId: "",
      majorId: "",
    },
  });

  const onNext = async () => {
    const stepKeys = Object.keys(allSchemas[step].shape);
    const isValid = await form.trigger(stepKeys);
    const errors = form.formState.errors;

    let hasStepErrors = false;
    let errorMessage = "Please fix the form errors before proceeding.";

    for (const key of stepKeys) {
      if (errors[key]) {
        hasStepErrors = true;
        if (key === "email" && errors[key].type === "server") {
          errorMessage = errors[key].message;
          break;
        }
      }
    }

    if (isValid && !hasStepErrors) {
      setStep((currentStep) => currentStep + 1);
      return;
    }

    if (hasStepErrors) {
      toast.error(errorMessage);
    }
  };

  const onBack = () => {
    setStep((currentStep) => Math.max(0, currentStep - 1));
  };

  const onSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    const { confirmPassword, ...payload } = form.getValues();

    try {
      const res = await register(payload);
      const data = res.data;

      if (!data.success) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Registration Successful!");
      await sleep(2000);
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration Failed! Server error.");
    }
  };

  return {
    step,
    form,
    onNext,
    onBack,
    onSubmit,
    isLastStep: step === allSchemas.length - 1,
  };
};

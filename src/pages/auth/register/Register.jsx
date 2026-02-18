import React, { useState } from "react";
import StepAccount from "./StepAccount"
import StepPersonal from "./StepPersonal";
import StepAcademic from "./StepAcademic";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { register } from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import { isEmail, isOptionalString, isPassword, isRequiredPhoneNumber, isRequiredString 
} from "@/helpers/validations";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
  firstName:isRequiredString(1),
  lastName: isOptionalString(),
  phoneNumber: isRequiredPhoneNumber()
});

const step3Schema = z.object({
  registerId: isRequiredString(5, 10),
  regionId: isRequiredString(1),
  majorId: isRequiredString(1),
});

const allSchemas = [step1Schema, step2Schema, step3Schema];

export default function RegisterPage() {
  const [step, setStep] = useState(0);

  const navigate = useNavigate(); // 🚀 Inisialisasi navigate

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(allSchemas[step]),
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
    // 1. Dapatkan keys untuk step saat ini
    const stepKeys = Object.keys(allSchemas[step].shape);
    
    // 2. Trigger validasi Zod HANYA untuk field step saat ini
    const isValid = await form.trigger(stepKeys);
    
    // 3. Dapatkan SEMUA error (termasuk server error yang disetel oleh StepAccount)
    const errors = form.formState.errors;
    let hasStepErrors = false;
    let errorMessage = "Please fix the form errors before proceeding.";
    
    // 4. Cek apakah ada error di antara keys step saat ini
    for (const key of stepKeys) {
        if (errors[key]) {
            hasStepErrors = true;
            // Jika error adalah email dan bertipe 'server', ambil pesannya
            if (key === 'email' && errors[key].type === 'server') {
                 errorMessage = errors[key].message;
                 break;
            }
        }
    }

    // 5. Kondisi Akhir: Lanjutkan hanya jika Zod lolos AND tidak ada error yang disetel
    if (isValid && !hasStepErrors) {
      setStep(step + 1);
    } else if (hasStepErrors) {
      // Jika ada error (termasuk server error), tampilkan pesan
      toast.error(errorMessage);
    } 
  };


  const onSubmit = async () => {
    // Trigger seluruh validasi form sebelum submit
    if (!(await form.trigger())) return; 

    const { confirmPassword, ...payload } = form.getValues();

    try {
      
      const res = await register(payload);
      const datas = res.data;
      
      if (datas.success) {
        toast.success("Registration Successful!");
        
        await sleep(2000); 
        navigate('/Login'); 
      } else {
        toast.error(datas.message || "Registration failed");
      }
      
    } catch (err) {

      const errorMessage = err.message || "Registration Failed! Server error.";
      toast.error(errorMessage);
    } 
  };

  const steps = [
    <StepAccount form={form} key="step1" />,
    <StepPersonal form={form} key="step2" />,
    <StepAcademic form={form} key="step3" />,
  ];

  return (
    // Wadah penuh layar yang memusatkan komponen di tengah
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
                      <Button variant="outline" onClick={() => setStep(step - 1)}>
                        &larr; Back
                      </Button>
                    ) : (
                      <div />
                    )}
        
                    <Button onClick={step < steps.length - 1 ? onNext : onSubmit}>
                      {step < steps.length - 1 ? "Next" : "Submit"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
      </div>
    </div>
  );
}
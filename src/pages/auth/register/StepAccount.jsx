import { useEffect, useRef } from "react";
import { Controller } from "react-hook-form";

import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { checkEmail } from "@/api/userApi";

export default function StepAccount({ form }) {
  const { control, setError, clearErrors, watch } = form;

  const email = watch("email");
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!email) {
      clearErrors("email");
      return;
    }

    // ✨ Debounce untuk mengurangi call API
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      // 🔍 Format validation sebelum call API
      const validFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!validFormat) {
        setError("email", {
          type: "format",
          message: "Invalid email format.",
        });
        return;
      }

      // 🔥 Check email ke server
      try {
        const res = await checkEmail(email);
        const datas = res.data;

        if (!datas.success) {
          setError("email", {
            type: "server",
            message: datas.message || "Email is already registered.",
          });
        } else {
          clearErrors("email");
        }
      } catch (err) {
        setError("email", {
          type: "server",
          message: "Failed to validate email. Please try again.",
        });
      }
    }, 850);

    return () => clearTimeout(debounceRef.current);
  }, [email, clearErrors, setError]);

  return (
    <FieldGroup>
      {/* Email */}
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Email</FieldLabel>
            <Input {...field} type="email" placeholder="you@binus.ac.id" />
            {fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      {/* Password */}
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Password</FieldLabel>
            <Input {...field} type="password" placeholder="Enter password" />
            {fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      {/* Confirm Password */}
      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Confirm Password</FieldLabel>
            <Input {...field} type="password" placeholder="Confirm password" />
            {fieldState.error && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </FieldGroup>
  );
}

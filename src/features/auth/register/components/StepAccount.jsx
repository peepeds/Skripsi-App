import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, useRef } from "react";
import { checkEmail } from "@/api/userApi";

export function StepAccount({ form }) {
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailCheckError, setEmailCheckError] = useState(null);
  const debounceTimerRef = useRef(null);
  const emailValue = form.watch("email");

  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Clear error when user is typing
    setEmailCheckError(null);

    // Reset error in form
    if (form.formState.errors.email?.type === "server") {
      form.clearErrors("email");
    }

    // Only check if email is valid email format
    if (!emailValue || !emailValue.includes("@")) {
      return;
    }

    // Debounce email check (500ms)
    debounceTimerRef.current = setTimeout(async () => {
      setIsCheckingEmail(true);
      try {
        const response = await checkEmail(emailValue);
        if (!response.success) {
          setEmailCheckError(response.message);
          form.setError("email", {
            type: "server",
            message: response.message,
          });
        }
      } catch (error) {
        // Handle axios error dengan status code 409 (Conflict)
        if (error.response?.status === 409) {
          const errorMessage = error.response.data?.message || "Email already used!";
          setEmailCheckError(errorMessage);
          form.setError("email", {
            type: "server",
            message: errorMessage,
          });
        } else {
          // NetworkError atau error lainnya, skip untuk sekarang
          console.error("Email check error:", error);
        }
      } finally {
        setIsCheckingEmail(false);
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [emailValue, form]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...form.register("email")}
            disabled={isCheckingEmail}
            className={isCheckingEmail ? "opacity-75" : ""}
          />
          {isCheckingEmail && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
            </div>
          )}
        </div>
        {form.formState.errors.email && (
          <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
        )}
      </div>
    </div>
  );
}
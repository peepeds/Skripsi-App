import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

// Validation schema: defines what data is required and how it should be formatted
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export function PersonalInformationCard({ user }) {
  // Set up form with validation using react-hook-form and Zod
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
  });

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div>
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your basic contact details
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* First Name Field */}
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>First Name</FieldLabel>
                <dd className="text-base font-bold">
                  {user?.firstName || ""}
                </dd>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Last Name Field */}
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Last Name</FieldLabel>
                <dd className="text-base font-bold">
                  {user?.lastName || ""}
                </dd>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Phone Number Field */}
          <Controller
            name="phoneNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Phone Number</FieldLabel>
                <dd className="text-base font-bold">
                  {user?.phoneNumber || ""}
                </dd>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Email Field (Read-only) */}
          <Field>
            <FieldLabel>Email Address</FieldLabel>
            <dd className="text-base font-bold">
              {user?.email || ""}
            </dd>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}
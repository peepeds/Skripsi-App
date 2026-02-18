import { useContext, useEffect } from "react";
import { UserContext } from "@/context/userContext";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SkeletonCircle, SkeletonLine } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export default function Profile() {
  const { user, loadUser, loading } = useContext(UserContext);
  const navigate = useNavigate();
  

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  // Redirect if not logged in
  if (!loading && !user) {
    navigate("/login");
    return null;
  }

  

  const getInitials = () => {
    const first = user?.firstName?.charAt(0)?.toUpperCase() || "";
    const last = user?.lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "U";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <SkeletonCircle size={80} className="flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <SkeletonLine height="h-6" width="w-1/3" />
              <SkeletonLine height="h-4" width="w-1/4" />
            </div>
          </div>
          <Separator />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2 space-y-4">
            <SkeletonLine height="h-40" />
          </div>
          <SkeletonLine height="h-24" />
          <SkeletonLine height="h-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-6">
          <Avatar className="size-20 text-2xl font-semibold bg-linear-to-br from-blue-500 to-purple-600 text-white">
            <AvatarFallback className="bg-transparent">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">
              {user?.fullName || "Welcome"}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          
        </div>
        <Separator />
      </div>

      <div>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your basic contact details
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* First Name */}
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>First Name</FieldLabel>
                      <Input
                        {...field}
                        disabled
                        placeholder="Enter first name"
                        className="border-transparent bg-transparent"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Last Name */}
                <Controller
                  name="lastName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Last Name</FieldLabel>
                      <Input
                        {...field}
                        disabled
                        placeholder="Enter last name"
                        className="border-transparent bg-transparent"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Phone Number */}
                <Controller
                  name="phoneNumber"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Phone Number</FieldLabel>
                      <Input
                        {...field}
                        disabled
                        placeholder="Enter phone number"
                        className="border-transparent bg-transparent"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Email (Read-only) */}
                <Field>
                  <FieldLabel>Email Address</FieldLabel>
                  <div className="flex items-center gap-2">
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="border-transparent bg-transparent cursor-not-allowed"
                    />
                  </div>
                  
                </Field>
              </div>

              {/* Action Buttons for Edit Mode */}
              
            </CardContent>
          </Card>

          {/* Academic Information Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Academic Details</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your department and major
              </p>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">
                      Department
                    </dt>
                    <dd className="text-base font-medium">
                      {user?.deptName || "-"}
                    </dd>
                  </div>
                  <Separator />
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground mb-1">
                      Major
                    </dt>
                    <dd className="text-base font-medium">
                      {user?.majorName || "-"}
                    </dd>
                  </div>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Campus Information Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Campus Location</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your campus region
              </p>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">
                    Region
                  </dt>
                  <dd className="text-base font-medium">
                    {user?.regionName || "-"}
                  </dd>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

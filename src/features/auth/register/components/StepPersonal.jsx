import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StepPersonal({ form }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          placeholder="Enter your first name"
          {...form.register("firstName")}
        />
        {form.formState.errors.firstName && (
          <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          placeholder="Enter your last name"
          {...form.register("lastName")}
        />
        {form.formState.errors.lastName && (
          <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="Enter your phone number"
          {...form.register("phoneNumber")}
        />
        {form.formState.errors.phoneNumber && (
          <p className="text-sm text-red-600">{form.formState.errors.phoneNumber.message}</p>
        )}
      </div>
    </div>
  );
}
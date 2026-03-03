import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";

export default function AcademicDetailsCard({ user }) {
  return (
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
            {/* Department info */}
            <Field>
              <FieldLabel>Department</FieldLabel>
              <dd className="text-base font-bold">
                {user?.deptName || "-"}
              </dd>
            </Field>
            <Separator />

            {/* Major info */}
            <Field>
              <FieldLabel>Major</FieldLabel>
              <dd className="text-base font-bold">
                {user?.majorName || "-"}
              </dd>
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
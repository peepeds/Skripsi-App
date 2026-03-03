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

export default function CampusLocationCard({ user }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Campus Location</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your campus region
        </p>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {/* Region display */}
          <Field>
            <FieldLabel>Region</FieldLabel>
            <dd className="text-base font-bold">
              {user?.regionName || "-"}
            </dd>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
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
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function CertificateCard({ user }) {
  const certificates = user?.certificate || [];

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <h2 className="text-xl font-semibold">Certificates</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your uploaded certificates
        </p>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="space-y-4">
            {certificates.length === 0 ? (
              <p className="text-muted-foreground">No certificates uploaded yet.</p>
            ) : (
              certificates.map((cert, index) => (
                <div key={index}>
                  <Field>
                    <FieldLabel>Certificate {index + 1}</FieldLabel>
                    <div className="flex items-center gap-2">
                      <dd className="text-base font-bold flex-1">
                        {cert.url.split('/').pop() || `Certificate ${index + 1}`}
                      </dd>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(cert.url, '_blank')}
                        className="shrink-0"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </Field>
                  {index < certificates.length - 1 && <Separator />}
                </div>
              ))
            )}
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
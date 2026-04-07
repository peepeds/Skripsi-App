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

export function CertificateCard({ user }) {
  const certificates = user?.certificate || [];

  return (
    <Card className="rounded-2xl border-slate-200 py-0 shadow-sm lg:col-span-2">
      <CardHeader className="border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5">
        <h2 className="font-plus-jakarta text-xl font-semibold text-slate-900">Certificates</h2>
        <p className="font-inter mt-1 text-sm text-slate-500">
          Your uploaded certificates
        </p>
      </CardHeader>
      <CardContent className="px-5 py-5 sm:px-6 sm:py-6">
        <FieldGroup>
          <div className="space-y-3.5 sm:space-y-4">
            {certificates.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                <p className="font-inter text-sm text-slate-500">No certificates uploaded yet.</p>
              </div>
            ) : (
              certificates.map((cert, index) => (
                <div key={index} className="space-y-3">
                  <Field>
                    <FieldLabel className="font-inter text-xs font-medium uppercase tracking-wide text-slate-500">
                      Certificate {index + 1}
                    </FieldLabel>
                    <div className="flex items-center gap-2">
                      <dd className="font-plus-jakarta flex-1 text-sm font-semibold text-slate-900 sm:text-base">
                        {cert.url.split('/').pop() || `Certificate ${index + 1}`}
                      </dd>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(cert.url, '_blank')}
                        className="h-8 shrink-0 rounded-lg border-slate-200 px-3 font-inter text-xs font-semibold"
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
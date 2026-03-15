import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Validation schema for certificate
const certificateSchema = z.object({
  issuer: z.string().min(1, "Issuer is required"),
  certificateName: z.string().min(1, "Certificate name is required"),
});

export function CertificateModal({
  isOpen,
  onClose,
  onSubmit,
  selectedFile,
  fileName,
  setFileName,
  handleFileChange,
  compressing,
  requestingUrl,
  uploading,
}) {
  // Form for certificate submission
  const certificateForm = useForm({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      issuer: "",
      certificateName: "",
    },
  });

  const handleSubmit = (data) => {
    onSubmit(data);
    certificateForm.reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Submit Certificate</h2>
        <form onSubmit={certificateForm.handleSubmit(handleSubmit)} className="space-y-4">
          <Controller
            name="issuer"
            control={certificateForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Issuer</FieldLabel>
                <Input {...field} placeholder="Enter issuer" />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="certificateName"
            control={certificateForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Certificate Name</FieldLabel>
                <Input {...field} placeholder="Enter certificate name" />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* File Upload Section */}
          <div className="space-y-2">
            <Field>
              <FieldLabel>File</FieldLabel>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </Field>

            {fileName && (
              <Field>
                <FieldLabel>File Name (optional)</FieldLabel>
                <Input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter custom file name"
                />
              </Field>
            )}

            {(compressing || requestingUrl) && (
              <p className="text-sm text-muted-foreground">
                {compressing ? "Compressing image..." : "Getting upload URL..."}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={uploading || compressing || requestingUrl || !selectedFile}
            >
              {compressing ? "Compressing..." : requestingUrl ? "Preparing..." : uploading ? "Submitting..." : "Submit Certificate"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
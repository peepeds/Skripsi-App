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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
        <h2 className="font-plus-jakarta mb-4 text-xl font-semibold text-slate-900">Submit Certificate</h2>
        <form onSubmit={certificateForm.handleSubmit(handleSubmit)} className="space-y-4.5">
          <Controller
            name="issuer"
            control={certificateForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="font-inter text-sm text-slate-700">Issuer</FieldLabel>
                <Input {...field} placeholder="Enter issuer" className="h-11 rounded-xl" />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="certificateName"
            control={certificateForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="font-inter text-sm text-slate-700">Certificate Name</FieldLabel>
                <Input {...field} placeholder="Enter certificate name" className="h-11 rounded-xl" />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* File Upload Section */}
          <div className="space-y-2">
            <Field>
              <FieldLabel className="font-inter text-sm text-slate-700">File</FieldLabel>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="h-11 rounded-xl"
              />
            </Field>

            {fileName && (
              <Field>
                <FieldLabel className="font-inter text-sm text-slate-700">File Name (optional)</FieldLabel>
                <Input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter custom file name"
                  className="h-11 rounded-xl"
                />
              </Field>
            )}

            {(compressing || requestingUrl) && (
              <p className="font-inter text-sm text-slate-500">
                {compressing ? "Compressing image..." : "Getting upload URL..."}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="h-10 rounded-xl px-4">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploading || compressing || requestingUrl || !selectedFile}
              className="h-10 rounded-xl bg-[#F97316] px-4 text-white hover:bg-[#EA580C]"
            >
              {compressing ? "Compressing..." : requestingUrl ? "Preparing..." : uploading ? "Submitting..." : "Submit Certificate"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
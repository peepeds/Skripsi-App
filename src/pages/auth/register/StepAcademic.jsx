import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { getRegions } from "@/api/regionApi";
import { getMajors } from "@/api/majorApi";
import { SkeletonLine } from "@/components/ui/skeleton";

export default function StepAcademic({ form }) {
  const { watch, setValue } = form;

  const [regions, setRegions] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingMajors, setLoadingMajors] = useState(true);

  const selectedRegion = watch("regionId");

  useEffect(() => {
    const loadRegions = async () => {
      try {
        setLoadingRegions(true);
        const res = await getRegions();
        setRegions(res.data.result);
      } catch (err) {
        console.error("Failed to fetch regions:", err);
      } finally {
        setLoadingRegions(false);
      }
    };

    const loadMajors = async () => {
      try {
        setLoadingMajors(true);
        const res = await getMajors();
        setMajors(res.data.result);
      } catch (err) {
        console.error("Failed to fetch majors:", err);
      } finally {
        setLoadingMajors(false);
      }
    };

    loadRegions();
    loadMajors();
  }, []);

  const filteredMajors = selectedRegion
    ? majors.filter((m) => String(m.regionId) === String(selectedRegion)) // filter majors by selected regionId
    : [];

  useEffect(() => {
    setValue("majorId", ""); // reset major when region changes
  }, [selectedRegion, setValue]);

  return (
    <FieldGroup>
      <Controller
        name="registerId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Student ID / Lecture ID</FieldLabel>
            <Input {...field} placeholder="26020xxxxx" />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="regionId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>BINUS Region</FieldLabel>
            {loadingRegions ? (
              <SkeletonLine height="h-10" />
            ) : (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r.regionId} value={String(r.regionId)}>
                      {r.regionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="majorId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Major</FieldLabel>
            {loadingMajors ? (
              <SkeletonLine height="h-10" />
            ) : (
              <Select
                value={field.value}
                disabled={!selectedRegion}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedRegion ? "Select major" : "Select region first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredMajors.length > 0 ? (
                    filteredMajors.map((m) => (
                      <SelectItem key={m.majorId} value={String(m.majorId)}>
                        {m.majorName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="empty">
                      No majors available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}

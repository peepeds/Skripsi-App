import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton, SkeletonLine } from "@/components/ui/skeleton";
import { getRegions } from "@/api/regionApi";
import { getMajors } from "@/api/majorApi";

export function StepAcademic({ form }) {
  const [regions, setRegions] = useState([]);
  const [allMajors, setAllMajors] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedRegion = form.watch("regionId");

  useEffect(() => {
    if (selectedRegion) {
      const filtered = allMajors.filter(major => major.regionId === parseInt(selectedRegion));
      setMajors(filtered);
    } else {
      setMajors([]);
    }
  }, [selectedRegion, allMajors]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const regionsRes = await getRegions();
        if (regionsRes.success && regionsRes.result && Array.isArray(regionsRes.result)) {
          setRegions(regionsRes.result);
        }
        
        const majorsRes = await getMajors();
        if (majorsRes.success && majorsRes.result && Array.isArray(majorsRes.result)) {
          setAllMajors(majorsRes.result);
        }
      } catch (error) {
        console.error("Error fetching regions or majors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="registerId">Student ID</Label>
          <SkeletonLine className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="regionId">Region</Label>
          <SkeletonLine className="h-10 w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="majorId">Major</Label>
          <SkeletonLine className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="registerId">Student ID</Label>
        <Input
          id="registerId"
          placeholder="Enter your student ID"
          {...form.register("registerId")}
        />
        {form.formState.errors.registerId && (
          <p className="text-sm text-red-600">{form.formState.errors.registerId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="regionId">Region</Label>
        <Select onValueChange={(value) => {
          form.setValue("regionId", value);
          form.trigger("regionId");
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.regionId} value={region.regionId.toString()}>
                {region.regionName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.regionId && (
          <p className="text-sm text-red-600">{form.formState.errors.regionId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="majorId">Major</Label>
        <Select onValueChange={(value) => {
          form.setValue("majorId", value);
          form.trigger("majorId");
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select major" />
          </SelectTrigger>
          <SelectContent>
            {majors.map((major) => (
              <SelectItem key={major.majorId} value={major.majorId.toString()}>
                {major.majorName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.majorId && (
          <p className="text-sm text-red-600">{form.formState.errors.majorId.message}</p>
        )}
      </div>
    </div>
  );
}
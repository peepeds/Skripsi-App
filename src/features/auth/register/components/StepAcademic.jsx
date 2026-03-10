import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRegions } from "@/api/regionApi";
import { getMajors } from "@/api/majorApi";

export default function StepAcademic({ form }) {
  const [regions, setRegions] = useState([
    { regionId: 1, regionName: "Region 1" },
    { regionId: 2, regionName: "Region 2" },
  ]);
  const [allMajors, setAllMajors] = useState([
    { regionId: 1, majorId: 1, majorName: "Major 1" },
    { regionId: 1, majorId: 2, majorName: "Major 2" },
    { regionId: 1, majorId: 3, majorName: "Major 3" },
    { regionId: 1, majorId: 4, majorName: "Major 4" },
    { regionId: 1, majorId: 5, majorName: "Major 5" },
  ]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedRegion = form.watch("regionId");

  useEffect(() => {
    if (selectedRegion) {
      const filtered = allMajors.filter(major => major.regionId === parseInt(selectedRegion));
      setMajors(filtered);
    } else {
      setMajors(allMajors);
    }
  }, [selectedRegion, allMajors]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regionsRes = await getRegions();
        if (regionsRes.data && regionsRes.data.success && regionsRes.data.result && regionsRes.data.result.length > 0) {
          setRegions(regionsRes.data.result);
        }
        const majorsRes = await getMajors();
        if (majorsRes.data && majorsRes.data.success && majorsRes.data.result && majorsRes.data.result.length > 0) {
          setAllMajors(majorsRes.data.result);
        }
      } catch (error) {
        console.error("Error fetching regions or majors:", error);
        // Keep default data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
        <Select onValueChange={(value) => form.setValue("regionId", value)}>
          <SelectTrigger>
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
        <Select onValueChange={(value) => form.setValue("majorId", value)}>
          <SelectTrigger>
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
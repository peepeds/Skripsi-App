import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export const InformationDetailsCard = ({ data }) => {
  if (!data) {
    return null;
  }

  const { type, workScheme, duration, subCategories } = data;

  const getInternshipTypeLabel = (type) => {
    const typeMap = {
      P: "Part-time",
      F: "Full-time",
      I: "Internship",
    };
    return typeMap[type] || type;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Internship Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 font-medium text-gray-600 w-1/3">Type</td>
                <td className="py-3 px-4 text-gray-900">
                  {type ? getInternshipTypeLabel(type) : <span className="text-gray-400">N/A</span>}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-medium text-gray-600 w-1/3">Work Scheme</td>
                <td className="py-3 px-4">
                  {workScheme && workScheme.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {workScheme.map((scheme) => (
                        <span
                          key={scheme}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full"
                        >
                          {scheme}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-medium text-gray-600 w-1/3">Duration</td>
                <td className="py-3 px-4 text-gray-900">
                  {duration ? duration : <span className="text-gray-400">N/A</span>}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-medium text-gray-600 w-1/3">Categories</td>
                <td className="py-3 px-4">
                  {subCategories && subCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {subCategories.map((category) => (
                        <span
                          key={category}
                          className="inline-block bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

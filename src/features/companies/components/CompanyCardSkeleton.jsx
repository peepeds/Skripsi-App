import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CompanyCardSkeleton = () => (
  <div className="bg-white shadow-sm rounded-lg p-4 flex items-center space-x-4">
    <Skeleton className="w-10 h-10 rounded flex-shrink-0" />
    <div className="flex-1">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-2/3 mb-1" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  </div>
);

export default CompanyCardSkeleton;
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonLine } from "@/components/ui/skeleton";

export default function InboxDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <SkeletonLine height="h-6" width="w-1/2" />
          <SkeletonLine height="h-4" width="w-1/3" className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <SkeletonLine height="h-4" width="w-full" />
          <SkeletonLine height="h-4" width="w-3/4" />
          <SkeletonLine height="h-4" width="w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

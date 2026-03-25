import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SkeletonLine } from "@/components/ui/skeleton";
import { getRequestStatusClass } from "@/features/inbox/utils/activityLog";

export function InboxDetailView({
  requestId,
  requestData,
  reviewInformation,
  currentUserRole,
  timeline,
  auditLoading,
}) {
  const renderObjectAsList = (obj, title) => {
    if (!obj) return null;

    const formatValue = (key, value) => {
      if (value === null || value === undefined) return "N/A";
      if (key.toLowerCase().includes("at") && value) {
        try {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            return String(value); // If invalid date, return as string
          }
          return date.toLocaleString("id-ID");
        } catch (error) {
          return String(value);
        }
      }
      if (key.toLowerCase().includes("url") && value) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {value}
          </a>
        );
      }
      if (typeof value === "boolean") return value ? "Yes" : "No";
      if (Array.isArray(value)) {
        if (value.length === 0) return "None";
        return value.map((item, index) => (
          <div key={index} className="text-sm">
            {typeof item === "object" ? JSON.stringify(item) : String(item)}
          </div>
        ));
      }
      return String(value);
    };

    return (
      <div>
        <h3 className="font-semibold mb-3">{title}</h3>
        <div className="space-y-2">
          {Object.entries(obj).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}:
              </span>
              <span className="font-medium">
                {formatValue(key, value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Inbox Details</CardTitle>
              <CardDescription>Request ID: #{requestId}</CardDescription>
            </div>
            <span
              className={`text-sm px-3 py-1 rounded font-medium ${getRequestStatusClass(reviewInformation?.status)}`}
            >
              {reviewInformation?.status || "UNKNOWN"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderObjectAsList(requestData, "Request Details")}

          <Separator />

          {renderObjectAsList(reviewInformation, "Review Information")}

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Activity Log</h3>
            {auditLoading ? (
              <div className="space-y-2">
                <SkeletonLine height="h-4" width="w-full" />
                <SkeletonLine height="h-4" width="w-3/4" />
              </div>
            ) : timeline.length > 0 ? (
              <div className="space-y-2">
                {timeline.map((log, index) => (
                  <div
                    key={`${log.action}-${index}`}
                    className={`flex flex-col gap-2 p-3 rounded border-l-4 ${log.toneClass}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{log.action}</p>
                        {!log.hideActor && (
                          <p className="text-xs text-muted-foreground">{log.actor}</p>
                        )}
                      </div>

                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {log.timestamp
                          ? new Date(log.timestamp).toLocaleString("id-ID")
                          : "N/A"}
                      </span>
                    </div>

                    {!log.hideNotes && log.notes && (
                      <p className="text-xs text-muted-foreground italic">{log.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No activity log available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

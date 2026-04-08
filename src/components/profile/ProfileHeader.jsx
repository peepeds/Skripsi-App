import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function ProfileHeader({ user, onSubmitCertificate }) {
  // Helper function: create user initials for avatar (e.g. "John Doe" → "JD")
  const getInitials = () => {
    const first = user?.firstName?.charAt(0)?.toUpperCase() || "";
    const last = user?.lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "U";
  };

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          {/* Avatar: colorful circle with user initials */}
          <Avatar className="size-14 shrink-0 bg-linear-to-br from-blue-500 to-purple-600 text-xl font-semibold text-white sm:size-16 sm:text-2xl">
            <AvatarFallback className="bg-transparent">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* User name and email display */}
          <div className="min-w-0 flex-1">
            <h1 className="font-plus-jakarta mb-1 truncate text-2xl font-bold text-slate-900 sm:text-[30px]">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.fullName || "Welcome"}
            </h1>
            <p className="font-inter truncate text-sm text-slate-500 sm:text-base">{user?.email}</p>
          </div>
        </div>
        {/* Submit Certificates Button */}
        <Button
          onClick={onSubmitCertificate}
          className="h-10 w-full rounded-xl bg-[#F97316] px-5 text-sm font-semibold text-white hover:bg-[#EA580C] sm:w-auto"
        >
          Submit Certificates
        </Button>
      </div>
      <Separator />
    </div>
  );
}
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ProfileHeader({ user, onSubmitCertificate }) {
  // Helper function: create user initials for avatar (e.g. "John Doe" → "JD")
  const getInitials = () => {
    const first = user?.firstName?.charAt(0)?.toUpperCase() || "";
    const last = user?.lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || "U";
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          {/* Avatar: colorful circle with user initials */}
          <Avatar className="size-20 text-2xl font-semibold bg-linear-to-br from-blue-500 to-purple-600 text-white">
            <AvatarFallback className="bg-transparent">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {/* User name and email display */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.fullName || "Welcome"}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        {/* Submit Certificates Button */}
        <Button onClick={onSubmitCertificate}>
          Submit Certificates
        </Button>
      </div>
      <Separator />
    </div>
  );
}
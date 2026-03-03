import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import { SkeletonLine } from "@/components/ui/skeleton";

export default function TestPage() {
  const { user, loading } = useContext(UserContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {loading ? (
        <div className="w-64 space-y-2">
          <SkeletonLine height="h-6" width="w-3/4" />
          <SkeletonLine height="h-4" width="w-1/2" />
        </div>
      ) : user ? (
        `Selamat datang, ${user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.fullName || 'User'}`
      ) : (
        "Silahkan Login"
      )}
    </div>
  );
}

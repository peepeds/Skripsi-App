import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SkeletonCircle } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InboxDropdown } from "@/features/inbox/components/InboxDropdown";
import { useInboxNotifications } from "@/features/inbox/hooks/useInboxNotifications";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const {
    inboxData,
    inboxLoading,
    isInboxOpen,
    handleOpenChange,
    fetchInbox,
  } = useInboxNotifications();

  // Exclude paths for /register and /login
  if (location.pathname === "/register" || location.pathname === "/login") {
    return null;
  }

  const getDisplayName = () => {
    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
    if (fullName) return fullName;
    if (user?.name) return user.name;
    if (user?.username) return user.username;
    if (user?.email) return user.email;
    return "User";
  };

  const getInitials = () => {
    const firstName = user?.firstName?.trim();

    if (firstName) {
      return (firstName[0]).toUpperCase();
    }

    const source = firstName || user?.name || user?.username || user?.email || "U";
    const parts = source.trim().split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      // Redirect after logout completes (or fails)
      window.location.href = "/";
    }
  };

  const handleInboxItemClick = (item) => {
    handleOpenChange(false);
    navigate(`/inbox/${item.referenceId}?type=${item.type}`);
  };

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex-1">
          <a href="/" className="text-primary hover:text-primary/90">
            <Logo />
          </a>
        </div>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {loading ? (
            <div className="w-10 h-10">
              <SkeletonCircle size={40} />
            </div>
          ) : isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <a href="/categories">Categories</a>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <a href="/companies">Companies</a>
              </Button>
              <InboxDropdown
                isOpen={isInboxOpen}
                onOpenChange={handleOpenChange}
                onTriggerHover={fetchInbox}
                inboxLoading={inboxLoading}
                inboxData={inboxData}
                onItemClick={handleInboxItemClick}
              />

              {/* Authenticated User Avatar with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full hover:opacity-80 transition-opacity">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <a href="/">Home</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/profile">Profile</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Guest Links */}
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <a href="/categories">Categories</a>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <a href="/companies">Companies</a>
              </Button>
              <Button asChild size="sm" className="text-sm">
                <a href="/login">Get Started</a>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

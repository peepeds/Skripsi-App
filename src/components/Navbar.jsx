import { useId, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "@/context/userContext";
import Logo from "@/components/navbar-components/logo";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./navbar-components/SearchBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const id = useId();
  const location = useLocation();
  const { user, logout } = useContext(UserContext);

  // Check if user is authenticated
  const isAuthenticated = user !== null;

  // Exclude paths for /register and /login
  if (location.pathname === "/register" || location.pathname === "/login") {
    return null;
  }

  // Get user initials
  const getInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    // Optional: redirect to home or login page
    window.location.href = "/";
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
        {/* Middle area */}
        <div className="grow max-sm:hidden">
          {/* Search form */}
          <div className="relative mx-auto w-full max-w-xs">
            <SearchBar/>
          </div>
        </div>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {isAuthenticated ? (
            <>
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
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.name}
                  </div>
                  <DropdownMenuItem asChild>
                    <a href="/dashboard">Dashboard</a>
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
                <a href="#">Companies</a>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <a href="#">Categories</a>
              </Button>
              <Button asChild size="sm" className="text-sm">
                <a href="/Login">Get Started</a>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

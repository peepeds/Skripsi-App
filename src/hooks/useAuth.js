import { useContext } from "react";
import { UserContext } from "@/context/userContext";

export function useAuth() {
  const { user, loadUser, logout, loading } = useContext(UserContext);

  return {
    user,
    loadUser,
    logout,
    loading,
    isAuthenticated: user !== null,
  };
}

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { login } from "@/api/authApi";
import { isEmail, isPassword } from "@/helpers/validations";
import { UserContext } from "@/context/userContext";

const loginSchema = z.object({
  email: isEmail(),
  password: isPassword(),
});

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { loadUser } = useContext(UserContext);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (payload) => {
    try {
      const response = await login(payload);

      // Check response success per BASELINE contract
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      // Store token and load user
      localStorage.setItem("accessToken", response.result?.accessToken);
      await loadUser();

      toast.success(response.message || "Login successful");
      navigate("/");
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
      console.error("Login error:", error);
    }
  };

  return {
    form,
    handleLogin,
  };
};

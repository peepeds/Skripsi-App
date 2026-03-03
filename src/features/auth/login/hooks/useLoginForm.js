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
      const res = await login(payload);
      const data = res.data;

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      localStorage.setItem("accessToken", data.result.accessToken);
      await loadUser();

      toast.success(data.message);
      navigate("/");
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  return {
    form,
    handleLogin,
  };
};

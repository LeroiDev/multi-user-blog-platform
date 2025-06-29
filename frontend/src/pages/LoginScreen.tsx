import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "../components/CustomFormField";
import { Button } from "../components/CustomButton";
import { api } from "../api/client";
import { useAuthStore } from "../stores/authStore";
import type { AxiosError } from "axios";

const loginSchema = z.object({
  email: z.string().email("Must be valid"),
  password: z.string().min(6, "At least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    setServerError(undefined);
    try {
      const res = await api.post(
        "/token",
        new URLSearchParams({
          username: data.email,
          password: data.password,
        })
      );
      setToken(res.data.access_token);
      navigate("/", { replace: true });
    } catch (err) {
      const e = err as AxiosError<{ detail: string }>;
      setServerError(e.response?.data.detail ?? "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-heading mb-6 text-neutral-900">Log In</h1>

      {serverError && (
        <div className="mb-4 text-error text-sm">{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full p-2 border border-neutral-300 rounded"
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
        >
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full p-2 border border-neutral-300 rounded"
          />
        </FormField>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Logging in…" : "Login"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-center text-neutral-700">
        Don’t have an account?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

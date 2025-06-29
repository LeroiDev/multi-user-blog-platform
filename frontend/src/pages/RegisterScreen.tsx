import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "../components/CustomFormField";
import { Button } from "../components/CustomButton";
import { api } from "../api/client";
import type { AxiosError } from "axios";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Must be a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setServerError(undefined);
    try {
      await api.post("/users/", { email: data.email, password: data.password });
      navigate("/login", { replace: true });
    } catch (err) {
      const e = err as AxiosError<{ detail: string }>;
      setServerError(e.response?.data.detail ?? "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-heading mb-6 text-neutral-900">
        Create an account
      </h1>

      {serverError && (
        <div className="mb-4 text-error text-sm">{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="First Name"
          htmlFor="firstName"
          error={errors.firstName?.message}
        >
          <input
            id="firstName"
            {...register("firstName")}
            className="w-full p-2 border border-neutral-300 rounded"
          />
        </FormField>

        <FormField
          label="Last Name"
          htmlFor="lastName"
          error={errors.lastName?.message}
        >
          <input
            id="lastName"
            {...register("lastName")}
            className="w-full p-2 border border-neutral-300 rounded"
          />
        </FormField>

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

        <FormField
          label="Confirm Password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className="w-full p-2 border border-neutral-300 rounded"
          />
        </FormField>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating…" : "Create account"}
        </Button>
      </form>

      <p className="mt-4 text-sm text-center text-neutral-700">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

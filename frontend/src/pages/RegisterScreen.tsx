import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type RegisterData = z.infer<typeof schema>;

interface ErrorResponse {
  detail: string;
}

export default function RegisterScreen() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: RegisterData) => {
    try {
      await api.post("/users/", data);
      // Option A: auto-login here (call /token and store token)
      // Option B: redirect to login
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        alert(axiosErr.response?.data?.detail ?? "Registration failed");
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
      <h1 className="text-xl mb-4">Register</h1>
      <div className="mb-2">
        <label>Email</label>
        <input {...register("email")} className="w-full border p-2" />
        <p className="text-red-600">{errors.email?.message}</p>
      </div>
      <div className="mb-2">
        <label>Password</label>
        <input
          type="password"
          {...register("password")}
          className="w-full border p-2"
        />
        <p className="text-red-600">{errors.password?.message}</p>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-green-600 text-white p-2 rounded"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
}

import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../api/client";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type LoginData = z.infer<typeof schema>;

// shape of error response from our FastAPI back-end
interface ErrorResponse {
  detail: string;
}

export default function LoginScreen() {
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await api.post(
        "/token",
        new URLSearchParams({
          username: data.email,
          password: data.password,
        })
      );
      setToken(res.data.access_token);
      navigate("/");
    } catch (err: unknown) {
      // Narrow to AxiosError
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<ErrorResponse>;
        // err.response?.data is typed as ErrorResponse | undefined
        const message =
          axiosErr.response?.data?.detail ?? "Login failed (server error)";
        alert(message);
      } else {
        // Not an HTTP error
        alert("Login failed");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
      <h1 className="text-xl mb-4">Login</h1>
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
        className="bg-blue-600 text-white p-2 rounded"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

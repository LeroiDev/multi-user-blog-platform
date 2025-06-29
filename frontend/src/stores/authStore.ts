import { create } from "zustand";
import { parseJwt } from "../utils/jwt";


interface User {
  id: number;
  email?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const savedToken = localStorage.getItem("token");
  const initialUser = savedToken ? parseJwt(savedToken) : null;

  return {
    token: savedToken,
    user: initialUser,

    setToken: (token) => {
      if (token) {
        localStorage.setItem("token", token);
        set({ token, user: parseJwt(token) });
      } else {
        localStorage.removeItem("token");
        set({ token: null, user: null });
      }
    },

    logout: () => {
      localStorage.removeItem("token");
      set({ token: null, user: null });
    },
  };
});

// Helper to pull the token outside React components
export function getToken() {
  return useAuthStore.getState().token;
}

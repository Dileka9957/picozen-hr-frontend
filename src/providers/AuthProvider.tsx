import { createContext, useState, useCallback, type ReactNode } from "react";
import * as authService from "../services/authService";
import type {
  AuthContextValue,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../types/auth-types";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem("token"),
  );
  const [user, setUser] = useState<AuthResponse | null>(() => {
    const saved = sessionStorage.getItem("user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await authService.login(payload);
    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("user", JSON.stringify(res.data));
    setToken(res.data.token);
    setUser(res.data);
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    await authService.register(payload);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated: !!token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import { createContext, useState, useCallback, type ReactNode } from "react";
import * as authService from "../services/authService";
import type {
  AuthContextValue,
  LoginRequest,
  RegisterRequest,
} from "../types/auth-types";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await authService.login(payload);
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const res = await authService.register(payload);
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: !!token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

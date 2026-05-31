import api, { extractError } from "../api/api";
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth-types";

export async function register(
  payload: RegisterRequest,
): Promise<ApiResponse<AuthResponse>> {
  try {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/register",
      payload,
    );
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function login(
  payload: LoginRequest,
): Promise<ApiResponse<AuthResponse>> {
  try {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/login",
      payload,
    );
    return data;
  } catch (err) {
    throw extractError(err);
  }
}

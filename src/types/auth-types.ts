export interface AuthContextValue {
  token: string | null;
  user: AuthResponse | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export interface RegisterRequest {
  companyName: string;
  registrationNumber?: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  planType: "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
  companyId: number | null;
  companyName: string | null;
  planType: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

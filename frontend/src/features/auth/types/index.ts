export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  cartItems: number;
  // role: { id: string; name: string } | null;
  role : string
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  cartItems: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  cartItems: number;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  resendVerification: (email: string) => Promise<{ message: string }>;
  verifyEmailToken: (token: string) => Promise<{ message: string }>;
  clearError: () => void;
}

export interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

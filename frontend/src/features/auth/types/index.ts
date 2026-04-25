export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  emailVerifiedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

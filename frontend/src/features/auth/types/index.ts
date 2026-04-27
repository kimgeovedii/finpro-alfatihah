export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  emailVerifiedAt?: string;
  newEmail?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceId?: string;
}

export interface RegisterPayload {
  email: string;
  referralCode?: string;
}

export interface VerifyPayload {
  token: string;
  password?: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface MessageResponse {
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

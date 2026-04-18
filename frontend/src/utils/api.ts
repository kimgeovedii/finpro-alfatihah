import axios, { AxiosError, AxiosInstance } from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// create axios instance with defaults
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// helper to update tokens in cookies
function setTokens(accessToken: string, refreshToken: string) {
  const cookieOptions: Cookies.CookieAttributes = {
    sameSite: "strict",
    expires: 1,
    ...(process.env.NODE_ENV === "production" ? { secure: true } : {}),
  };
  Cookies.set("accessToken", accessToken, { path: "/", ...cookieOptions });
  Cookies.set(
    "refreshToken",
    refreshToken,
    { path: "/", ...cookieOptions, expires: 7 },
  );
}

// request interceptor to attach access token
api.interceptors.request.use((cfg) => {
  const token = Cookies.get("accessToken");
  if (token) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// response interceptor to handle refresh logic
api.interceptors.response.use(
  (resp) => resp,
  async (error: AxiosError) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    if (
      originalRequest &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refreshToken");
      if (refreshToken) {
        try {
          const r = await axios.post(`${API_URL}/auth/refresh`, { token: refreshToken });
          const tokens = r.data.data || r.data;
          setTokens(tokens.accessToken, tokens.refreshToken);
          // update header and retry original request
          if (originalRequest.headers)
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return api(originalRequest);
        } catch (_) {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          if (typeof window !== "undefined") window.location.href = "/login";
          return Promise.reject(_);
        }
      }
    }
    const errorMessage = (error.response?.data as any)?.message || error.message;
    return Promise.reject(new Error(errorMessage));
  },
);

// generic helper that unwraps success wrappers
export async function apiFetch<T>(
  endpoint: string,
  method: "get" | "post" | "put" | "patch" | "delete" = "get",
  body?: any,
): Promise<T> {
  const isFormData = body instanceof FormData
  const response = await api.request({ 
    url: endpoint, 
    method, 
    data: body,
    ...(isFormData && {
      headers: { "Content-Type": "multipart/form-data" },
      transformRequest: (data: any) => data,  
    })
  });  
  const data = response.data;

  if (data && data.hasOwnProperty("data")) {
    if (data.success === false) throw new Error(data.message || "Request failed");

    return data.data as T;
  }

  return data as T;
}


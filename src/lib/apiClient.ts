import axios from "axios";
import { supabase } from "./supabase";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
});

// ─── Request Interceptor ──────────────────────────────────────

apiClient.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    if (import.meta.env.DEV) {
      console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`← ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      await supabase.auth.signOut();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (status >= 500 && import.meta.env.DEV) {
      console.error("Server error:", error.response?.data);
    }

    return Promise.reject(error);
  },
);

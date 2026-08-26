import { create } from "zustand";
import {
  clearToken,
  getToken,
  setToken,
  TOKEN_KEY,
  UNAUTHORIZED_EVENT,
} from "@/src/services/apiClient";
import { getUserFromToken } from "@/src/services/Auth/AuthServices";

export interface AuthUser {
  id_user?: number;
  full_name?: string;
  email?: string;
  role_id?: number;
}

const USER_KEY = "auth_user";

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  hydrated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  hydrated: false,

  hydrate: () => {
    const token = getToken();
    const storedUser = readStoredUser();
    const fallbackUser = token ? getUserFromToken(token) : null;
    set({
      user: storedUser ?? fallbackUser ?? null,
      loading: false,
      hydrated: true,
    });
  },

  login: (token: string, authUser: AuthUser) => {
    setToken(token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    set({ user: authUser });
  },

  logout: () => {
    clearToken();
    window.localStorage.removeItem(USER_KEY);
    set({ user: null });
  },
}));

if (typeof window !== "undefined") {
  window.addEventListener(UNAUTHORIZED_EVENT, () => {
    clearToken();
    window.localStorage.removeItem(USER_KEY);
    useAuthStore.getState().logout();
  });
}


"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "accessToken";
const TOKEN_EVENT = "auth-token-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(TOKEN_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(TOKEN_EVENT, callback);
  };
}

function getSnapshot() {
  return sessionStorage.getItem(TOKEN_KEY);
}

function getServerSnapshot() {
  return null;
}

function getLoadingSnapshot() {
  return false;
}

function getServerLoadingSnapshot() {
  return true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const isLoading = useSyncExternalStore(
    subscribe,
    getLoadingSnapshot,
    getServerLoadingSnapshot
  );

  function login(accessToken: string) {
    sessionStorage.setItem(TOKEN_KEY, accessToken);
    window.dispatchEvent(new Event(TOKEN_EVENT));
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new Event(TOKEN_EVENT));
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return context;
}

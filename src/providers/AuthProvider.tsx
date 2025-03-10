"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";
import { AuthProvider as AuthProviderType } from "@/types";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  login: (provider: AuthProviderType) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth context provider to handle auth logic
function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  // Login function
  const login = async (provider: AuthProviderType) => {
    await signIn(provider, { callbackUrl: "/playground" });
  };

  // Logout function
  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Main Auth provider that wraps SessionProvider from next-auth
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

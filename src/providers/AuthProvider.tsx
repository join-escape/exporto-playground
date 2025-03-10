"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";
import { AuthProvider as AuthProviderType } from "@/types";
import { toast } from "sonner";

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

  // Login function with error handling
  const login = async (provider: AuthProviderType) => {
    try {
      const result = await signIn(provider, {
        callbackUrl: "/playground",
        redirect: false, // Don't redirect automatically, handle it ourselves
      });

      // Check if there was an error
      if (result?.error) {
        // Extract and show the error message
        const errorMessage = result.error;
        toast.error(
          errorMessage.includes("associated with")
            ? errorMessage
            : "Authentication failed. Please try again.",
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Authentication failed. Please try again.");
    }
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

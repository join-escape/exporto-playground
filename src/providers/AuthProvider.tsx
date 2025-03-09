"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (provider: "github" | "google") => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching user on mount
  useEffect(() => {
    // Check local storage or session for existing auth
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // In a real app, you'd verify the token with your backend
        const savedUser = localStorage.getItem("notionConverterUser");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Auth error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (provider: "github" | "google") => {
    setIsLoading(true);
    try {
      // Simulate OAuth login
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substring(2, 9),
        name: provider === "github" ? "GitHub User" : "Google User",
        email: `user@${provider}.example.com`,
        provider,
      };

      setUser(mockUser);
      localStorage.setItem("notionConverterUser", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem("notionConverterUser");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

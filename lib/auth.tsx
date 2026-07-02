"use client";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { PREDEFINED_USERS, hashPassword, User } from "./data";

interface AuthContextValue {
  user: User | null;
  signInById: (id: string) => void;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signInById: () => {},
  signOut: () => {},
  isLoading: true,
});

const SESSION_KEY = "bofa_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const found = PREDEFINED_USERS.find(u => u.id === stored);
        if (found) setUser(found);
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const signInById = useCallback((id: string) => {
    const found = PREDEFINED_USERS.find(u => u.id === id);
    if (found) {
      setUser(found);
      try { localStorage.setItem(SESSION_KEY, id); } catch {}
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem(SESSION_KEY); localStorage.removeItem("bofa_pin"); } catch {}
  }, []);

  return <AuthContext.Provider value={{ user, signInById, signOut, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }

export function verifyCredentials(userId: string, password: string): User | null {
  const hashed = hashPassword(password);
  return PREDEFINED_USERS.find(u => u.userId.toLowerCase() === userId.toLowerCase() && u.password === hashed) ?? null;
}

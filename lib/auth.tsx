"use client";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { PREDEFINED_USERS, hashPassword, User } from "./data";

interface AuthContextValue {
  user: User | null;
  signInById: (id: string) => void;
  signOut: () => void;
  updateAvatar: (dataUrl: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signInById: () => {},
  signOut: () => {},
  updateAvatar: () => {},
  isLoading: true,
});

const SESSION_KEY = "bofa_session";
const avatarOverrideKey = (id: string) => `bofa_avatar_${id}`;
export const pinKey = (id: string) => `bofa_pin_${id}`;

function withAvatarOverride(user: User): User {
  try {
    const override = localStorage.getItem(avatarOverrideKey(user.id));
    if (override) return { ...user, avatar: override };
  } catch {}
  return user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const found = PREDEFINED_USERS.find(u => u.id === stored);
        if (found) setUser(withAvatarOverride(found));
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const signInById = useCallback((id: string) => {
    const found = PREDEFINED_USERS.find(u => u.id === id);
    if (found) {
      setUser(withAvatarOverride(found));
      try { localStorage.setItem(SESSION_KEY, id); } catch {}
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try { localStorage.removeItem(SESSION_KEY); } catch {}
  }, []);

  const updateAvatar = useCallback((dataUrl: string) => {
    setUser(prev => {
      if (!prev) return prev;
      try { localStorage.setItem(avatarOverrideKey(prev.id), dataUrl); } catch {}
      return { ...prev, avatar: dataUrl };
    });
  }, []);

  return <AuthContext.Provider value={{ user, signInById, signOut, updateAvatar, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }

export function verifyCredentials(userId: string, password: string): User | null {
  const hashed = hashPassword(password);
  return PREDEFINED_USERS.find(u => u.userId.toLowerCase() === userId.toLowerCase() && u.password === hashed) ?? null;
}

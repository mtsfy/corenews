"use client";

import axios from "axios";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("corenews-access-token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios({
          method: "GET",
          url: process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/protected",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if (response.status === 200) {
          setUser(response.data.user);
          return;
        }
      } catch (error) {
        console.log("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

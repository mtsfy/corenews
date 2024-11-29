"use client";

import LogoutButton from "@/components/auth/logout-button";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) return <div>Loading...</div>;

  if (!user) return null;

  return (
    <div className="min-h-screen">
      Hello, {user.name}
      <LogoutButton />
    </div>
  );
};

export default Dashboard;

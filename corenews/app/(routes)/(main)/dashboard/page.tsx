"use client";

import { useAuth } from "@/providers/auth-provider";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    redirect("/login");
    return null;
  }

  return <div>Hello, {user.name}</div>;
};

export default Dashboard;

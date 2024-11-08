"use client";

import LoginForm from "@/components/auth/login-form";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;

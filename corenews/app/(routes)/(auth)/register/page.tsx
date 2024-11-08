"use client";

import RegisterForm from "@/components/auth/register-form";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RegisterPage = () => {
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
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;

"use client";

import RegisterForm from "@/components/auth/register-form";
import Logo from "@/components/logo";
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
    <div className="flex h-screen">
      <div className="h-full w-1/2 flex flex-col justify-center items-center gap-8">
        <Logo className="font-semibold text-5xl text-sky-600" />
        <p className="text-xl text-neutral-500 font-medium">Your News, Your Perspective, Simplified.</p>
      </div>
      <div className="h-full w-1/2 flex justify-center items-center bg-white">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;

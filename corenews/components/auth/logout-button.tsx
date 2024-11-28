"use client";

import { useAuth } from "@/providers/auth-provider";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const { setUser } = useAuth();
  const router = useRouter();

  const onSubmit = () => {
    localStorage.removeItem("corenews-access-token");
    setUser(null);
    router.push("/login");
  };

  return (
    <Button variant="destructive" onClick={onSubmit}>
      Logout
    </Button>
  );
};

export default LogoutButton;

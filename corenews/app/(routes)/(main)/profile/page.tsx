"use client";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { IoMdArrowBack } from "react-icons/io";

import EditProfile from "@/components/profile/edit-profile";

const ProfilePage = () => {
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
    <div className=" min-h-screen flex flex-col items-center pb-32">
      <div className="p-8 border-b-[1px] w-full flex justify-evenly items-center bg-white">
        <div className="w-4/5">
          <Logo className="font-semibold text-4xl text-sky-600 text-center" />
        </div>
      </div>
      <div className=" self-start p-8">
        <Button variant={"default"} onClick={() => router.push("/dashboard")}>
          <IoMdArrowBack />
        </Button>
      </div>
      <h1 className="font-semibold text-2xl mb-4">Account Information</h1>
      <div className="p-8 flex flex-col justify-between border-[1px] rounded-xl xl:w-2/5  w-5/5 mx-4 bg-white shadow-sm">
        <EditProfile user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;

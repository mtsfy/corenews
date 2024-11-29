"use client";
import Link from "next/link";
import Logo from "../logo";
import { Button } from "../ui/button";
import { useAuth } from "@/providers/auth-provider";

import { Input } from "../ui/input";
import { CiSearch } from "react-icons/ci";

const GeneralNav = () => {
  const { user } = useAuth();

  const pages = [
    { name: "Home", href: `${user ? "/dashboard" : "/"}` },
    { name: "Topics", href: "/topics" },
    { name: "About", href: "/about" },
  ];
  return (
    <div className="w-full border-b-[1px] px-16 py-6 flex items-center justify-between fixed bg-white">
      <div className="flex gap-16">
        <Logo className="font-semibold text-2xl text-sky-600" />
        <div className="flex gap-8 items-center justify-center">
          {pages.map((page, idx) => (
            <Link key={idx} href={page.href} className="font-medium hover:text-sky-600 hover:opacity-80 transition ">
              {page.name}
            </Link>
          ))}
        </div>
      </div>

      {user && (
        <div className="flex w-2/5 gap-6">
          <Input />
          <Button variant="secondary">
            <CiSearch />
          </Button>
        </div>
      )}
      <div>
        {user ? (
          <div className="flex items-center justify-center gap-6">
            <Link href={"/profile"}>
              <div className="h-[45px] w-[45px] font-medium rounded-full flex items-center justify-center bg-sky-600 text-white">{user.name[0]}</div>
            </Link>
          </div>
        ) : (
          <div className="flex gap-6">
            <Link href={"/login"}>
              <Button className="w-24 bg-sky-600 hover:opacity-80 hover:bg-sky-600 transition" variant={"default"}>
                Log in
              </Button>
            </Link>
            <Link href={"/register"}>
              <Button className="w-24" variant={"secondary"}>
                Sign up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralNav;

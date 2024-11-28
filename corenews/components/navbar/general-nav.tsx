"use client";
import Link from "next/link";
import Logo from "../logo";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const GeneralNav = () => {
  const pages = [
    { name: "Home", href: "/" },
    { name: "Topics", href: "/topics" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  return (
    <div className="w-full border-b-[1px] px-16 py-6 flex justify-between fixed bg-white">
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
      <div className="w-2/5 px-8 flex gap-2">
        <Input type="text" placeholder="Search" />
        <Button variant={"link"} className="text-5xl bg-neutral-100 font-bold">
          <Search />
        </Button>
      </div>
      <div>
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
      </div>
    </div>
  );
};

export default GeneralNav;

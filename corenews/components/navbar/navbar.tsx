"use client";

import { useAuth } from "@/providers/auth-provider";
import GeneralNav from "./general-nav";

const Navbar = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div>
        <GeneralNav />
      </div>
    );
  }
  return <div>Navbar</div>;
};

export default Navbar;

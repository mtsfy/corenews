"use client";

import Link from "next/link";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "font-bold text-3xl" }) => {
  return (
    <Link href={"/"}>
      <div>
        <h1 className={className}>CoreNews</h1>
      </div>
    </Link>
  );
};

export default Logo;

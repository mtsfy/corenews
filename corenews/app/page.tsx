import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-bold text-3xl">corenews</h1>
      </div>
      <div className="flex gap-6">
        <Link href={"/login"}>
          <Button className="w-24" variant={"default"}>
            login
          </Button>
        </Link>
        <Link href={"/register"}>
          <Button className="w-24" variant={"secondary"}>
            register
          </Button>
        </Link>
      </div>
    </div>
  );
}

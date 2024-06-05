"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function SignOut() {
  const router = useRouter();

  const handleSignOut = async (e: any) => {
    e.preventDefault();
    await signOut({ callbackUrl: "/login" });
    router.push("/login");
  };

  return (
    <Button className="hover:brightness-50" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}

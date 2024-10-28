import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

// Define the session type for better type safety
interface User {
  id: string;
  name: string | null;
}

interface Session {
  user: User | null;
}

// Update function component type
export default async function Navbar() {
  const session: Session | null = await auth();

  return (
    <div className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <div className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={33} />
        </Link>
        <div className="flex items-center gap-5 text-black">
          {session && session.user ? (
            <>
              <Link href="/startup/create">
                <span>Create</span>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit">Logout</Button>
              </form>
              <Link href={`/user/${session.user.id}`}>
                <span>{session.user.name}</span>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn({ provider: "github" });
              }}
            >
              <Button type="submit">Login</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { clearToken, getUsernameFromToken, getValidToken } from "@/auth";

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const syncFromToken = () => {
      const token = getValidToken();
      if (!token) {
        setUsername(null);
        return;
      }
      const tokenUsername = getUsernameFromToken(token);
      setUsername(tokenUsername);
    };

    syncFromToken();

    const onStorage = () => syncFromToken();
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, [pathname]);

  const handleLogout = () => {
    clearToken();
    setUsername(null);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Salons Nearby
        </Link>

        <div className="flex items-center gap-3">
          {username ? (
            <>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Hello, {username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-orange-600 px-3 py-1.5 text-sm text-white hover:bg-orange-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

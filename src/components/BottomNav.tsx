"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function BottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const handleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      const searchInput = document.querySelector<HTMLInputElement>(
        'input[placeholder*="ara"], input[placeholder*="Search"]'
      );
      if (searchInput) {
        searchInput.focus();
        return;
      }
    }
    window.location.href = "/?q=";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:hidden">
      <div className="max-w-3xl mx-auto flex items-center justify-around h-14">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
            isActive("/") && !pathname.includes("?q=")
              ? "text-black"
              : "text-gray-400"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <button
          onClick={handleSearch}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[10px] font-medium">Search</span>
        </button>

        {user ? (
          <>
            <Link
              href="/create"
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive("/create") ? "text-black" : "text-gray-400"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[10px] font-medium">Create</span>
            </Link>

            <Link
              href="/profile"
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive("/profile") ? "text-black" : "text-gray-400"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] font-medium">Profile</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive("/login") ? "text-black" : "text-gray-400"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[10px] font-medium">Create</span>
            </Link>

            <Link
              href="/login"
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive("/login") ? "text-black" : "text-gray-400"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] font-medium">Login</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

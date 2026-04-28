"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n/context";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const { logout } = useAuth();
  const { t } = useLanguage();

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

  const handleLogout = () => {
    if (loggingOut) return;
    setLoggingOut(true);
    logout();
  };

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          {t("siteTitle")}
        </Link>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          {user ? (
            <>
              <Link
                href="/create"
                className="hidden md:inline text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                {t("navbarWriteRecipe")}
              </Link>
              <Link
                href="/profile"
                className="hidden md:inline text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                {t("navbarProfile")}
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="hidden md:block text-sm font-medium text-gray-400 hover:text-black transition-colors disabled:opacity-50"
              >
                {loggingOut ? t("navbarLoggingOut") : t("navbarLogout")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                {t("navbarLogin")}
              </Link>
              <Link
                href="/signup"
                className="hidden md:inline bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                {t("navbarSignup")}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

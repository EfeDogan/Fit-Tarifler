"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const errMsg = await login(
      formData.get("email") as string,
      formData.get("password") as string
    );

    if (errMsg) {
      setError(
        errMsg === "Invalid login credentials" ? t("loginError") : errMsg
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-6">
        <h1 className="text-4xl font-bold text-center mb-2 tracking-tight">
          {t("loginTitle")}
        </h1>
        <p className="text-gray-500 text-center mb-8">
          {t("loginSubtitle")}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("loginEmailLabel")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("loginPasswordLabel")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? t("loginSubmitting") : t("loginSubmit")}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t("loginNoAccount")}{" "}
          <Link
            href="/signup"
            className="text-black font-medium hover:underline"
          >
            {t("navbarSignup")}
          </Link>
        </p>
      </div>
    </div>
  );
}

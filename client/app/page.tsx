"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !data?.session && !data?.user) {
      router.replace("/sign-in");
    }
  }, [isPending, data, router]);

  if (isPending || (!data?.session && !data?.user)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-950">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 font-sans overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-2xl px-4 py-8">
        <div className="space-y-6">
          {/* Profile Header Card */}
          <div className="relative group border border-zinc-800/50 rounded-3xl p-8 md:p-10 bg-gradient-to-br from-zinc-900/90 via-zinc-900/50 to-zinc-900/90 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300">
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-indigo-500/30 rounded-tl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-purple-500/30 rounded-br-3xl"></div>

            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative group/avatar">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-50 group-hover/avatar:opacity-75 transition-opacity"></div>
                <div className="relative">
                  <Image
                    src={data?.user?.image ?? "/vercel.svg"}
                    alt={data?.user?.name || "User"}
                    width={140}
                    height={140}
                    className="relative z-10 rounded-full border-4 border-zinc-800 object-cover shadow-xl ring-2 ring-indigo-500/20"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-4 border-zinc-900 shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {data?.user?.name || "User"}
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-sm font-medium text-zinc-400">
                    Active Session
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Email Card */}
            <div className="border border-zinc-800/50 rounded-2xl p-6 bg-zinc-900/50 backdrop-blur-xl space-y-3 hover:border-zinc-700/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <svg
                    className="w-5 h-5 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Email Address
                </p>
              </div>
              <p className="text-base text-zinc-100 font-medium break-all pl-11">
                {data?.user?.email}
              </p>
            </div>

            {/* Account Type Card */}
            <div className="border border-zinc-800/50 rounded-2xl p-6 bg-zinc-900/50 backdrop-blur-xl space-y-3 hover:border-zinc-700/50 transition-colors">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Account Type
                </p>
              </div>
              <p className="text-base text-zinc-100 font-medium pl-11">
                GitHub OAuth
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onError: (ctx) => console.log(ctx),
                    onSuccess: () => router.push("/sign-in"),
                  },
                })
              }
              className="flex-1 h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 group"
            >
              <svg
                className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </Button>
          </div>

          {/* Decorative footer */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-medium">Authenticated</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

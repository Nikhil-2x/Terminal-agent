"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const loginHandler = () => {
    setIsLoading(true);
    toast("Redirecting to GitHub…");
    authClient.signIn.social({
      provider: "github",
      callbackURL: "http://localhost:3000",
    });
  };

  return (
    <div className="relative flex flex-col gap-8 justify-center items-center px-4 py-12 min-h-screen">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main content container */}
      <div className="w-full max-w-md space-y-8">
        {/* Header section */}
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="">
            <h1 className="text-5xl p-2 md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Terminal Agent
            </h1>
            <p className="text-base md:text-lg font-medium text-zinc-400/90 max-w-sm mx-auto">
              Sign in with GitHub to get started
            </p>
          </div>
        </div>

        {/* Login card */}
        <Card className="border-2 border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Decorative divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  OAuth Login
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
              </div>

              {/* GitHub login button */}
              <Button
                variant="outline"
                className="w-full h-14 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-100 font-semibold transition-all duration-200 group relative overflow-hidden"
                type="button"
                onClick={loginHandler}
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center gap-3">
                  <Image
                    src={"/github.svg"}
                    alt="Github"
                    height={22}
                    width={22}
                    className="size-5 dark:invert group-hover:scale-110 transition-transform"
                  />
                  <span className="text-base">
                    {isLoading
                      ? "Connecting to GitHub..."
                      : "Continue With GitHub"}
                  </span>
                </div>
              </Button>

              {/* Features list */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span>Instant authentication via GitHub OAuth</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span>No registration required</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span>Secure device flow authorization</span>
                </div>
              </div>

              {/* Info section */}
              <div className="pt-2 space-y-3 border-t border-zinc-800">
                <div className="flex items-start gap-2 text-xs text-zinc-500 mt-4">
                  <svg
                    className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-400"
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
                  <p>
                    Your GitHub account will be used to authenticate and
                    authorize access to the terminal agent
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer decorative element */}
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
          <span>Powered by Nick</span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

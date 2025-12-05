"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ShieldAlert } from "lucide-react";
import FaultyTerminal from "@/components/FaultyTerminal";

const DeviceAuthorizationPage = () => {
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const formattedCode = userCode.trim().replace(/-/g, "").toUpperCase();

      const response = await authClient.device({
        query: { user_code: formattedCode },
      });

      if (response.data) {
        router.push(`/approve?user_code=${formattedCode}`);
      }
    } catch (error) {
      setError("Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4, 8);
    }
    setUserCode(value);
  };

  const Faulty = useMemo(() => {
    return (
      <div className="absolute inset-0 z-0.5 opacity-[0.35] pointer-events-none h-full w-full">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={1}
          scanlineIntensity={0.5}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint="#826490"
          brightness={0.9}
          pageLoadAnimation={true}
          mouseReact={true}
          mouseStrength={0.5}
        />
      </div>
    );
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      {Faulty}

      {/* Your Page Content */}
      <div className="w-full max-w-md z-30">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="p-3 rounded-lg border-2 border-dashed border-zinc-700">
            <ShieldAlert className="w-8 h-8 text-yellow-300" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Device Authorization
            </h1>
            <p className="text-muted-foreground">
              Enter your device code to continue
            </p>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="border-2 border-dashed border-zinc-700 rounded-xl p-8 bg-black/40 backdrop-blur-xl"
        >
          <div className="space-y-6">
            {/* Code Input */}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Device Code
              </label>
              <input
                id="code"
                type="text"
                value={userCode}
                onChange={handleCodeChange}
                placeholder="XXXX-XXXX"
                maxLength={9}
                className="w-full px-4 py-3 bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-zinc-600 font-mono text-center text-lg tracking-widest"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Find this code on the device you want to authorize
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-950 border border-red-900 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || userCode.length < 9}
              className="w-full py-3 px-4 bg-zinc-100 text-zinc-950 font-semibold rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {isLoading ? "Verifying..." : "Continue"}
            </button>

            {/* Info Box */}
            <div className="p-4 bg-zinc-900/60 border-2 border-dashed border-zinc-700 rounded-lg backdrop-blur">
              <p className="text-xs text-muted-foreground leading-relaxed">
                This code is unique to your device and will expire shortly. Keep
                it confidential and never share it with anyone.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceAuthorizationPage;

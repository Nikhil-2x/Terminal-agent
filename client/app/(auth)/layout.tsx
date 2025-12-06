"use client";
import FaultyTerminal from "@/components/FaultyTerminal";
import React, { useMemo } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
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
    <div className="flex flex-col items-center justify-center h-screen">
      {Faulty}
      {children}
    </div>
  );
};

export default AuthLayout;

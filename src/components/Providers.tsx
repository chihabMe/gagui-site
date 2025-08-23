"use client";
import { LazyMotion, domAnimation } from "motion/react";
import { ThemeProvider } from "@/contexts/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider>
        <LazyMotion features={domAnimation}>{children}</LazyMotion>
      </ThemeProvider>
    </>
  );
}

"use client";
import { LazyMotion, domAnimation } from "motion/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PostHogProvider } from "@/components/PostHogProvider";
import { PostHogPageView } from "@/components/PostHogPageView";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <ThemeProvider>
        <LazyMotion features={domAnimation}>
          <PostHogPageView />
          {children}
        </LazyMotion>
      </ThemeProvider>
    </PostHogProvider>
  );
}

"use client";

import React, { createContext, useContext } from "react";

const PostHogContext = createContext<any>(null);

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const mockPostHog = {
    capture: (event: string, properties?: any) => {
      console.log(`[PostHog Analytics] Event captured: "${event}"`, properties);
    },
  };

  return (
    <PostHogContext.Provider value={mockPostHog}>
      {children}
    </PostHogContext.Provider>
  );
}

export function usePostHog() {
  const context = useContext(PostHogContext);
  if (!context) {
    return {
      capture: (event: string, properties?: any) => {
        console.log(`[PostHog Analytics] Event captured: "${event}"`, properties);
      },
    };
  }
  return context;
}

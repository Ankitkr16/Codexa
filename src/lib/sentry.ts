// Production-ready mock logger compatible with Sentry API.
// Can be substituted with '@sentry/nextjs' in production configurations.

export const sentry = {
  captureException: (error: any, context?: any) => {
    console.error("[Sentry Logger] Captured Exception:", error, context);
  },
  captureMessage: (message: string, level?: "info" | "warning" | "error") => {
    console.log(`[Sentry Logger] [${level?.toUpperCase() || "INFO"}] ${message}`);
  },
};

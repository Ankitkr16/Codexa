"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { Terminal, Loader2, ArrowLeft } from "lucide-react";
import { GithubIcon, GoogleIcon } from "@/components/shared/BrandIcons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

const signupSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = zod.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/dashboard",
      });
      if (response?.error) {
        setError(response.error.message || "Failed to create account");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    try {
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (err: any) {
      setError(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative px-4 py-12">
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="glass border border-white/5 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 mb-3">
              <Terminal className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create an account</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Get started with Codexa today</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
              {errors.name && <span className="text-[10px] text-red-400 mt-1 block">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
              {errors.email && <span className="text-[10px] text-red-400 mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="w-full bg-white/3 border border-white/5 focus:border-primary/50 text-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
              {errors.password && <span className="text-[10px] text-red-400 mt-1 block">{errors.password.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Up"}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative bg-background/90 px-3 text-[10px] uppercase tracking-wider text-muted-foreground">or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleOAuthSignIn("github")}
              className="flex items-center justify-center gap-2 bg-white/3 border border-white/5 hover:bg-white/5 hover:border-white/10 text-white py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </button>
            <button
              onClick={() => handleOAuthSignIn("google")}
              className="flex items-center justify-center gap-2 bg-white/3 border border-white/5 hover:bg-white/5 hover:border-white/10 text-white py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              <GoogleIcon className="h-4 w-4 text-primary" />
              Google
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

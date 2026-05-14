"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-1 md:grid-cols-4 border-r border-border opacity-20">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-l border-border h-full" />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10 animate-reveal">
        <div className="mb-10 text-center">
          <Link href="/" className="font-serif text-3xl tracking-tight text-foreground hover:opacity-80 transition-opacity">Campus Founders Network</Link>
          <div className="mt-4 flex items-center justify-center gap-2">
             <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
             <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
               Directory Access
             </span>
          </div>
        </div>

        <div className="bg-secondary border border-border p-8">
          <h1 className="font-serif text-4xl text-foreground mb-2">Initialize Session</h1>
          <p className="font-mono text-sm text-muted-foreground mb-8 border-b border-border/50 pb-4">
            Authenticate to access the founder network.
          </p>

          <form onSubmit={handleSignIn} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 font-mono text-sm">
                [Error] {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">
                .EDU Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@university.edu"
                className="input focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-primary hover:bg-background hover:text-primary mt-4"
            >
              {loading ? "Authenticating..." : "Login to Network"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-border/50 pt-6">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              No active session?{" "}
              <Link href="/sign-up" className="text-primary font-bold hover:underline">
                Create Account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

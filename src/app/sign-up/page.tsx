"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate .edu email
    if (!email.toLowerCase().endsWith(".edu")) {
      setError("An active .edu email address is required to join the network.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess("Account initialized. Please check your email to verify your identity before accessing the directory.");
      setLoading(false);
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
               Secure Onboarding
             </span>
          </div>
        </div>

        <div className="bg-secondary border border-border p-8">
          <h1 className="font-serif text-4xl text-foreground mb-2">Create Record</h1>
          <p className="font-mono text-sm text-muted-foreground mb-8 border-b border-border/50 pb-4">
            Join the exclusive founder directory.
          </p>

          {success ? (
             <div className="bg-primary/10 border border-primary text-primary px-4 py-6 font-mono text-sm text-center">
               {success}
             </div>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-5">
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 font-mono text-sm">
                  [Error] {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">
                  University Email (.edu required)
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

              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-4 font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-primary hover:bg-background hover:text-primary mt-4"
              >
                {loading ? "Processing..." : "Generate Access"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-border/50 pt-6">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              Existing member?{" "}
              <Link href="/sign-in" className="text-primary font-bold hover:underline">
                Authenticate
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

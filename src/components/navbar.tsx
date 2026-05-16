"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
    }
    loadUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="font-serif text-2xl tracking-tight text-foreground hover:opacity-80 transition-opacity">Founders Scout</Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            [ Directory ]
          </Link>
          {currentUserId && (
            <Link
              href={`/profile/${currentUserId}`}
              className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              [ My Profile ]
            </Link>
          )}
          <Link
            href="/onboarding"
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            [ Edit Profile ]
          </Link>
          <button
            onClick={handleSignOut}
            className="text-xs font-mono uppercase tracking-widest text-destructive hover:opacity-80 transition-opacity border border-destructive px-3 py-1"
          >
            Terminate Session
          </button>
        </div>
      </div>
    </nav>
  );
}

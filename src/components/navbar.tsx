"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="font-serif text-2xl tracking-tight text-foreground hover:opacity-80 transition-opacity">Campus Founders Network</Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            [ Directory ]
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
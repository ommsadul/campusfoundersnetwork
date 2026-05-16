import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LandingHeroLeft } from "@/components/landing/hero-left";
import { LandingHeroRight } from "@/components/landing/hero-right";
import { LandingMarquee } from "@/components/landing/marquee";
import { LandingFooter } from "@/components/landing/footer";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 pointer-events-none grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 border-r border-border opacity-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-l border-border h-full" />
        ))}
      </div>

      <nav className="relative z-10 w-full bg-background/80 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-3xl tracking-tight text-foreground hover:opacity-80 transition-opacity">
            Campus Founders Network
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              [ Login ]
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-bold bg-primary text-primary-foreground px-6 py-2.5 rounded-none border border-primary hover:bg-background hover:text-primary transition-all"
            >
              INITIALIZE
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 relative z-10 flex flex-col justify-center max-w-screen-2xl mx-auto w-full px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <LandingHeroLeft />
          <LandingHeroRight />
        </div>
      </main>

      <LandingMarquee />
      <LandingFooter />
    </div>
  );
}

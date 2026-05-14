import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  
  if (data?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 border-r border-border opacity-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-l border-border h-full" />
        ))}
      </div>

      {/* Nav */}
      <nav className="relative z-10 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-3xl tracking-tight text-foreground hover:opacity-80 transition-opacity">Campus Founders Network</Link>
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

      {/* Hero */}
      <main className="flex-1 relative z-10 flex flex-col justify-center max-w-screen-2xl mx-auto w-full px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="col-span-1 lg:col-span-8 flex flex-col justify-center animate-reveal">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Network Active / University Only
              </span>
            </div>
            
            <h1 className="font-serif text-7xl sm:text-8xl lg:text-9xl leading-[0.9] tracking-tighter text-foreground mb-8">
              Build the <br />
              <span className="italic text-primary relative">
                next big thing
                <span className="absolute bottom-1 left-0 w-full h-1 bg-primary/20"></span>
              </span>
              <br /> on campus.
            </h1>
            
            <div className="max-w-xl animate-reveal delay-100 border-l-4 border-primary pl-6 py-2 my-8">
              <p className="text-xl sm:text-2xl text-foreground font-medium leading-snug">
                An exclusive directory for ambitious students seeking co-founders. 
                Stop building alone. Start shipping today.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-reveal delay-200">
              <Link
                href="/sign-up"
                className="bg-accent text-accent-foreground px-8 py-4 text-base font-bold uppercase tracking-wider flex items-center gap-3 border border-accent hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Join Directory
                <span className="font-serif italic normal-case text-xl">&rarr;</span>
              </Link>
              <span className="font-mono text-sm text-muted-foreground">
                Requires valid .edu email
              </span>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4 flex flex-col justify-end animate-reveal delay-300">
             <div className="bg-secondary border border-border p-8 relative overflow-hidden group">
               {/* Abstract decorative element */}
               <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border border-primary/20 group-hover:scale-110 transition-transform duration-700"></div>
               <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full border border-border/60 group-hover:scale-110 transition-transform duration-700 delay-100"></div>
               
               <h3 className="font-serif text-3xl mb-4 relative z-10">Why join?</h3>
               <ul className="space-y-4 font-mono text-sm relative z-10">
                 <li className="flex items-start gap-3 border-b border-border/50 pb-3">
                   <span className="text-primary font-bold">01</span>
                   <span>Access highly vetted technical & non-technical talent.</span>
                 </li>
                 <li className="flex items-start gap-3 border-b border-border/50 pb-3">
                   <span className="text-primary font-bold">02</span>
                   <span>Filter by skills, major, and graduation year.</span>
                 </li>
                 <li className="flex items-start gap-3 pb-2">
                   <span className="text-primary font-bold">03</span>
                   <span>Zero noise. Pure builder signal.</span>
                 </li>
               </ul>
             </div>
          </div>

        </div>
      </main>

      {/* Marquee Banner */}
      <div className="border-y border-border bg-accent text-accent-foreground py-3 overflow-hidden relative z-10 flex whitespace-nowrap">
        <div className="animate-[marquee_20s_linear_infinite] flex items-center gap-8 font-mono text-sm uppercase tracking-widest">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>Find a technical co-founder</span>
              <span className="text-primary opacity-50">*</span>
              <span>Find a business co-founder</span>
              <span className="text-primary opacity-50">*</span>
            </span>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-border bg-background py-8 mt-auto">
        <div className="max-w-screen-2xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-serif text-2xl tracking-tight text-foreground">Campus Founders Network</div>
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest" suppressHydrationWarning>
            © {new Date().getFullYear()} / System Online
          </div>
        </div>
      </footer>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  // Fetch the current user's university to filter others
  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("university")
    .eq("id", user.id)
    .single();

  // Fetch real founders from the database
  // Note: Temporarily showing yourself in the directory as requested
  const { data: founders, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("profile_completed", true)
    .eq("university", currentUserProfile?.university) // Filter by same university
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching founders:", error);
  }

  return (
    <div className="max-w-screen-2xl mx-auto py-12 px-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-border pb-8 mb-12">
        <div className="animate-reveal">
          <div className="inline-flex items-center gap-3 mb-4">
             <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
             <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
               Live Database / {currentUserProfile?.university || "Global"}
             </span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl text-foreground leading-none tracking-tight">
            Founder <span className="italic text-primary">Directory</span>
          </h1>
        </div>
        <Link
          href="/onboarding"
          className="bg-primary text-primary-foreground px-6 py-3 font-mono font-bold uppercase tracking-wider transition-all border border-primary hover:bg-background hover:text-primary animate-reveal delay-100"
        >
          Edit My Profile
        </Link>
      </div>

      {!founders || founders.length === 0 ? (
        <div className="bg-secondary border border-border p-12 text-center animate-reveal">
          <h3 className="font-serif text-3xl mb-4 text-foreground">No other founders yet.</h3>
          <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
            Be the first to build at {currentUserProfile?.university || "your university"}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {founders.map((founder, i) => (
            <div 
              key={founder.id} 
              className={`bg-card border border-border p-6 hover:border-primary transition-all group flex flex-col animate-reveal`}
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-serif text-3xl text-foreground group-hover:text-primary transition-colors">
                  {founder.first_name} {founder.last_name}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-widest bg-muted text-muted-foreground px-2 py-1 border border-border">
                  {founder.is_technical ? "TECH" : "BIZ"}
                </span>
              </div>
              
              <div className="mb-6 flex-1">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2 border-b border-border/50 pb-2">
                  Current Thesis
                </p>
                <p className="text-foreground text-sm font-medium leading-relaxed italic">
                  &quot;{founder.idea_description || "Exploring interesting problem spaces..."}&quot;
                </p>
              </div>

              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">
                  Core Competencies
                </p>
                <div className="flex flex-wrap gap-2">
                  {(founder.startup_areas || []).slice(0, 3).map((area: string) => (
                    <span key={area} className="font-mono text-xs bg-secondary text-secondary-foreground px-2 py-1 border border-border">
                      {area}
                    </span>
                  ))}
                  {(!founder.startup_areas || founder.startup_areas.length === 0) && (
                    <span className="font-mono text-[10px] text-muted-foreground italic">No areas specified</span>
                  )}
                </div>
              </div>

              <Link 
                href={`/profile/${founder.id}`}
                className="w-full mt-8 bg-accent text-accent-foreground py-3 font-mono text-sm uppercase tracking-wider border border-border hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2 group/btn"
              >
                <span>View Profile</span>
                <span className="font-serif italic text-lg group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

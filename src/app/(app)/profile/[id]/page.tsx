import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) redirect("/sign-in");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !profile) {
    return notFound();
  }

  const isOwnProfile = authUser.id === id;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 border-r border-border opacity-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-l border-border h-full" />
        ))}
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10 py-12 px-6">
        {/* Back Link */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-12 group">
          <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Directory
        </Link>

        {/* Profile Header */}
        <div className="bg-secondary border border-border p-8 lg:p-12 animate-reveal">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12 border-b border-border pb-8">
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${profile.is_technical ? 'bg-primary' : 'bg-accent'}`} />
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {profile.is_technical ? "Technical Founder" : "Business Founder"} / {profile.university}
                </span>
              </div>
              <h1 className="font-serif text-6xl text-foreground leading-tight">
                {profile.first_name} {profile.last_name}
              </h1>
              {profile.location && (
                <p className="font-mono text-sm text-muted-foreground mt-2 uppercase tracking-widest">Based in {profile.location}</p>
              )}
            </div>
            
            {isOwnProfile && (
              <Link 
                href="/onboarding" 
                className="bg-background text-foreground border border-border px-6 py-2 font-mono text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                Edit My Profile
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-12">
              {/* Bio Section */}
              <section>
                <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 border-b border-border/50 pb-2">The Mission</h2>
                <p className="text-xl text-foreground font-medium leading-relaxed">
                  {profile.bio || "No biography provided."}
                </p>
              </section>

              {/* Idea Section */}
              <section className="bg-background border border-border p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground opacity-30">
                  Status: {profile.idea_status}
                </div>
                <h2 className="font-mono text-xs uppercase tracking-widest text-primary font-bold mb-4">Current Thesis</h2>
                <div className="font-serif text-3xl italic text-foreground mb-6">
                  &quot;{profile.idea_description || "Exploring the frontier of university-led innovation."}&quot;
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {profile.startup_areas?.map((area: string) => (
                    <span key={area} className="px-3 py-1 bg-secondary border border-border font-mono text-[10px] uppercase tracking-widest">
                      {area}
                    </span>
                  ))}
                </div>
              </section>

              {/* Accomplishment Section */}
              {profile.accomplishment && (
                <section>
                  <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 border-b border-border/50 pb-2">Key Accomplishment</h2>
                  <p className="text-lg text-foreground leading-relaxed">
                    {profile.accomplishment}
                  </p>
                </section>
              )}
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-6 bg-background/50 border border-border p-6">
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Availability</h3>
                  <p className="font-serif text-xl">{profile.timeline?.replace(/_/g, ' ') || "TBD"}</p>
                </div>
                
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Academic Core</h3>
                  <p className="font-serif text-xl">{profile.education || "University Student"}</p>
                </div>

                {profile.interested_topics?.length > 0 && (
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interested_topics.map((topic: string) => (
                        <span key={topic} className="text-xs text-foreground font-medium lowercase italic">#{topic.replace(/\s+/g, '')}</span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.linkedin_url && (
                  <div className="pt-4 border-t border-border">
                    <a 
                      href={profile.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:underline"
                    >
                      View LinkedIn Profile &rarr;
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border flex justify-center">
             <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
               Record Verified / {profile.university} / Campus Founders Network
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

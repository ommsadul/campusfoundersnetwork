"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const STEPS = ["Basics", "Startup Journey", "Co-Founder Preferences"];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    location: "",
    is_technical: false,
    idea_status: "OPEN",
    idea_description: "",
    timeline: "READY_WHEN_RIGHT",
    startup_areas: [] as string[],
    interested_topics: [] as string[],
    accomplishment: "",
    education: "",
    linkedin_url: "",
  });

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
        return;
      }
      
      // Check if profile exists and if it's already completed
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      if (profile) {
        setFormData({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          bio: profile.bio || "",
          location: profile.location || "",
          is_technical: profile.is_technical || false,
          idea_status: profile.idea_status || "OPEN",
          idea_description: profile.idea_description || "",
          timeline: profile.timeline || "READY_WHEN_RIGHT",
          startup_areas: profile.startup_areas || [],
          interested_topics: profile.interested_topics || [],
          accomplishment: profile.accomplishment || "",
          education: profile.education || "",
          linkedin_url: profile.linkedin_url || "",
        });
      }
      setInitialLoading(false);
    }
    checkUser();
  }, [router, supabase]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        ...formData,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error(error);
      alert("Error saving profile. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col p-6">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 border-r border-border opacity-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-l border-border h-full" />
        ))}
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10 py-12">
        <header className="mb-12">
          <Link href="/" className="font-serif text-3xl tracking-tight text-foreground hover:opacity-80 transition-opacity">Campus Founders Network</Link>
          <div className="mt-8 flex items-center justify-between border-b border-border pb-4">
             <div>
               <h1 className="font-serif text-5xl text-foreground">Complete Profile</h1>
               <p className="font-mono text-sm text-muted-foreground mt-2 uppercase tracking-widest">Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}</p>
             </div>
             <div className="hidden sm:flex gap-2">
                {STEPS.map((_, i) => (
                  <div key={i} className={`h-2 w-12 border border-border ${i <= currentStep ? 'bg-primary' : 'bg-transparent'}`} />
                ))}
             </div>
          </div>
        </header>

        <div className="bg-secondary border border-border p-8 lg:p-12 animate-reveal">
          
          {currentStep === 0 && (
            <div className="space-y-8 animate-reveal">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    className="input"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    className="input"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">Personal Biography</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="input min-h-[120px]"
                  placeholder="Tell us about your background, interests, and what drives you..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">Primary Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="input"
                    placeholder="e.g. San Francisco, New York, or Remote"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                    className="input"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.is_technical}
                      onChange={(e) => setFormData({...formData, is_technical: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-muted border-2 border-border rounded-none peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                    <div className="absolute left-1 top-1 w-6 h-6 bg-background border border-border peer-checked:translate-x-6 transition-all"></div>
                  </div>
                  <span className="font-mono text-sm uppercase tracking-widest text-foreground font-bold">I am a Technical Founder (Developer/Engineer)</span>
                </label>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8 animate-reveal">
              <div className="space-y-4">
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold border-b border-border pb-2 mb-4">Current Idea Status</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "COMMITTED", label: "Committed", desc: "Building a specific idea." },
                    { id: "EXPLORING", label: "Exploring", desc: "Evaluating market niches." },
                    { id: "OPEN", label: "Open", desc: "Ready for new concepts." }
                  ].map((status) => (
                    <button
                      key={status.id}
                      onClick={() => setFormData({...formData, idea_status: status.id})}
                      className={`p-4 border text-left transition-all ${formData.idea_status === status.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-background border-border hover:border-primary'}`}
                    >
                      <span className="font-serif text-xl block mb-1">{status.label}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">{status.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">What are you working on / interested in?</label>
                <textarea
                  rows={4}
                  value={formData.idea_description}
                  onChange={(e) => setFormData({...formData, idea_description: e.target.value})}
                  className="input min-h-[120px]"
                  placeholder="Describe your current thesis or problem spaces you find fascinating..."
                />
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">Startup Areas of Interest</label>
                <div className="flex flex-wrap gap-2">
                  {["AI/ML", "SaaS", "Fintech", "Healthtech", "Consumer", "DevTools", "BioTech", "Hardware", "EduTech", "Crypto/Web3"].map((area) => (
                    <button
                      key={area}
                      onClick={() => {
                        const newAreas = formData.startup_areas.includes(area)
                          ? formData.startup_areas.filter(a => a !== area)
                          : [...formData.startup_areas, area];
                        setFormData({...formData, startup_areas: newAreas});
                      }}
                      className={`px-3 py-1 font-mono text-xs border transition-all ${formData.startup_areas.includes(area) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary'}`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">Biggest Accomplishment</label>
                <input
                  type="text"
                  value={formData.accomplishment}
                  onChange={(e) => setFormData({...formData, accomplishment: e.target.value})}
                  className="input"
                  placeholder="Something you've built or achieved that you're proud of..."
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 animate-reveal">
              <div className="space-y-4">
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold border-b border-border pb-2 mb-4">When can you go full-time?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "ALREADY_FULLTIME", label: "Already Full-time" },
                    { id: "READY_WHEN_RIGHT", label: "When the idea is right" },
                    { id: "NEXT_YEAR", label: "Next academic year" },
                    { id: "NO_PLANS", label: "Just exploring for now" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFormData({...formData, timeline: item.id})}
                      className={`p-4 border text-left transition-all ${formData.timeline === item.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-background border-border hover:border-primary'}`}
                    >
                      <span className="font-serif text-xl">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">Academic Background</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({...formData, education: e.target.value})}
                  className="input"
                  placeholder="Degree, major, and graduation year..."
                />
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground font-bold">Favorite Topics / Intellectual Hobbies</label>
                <p className="font-mono text-[10px] text-muted-foreground uppercase mb-2 italic underline text-primary">Separated by commas</p>
                <input
                  type="text"
                  value={formData.interested_topics.join(", ")}
                  onChange={(e) => setFormData({...formData, interested_topics: e.target.value.split(",").map(t => t.trim())})}
                  className="input"
                  placeholder="Distributed systems, philosophy, pottery, weightlifting..."
                />
              </div>

              <div className="bg-primary/5 border-l-4 border-primary p-6 mt-8">
                <p className="font-serif text-xl italic text-foreground">
                  &ldquo;Great things are done by a series of small things brought together.&rdquo;
                </p>
                <p className="font-mono text-[10px] mt-2 uppercase tracking-widest text-muted-foreground">— The Network Awaits</p>
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-between items-center pt-8 border-t border-border">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`font-mono text-sm uppercase tracking-widest px-6 py-2 border border-border transition-all ${currentStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-accent hover:text-accent-foreground'}`}
            >
              [ Back ]
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="bg-primary text-primary-foreground px-10 py-4 font-mono font-bold uppercase tracking-wider transition-all border border-primary hover:bg-background hover:text-primary"
            >
              {loading ? "Initializing..." : currentStep === STEPS.length - 1 ? "Complete Registration" : "Next Segment"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

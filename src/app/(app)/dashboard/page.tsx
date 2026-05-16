"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { FounderCard } from "@/components/dashboard/founder-card";
import { ConnectModal } from "@/components/dashboard/connect-modal";
import type { Profile } from "@/types/database";

const MOCK_FOUNDERS: Profile[] = [
  {
    id: "mock-1",
    first_name: "Aarav",
    last_name: "Patel",
    bio: "Computer science student focused on applied AI products.",
    location: "Boston",
    university: "Northeastern University",
    is_technical: true,
    idea_status: "EXPLORING",
    idea_description: "Building an AI workflow assistant for student startups.",
    timeline: "READY_WHEN_RIGHT",
    startup_areas: ["AI/ML", "SaaS", "DevTools"],
    interested_topics: ["agent systems", "product strategy"],
    accomplishment: "Built and shipped 4 web products in college.",
    education: "BS Computer Science, 2027",
    linkedin_url: "",
    profile_completed: true,
  },
  {
    id: "mock-2",
    first_name: "Maya",
    last_name: "Chen",
    bio: "Growth and GTM operator with fintech interest.",
    location: "San Francisco",
    university: "UC Berkeley",
    is_technical: false,
    idea_status: "COMMITTED",
    idea_description: "Working on modern treasury tools for student founders.",
    timeline: "ALREADY_FULLTIME",
    startup_areas: ["Fintech", "SaaS"],
    interested_topics: ["distribution", "payments"],
    accomplishment: "Scaled a campus product from 0 to 8k MAU.",
    education: "BA Economics, 2026",
    linkedin_url: "",
    profile_completed: true,
  },
  {
    id: "mock-3",
    first_name: "Noah",
    last_name: "Williams",
    bio: "Backend engineer with infra and API focus.",
    location: "Austin",
    university: "UT Austin",
    is_technical: true,
    idea_status: "OPEN",
    idea_description: "Open to joining infra-heavy early-stage ideas.",
    timeline: "NEXT_YEAR",
    startup_areas: ["DevTools", "AI/ML", "Hardware"],
    interested_topics: ["distributed systems", "security"],
    accomplishment: "Designed a high-throughput event processing system.",
    education: "BS Computer Engineering, 2027",
    linkedin_url: "",
    profile_completed: true,
  },
  {
    id: "mock-4",
    first_name: "Sofia",
    last_name: "Garcia",
    bio: "Design-minded founder interested in consumer products.",
    location: "New York",
    university: "NYU",
    is_technical: false,
    idea_status: "EXPLORING",
    idea_description: "Testing social accountability products for students.",
    timeline: "READY_WHEN_RIGHT",
    startup_areas: ["Consumer", "SaaS"],
    interested_topics: ["community", "behavior design"],
    accomplishment: "Launched two successful campus communities.",
    education: "BS Media, Culture, and Communication, 2026",
    linkedin_url: "",
    profile_completed: true,
  },
  {
    id: "mock-5",
    first_name: "Ibrahim",
    last_name: "Khan",
    bio: "ML engineer focused on healthcare prediction models.",
    location: "Chicago",
    university: "Northwestern University",
    is_technical: true,
    idea_status: "COMMITTED",
    idea_description: "Building tooling for preventive health monitoring.",
    timeline: "ALREADY_FULLTIME",
    startup_areas: ["Healthtech", "AI/ML"],
    interested_topics: ["medical AI", "data quality"],
    accomplishment: "Published 2 ML papers and led an open-source team.",
    education: "MS Computer Science, 2026",
    linkedin_url: "",
    profile_completed: true,
  },
  {
    id: "mock-6",
    first_name: "Emma",
    last_name: "Lopez",
    bio: "Product generalist with edtech and marketplace experience.",
    location: "Los Angeles",
    university: "UCLA",
    is_technical: false,
    idea_status: "OPEN",
    idea_description: "Looking for technical co-founder in education products.",
    timeline: "READY_WHEN_RIGHT",
    startup_areas: ["EduTech", "Consumer", "SaaS"],
    interested_topics: ["market research", "brand"],
    accomplishment: "Built and monetized a niche campus marketplace.",
    education: "BA Business Economics, 2027",
    linkedin_url: "",
    profile_completed: true,
  },
];
const USE_MOCK_DATA = process.env.NODE_ENV === "development";

export default function DashboardPage() {
  const [founders, setFounders] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFounder, setSelectedFounder] = useState<Profile | null>(null);
  const [connectSuccess, setConnectSuccess] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);

      let query = supabase.from("profiles").select("*").eq("profile_completed", true);
      if (user) query = query.neq("id", user.id);

      const { data, error } = await query;

      if (error) {
        setConnectError("Could not load founder profiles. Please refresh.");
      } else {
        const loaded = (data ?? []) as Profile[];
        setFounders(loaded.length > 0 ? loaded : USE_MOCK_DATA ? MOCK_FOUNDERS : []);
      }
      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]));
  };

  const filteredFounders = founders.filter((founder) => {
    const matchesType =
      activeFilter === "ALL" ||
      (activeFilter === "TECHNICAL" && founder.is_technical) ||
      (activeFilter === "NON-TECHNICAL" && !founder.is_technical);

    const matchesArea = selectedAreas.length === 0 || selectedAreas.some((area) => (founder.startup_areas || []).includes(area));

    return matchesType && matchesArea;
  });

  const handleOpenConnect = (founder: Profile) => {
    setConnectError(null);
    setConnectSuccess(null);

    if (currentUserId && founder.id === currentUserId) {
      setConnectError("You cannot send a request to your own profile.");
      return;
    }

    setSelectedFounder(founder);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background p-6 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[grid-line_1px_rgba(0,0,0,0.1)] [background-size:40px_40px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-8">
            <div className="max-w-2xl border-l-4 border-primary pl-6">
              <p className="font-serif text-4xl md:text-5xl leading-tight text-foreground">
                Connecting driven founders.
                <span className="text-primary"> Building what matters.</span>
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Scan the network for technical partners and domain experts. Broadcast your thesis to initialize high-signal connections.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 min-w-[320px]">
              <div className="border-l border-border/60 pl-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2">Nodes Online</p>
                <div className="flex items-end gap-2">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full mb-2 animate-pulse" />
                  <span className="font-serif text-6xl leading-none text-foreground">{founders.length}</span>
                </div>
              </div>
              <div className="border-l border-border/60 pl-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2">Resulting Matches</p>
                <div className="flex items-end gap-2">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full mb-2" />
                  <span className="font-serif text-6xl leading-none text-foreground">{filteredFounders.length}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {connectSuccess && <div className="mb-6 bg-primary/10 border border-primary text-primary px-4 py-3 font-mono text-xs uppercase tracking-wider">{connectSuccess}</div>}
        {connectError && <div className="mb-6 bg-destructive/10 border border-destructive text-destructive px-4 py-3 font-mono text-xs uppercase tracking-wider">{connectError}</div>}

        <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} selectedAreas={selectedAreas} toggleArea={toggleArea} />

        {filteredFounders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFounders.map((founder, index) => (
              <FounderCard key={founder.id} founder={founder} index={index} onConnect={() => handleOpenConnect(founder)} />
            ))}
          </div>
        ) : (
          <div className="py-24 border border-dashed border-border flex flex-col items-center justify-center text-center">
            <span className="font-serif text-4xl text-muted-foreground mb-4 opacity-50">No matching nodes found.</span>
            <button onClick={() => { setActiveFilter("ALL"); setSelectedAreas([]); }} className="font-mono text-xs uppercase tracking-widest text-primary hover:underline">
              [ Reset Filters ]
            </button>
          </div>
        )}
      </div>

      {selectedFounder && (
        <ConnectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          receiverId={selectedFounder.id}
          receiverName={`${selectedFounder.first_name ?? "Founder"}`}
          onSuccess={() => setConnectSuccess("Signal broadcasted. Connection pending.")}
        />
      )}
    </div>
  );
}

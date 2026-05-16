"use client";

interface FilterBarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  selectedAreas: string[];
  toggleArea: (area: string) => void;
}

const STARTUP_AREAS = ["AI/ML", "SaaS", "Fintech", "Healthtech", "DevTools", "Consumer", "Hardware", "BioTech"];

export function FilterBar({ activeFilter, setActiveFilter, selectedAreas, toggleArea }: FilterBarProps) {
  return (
    <div className="space-y-6 mb-12 animate-reveal">
      <div className="flex flex-wrap gap-3">
        {["ALL", "TECHNICAL", "NON-TECHNICAL"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 border transition-all ${
              activeFilter === filter
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {filter.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 self-center mr-2">Focus Areas:</span>
        {STARTUP_AREAS.map((area) => (
          <button
            key={area}
            onClick={() => toggleArea(area)}
            className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1 border transition-all rounded-full ${
              selectedAreas.includes(area)
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-secondary/50 border-border text-muted-foreground hover:border-accent hover:text-accent"
            }`}
          >
            {area}
          </button>
        ))}
      </div>
    </div>
  );
}

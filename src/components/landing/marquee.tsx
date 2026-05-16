export function LandingMarquee() {
  return (
    <div className="border-y border-border bg-accent text-accent-foreground py-3 overflow-hidden relative z-10 flex whitespace-nowrap">
      <div className="animate-[marquee_40s_linear_infinite] flex items-center gap-8 font-mono text-sm uppercase tracking-widest">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="flex items-center gap-8">
            <span>Match with full-stack technical founders</span>
            <span className="text-primary opacity-50">*</span>
            <span>Find GTM and operator co-founders</span>
            <span className="text-primary opacity-50">*</span>
            <span>Go from 0-1 prototype to production MVP</span>
            <span className="text-primary opacity-50">*</span>
            <span>Validate problem-solution fit with peers</span>
            <span className="text-primary opacity-50">*</span>
            <span>Filter by stack domain and build velocity</span>
            <span className="text-primary opacity-50">*</span>
            <span>Assemble balanced tech and business teams</span>
            <span className="text-primary opacity-50">*</span>
            <span>Turn campus R&D into venture-scale startups</span>
            <span className="text-primary opacity-50">*</span>
          </span>
        ))}
      </div>
    </div>
  );
}

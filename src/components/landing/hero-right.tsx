import { FounderSignalConsole } from "@/components/founder-signal-console";

export function LandingHeroRight() {
  return (
    <div className="col-span-1 lg:col-span-4 flex flex-col justify-end animate-reveal delay-300 relative">
      <FounderSignalConsole />

      <div className="bg-secondary border border-border p-8 relative overflow-hidden group">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border border-primary/20 group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full border border-border/60 group-hover:scale-110 transition-transform duration-700 delay-100" />

        <h3 className="font-serif text-3xl mb-4 relative z-10">Why join?</h3>
        <ul className="space-y-4 font-mono text-sm relative z-10">
          <li className="flex items-start gap-3 border-b border-border/50 pb-3">
            <span className="text-primary font-bold">01</span>
            <span>Access highly vetted technical and non-technical talent.</span>
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
  );
}

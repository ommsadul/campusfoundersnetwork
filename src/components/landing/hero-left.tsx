import Link from "next/link";

export function LandingHeroLeft() {
  return (
    <div className="col-span-1 lg:col-span-8 flex flex-col justify-center animate-reveal">
      <div className="inline-flex items-center gap-3 mb-8">
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Network Active / University Only
        </span>
      </div>

      <h1 className="font-serif text-7xl sm:text-8xl lg:text-9xl leading-[0.9] tracking-tighter text-foreground mb-8">
        Build the <br />
        <span className="italic text-primary">next big thing</span>
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
        <span className="font-mono text-sm text-muted-foreground">Requires valid .edu email</span>
      </div>
    </div>
  );
}

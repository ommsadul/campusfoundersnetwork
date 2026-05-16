export function LandingFooter() {
  return (
    <footer className="relative z-10 w-full border-t border-border bg-background py-8 mt-auto">
      <div className="max-w-screen-2xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="font-serif text-2xl tracking-tight text-foreground">Campus Founders Network</div>
        <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest" suppressHydrationWarning>
          (c) {new Date().getFullYear()} / All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

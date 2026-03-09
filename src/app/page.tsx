import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className="font-bold text-xl tracking-tight">Campus Founders</span>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary-hover transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-28 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-muted text-sm text-muted-foreground px-4 py-1.5 rounded-full mb-8 font-medium">
          <span>For university founders</span>
          <span className="text-foreground">&rarr;</span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold leading-[1.08] tracking-tight text-foreground">
          Find your
          <br />
          co-founder
          <br />
          on campus.
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mt-8 max-w-2xl mx-auto leading-relaxed">
          Like YC co-founder matching, but for universities. Create your profile,
          share your ideas, and connect with fellow students who want to build
          startups together.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sign-up"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-medium hover:bg-primary-hover transition-colors inline-flex items-center justify-center gap-2"
          >
            Join with your .edu email
            <span>&rarr;</span>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Free for all university students
        </p>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-secondary/50">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 tracking-tight">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Create your profile",
                desc: "Share your background, skills, startup ideas, and what you're looking for in a co-founder.",
              },
              {
                step: "02",
                title: "Browse founders",
                desc: "Explore profiles of students at your university who are building or want to build startups.",
              },
              {
                step: "03",
                title: "Connect & build",
                desc: "Found a match? Schedule a call, share ideas, and start building together.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-sm font-mono font-bold text-muted-foreground mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
            For founders who are serious.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            This isn&apos;t a job board or a social network. Everyone here has
            agreed to use this platform for one purpose: finding a co-founder.
            No selling, no hiring, no spam.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-secondary/50 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            Ready to find your co-founder?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join hundreds of students building the next generation of startups.
          </p>
          <Link
            href="/sign-up"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-medium hover:bg-primary-hover transition-colors inline-flex items-center gap-2"
          >
            Get started free
            <span>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Campus Founders
        </p>
      </footer>
    </div>
  );
}

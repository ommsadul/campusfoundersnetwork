import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DashboardContent } from "./dashboard-content";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const clerkUser = await (await import("@clerk/nextjs/server")).currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

  let user = await db.user.findUnique({ where: { clerkId } });
  if (!user && email) {
    user = await db.user.findUnique({ where: { email } });
    if (user) {
      user = await db.user.update({ where: { id: user.id }, data: { clerkId } });
    }
  }
  if (!user) redirect("/onboarding");
  if (user.profileStep < 3) redirect("/onboarding");

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Co-Founders at {user.university}
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse profiles and find your next co-founder
          </p>
        </div>
        <a
          href="/onboarding"
          className="inline-flex items-center justify-center border border-border text-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-muted/10 transition-colors"
        >
          Edit My Profile
        </a>
      </div>
      <DashboardContent />
    </div>
  );
}

import { auth, currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { OnboardingForm } from "./onboarding-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

  const existingUser =
    (await db.user.findUnique({ where: { clerkId: userId } })) ??
    (email ? await db.user.findUnique({ where: { email } }) : null);



  if (!email.endsWith(".edu")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            .edu Email Required
          </h1>
          <p className="text-muted-foreground">
            Campus Founders is only available to university students. Please
            sign up with your .edu email address.
          </p>
          <SignOutButton redirectUrl="/sign-in">
            <button className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary-hover transition-colors">
              Sign out &amp; try another email
            </button>
          </SignOutButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <OnboardingForm
        email={email}
        agreedToTerms={existingUser?.agreedToTerms ?? false}
        initialStep={existingUser?.profileStep ?? 0}
        existingProfile={existingUser}
      />
    </div>
  );
}

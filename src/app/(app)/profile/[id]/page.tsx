import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ProfileDetail } from "./profile-detail";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/onboarding");
  if (user.profileStep < 3) redirect("/onboarding");

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <ProfileDetail profileId={id} />
    </div>
  );
}

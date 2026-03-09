"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

const IDEA_LABELS: Record<string, string> = {
  COMMITTED: "Yes, I'm committed to an idea and I want a co-founder who can help me build it",
  EXPLORING: "I have some ideas, but I'm also open to exploring other ideas",
  OPEN: "No, I could help a co-founder with their existing idea or explore new ideas together",
};

const TIMELINE_LABELS: Record<string, string> = {
  ALREADY_FULLTIME: "Already full-time on a startup",
  READY_WHEN_RIGHT: "Ready to go full-time when meeting the right co-founder",
  NEXT_YEAR: "Planning to go full-time in the next year",
  NO_PLANS: "No specific plans yet",
};

export function ProfileDetail({ profileId }: { profileId: string }) {
  const { data: profile, isLoading, error } = trpc.profile.getById.useQuery({
    id: profileId,
  });

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-muted-foreground">Loading profile...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 mb-4">Profile not found</p>
        <Link href="/dashboard" className="text-primary hover:underline">
          Back to browse
        </Link>
      </div>
    );
  }

  if (!profile) return null;

  const age =
    profile.birthdate && now
      ? Math.floor(
          (now - new Date(profile.birthdate).getTime()) /
            (1000 * 60 * 60 * 24 * 365.25)
        )
      : null;

  return (
    <div>
      <Link
        href="/dashboard"
        className="text-primary hover:underline text-sm mb-6 inline-block"
      >
        &larr; Back to profiles
      </Link>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-secondary px-8 py-6 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-muted-foreground mt-1">
                {profile.location}
                {age !== null && ` · ${age} years old`}
                {profile.university && ` · ${profile.university}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.isTechnical !== null && (
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    profile.isTechnical
                      ? "badge-technical"
                      : "badge-nontechnical"
                  }`}
                >
                  {profile.isTechnical ? "Technical" : "Non-technical"}
                </span>
              )}
              {profile.ideaStatus && (
                <span className="badge-idea text-xs px-3 py-1 rounded-full font-medium">
                  {profile.ideaStatus === "COMMITTED"
                    ? "Has idea"
                    : profile.ideaStatus === "EXPLORING"
                    ? "Exploring"
                    : "Open to ideas"}
                </span>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-4">
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                LinkedIn
              </a>
            )}
            {profile.schedulingUrl && (
              <a
                href={profile.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:bg-primary-hover transition-colors"
              >
                Schedule a Call
              </a>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6">
          {/* About */}
          {profile.bio && (
            <Section title="About">
              <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>
            </Section>
          )}

          {/* Accomplishment */}
          {profile.accomplishment && (
            <Section title="Impressive Accomplishment">
              <p className="text-sm whitespace-pre-wrap">
                {profile.accomplishment}
              </p>
            </Section>
          )}

          {/* Education & Employment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {profile.education && (
              <Section title="Education">
                <p className="text-sm whitespace-pre-wrap">
                  {profile.education}
                </p>
              </Section>
            )}
            {profile.employment && (
              <Section title="Employment">
                <p className="text-sm whitespace-pre-wrap">
                  {profile.employment}
                </p>
              </Section>
            )}
          </div>

          {/* Startup Info */}
          {profile.ideaStatus && (
            <Section title="Startup Status">
              <p className="text-sm">
                {IDEA_LABELS[profile.ideaStatus] ?? profile.ideaStatus}
              </p>
              {profile.ideaDescription && (
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">
                  {profile.ideaDescription}
                </p>
              )}
            </Section>
          )}

          {profile.fullTimeTimeline && (
            <Section title="Full-time Timeline">
              <p className="text-sm">
                {TIMELINE_LABELS[profile.fullTimeTimeline] ??
                  profile.fullTimeTimeline}
              </p>
            </Section>
          )}

          {/* Areas */}
          {profile.startupAreas.length > 0 && (
            <Section title="Responsible For">
              <div className="flex flex-wrap gap-2">
                {profile.startupAreas.map((area: string) => (
                  <span
                    key={area}
                    className="bg-accent text-accent-foreground text-xs px-2.5 py-1 rounded-full font-medium"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Topics */}
          {profile.interestedTopics.length > 0 && (
            <Section title="Interested In">
              <div className="flex flex-wrap gap-2">
                {profile.interestedTopics.map((topic: string) => (
                  <span
                    key={topic}
                    className="badge-topic text-xs px-2.5 py-1 rounded-full font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Equity */}
          {profile.equityExpectation && (
            <Section title="Equity Expectations">
              <p className="text-sm">{profile.equityExpectation}</p>
            </Section>
          )}

          {/* Looking for */}
          {profile.lookingFor && (
            <Section title="Looking For in a Co-Founder">
              <p className="text-sm whitespace-pre-wrap">
                {profile.lookingFor}
              </p>
            </Section>
          )}

          {/* Personal */}
          {(profile.hobbies || profile.lifePath || profile.anythingElse) && (
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-4">Personal</h3>
              <div className="space-y-4">
                {profile.hobbies && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Free Time / Hobbies
                    </p>
                    <p className="text-sm">{profile.hobbies}</p>
                  </div>
                )}
                {profile.lifePath && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Life Path
                    </p>
                    <p className="text-sm">{profile.lifePath}</p>
                  </div>
                )}
                {profile.anythingElse && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Anything Else
                    </p>
                    <p className="text-sm">{profile.anythingElse}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">{title}</h3>
      {children}
    </div>
  );
}

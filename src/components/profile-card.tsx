"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ProfileCardProps {
  profile: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    location: string | null;
    isTechnical: boolean | null;
    ideaStatus: string | null;
    fullTimeTimeline: string | null;
    startupAreas: string[];
    interestedTopics: string[];
    accomplishment: string | null;
    education: string | null;
    lastActiveAt: Date;
    createdAt: Date;
  };
}

const IDEA_LABELS: Record<string, string> = {
  COMMITTED: "Committed to idea",
  EXPLORING: "Exploring ideas",
  OPEN: "Open to ideas",
};

const TIMELINE_LABELS: Record<string, string> = {
  ALREADY_FULLTIME: "Full-time",
  READY_WHEN_RIGHT: "Ready for full-time",
  NEXT_YEAR: "Full-time next year",
  NO_PLANS: "No specific plans",
};

export function ProfileCard({ profile }: ProfileCardProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
  }, []);

  const daysSinceActive = now
    ? Math.floor(
        (now - new Date(profile.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0; // Default to 0 or handled by loading state if critical, but 0 is safe "Active today" equivalent until loaded

  const activeLabel = !now
    ? "" // Show nothing or a placeholder during server render/hydration
    : daysSinceActive === 0
    ? "Active today"
    : daysSinceActive <= 7
    ? `Active ${daysSinceActive}d ago`
    : `Active ${daysSinceActive}d ago`;

  return (
    <Link
      href={`/profile/${profile.id}`}
      className="block bg-white border border-border rounded-xl p-6 hover:shadow-md transition-all"
    >
      {/* Name and active status */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-lg text-foreground">
          {profile.firstName} {profile.lastName}
        </h3>
        {activeLabel && (
          <span
            className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
              daysSinceActive <= 7
                ? "bg-emerald-50 text-emerald-700"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {activeLabel}
          </span>
        )}
      </div>

      {/* Location */}
      {profile.location && (
        <p className="text-muted-foreground text-sm mb-3">{profile.location}</p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {profile.isTechnical !== null && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              profile.isTechnical
                ? "badge-technical"
                : "badge-nontechnical"
            }`}
          >
            {profile.isTechnical ? "Technical" : "Non-technical"}
          </span>
        )}
        {profile.ideaStatus && (
          <span className="badge-idea text-xs px-2 py-0.5 rounded-full font-medium">
            {IDEA_LABELS[profile.ideaStatus] ?? profile.ideaStatus}
          </span>
        )}
        {profile.fullTimeTimeline && (
          <span className="badge-timeline text-xs px-2 py-0.5 rounded-full font-medium">
            {TIMELINE_LABELS[profile.fullTimeTimeline] ??
              profile.fullTimeTimeline}
          </span>
        )}
      </div>

      {/* Bio excerpt */}
      {profile.bio && (
        <p className="text-sm text-foreground line-clamp-3 mb-3">
          {profile.bio}
        </p>
      )}

      {/* Topics */}
      {profile.interestedTopics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {profile.interestedTopics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="badge-topic text-xs px-2 py-0.5 rounded font-medium"
            >
              {topic}
            </span>
          ))}
          {profile.interestedTopics.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{profile.interestedTopics.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Education snippet */}
      {profile.education && (
        <p className="text-xs text-muted-foreground line-clamp-1 mt-2">
          {profile.education}
        </p>
      )}
    </Link>
  );
}

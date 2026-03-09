"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ProfileCard } from "@/components/profile-card";
import { TOPICS } from "@/lib/validators";

const IDEA_FILTERS = [
  { value: undefined as string | undefined, label: "All" },
  { value: "COMMITTED" as const, label: "Has idea" },
  { value: "EXPLORING" as const, label: "Exploring" },
  { value: "OPEN" as const, label: "Open to ideas" },
];

export function DashboardContent() {
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState<string | undefined>(undefined);
  const [ideaFilter, setIdeaFilter] = useState<
    "COMMITTED" | "EXPLORING" | "OPEN" | undefined
  >(undefined);
  const [technicalFilter, setTechnicalFilter] = useState<
    boolean | undefined
  >(undefined);

  const { data: profiles, isLoading } = trpc.profile.browse.useQuery({
    topicFilter,
    ideaFilter,
    technicalFilter,
    search: search || undefined,
  });

  return (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, bio, or interests..."
          className="input focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 mb-6 p-4 bg-white rounded-xl border border-border">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Stage
          </label>
          <select
            value={ideaFilter ?? ""}
            onChange={(e) =>
              setIdeaFilter(
                (e.target.value as "COMMITTED" | "EXPLORING" | "OPEN") ||
                  undefined
              )
            }
            className="input"
          >
            {IDEA_FILTERS.map((f) => (
              <option key={f.label} value={f.value ?? ""}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Technical
          </label>
          <select
            value={
              technicalFilter === undefined
                ? ""
                : technicalFilter
                ? "true"
                : "false"
            }
            onChange={(e) =>
              setTechnicalFilter(
                e.target.value === ""
                  ? undefined
                  : e.target.value === "true"
              )
            }
            className="input"
          >
            <option value="">All</option>
            <option value="true">Technical</option>
            <option value="false">Non-technical</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Topic
          </label>
          <select
            value={topicFilter ?? ""}
            onChange={(e) =>
              setTopicFilter(e.target.value || undefined)
            }
            className="input"
          >
            <option value="">All Topics</option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">
          Loading profiles...
        </div>
      ) : !profiles?.length ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-3">
            No profiles match your filters.
          </p>
          <p className="text-sm text-muted-foreground">
            Try broadening your search or check back later as more students join.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {profiles.length} profile{profiles.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profiles.map((profile: any) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

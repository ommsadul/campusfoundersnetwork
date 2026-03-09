import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import { router, onboardedProcedure } from "../../trpc";

export const profileRouter = router({
  /** Browse profiles from your university (only complete profiles) */
  browse: onboardedProcedure
    .input(
      z.object({
        topicFilter: z.string().optional(),
        ideaFilter: z.enum(["COMMITTED", "EXPLORING", "OPEN"]).optional(),
        technicalFilter: z.boolean().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const profiles = await ctx.db.user.findMany({
        where: {
          universityDomain: ctx.user.universityDomain,
          profileStep: { gte: 3 },
          id: { not: ctx.user.id }, // exclude self
          ...(input.ideaFilter && { ideaStatus: input.ideaFilter }),
          ...(input.technicalFilter !== undefined && {
            isTechnical: input.technicalFilter,
          }),
          ...(input.topicFilter && {
            interestedTopics: { has: input.topicFilter },
          }),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          bio: true,
          location: true,
          isTechnical: true,
          ideaStatus: true,
          fullTimeTimeline: true,
          startupAreas: true,
          interestedTopics: true,
          accomplishment: true,
          education: true,
          lastActiveAt: true,
          createdAt: true,
        },
        orderBy: { lastActiveAt: "desc" },
      });

      // Client-side search filter
      if (input.search) {
        const q = input.search.toLowerCase();
        return profiles.filter(
          (p: any) =>
            p.firstName?.toLowerCase().includes(q) ||
            p.lastName?.toLowerCase().includes(q) ||
            p.bio?.toLowerCase().includes(q) ||
            p.accomplishment?.toLowerCase().includes(q) ||
            p.interestedTopics.some((t: any) => t.toLowerCase().includes(q))
        );
      }

      return profiles;
    }),

  /** View a single profile (must be same university) */
  getById: onboardedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          university: true,
          linkedinUrl: true,
          location: true,
          bio: true,
          accomplishment: true,
          education: true,
          employment: true,
          isTechnical: true,
          gender: true,
          birthdate: true,
          schedulingUrl: true,
          ideaStatus: true,
          ideaDescription: true,
          hasCofounder: true,
          fullTimeTimeline: true,
          startupAreas: true,
          interestedTopics: true,
          equityExpectation: true,
          hobbies: true,
          lifePath: true,
          anythingElse: true,
          lookingFor: true,
          lastActiveAt: true,
          createdAt: true,
          universityDomain: true,
        },
      });

      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

      if (profile.universityDomain !== ctx.user.universityDomain) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Remove internal field
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { universityDomain, ...rest } = profile;
      return rest;
    }),
});

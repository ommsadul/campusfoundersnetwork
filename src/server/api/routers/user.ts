import { TRPCError } from "@trpc/server";
import {
  router,
  authedProcedure,
  onboardedProcedure,
} from "../../trpc";
import {
  agreementSchema,
  basicsSchema,
  aboutYouSchema,
  preferencesSchema,
} from "@/lib/validators";

function extractDomain(email: string): string {
  const domain = email.split("@")[1];
  if (!domain?.endsWith(".edu")) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Only .edu email addresses are allowed",
    });
  }
  return domain;
}

function universityFromDomain(domain: string): string {
  const parts = domain.replace(".edu", "").split(".");
  const name = parts[parts.length - 1];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export const userRouter = router({
  /** Check if user has a DB record at all */
  isOnboarded: authedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: ctx.clerkUserId },
    });
    if (!user) return { onboarded: false, profileStep: 0, agreedToTerms: false };
    return {
      onboarded: true,
      profileStep: user.profileStep,
      agreedToTerms: user.agreedToTerms,
    };
  }),

  /** Get the full profile of the logged-in user */
  getProfile: onboardedProcedure.query(({ ctx }) => ctx.user),

  /** Step 0: Accept the behavior agreement and create the DB row */
  agreeToTerms: authedProcedure
    .input(agreementSchema)
    .mutation(async ({ ctx }) => {
      const existing =
        (await ctx.db.user.findUnique({ where: { clerkId: ctx.clerkUserId } })) ??
        (await ctx.db.user.findUnique({ where: { email: ctx.email } }));

      const domain = extractDomain(ctx.email);

      if (existing) {
        return ctx.db.user.update({
          where: { id: existing.id },
          data: { agreedToTerms: true, clerkId: ctx.clerkUserId },
        });
      }

      return ctx.db.user.create({
        data: {
          clerkId: ctx.clerkUserId,
          email: ctx.email,
          university: universityFromDomain(domain),
          universityDomain: domain,
          agreedToTerms: true,
        },
      });
    }),

  /** Step 1: Save Basics */
  saveBasics: onboardedProcedure
    .input(basicsSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.user.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          linkedinUrl: input.linkedinUrl || null,
          location: input.location,
          bio: input.bio,
          accomplishment: input.accomplishment,
          education: input.education,
          employment: input.employment || null,
          isTechnical: input.isTechnical,
          gender: input.gender || null,
          birthdate: input.birthdate ? new Date(input.birthdate) : null,
          schedulingUrl: input.schedulingUrl || null,
          twitterUrl: input.twitterUrl || null,
          instagramUrl: input.instagramUrl || null,
          profileStep: Math.max(ctx.user.profileStep, 1),
          lastActiveAt: new Date(),
        },
      });
    }),

  /** Step 2: Save More About You */
  saveAboutYou: onboardedProcedure
    .input(aboutYouSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.user.id },
        data: {
          ideaStatus: input.ideaStatus,
          ideaDescription: input.ideaDescription || null,
          hasCofounder: input.hasCofounder,
          fullTimeTimeline: input.fullTimeTimeline,
          startupAreas: input.startupAreas,
          interestedTopics: input.interestedTopics,
          equityExpectation: input.equityExpectation || null,
          hobbies: input.hobbies || null,
          lifePath: input.lifePath || null,
          anythingElse: input.anythingElse || null,
          profileStep: Math.max(ctx.user.profileStep, 2),
          lastActiveAt: new Date(),
        },
      });
    }),

  /** Step 3: Save Co-Founder Preferences */
  savePreferences: onboardedProcedure
    .input(preferencesSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.user.id },
        data: {
          lookingFor: input.lookingFor || null,
          prefIdeaStatus: input.prefIdeaStatus,
          prefIdeaImportance: input.prefIdeaImportance,
          prefTechnical: input.prefTechnical,
          prefTechnicalImportance: input.prefTechnicalImportance,
          prefTimingMatch: input.prefTimingMatch,
          prefLocationMatch: input.prefLocationMatch,
          prefLocationImportance: input.prefLocationImportance,
          prefAgeMin: input.prefAgeMin ?? null,
          prefAgeMax: input.prefAgeMax ?? null,
          prefAgeImportance: input.prefAgeImportance,
          prefCofounderAreas: input.prefCofounderAreas,
          prefAreasImportance: input.prefAreasImportance,
          prefInterestMatch: input.prefInterestMatch,
          prefSchoolMatch: input.prefSchoolMatch,
          alertOnMatch: input.alertOnMatch,
          profileStep: Math.max(ctx.user.profileStep, 3),
          lastActiveAt: new Date(),
        },
      });
    }),
});

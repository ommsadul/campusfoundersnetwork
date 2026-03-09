import { z } from "zod/v4";

// ── Behavior Agreement ──────────────────────────────────────────
export const agreementSchema = z.object({
  searchingForCofounder: z.literal(true),
  noSelling: z.literal(true),
  noHiring: z.literal(true),
  respectful: z.literal(true),
  noExternalContact: z.literal(true),
  platformPurpose: z.literal(true),
});

// ── Step 1: Basics ──────────────────────────────────────────────
export const basicsSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  linkedinUrl: z
    .string()
    .url("Must be a valid URL")
    .startsWith("https://", "URL should start with https://")
    .optional()
    .or(z.literal("")),
  location: z.string().min(1, "Location is required").max(100),
  bio: z.string().min(1, "Please introduce yourself").max(1000),
  accomplishment: z.string().min(1, "Share an accomplishment").max(1000),
  education: z.string().min(1, "Education is required").max(800),
  employment: z.string().max(600).optional().or(z.literal("")),
  isTechnical: z.boolean(),
  gender: z.string().max(30).optional().or(z.literal("")),
  birthdate: z.string().min(1, "Birthdate is required"),
  schedulingUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
});

// ── Step 2: More About You ──────────────────────────────────────
export const aboutYouSchema = z.object({
  ideaStatus: z.enum(["COMMITTED", "EXPLORING", "OPEN"]),
  ideaDescription: z.string().max(1000).optional().or(z.literal("")),
  hasCofounder: z.boolean(),
  fullTimeTimeline: z.enum([
    "ALREADY_FULLTIME",
    "READY_WHEN_RIGHT",
    "NEXT_YEAR",
    "NO_PLANS",
  ]),
  startupAreas: z.array(z.string()).min(1, "Select at least one area"),
  interestedTopics: z.array(z.string()).min(1, "Select at least one topic"),
  equityExpectation: z.string().max(250).optional().or(z.literal("")),
  hobbies: z.string().max(500).optional().or(z.literal("")),
  lifePath: z.string().max(500).optional().or(z.literal("")),
  anythingElse: z.string().max(500).optional().or(z.literal("")),
});

// ── Step 3: Co-Founder Preferences ──────────────────────────────
export const preferencesSchema = z.object({
  lookingFor: z.string().max(1000).optional().or(z.literal("")),
  prefIdeaStatus: z.enum(["has_idea", "no_idea", "no_preference"]),
  prefIdeaImportance: z.enum([
    "REQUIRED",
    "VERY_IMPORTANT",
    "SOMEWHAT_IMPORTANT",
    "NOT_IMPORTANT",
  ]),
  prefTechnical: z.enum(["technical", "non_technical", "no_preference"]),
  prefTechnicalImportance: z.enum([
    "REQUIRED",
    "VERY_IMPORTANT",
    "SOMEWHAT_IMPORTANT",
    "NOT_IMPORTANT",
  ]),
  prefTimingMatch: z.enum(["only", "prefer", "no_preference"]),
  prefLocationMatch: z.enum(["nearby", "country", "region", "no_preference"]),
  prefLocationImportance: z.enum([
    "REQUIRED",
    "VERY_IMPORTANT",
    "SOMEWHAT_IMPORTANT",
    "NOT_IMPORTANT",
  ]),
  prefAgeMin: z.number().min(16).max(99).optional(),
  prefAgeMax: z.number().min(16).max(99).optional(),
  prefAgeImportance: z.enum([
    "REQUIRED",
    "VERY_IMPORTANT",
    "SOMEWHAT_IMPORTANT",
    "NOT_IMPORTANT",
  ]),
  prefCofounderAreas: z.array(z.string()),
  prefAreasImportance: z.enum([
    "REQUIRED",
    "VERY_IMPORTANT",
    "SOMEWHAT_IMPORTANT",
    "NOT_IMPORTANT",
  ]),
  prefInterestMatch: z.enum(["only", "prefer", "no_preference"]),
  prefSchoolMatch: z.enum(["only", "prefer", "no_preference"]),
  alertOnMatch: z.boolean().default(false),
});

// ── Full profile (all steps combined) ───────────────────────────
export const fullProfileSchema = basicsSchema
  .merge(aboutYouSchema)
  .merge(preferencesSchema);

// ── Constants ───────────────────────────────────────────────────
export const STARTUP_AREAS = [
  "Engineering / Technical",
  "Product Management",
  "Design / UX",
  "Sales / Business Development",
  "Marketing / Growth",
  "Operations",
  "Finance",
  "Legal",
] as const;

export const TOPICS = [
  "AI / Machine Learning",
  "B2B / SaaS",
  "Consumer",
  "Education",
  "Fintech",
  "Healthcare / Biotech",
  "Hard Tech / Robotics",
  "Climate / Energy",
  "Government / Civic Tech",
  "E-Commerce / Marketplace",
  "Social / Community",
  "Developer Tools",
  "Gaming",
  "Real Estate / PropTech",
  "Food / Agriculture",
  "Transportation / Logistics",
] as const;

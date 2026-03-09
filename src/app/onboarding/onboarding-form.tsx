"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { STARTUP_AREAS, TOPICS } from "@/lib/validators";

/* ─────────────────── types ─────────────────── */
interface Props {
  email: string;
  agreedToTerms: boolean;
  initialStep: number;
  existingProfile: Record<string, unknown> | null;
}

type Step = "agreement" | "basics" | "about" | "preferences" | "preview";

const STEP_ORDER: Step[] = [
  "agreement",
  "basics",
  "about",
  "preferences",
  "preview",
];

const STEP_LABELS: Record<Step, string> = {
  agreement: "Agreement",
  basics: "Basics",
  about: "More About You",
  preferences: "Co-Founder Preferences",
  preview: "Preview Your Profile",
};

/* ─────────────────── main component ─────────────────── */
export function OnboardingForm({
  email,
  agreedToTerms,
  initialStep,
  existingProfile,
}: Props) {
  const router = useRouter();
  const utils = trpc.useUtils();

  // Determine starting step
  const getInitialStep = (): Step => {
    if (!agreedToTerms) return "agreement";
    if (initialStep < 1) return "basics";
    if (initialStep < 2) return "about";
    if (initialStep < 3) return "preferences";
    return "preview";
  };

  const [currentStep, setCurrentStep] = useState<Step>(getInitialStep());

  /* ── Agreement state ── */
  const [checks, setChecks] = useState({
    searchingForCofounder: false,
    noSelling: false,
    noHiring: false,
    respectful: false,
    noExternalContact: false,
    platformPurpose: false,
  });
  const allChecked = Object.values(checks).every(Boolean);

  /* ── Basics state ── */
  const p = existingProfile ?? {};
  const [firstName, setFirstName] = useState((p.firstName as string) ?? "");
  const [lastName, setLastName] = useState((p.lastName as string) ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(
    (p.linkedinUrl as string) ?? ""
  );
  const [location, setLocation] = useState((p.location as string) ?? "");
  const [bio, setBio] = useState((p.bio as string) ?? "");
  const [accomplishment, setAccomplishment] = useState(
    (p.accomplishment as string) ?? ""
  );
  const [education, setEducation] = useState((p.education as string) ?? "");
  const [employment, setEmployment] = useState(
    (p.employment as string) ?? ""
  );
  const [isTechnical, setIsTechnical] = useState<boolean>(
    (p.isTechnical as boolean) ?? true
  );
  const [gender, setGender] = useState((p.gender as string) ?? "");
  const [birthdate, setBirthdate] = useState((p.birthdate as string) ?? "");
  const [schedulingUrl, setSchedulingUrl] = useState(
    (p.schedulingUrl as string) ?? ""
  );
  const [twitterUrl, setTwitterUrl] = useState(
    (p.twitterUrl as string) ?? ""
  );
  const [instagramUrl, setInstagramUrl] = useState(
    (p.instagramUrl as string) ?? ""
  );

  /* ── About You state ── */
  const [ideaStatus, setIdeaStatus] = useState<string>(
    (p.ideaStatus as string) ?? ""
  );
  const [ideaDescription, setIdeaDescription] = useState(
    (p.ideaDescription as string) ?? ""
  );
  const [hasCofounder, setHasCofounder] = useState<string>(
    p.hasCofounder === true ? "yes" : p.hasCofounder === false ? "no" : ""
  );
  const [fullTimeTimeline, setFullTimeTimeline] = useState<string>(
    (p.fullTimeTimeline as string) ?? ""
  );
  const [startupAreas, setStartupAreas] = useState<string[]>(
    (p.startupAreas as string[]) ?? []
  );
  const [interestedTopics, setInterestedTopics] = useState<string[]>(
    (p.interestedTopics as string[]) ?? []
  );
  const [equityExpectation, setEquityExpectation] = useState(
    (p.equityExpectation as string) ?? ""
  );
  const [hobbies, setHobbies] = useState((p.hobbies as string) ?? "");
  const [lifePath, setLifePath] = useState((p.lifePath as string) ?? "");
  const [anythingElse, setAnythingElse] = useState(
    (p.anythingElse as string) ?? ""
  );

  /* ── Preferences state ── */
  const [lookingFor, setLookingFor] = useState(
    (p.lookingFor as string) ?? ""
  );
  const [prefIdeaStatus, setPrefIdeaStatus] = useState(
    (p.prefIdeaStatus as string) ?? "no_preference"
  );
  const [prefIdeaImportance, setPrefIdeaImportance] = useState(
    (p.prefIdeaImportance as string) ?? "SOMEWHAT_IMPORTANT"
  );
  const [prefTechnical, setPrefTechnical] = useState(
    (p.prefTechnical as string) ?? "no_preference"
  );
  const [prefTechnicalImportance, setPrefTechnicalImportance] = useState(
    (p.prefTechnicalImportance as string) ?? "SOMEWHAT_IMPORTANT"
  );
  const [prefTimingMatch, setPrefTimingMatch] = useState(
    (p.prefTimingMatch as string) ?? "no_preference"
  );
  const [prefLocationMatch, setPrefLocationMatch] = useState(
    (p.prefLocationMatch as string) ?? "no_preference"
  );
  const [prefLocationImportance, setPrefLocationImportance] = useState(
    (p.prefLocationImportance as string) ?? "SOMEWHAT_IMPORTANT"
  );
  const [prefAgeMin, setPrefAgeMin] = useState<number | undefined>(
    (p.prefAgeMin as number) ?? undefined
  );
  const [prefAgeMax, setPrefAgeMax] = useState<number | undefined>(
    (p.prefAgeMax as number) ?? undefined
  );
  const [prefAgeImportance, setPrefAgeImportance] = useState(
    (p.prefAgeImportance as string) ?? "NOT_IMPORTANT"
  );
  const [prefCofounderAreas, setPrefCofounderAreas] = useState<string[]>(
    (p.prefCofounderAreas as string[]) ?? []
  );
  const [prefAreasImportance, setPrefAreasImportance] = useState(
    (p.prefAreasImportance as string) ?? "SOMEWHAT_IMPORTANT"
  );
  const [prefInterestMatch, setPrefInterestMatch] = useState(
    (p.prefInterestMatch as string) ?? "no_preference"
  );
  const [prefSchoolMatch, setPrefSchoolMatch] = useState(
    (p.prefSchoolMatch as string) ?? "no_preference"
  );
  const [alertOnMatch, setAlertOnMatch] = useState(
    (p.alertOnMatch as boolean) ?? false
  );

  /* ── Mutations ── */
  const agreeMut = trpc.user.agreeToTerms.useMutation();
  const basicsMut = trpc.user.saveBasics.useMutation();
  const aboutMut = trpc.user.saveAboutYou.useMutation();
  const prefsMut = trpc.user.savePreferences.useMutation();

  const isPending =
    agreeMut.isPending ||
    basicsMut.isPending ||
    aboutMut.isPending ||
    prefsMut.isPending;
  const error =
    agreeMut.error || basicsMut.error || aboutMut.error || prefsMut.error;

  /* ── handlers ── */
  const handleAgree = () => {
    agreeMut.mutate(
      {
        searchingForCofounder: true,
        noSelling: true,
        noHiring: true,
        respectful: true,
        noExternalContact: true,
        platformPurpose: true,
      },
      {
        onSuccess: () => {
          utils.user.isOnboarded.invalidate();
          setCurrentStep("basics");
        },
      }
    );
  };

  const handleBasics = (e: React.FormEvent) => {
    e.preventDefault();
    basicsMut.mutate(
      {
        firstName,
        lastName,
        linkedinUrl: linkedinUrl || undefined,
        location,
        bio,
        accomplishment,
        education,
        employment: employment || undefined,
        isTechnical,
        gender: gender || undefined,
        birthdate,
        schedulingUrl: schedulingUrl || undefined,
        twitterUrl: twitterUrl || undefined,
        instagramUrl: instagramUrl || undefined,
      },
      {
        onSuccess: () => setCurrentStep("about"),
      }
    );
  };

  const handleAbout = (e: React.FormEvent) => {
    e.preventDefault();
    aboutMut.mutate(
      {
        ideaStatus: ideaStatus as "COMMITTED" | "EXPLORING" | "OPEN",
        ideaDescription: ideaDescription || undefined,
        hasCofounder: hasCofounder === "yes",
        fullTimeTimeline: fullTimeTimeline as
          | "ALREADY_FULLTIME"
          | "READY_WHEN_RIGHT"
          | "NEXT_YEAR"
          | "NO_PLANS",
        startupAreas,
        interestedTopics,
        equityExpectation: equityExpectation || undefined,
        hobbies: hobbies || undefined,
        lifePath: lifePath || undefined,
        anythingElse: anythingElse || undefined,
      },
      {
        onSuccess: () => setCurrentStep("preferences"),
      }
    );
  };

  const handlePrefs = (e: React.FormEvent) => {
    e.preventDefault();
    prefsMut.mutate(
      {
        lookingFor: lookingFor || undefined,
        prefIdeaStatus: prefIdeaStatus as "has_idea" | "no_idea" | "no_preference",
        prefIdeaImportance: prefIdeaImportance as "REQUIRED" | "VERY_IMPORTANT" | "SOMEWHAT_IMPORTANT" | "NOT_IMPORTANT",
        prefTechnical: prefTechnical as "technical" | "non_technical" | "no_preference",
        prefTechnicalImportance: prefTechnicalImportance as "REQUIRED" | "VERY_IMPORTANT" | "SOMEWHAT_IMPORTANT" | "NOT_IMPORTANT",
        prefTimingMatch: prefTimingMatch as "only" | "prefer" | "no_preference",
        prefLocationMatch: prefLocationMatch as "nearby" | "country" | "region" | "no_preference",
        prefLocationImportance: prefLocationImportance as "REQUIRED" | "VERY_IMPORTANT" | "SOMEWHAT_IMPORTANT" | "NOT_IMPORTANT",
        prefAgeMin,
        prefAgeMax,
        prefAgeImportance: prefAgeImportance as "REQUIRED" | "VERY_IMPORTANT" | "SOMEWHAT_IMPORTANT" | "NOT_IMPORTANT",
        prefCofounderAreas,
        prefAreasImportance: prefAreasImportance as "REQUIRED" | "VERY_IMPORTANT" | "SOMEWHAT_IMPORTANT" | "NOT_IMPORTANT",
        prefInterestMatch: prefInterestMatch as "only" | "prefer" | "no_preference",
        prefSchoolMatch: prefSchoolMatch as "only" | "prefer" | "no_preference",
        alertOnMatch,
      },
      {
        onSuccess: () => setCurrentStep("preview"),
      }
    );
  };

  /* ── Sidebar ── */
  const sidebar = (
    <div className="w-full lg:w-56 shrink-0">
      <h3 className="font-semibold mb-3">My Profile</h3>
      <nav className="space-y-1">
        {STEP_ORDER.filter((s) => s !== "agreement").map((step, i) => {
          const isActive = step === currentStep;
          const stepNum = i; // 0-based for profile steps
          const isComplete = initialStep > stepNum || (step === "preview" && initialStep >= 3);
          const isAccessible =
            agreedToTerms || checks.searchingForCofounder
              ? true
              : false;

          return (
            <button
              key={step}
              onClick={() => isAccessible && setCurrentStep(step)}
              disabled={!isAccessible}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : isComplete
                  ? "text-foreground hover:bg-muted"
                  : "text-muted-foreground"
              } ${!isAccessible ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {STEP_LABELS[step]}
            </button>
          );
        })}
      </nav>
    </div>
  );

  /* ── Agreement Step ── */
  if (currentStep === "agreement") {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">
          Co-Founder Matching Behavior Agreement
        </h1>
        <div className="bg-white rounded-xl border border-border p-8 space-y-5">
          <p className="text-muted-foreground">
            Please confirm that you understand and agree to the behavior
            guidelines of the co-founder matching platform.
          </p>

          {[
            {
              key: "searchingForCofounder" as const,
              text: (
                <>
                  I confirm that{" "}
                  <span className="text-primary font-medium">
                    I am searching for a co-founder.
                  </span>{" "}
                  (This means someone with at least 10% equity.)
                </>
              ),
            },
            {
              key: "noSelling" as const,
              text: (
                <>
                  I confirm that{" "}
                  <span className="text-primary font-medium">
                    I will not use this platform to sell services or promote my
                    product.
                  </span>
                </>
              ),
            },
            {
              key: "noHiring" as const,
              text: (
                <>
                  I confirm that{" "}
                  <span className="text-primary font-medium">
                    I will not use this platform to try to hire non-founder
                    employees
                  </span>{" "}
                  for my company.
                </>
              ),
            },
            {
              key: "respectful" as const,
              text: (
                <>
                  I confirm that{" "}
                  <span className="text-primary font-medium">
                    I will treat everyone I meet on the platform with respect,
                  </span>{" "}
                  and will not act in a way that is rude or offensive.
                </>
              ),
            },
            {
              key: "noExternalContact" as const,
              text: (
                <>
                  I confirm that{" "}
                  <span className="text-primary font-medium">
                    I will not reach out to anyone I see here on an external
                    platform (such as LinkedIn)
                  </span>{" "}
                  without their consent beforehand.
                </>
              ),
            },
            {
              key: "platformPurpose" as const,
              text: (
                <>
                  I confirm that{" "}
                  <span className="text-primary font-medium">
                    I will not use this platform for any purpose other than to
                    find a co-founder.
                  </span>
                </>
              ),
            },
          ].map(({ key, text }) => (
            <label
              key={key}
              className="flex items-start gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checks[key]}
                onChange={() =>
                  setChecks((c) => ({ ...c, [key]: !c[key] }))
                }
                className="accent-primary mt-1 w-4 h-4"
              />
              <span className="text-sm">{text}</span>
            </label>
          ))}

          <p className="text-sm text-muted-foreground pt-2">
            We will remove anyone who violates this agreement to keep the
            platform safe, effective, and spam-free.
          </p>

          <div className="text-center pt-4">
            <button
              onClick={handleAgree}
              disabled={!allChecked || isPending}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors"
            >
              {isPending ? "Saving..." : "I agree"}
            </button>
          </div>
        </div>
        {error && (
          <p className="text-red-600 text-sm text-center mt-4">
            {error.message}
          </p>
        )}
      </div>
    );
  }

  /* ── Profile Steps (with sidebar) ── */
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Everything you write here will be shown in the matching process. The
          more information you give, the easier it will be for a potential
          co-founder to tell if they&apos;d be interested in working with you.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {sidebar}

        <div className="flex-1 min-w-0">
          {/* ── Basics ── */}
          {currentStep === "basics" && (
            <form
              onSubmit={handleBasics}
              className="bg-white rounded-xl border border-border"
            >
              <div className="bg-secondary px-6 py-3 rounded-t-xl border-b border-border">
                <h2 className="font-semibold text-foreground">Basics</h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First name" required>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input"
                      required
                    />
                  </Field>
                  <Field label="Last name" required>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input"
                      required
                    />
                  </Field>
                </div>

                <Field label="Email" required>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="input bg-muted/30 text-muted-foreground"
                  />
                </Field>

                <Field
                  label="LinkedIn URL"
                  hint="URL should start with https://"
                >
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="input"
                    placeholder="https://www.linkedin.com/in/..."
                  />
                </Field>

                <Field
                  label="Location"
                  hint="What country and city are you in?"
                  required
                >
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input"
                    placeholder="Baltimore, MD, USA"
                    required
                  />
                </Field>

                <Field
                  label="Introduce yourself!"
                  hint="Write a paragraph or two about your background and what you're looking for."
                  required
                >
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="input"
                    rows={4}
                    maxLength={1000}
                    required
                  />
                  <CharCount current={bio.length} max={1000} />
                </Field>

                <Field
                  label="Impressive accomplishment"
                  hint="An academic or professional achievement, an award, or something impressive you've built."
                  required
                >
                  <textarea
                    value={accomplishment}
                    onChange={(e) => setAccomplishment(e.target.value)}
                    className="input"
                    rows={4}
                    maxLength={1000}
                    required
                  />
                  <CharCount current={accomplishment.length} max={1000} />
                </Field>

                <Field
                  label="Education"
                  hint="Schools, degrees, fields of study, and years of graduation."
                  required
                >
                  <textarea
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="input"
                    rows={3}
                    maxLength={800}
                    required
                  />
                  <CharCount current={education.length} max={800} />
                </Field>

                <Field
                  label="Employment"
                  hint="Employers, positions, titles, and dates. Most recent first."
                >
                  <textarea
                    value={employment}
                    onChange={(e) => setEmployment(e.target.value)}
                    className="input"
                    rows={3}
                    maxLength={600}
                  />
                  <CharCount current={employment.length} max={600} />
                </Field>

                <Field label="Are you technical?" required>
                  <p className="text-xs text-muted-foreground mb-2">
                    You are a programmer, scientist, or engineer who can build
                    the product without outside assistance.
                  </p>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={isTechnical === true}
                        onChange={() => setIsTechnical(true)}
                        className="accent-primary"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={isTechnical === false}
                        onChange={() => setIsTechnical(false)}
                        className="accent-primary"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Gender">
                    <input
                      type="text"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="input"
                    />
                  </Field>
                  <Field label="Birthdate" required>
                    <input
                      type="date"
                      value={birthdate}
                      onChange={(e) => setBirthdate(e.target.value)}
                      className="input"
                      required
                    />
                  </Field>
                </div>

                <Field
                  label="Scheduling URL"
                  hint="Calendly, Cal, or Google Calendar (optional)"
                >
                  <input
                    type="url"
                    value={schedulingUrl}
                    onChange={(e) => setSchedulingUrl(e.target.value)}
                    className="input"
                    placeholder="https://calendly.com/..."
                  />
                </Field>

                <Field label="Twitter URL" hint="Only your matches will see this.">
                  <input
                    type="url"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    className="input"
                    placeholder="https://twitter.com/..."
                  />
                </Field>

                <Field
                  label="Instagram URL"
                  hint="Only your matches will see this."
                >
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    className="input"
                    placeholder="https://instagram.com/..."
                  />
                </Field>

                <SubmitRow isPending={isPending} label="Save & continue" />
              </div>
            </form>
          )}

          {/* ── More About You ── */}
          {currentStep === "about" && (
            <form
              onSubmit={handleAbout}
              className="bg-white rounded-xl border border-border"
            >
              <div className="bg-secondary px-6 py-3 rounded-t-xl border-b border-border">
                <h2 className="font-semibold text-foreground">More About You</h2>
              </div>
              <div className="p-6 space-y-6">
                <Field
                  label="Do you already have a startup or idea that you're set on?"
                  required
                >
                  {[
                    {
                      value: "COMMITTED",
                      label:
                        "Yes, I'm committed to an idea and I want a co-founder who can help me build it",
                    },
                    {
                      value: "EXPLORING",
                      label:
                        "I have some ideas, but I'm also open to exploring other ideas",
                    },
                    {
                      value: "OPEN",
                      label:
                        "No, I could help a co-founder with their existing idea or explore new ideas together",
                    },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-start gap-2 cursor-pointer mb-2"
                    >
                      <input
                        type="radio"
                        name="ideaStatus"
                        checked={ideaStatus === opt.value}
                        onChange={() => setIdeaStatus(opt.value)}
                        className="accent-primary mt-0.5"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </Field>

                <Field
                  label="What are some ideas you're interested in pursuing?"
                  hint=""
                >
                  <textarea
                    value={ideaDescription}
                    onChange={(e) => setIdeaDescription(e.target.value)}
                    className="input"
                    rows={3}
                    maxLength={1000}
                  />
                  <CharCount current={ideaDescription.length} max={1000} />
                </Field>

                <Field label="Do you already have a co-founder?" required>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={hasCofounder === "yes"}
                        onChange={() => setHasCofounder("yes")}
                        className="accent-primary"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={hasCofounder === "no"}
                        onChange={() => setHasCofounder("no")}
                        className="accent-primary"
                      />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </Field>

                <Field
                  label="When do you want to start working on a startup full-time?"
                  hint="i.e. leave your job / school to be a full-time founder"
                  required
                >
                  {[
                    {
                      value: "ALREADY_FULLTIME",
                      label: "I'm already full-time on my startup",
                    },
                    {
                      value: "READY_WHEN_RIGHT",
                      label:
                        "I'm ready to go full-time as soon as I meet the right co-founder",
                    },
                    {
                      value: "NEXT_YEAR",
                      label: "I'm planning to go full-time in the next year",
                    },
                    {
                      value: "NO_PLANS",
                      label: "I don't have any specific plans yet",
                    },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-start gap-2 cursor-pointer mb-2"
                    >
                      <input
                        type="radio"
                        name="fullTimeTimeline"
                        checked={fullTimeTimeline === opt.value}
                        onChange={() => setFullTimeTimeline(opt.value)}
                        className="accent-primary mt-0.5"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </Field>

                <Field
                  label="Which areas of a startup are you willing to take responsibility for?"
                  required
                >
                  <MultiSelect
                    options={[...STARTUP_AREAS]}
                    selected={startupAreas}
                    onChange={setStartupAreas}
                  />
                </Field>

                <Field
                  label="Which topics and industries are you interested in?"
                  hint="We'll try to show you more profiles from founders with common interests."
                  required
                >
                  <MultiSelect
                    options={[...TOPICS]}
                    selected={interestedTopics}
                    onChange={setInterestedTopics}
                  />
                </Field>

                <Field
                  label="What are your expectations for splitting equity?"
                  hint="How much equity are you willing to offer a co-founder?"
                >
                  <textarea
                    value={equityExpectation}
                    onChange={(e) => setEquityExpectation(e.target.value)}
                    className="input"
                    rows={2}
                    maxLength={250}
                  />
                  <CharCount current={equityExpectation.length} max={250} />
                </Field>

                <Field
                  label="What do you do with your free time?"
                  hint="What are your hobbies and interests?"
                >
                  <textarea
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                    className="input"
                    rows={2}
                    maxLength={500}
                  />
                  <CharCount current={hobbies.length} max={500} />
                </Field>

                <Field
                  label="How did your life path lead to where you are now?"
                  hint="How have your experiences shaped your values?"
                >
                  <textarea
                    value={lifePath}
                    onChange={(e) => setLifePath(e.target.value)}
                    className="input"
                    rows={2}
                    maxLength={500}
                  />
                  <CharCount current={lifePath.length} max={500} />
                </Field>

                <Field label="Anything else you would like to add about yourself?">
                  <textarea
                    value={anythingElse}
                    onChange={(e) => setAnythingElse(e.target.value)}
                    className="input"
                    rows={2}
                    maxLength={500}
                  />
                  <CharCount current={anythingElse.length} max={500} />
                </Field>

                <SubmitRow isPending={isPending} label="Save & continue" />
              </div>
            </form>
          )}

          {/* ── Co-Founder Preferences ── */}
          {currentStep === "preferences" && (
            <form
              onSubmit={handlePrefs}
              className="bg-white rounded-xl border border-border"
            >
              <div className="bg-secondary px-6 py-3 rounded-t-xl border-b border-border">
                <h2 className="font-semibold text-foreground">
                  Co-Founder Requirements and Preferences
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <Field label="What are you looking for in a co-founder?">
                  <textarea
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                    className="input"
                    rows={3}
                    maxLength={1000}
                  />
                </Field>

                <PrefRadio
                  label="Are you looking for a co-founder who already has a specific idea, or are you open to exploring new ideas together?"
                  name="prefIdeaStatus"
                  value={prefIdeaStatus}
                  onChange={setPrefIdeaStatus}
                  options={[
                    {
                      value: "has_idea",
                      label: "I want to see co-founders who have a specific idea",
                    },
                    {
                      value: "no_idea",
                      label:
                        "I want to see co-founders who are not set on a specific idea",
                    },
                    { value: "no_preference", label: "No preference" },
                  ]}
                  importance={prefIdeaImportance}
                  onImportanceChange={setPrefIdeaImportance}
                />

                <PrefRadio
                  label="Do you prefer either technical or non-technical profiles?"
                  name="prefTechnical"
                  value={prefTechnical}
                  onChange={setPrefTechnical}
                  options={[
                    { value: "technical", label: "Technical" },
                    { value: "non_technical", label: "Non-technical" },
                    { value: "no_preference", label: "No preference" },
                  ]}
                  importance={prefTechnicalImportance}
                  onImportanceChange={setPrefTechnicalImportance}
                />

                <PrefRadio
                  label="Do you prefer to see co-founders who match up with your timing?"
                  name="prefTimingMatch"
                  value={prefTimingMatch}
                  onChange={setPrefTimingMatch}
                  options={[
                    {
                      value: "only",
                      label:
                        "I only want to see co-founders who match my timing",
                    },
                    {
                      value: "prefer",
                      label:
                        "I prefer to see co-founders who match my timing, but it's not required",
                    },
                    { value: "no_preference", label: "No preference" },
                  ]}
                />

                <PrefRadio
                  label="Do you have a location preference?"
                  name="prefLocationMatch"
                  value={prefLocationMatch}
                  onChange={setPrefLocationMatch}
                  options={[
                    {
                      value: "nearby",
                      label: "Within a certain distance of me",
                    },
                    { value: "country", label: "In my country" },
                    { value: "region", label: "In my region" },
                    { value: "no_preference", label: "No preference" },
                  ]}
                  importance={prefLocationImportance}
                  onImportanceChange={setPrefLocationImportance}
                />

                <Field label="Do you have an age preference?">
                  <div className="flex items-center gap-4 mb-2">
                    <input
                      type="number"
                      min={16}
                      max={99}
                      value={prefAgeMin ?? ""}
                      onChange={(e) =>
                        setPrefAgeMin(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="input w-24"
                      placeholder="Min"
                    />
                    <span className="text-muted-foreground">to</span>
                    <input
                      type="number"
                      min={16}
                      max={99}
                      value={prefAgeMax ?? ""}
                      onChange={(e) =>
                        setPrefAgeMax(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="input w-24"
                      placeholder="Max"
                    />
                  </div>
                  <ImportanceSelect
                    value={prefAgeImportance}
                    onChange={setPrefAgeImportance}
                  />
                </Field>

                <Field label="Which areas would you like a co-founder to take responsibility for?">
                  <MultiSelect
                    options={[...STARTUP_AREAS]}
                    selected={prefCofounderAreas}
                    onChange={setPrefCofounderAreas}
                  />
                  <ImportanceSelect
                    value={prefAreasImportance}
                    onChange={setPrefAreasImportance}
                  />
                </Field>

                <PrefRadio
                  label="Do you prefer to match candidates who share your interests?"
                  name="prefInterestMatch"
                  value={prefInterestMatch}
                  onChange={setPrefInterestMatch}
                  options={[
                    {
                      value: "only",
                      label:
                        "I only want to match with co-founders who share my interests",
                    },
                    {
                      value: "prefer",
                      label:
                        "I prefer to match with co-founders who share my interests, but it's not required",
                    },
                    { value: "no_preference", label: "No preference" },
                  ]}
                />

                <PrefRadio
                  label="Do you prefer to match with fellow students and alumni from your university?"
                  name="prefSchoolMatch"
                  value={prefSchoolMatch}
                  onChange={setPrefSchoolMatch}
                  options={[
                    {
                      value: "only",
                      label:
                        "I only want to match with fellow students and alumni",
                    },
                    {
                      value: "prefer",
                      label:
                        "I prefer to match with fellow students and alumni, but it's not required",
                    },
                    { value: "no_preference", label: "No preference" },
                  ]}
                />

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alertOnMatch}
                    onChange={(e) => setAlertOnMatch(e.target.checked)}
                    className="accent-primary w-4 h-4"
                  />
                  <span className="text-sm">
                    Alert me when a new profile that matches all my preferences
                    joins
                  </span>
                </label>

                <SubmitRow isPending={isPending} label="Save & continue" />
              </div>
            </form>
          )}

          {/* ── Preview ── */}
          {currentStep === "preview" && (
            <div className="bg-white rounded-xl border border-border">
              <div className="bg-secondary px-6 py-3 rounded-t-xl border-b border-border">
                <h2 className="font-semibold text-foreground">Preview Your Profile</h2>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  {firstName} {lastName}
                </h3>
                <p className="text-muted-foreground text-sm">{location}</p>

                {bio && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">
                      About
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">{bio}</p>
                  </div>
                )}

                {accomplishment && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">
                      Accomplishment
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">
                      {accomplishment}
                    </p>
                  </div>
                )}

                {education && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">
                      Education
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">{education}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isTechnical
                        ? "badge-technical"
                        : "badge-nontechnical"
                    }`}
                  >
                    {isTechnical ? "Technical" : "Non-technical"}
                  </span>
                  {ideaStatus && (
                    <span className="badge-idea text-xs px-2 py-0.5 rounded-full font-medium">
                      {ideaStatus === "COMMITTED"
                        ? "Committed to idea"
                        : ideaStatus === "EXPLORING"
                        ? "Exploring ideas"
                        : "Open to ideas"}
                    </span>
                  )}
                  {fullTimeTimeline && (
                    <span className="badge-timeline text-xs px-2 py-0.5 rounded-full font-medium">
                      {fullTimeTimeline === "ALREADY_FULLTIME"
                        ? "Full-time"
                        : fullTimeTimeline === "READY_WHEN_RIGHT"
                        ? "Ready for full-time"
                        : fullTimeTimeline === "NEXT_YEAR"
                        ? "Full-time next year"
                        : "No specific plans"}
                    </span>
                  )}
                </div>

                {interestedTopics.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">
                      Interests
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {interestedTopics.map((t) => (
                        <span
                          key={t}
                          className="badge-topic text-xs px-2 py-0.5 rounded font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setCurrentStep("basics")}
                    className="px-6 py-2.5 border border-border rounded-full text-sm hover:bg-muted transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium hover:bg-primary-hover transition-colors"
                  >
                    Start Browsing Co-Founders
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center mt-4">
              {error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── sub-components ─────────────────── */

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-muted-foreground mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

function CharCount({ current, max }: { current: number; max: number }) {
  return (
    <p className="text-xs text-muted-foreground text-right mt-1">
      Characters used: {current} (out of {max})
    </p>
  );
}

function SubmitRow({
  isPending,
  label,
}: {
  isPending: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 pt-4 border-t border-border">
      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors"
      >
        {isPending ? "Saving..." : label}
      </button>
      {!isPending && (
        <span className="text-sm text-muted-foreground">No unsaved changes</span>
      )}
    </div>
  );
}

function ImportanceSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-2">
      <p className="text-xs font-medium text-muted-foreground mb-1">
        How important is this to you?
        <span className="text-red-500 ml-0.5">*</span>
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border rounded-lg px-3 py-1.5 text-sm w-full max-w-xs"
      >
        <option value="REQUIRED">Required</option>
        <option value="VERY_IMPORTANT">Very important</option>
        <option value="SOMEWHAT_IMPORTANT">Somewhat important</option>
        <option value="NOT_IMPORTANT">Not important</option>
      </select>
    </div>
  );
}

function PrefRadio({
  label,
  name,
  value,
  onChange,
  options,
  importance,
  onImportanceChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  importance?: string;
  onImportanceChange?: (v: string) => void;
}) {
  return (
    <Field label={label} required>
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-start gap-2 cursor-pointer mb-2"
        >
          <input
            type="radio"
            name={name}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-primary mt-0.5"
          />
          <span className="text-sm">{opt.label}</span>
        </label>
      ))}
      {importance !== undefined && onImportanceChange && (
        <ImportanceSelect value={importance} onChange={onImportanceChange} />
      )}
    </Field>
  );
}

function MultiSelect({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) =>
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected.includes(opt)
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground hover:bg-muted/50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

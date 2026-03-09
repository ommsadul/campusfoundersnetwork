import { initTRPC, TRPCError } from "@trpc/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import superjson from "superjson";
import { db } from "@/lib/db";

export const createTRPCContext = async () => {
  const { userId } = await auth();
  let email: string | null = null;

  if (userId) {
    const clerkUser = await currentUser();
    email = clerkUser?.emailAddresses[0]?.emailAddress ?? null;
  }

  return { db, clerkUserId: userId, email };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Requires Clerk authentication
const enforceAuth = t.middleware(async ({ ctx, next }) => {
  if (!ctx.clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: { ...ctx, clerkUserId: ctx.clerkUserId, email: ctx.email! },
  });
});

// Requires Clerk auth AND completed onboarding (user exists in DB)
const enforceOnboarded = t.middleware(async ({ ctx, next }) => {
  if (!ctx.clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  let user = await ctx.db.user.findUnique({
    where: { clerkId: ctx.clerkUserId },
  });

  if (!user && ctx.email) {
    user = await ctx.db.user.findUnique({ where: { email: ctx.email } });
    if (user) {
      user = await ctx.db.user.update({
        where: { id: user.id },
        data: { clerkId: ctx.clerkUserId },
      });
    }
  }

  if (!user) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Complete onboarding first",
    });
  }

  return next({
    ctx: { ...ctx, clerkUserId: ctx.clerkUserId, email: ctx.email!, user },
  });
});

export const authedProcedure = t.procedure.use(enforceAuth);
export const onboardedProcedure = t.procedure.use(enforceOnboarded);

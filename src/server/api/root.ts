import { router } from "../trpc";
import { userRouter } from "./routers/user";
import { profileRouter } from "./routers/profile";

export const appRouter = router({
  user: userRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;

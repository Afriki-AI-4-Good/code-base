import { inboxRouter } from "~/features/inbox/server/inbox.router";
import { tasksRouter } from "~/features/tasks/server/tasks.router";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * Primary tRPC router. Mount one router per feature here — the equivalent of
 * the Express `routes.ts` that composes every feature's routes.
 */
export const appRouter = createTRPCRouter({
  inbox: inboxRouter,
  tasks: tasksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const tasks = await trpc.tasks.list();
 */
export const createCaller = createCallerFactory(appRouter);

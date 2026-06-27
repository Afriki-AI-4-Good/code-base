import {
  createTaskSchema,
  deleteTaskSchema,
  toggleTaskSchema,
} from "~/features/tasks/schema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

/**
 * Tasks feature API. In a fullstack app this single router replaces the
 * Express controller + service + routes trio: each procedure reads validated
 * input, runs the query via `ctx.db`, and its return type flows to the client.
 */
export const tasksRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) =>
    ctx.db.task.findMany({ orderBy: { createdAt: "desc" } }),
  ),

  create: publicProcedure
    .input(createTaskSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.task.create({ data: { title: input.title } }),
    ),

  toggle: publicProcedure.input(toggleTaskSchema).mutation(({ ctx, input }) =>
    ctx.db.task.update({
      where: { id: input.id },
      data: { done: input.done },
    }),
  ),

  delete: publicProcedure
    .input(deleteTaskSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.task.delete({ where: { id: input.id } }),
    ),
});

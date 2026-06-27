import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
});

export const toggleTaskSchema = z.object({
  id: z.number().int(),
  done: z.boolean(),
});

export const deleteTaskSchema = z.object({
  id: z.number().int(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

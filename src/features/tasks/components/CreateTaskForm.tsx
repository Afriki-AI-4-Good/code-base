"use client";

import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { createTaskSchema } from "~/features/tasks/schema";
import { api } from "~/trpc/react";

export function CreateTaskForm() {
  const utils = api.useUtils();
  const form = useForm({
    initialValues: { title: "" },
    validate: {
      title: (value) =>
        createTaskSchema.shape.title.safeParse(value).success
          ? null
          : "Title is required",
    },
  });

  const createTask = api.tasks.create.useMutation({
    onSuccess: async () => {
      await utils.tasks.list.invalidate();
      form.reset();
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => createTask.mutate(values))}>
      <Group align="flex-end" gap="sm">
        <TextInput
          label="New task"
          placeholder="What needs doing?"
          style={{ flex: 1 }}
          {...form.getInputProps("title")}
        />
        <Button type="submit" loading={createTask.isPending}>
          Add
        </Button>
      </Group>
    </form>
  );
}

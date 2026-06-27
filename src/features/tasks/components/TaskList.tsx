"use client";

import { Container, Stack, Text, Title } from "@mantine/core";

import { CreateTaskForm } from "~/features/tasks/components/CreateTaskForm";
import { TaskItem } from "~/features/tasks/components/TaskItem";
import { api } from "~/trpc/react";

export function TaskList() {
  const { data: tasks, isLoading } = api.tasks.list.useQuery();

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Title order={1}>Tasks</Title>
        <CreateTaskForm />
        {isLoading && <Text c="dimmed">Loading tasks…</Text>}
        {!isLoading && (!tasks || tasks.length === 0) && (
          <Text c="dimmed">No tasks yet — add your first one above.</Text>
        )}
        {tasks && tasks.length > 0 && (
          <Stack gap="xs">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

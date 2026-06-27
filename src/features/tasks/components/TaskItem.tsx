"use client";

import { ActionIcon, Checkbox, Group, Paper, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

import type { Task } from "~/features/tasks/types";
import { api } from "~/trpc/react";

export function TaskItem({ task }: { task: Task }) {
  const utils = api.useUtils();
  const invalidate = () => utils.tasks.list.invalidate();

  const toggle = api.tasks.toggle.useMutation({ onSuccess: invalidate });
  const remove = api.tasks.delete.useMutation({ onSuccess: invalidate });

  return (
    <Paper withBorder p="sm">
      <Group justify="space-between" wrap="nowrap">
        <Checkbox
          checked={task.done}
          onChange={(event) =>
            toggle.mutate({ id: task.id, done: event.currentTarget.checked })
          }
          label={
            <Text
              td={task.done ? "line-through" : undefined}
              c={task.done ? "dimmed" : undefined}
            >
              {task.title}
            </Text>
          }
        />
        <ActionIcon
          variant="subtle"
          color="red"
          aria-label="Delete task"
          loading={remove.isPending}
          onClick={() => remove.mutate({ id: task.id })}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    </Paper>
  );
}

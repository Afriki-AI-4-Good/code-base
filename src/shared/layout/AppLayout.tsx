"use client";

import { AppShell, Group, Title } from "@mantine/core";
import Link from "next/link";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell header={{ height: 56 }} padding={0}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={4}>Hackathon Starter</Title>
          <Group gap="lg">
            <Link href="/">Home</Link>
            <Link href="/tasks">Tasks</Link>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

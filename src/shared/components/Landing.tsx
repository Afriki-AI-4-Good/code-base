"use client";

import { Button, Container, List, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

export function Landing() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Title order={1}>Hackathon Starter</Title>
        <Text c="dimmed">
          Next.js (App Router) + TypeScript + tRPC + Prisma + Supabase +
          Mantine. One app, one command — fork it and start shipping.
        </Text>
        <List spacing="xs">
          <List.Item>
            End-to-end type safety from the database to the UI
          </List.Item>
          <List.Item>
            Feature-based structure under{" "}
            <Text span ff="monospace">
              src/features/
            </Text>
          </List.Item>
          <List.Item>Local Postgres via Supabase, typed with Prisma</List.Item>
        </List>
        <Button component={Link} href="/tasks" w="fit-content">
          See the tasks demo →
        </Button>
      </Stack>
    </Container>
  );
}

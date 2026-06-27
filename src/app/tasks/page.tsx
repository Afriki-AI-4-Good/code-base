import { TaskList } from "~/features/tasks";
import { AppLayout } from "~/shared/layout";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  // Warm the React Query cache on the server so the list renders immediately.
  void api.tasks.list.prefetch();

  return (
    <HydrateClient>
      <AppLayout>
        <TaskList />
      </AppLayout>
    </HydrateClient>
  );
}

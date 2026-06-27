import type { RouterOutputs } from "~/trpc/react";

/** A single task, inferred from the tRPC router output — no manual typing. */
export type Task = RouterOutputs["tasks"]["list"][number];

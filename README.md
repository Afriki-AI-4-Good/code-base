# Hackathon Starter

Next.js (App Router) + TypeScript + tRPC + Prisma + Supabase (local Postgres) + Mantine. One app, one command — fullstack and type-safe end to end.

---

## Prerequisites

- Node.js 20+
- Docker (for the local Supabase Postgres)
- The Supabase CLI is used via `npx` — no global install needed

---

## Running the app

### First time setup

```bash
npm install                 # install dependencies
cp .env.example .env        # DATABASE_URL already points at local Supabase
npm run db:start            # start local Postgres + Studio (first run pulls Docker images)
npm run db:migrate          # create the database tables from prisma/schema.prisma
```

To enable Gmail summary delivery from the inbox assistant, set `GMAIL_CLIENT_ID`,
`GMAIL_CLIENT_SECRET`, and `GMAIL_REFRESH_TOKEN` in `.env`.

### Every time you want to develop

```bash
npm run db:start            # start the database (once per machine restart)
npm run dev                 # start the app on :3000 (frontend + backend together)
```

The app runs at `http://localhost:3000` with hot reload. There is **no second server** —
Next.js serves the React UI and the tRPC API from the same process, so there are no CORS
issues and nothing else to start.

> **Note:** the database runs in Docker via Supabase. `npm run db:start` only needs to run
> once per machine restart — Docker keeps it alive in the background. Use `npm run db:studio`
> to browse data (Prisma Studio) and `npm run db:stop` to shut the database down.

---

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the app (UI + API) with hot reload on `:3000` |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run db:start` | Start local Supabase Postgres + Studio (Docker) |
| `npm run db:stop` | Stop the local Supabase stack |
| `npm run db:migrate` | Apply schema changes — creates a Prisma migration |
| `npm run db:studio` | Open Prisma Studio to browse the database |
| `npm run check` | Lint + typecheck — **run before pushing** |
| `npm run format` | Auto-format and fix with Biome |

---

## Project structure

```
src/
├── app/                  # Next.js App Router — thin route files only
│   ├── layout.tsx              # MantineProvider + theme + tRPC provider
│   ├── page.tsx                # "/" — landing
│   ├── tasks/page.tsx          # "/tasks" — renders the tasks feature
│   └── api/trpc/[trpc]/route.ts  # the single HTTP endpoint tRPC runs over
│
├── features/             # One folder per feature — front AND back together
│   └── tasks/
│       ├── server/tasks.router.ts  # tRPC router = controller + service + routes
│       ├── components/             # TaskList (container) + TaskItem + CreateTaskForm
│       ├── schema.ts               # Zod schemas, shared by client and server
│       ├── types.ts                # types inferred from the router output
│       └── index.ts                # public surface — what other code may import
│
├── shared/               # Reusable across features — no feature imports another
│   ├── layout/AppLayout.tsx        # Mantine AppShell + nav
│   ├── components/                 # Landing, and other cross-cutting UI
│   └── theme.ts                    # Mantine theme (colors, radius, fonts)
│
├── server/               # tRPC core
│   ├── api/root.ts                 # mounts every feature router (like Express routes.ts)
│   ├── api/trpc.ts                 # tRPC init, context (exposes ctx.db), procedures
│   └── db.ts                       # Prisma client singleton
│
├── trpc/                 # tRPC client entrypoints (react.tsx for components, server.ts for RSC)
├── env.js                # validated environment variables
└── styles/globals.css    # tiny global layer; design tokens live in theme.ts

prisma/schema.prisma      # the data model — one file (Prisma requires a single schema)
supabase/config.toml      # local Postgres + Studio config
```

---

## Adding a new feature

Use `tasks` as the reference. Steps for a new feature, e.g. `note`:

**1. Add the model** to `prisma/schema.prisma`, then create the table:

```prisma
model Note {
  id        Int      @id @default(autoincrement())
  body      String
  createdAt DateTime @default(now())
}
```

```bash
npm run db:migrate          # name it e.g. "add-note"
```

**2. Create the feature folder:**

```
src/features/note/
├── server/note.router.ts
├── components/
├── schema.ts
├── types.ts
└── index.ts
```

**3. Define the validation schema** (`schema.ts`) — Zod, shared by client and server:

```ts
import { z } from "zod";

export const createNoteSchema = z.object({
  body: z.string().min(1),
});
```

**4. Write the router** (`server/note.router.ts`) — input is validated, queries use `ctx.db`:

```ts
import { createNoteSchema } from "~/features/note/schema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => ctx.db.note.findMany()),
  create: publicProcedure
    .input(createNoteSchema)
    .mutation(({ ctx, input }) => ctx.db.note.create({ data: input })),
});
```

**5. Mount the router** in `src/server/api/root.ts` — one new line:

```ts
import { noteRouter } from "~/features/note/server/note.router";

export const appRouter = createTRPCRouter({
  tasks: tasksRouter,
  note: noteRouter,
});
```

**6. Build the components** — a *container* (client) that calls `api.note.list.useQuery()` and
handles loading/empty, plus *presentational* ones that take props and render Mantine.

**7. Export the public surface** (`index.ts`) and **add a page + route**:

```ts
// src/features/note/index.ts
export { NoteList } from "./components/NoteList";
export type { Note } from "./types";
```

```tsx
// src/app/notes/page.tsx
import { NoteList } from "~/features/note";
import { AppLayout } from "~/shared/layout";

export default function NotesPage() {
  return (
    <AppLayout>
      <NoteList />
    </AppLayout>
  );
}
```

The tRPC provider, error formatting, and database client are wired up globally — the new
feature inherits them automatically.

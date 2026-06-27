# STARTUP — AI agent skills & MCP

Set up Claude Code **or** Codex for this stack. See [`README.md`](./README.md) for the app
itself. Everything below lives at the **repo root** and is **committed** — clone and it's
there, no per-machine global config (one Codex Desktop caveat, noted inline).

## 1. Mantine — MCP server + form skill

**Skill** — `npx skills` installs into the project by default and copies real files into
the right folder per agent (`.claude/skills/` for Claude Code, `.agents/skills/` for Codex):

```bash
npx skills add https://github.com/mantinedev/skills --skill mantine-form --copy
# extras: --skill mantine-combobox  --skill mantine-custom-components
# --copy vendors real files (commit-safe); omit it and you get symlinks to a global
# cache that break for teammates. Do NOT pass -g/--global.
```

**MCP server** — config format differs per agent, so commit one block for each:

```jsonc
// .mcp.json  (Claude Code, repo root)
{ "mcpServers": { "mantine": { "command": "npx", "args": ["-y", "@mantine/mcp-server"] } } }
```

```toml
# .codex/config.toml  (Codex, repo root — do NOT use `codex mcp add`, it writes global)
[mcp_servers.mantine]
command = "npx"
args = ["-y", "@mantine/mcp-server"]
```

> Codex **CLI** reads project `.codex/config.toml`; Codex **Desktop** only reads global
> `~/.codex/config.toml`, so Desktop users must add the same block there.
>
> Mantine is pinned to **v8** (v9 breaks Next SSR) — don't let an agent bump it.

## 2. tRPC — TanStack Intent skills

```bash
npx @tanstack/intent@latest install   # routers, procedures, Query hooks; tracks v11
```

Cross-agent already: skills live in `node_modules/`, and `install` writes its loading
guidance into `AGENTS.md` + `CLAUDE.md` — both Claude Code and Codex read those.

## Verify

```bash
ls .claude/skills .agents/skills   # real skill dirs (not dangling symlinks) per agent
cat .mcp.json .codex/config.toml   # MCP blocks committed at repo root
```

In Claude Code, `/mcp` should show `mantine` connected.

## Sources

[Mantine](https://mantine.dev/guides/llms/) ·
[tRPC](https://trpc.io/docs/skills) ·
[skills CLI](https://github.com/vercel-labs/skills) ·
[Codex MCP](https://developers.openai.com/codex/mcp) ·
[Codex skills](https://developers.openai.com/codex/skills)

# ai-router edit boundary

Root `AGENTS.md` applies. Read `config/repository-sections.json` and `docs/REPOSITORY-OWNERSHIP.md` from the repository root before editing.

Assigned section: `ai-router`. Allowed prefixes: `ai-router/`, `src/adapters/`, `src/connections/`.

Current provider adapters are in `src/adapters/` (OpenAI, Anthropic, Gemini, xAI); connector contracts are in `src/connections/`. This directory is an entry point, not a second Node service. `server.js`, `src/runtime/`, `db/`, and runtime tests remain shared. Persistence and orchestration have source implementations; source presence does not prove live configuration, durability, or operational orchestration. Further work remains planned until implemented and verified.

Do not overwrite another section or editor workspace. Update `.agent-task.json` for this task; shared paths require exact declarations and review by `@ohi-stack`.

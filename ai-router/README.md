# ai-router

Current provider adapters are in `src/adapters/` (OpenAI, Anthropic, Gemini, xAI); connector contracts are in `src/connections/`. This directory is an entry point, not a second Node service. `server.js`, `src/runtime/`, `db/`, and runtime tests remain shared. Persistence and orchestration have source implementations; source presence does not prove live configuration, durability, or operational orchestration. Further work remains planned until implemented and verified.

See `../docs/REPOSITORY-OWNERSHIP.md` for edit scope and shared-file review.

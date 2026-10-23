# wordpress-plugin edit boundary

Root `AGENTS.md` applies. Read `config/repository-sections.json` and `docs/REPOSITORY-OWNERSHIP.md` from the repository root before editing.

Assigned section: `wordpress-plugin`. Allowed prefixes: `wordpress-plugin/`, `plugins/`, `wordpress/plugin-architecture/`.

Existing OMOS Core Tools implementations remain in `plugins/omos-core-tools-v1.4.0/` and `plugins/omos-core-tools-v1.5.0/`. Architecture is in `wordpress/plugin-architecture/`. Do not edit every version or create a duplicate implementation. Select the version explicitly assigned by the task. Standalone `wordpress/*.php` files remain shared integration files requiring exact declaration.

Do not overwrite another section or editor workspace. Update `.agent-task.json` for this task; shared paths require exact declarations and review by `@ohi-stack`.

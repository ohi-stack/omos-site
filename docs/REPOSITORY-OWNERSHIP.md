# OMOS repository ownership and edit scopes

Canonical GitHub repository: **ohi-stack/omos-site**. Canonical runtime: **https://omos.onegodian.com**. One repository, one runtime, one shared ownership map.

## Code sections

| Section entry point | Existing source and responsibility |
| --- | --- |
| `wordpress-plugin/` | OMOS Core Tools in `plugins/`; architecture in `wordpress/plugin-architecture/` |
| `wordpress-content/` | Authored pages in `wordpress/pages/`; future WXR imports here |
| `woocommerce/` | Future product CSVs and bundle definitions; none found on inspected main |
| `ai-router/` | Providers in `src/adapters/`, connectors in `src/connections/`; no duplicate service |
| `docs/` | Protocol, algorithm, consolidation, contracts, and evidence |

These entry points establish boundaries without moving existing code or breaking open PRs. `config/repository-sections.json` is the machine-readable map. All unlisted paths are shared, including runtime/orchestration, database, site UI, root files, CI, tests, and ownership policy. Exact shared files must be declared; adding a broad section does not grant access to shared files.

## AI editor sections

`agents/chatgpt/`, `agents/claude/`, `agents/gemini/`, and `agents/grok/` hold each editor's instructions and handoff notes. Each editor can change only its own workspace plus code sections explicitly assigned for the current task. Production source stays in the code sections; do not duplicate it into editor directories. An editor identity denotes the editing platform, not the model-provider adapter it may implement.

## Every task

1. Fetch current main; inspect open PRs and local changes. Use a dedicated branch/worktree per concurrent task. Do not work concurrently in the same checkout.
2. Read root and section `AGENTS.md` files. Assign one editor and the smallest necessary set of sections.
3. Replace `.agent-task.json` with the task declaration. Example:

```json
{
  "editor": "claude",
  "sections": ["ai-router", "docs"],
  "sharedFiles": ["tests/model-gateway-contract.test.js"]
}
```

4. Preserve unrelated work; never force-push, bulk-sync, or regenerate another section. Deletions and renames must satisfy scope for both old and new paths.
5. Run `node scripts/check-edit-scope.cjs BASE_SHA` after committing, plus relevant checks. The base map governs existing repos, so a task cannot widen its own allowed prefixes by editing the map.
6. Open a PR. Explain shared-file changes, dependencies on other PRs, tests, and handoff records. `@ohi-stack` is the human integration owner. Human review must approve shared changes and concurrent integration before merge.

The scope check rejects unassigned sections and another editor's workspace. `.agent-task.json` must change for every PR; its content is a task declaration, not proof of authenticated model identity. Shared declarations identify files for review; they do not authorize a merge.

## Enforcement and limits

`OMOS Edit Scope / edit-scope` runs on PRs. After this setup is merged, configure main to require that check and code-owner approval, dismiss stale approvals, require approval of the latest push, and block force pushes/direct bypasses. This change does not claim those repository settings are already enabled. CODEOWNERS alone does not block writes, and the repository owner cannot supply an independent approval to their own PR; configure an eligible independent human reviewer if that review rule applies.

Instructions and path checks reduce accidental cross-edits; they are not a security sandbox against an editor with unrestricted write/admin access. Review changes to the checker, workflow, task declarations and ownership map as shared governance changes. The initial bootstrap uses the new map because main does not yet contain one. Subsequent checks use the base revision's checker and map.

## Capability status

Provider adapters, orchestration, and PostgreSQL persistence have existing source implementations. This ownership setup does not verify their live operation. No WXR imports, WooCommerce product CSVs or bundle definitions were found on the inspected main revision. Reserved folders do not establish capabilities. Describe new work as planned until implemented; distinguish implemented, tested, deployed and production-proven states.

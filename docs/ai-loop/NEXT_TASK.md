```markdown
# Worker Prompt Template

## Context

The current roadmap for `nail-report` is in Phase 2, focusing on improving stability, test coverage, and UX. A key aspect of this phase is adding comprehensive unit tests using Vitest. This task specifically targets improving the test coverage for our Firebase helper functions.

## Objective

Implement Vitest unit tests for the helper functions within `src/lib/firestore.ts`.

## Allowed Scope

- `src/lib/firestore.ts` (modifications to export functions if needed for testing, but ideally, test existing exports)
- `src/__tests__/firestore.test.ts` (new test file)
- `package.json` (only if adding `vitest` script or similar *existing* dependency related configuration, no new `dependencies` or `devDependencies`)
- `vite.config.ts` (only if adding `test` configuration for Vitest, no new dependencies)

## Forbidden Scope

- `src/main.tsx` (entry point — do not modify)
- `commands/` (PowerShell scripts — do not modify)
- `firestore.rules`, `storage.rules` (require human approval)
- `package.json` deps (no new npm packages without human approval)
- Firebase deploy commands
- Secrets and credentials

## Requirements

- Add unit tests for at least two functions within `src/lib/firestore.ts` (e.g., `addNailItem`, `getNailItems`, `updateNailItem`, `deleteNailItem`, etc.).
- Create a new test file: `src/__tests__/firestore.test.ts`.
- Use Vitest's mocking capabilities (`vi.mock`) to mock Firebase SDK dependencies (e.g., `firebase/firestore`, `firebase/auth`).
- Ensure tests cover successful operations and potential error scenarios where applicable.
- Keep the overall diff for this task to ≤ 150 lines.
- Run `npm run build && npm run lint` before finishing.

## Output Format

- Summary of what changed
- Changed files list
- Commands run and results
- Known issues or limitations
- Suggested next task
```
